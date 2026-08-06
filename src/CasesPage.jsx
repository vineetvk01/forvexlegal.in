import { useEffect, useMemo, useState, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  const ordinal = day % 10 === 1 && day !== 11
    ? 'st'
    : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th';

  return `${day}${ordinal} ${month} ${year}`;
}

function encodeUrlsInText(text, fullEncode = true) {
  // Regex to capture http/https URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, (match) => {
    // Separate trailing punctuation (like periods or commas) at the end of a sentence
    const cleanUrl = match.replace(/[.,!?)]+$/, '');
    const trailingPunctuation = match.slice(cleanUrl.length);

    // fullEncode = true -> encodeURIComponent (encodes :, /, ?, =, etc.)
    // fullEncode = false -> encodeURI (preserves valid URL structure characters)
    const encoded = fullEncode ? encodeURIComponent(cleanUrl) : encodeURI(cleanUrl);

    return encoded + trailingPunctuation;
  });
}

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [summaryResponse, setSummaryResponse] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deletingTid, setDeletingTid] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [beforeText, setBeforeText] = useState('');
  const [afterText, setAfterText] = useState(`For litigation and advisory in Income Tax, GST, Customs, FEMA, PMLA, Benami, Black Money Act, and other Economic Offence matters, connect with Forvex Legal.

🌐 www.forvexlegal.in
📞 +91 9013265820. 

Forvex Legal
Founded by Adv. (CA) Shikhar Garg`);
  const [promptText, setPromptText] = useState(`You are a legal research assistant specializing in Indian taxation law.

Your task is to analyse the judgements shared above, Prefer the uploaded files over the shared cases above in the prompt example number 1,2 will be files. Include all shared.

For each judgment shared above, provide the following details in a concise and clear manner, formatted for WhatsApp:
1. Court Name
2. Case Title (Petitioner vs Respondent)
3. Case Number
4. Date of Judgment
5. Brief Summary (2-3 lines max — what the case was about and the outcome)
6. Key Section / Provision involved (e.g. Section 148 Income Tax Act, Section 74 CGST Act)
7. Direct PDF link to open the judgment

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (WhatsApp friendly):

📅 *Forvex legal | Tax & Allied Laws Updates — [Todays Indian time DATE]*

🔹 *1. [Court Name]
<blank line>
Case Title: [Case Title]
<blank line>
📁 Case No: [Case Number]
<blank line>
📆 Date: [Date]
<blank line>
⚖️ Issue: 
[ Instead of merely mentioning the statutory provision, mention the core legal issue involved in the case.
    * Example:
        * Validity of reassessment under Section 148
        * Natural justice
        * Limitation
        * Penalty under Section 270A
        * Faceless assessment
]
<blank>
📝 Ratio: [
    * The Ratio should not simply describe what happened in the case.
    * It should state the principle of law laid down by the Court, i.e., the proposition that can be applied in other cases.
    * It should be written in 2–4 concise lines.
    * Wherever possible, add a very short practical analysis (1–2 lines) explaining when practitioners can rely on this judgment.
]
🔗 *Tap to open judgment:* if "indiankanoon link is present" share pdf link or doc link. [ DON'T include any link if indiankanoon link is not present. NO NEED TO SHOW ANY LINK IN THAT CASE ]

🔹 *2. [Court Name]
<blank line>
Case Title: [Case Title]
📁 Case No: [Case Number]
📆 Date: [Date]
<blank>
⚖️ Issue: 
[ Instead of merely mentioning the statutory provision, mention the core legal issue involved in the case.
    * Example:
        * Validity of reassessment under Section 148
        * Natural justice
        * Limitation
        * Penalty under Section 270A
        * Faceless assessment
]
<blank>
📝 Ratio: [
    * The Ratio should not simply describe what happened in the case.
    * It should state the principle of law laid down by the Court, i.e., the proposition that can be applied in other cases.
    * It should be written in 2–4 concise lines.
    * Wherever possible, add a very short practical analysis (1–2 lines) explaining when practitioners can rely on this judgment.
]
🔗 *Tap to open judgment:* if "indiankanoon link is present" share pdf link or doc link. [ DON'T include any link if indiankanoon link is not present. NO NEED TO SHOW ANY LINK IN THAT CASE ]

...and soo on for all selected judgments. For each judgment, provide the above details in the same format.

RULES:
- Focus on the areas related to Income Tax and GST. No need to add a NOTE or PS at the end.
- Keep good spaces — this will be read on WhatsApp.
- Use bold and italics as shown — WhatsApp renders * for bold and _ for italics.
- Always include the direct PDF link. If PDF is not directly accessible, include the case detail page link.
- Do not add any extra commentary outside the format above. like NOTE. at the end, not needed`);
  const baseUrl = process.env.REACT_APP_SERVER_URL || '';
  const [metadataChanged, setMetadataChanged] = useState(false);
  const [savingMetadata, setSavingMetadata] = useState(false);
  const [metadataSaveError, setMetadataSaveError] = useState('');
  const [metadataSaveSuccess, setMetadataSaveSuccess] = useState('');

  function toggleSelection(item) {
      const id = item.tid;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handlePdfSelection(event) {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));

    if (validFiles.length !== files.length) {
      setUploadError('Only PDF files are allowed.');
      event.target.value = '';
      return;
    }

    if (pdfFiles.length + validFiles.length > 5) {
      setUploadError('You can upload up to 5 PDF files in total.');
      event.target.value = '';
      return;
    }

    setUploadError('');
    setPdfFiles((prev) => [...prev, ...validFiles]);
    event.target.value = '';
  }

  function removePdfFile(index) {
    setPdfFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleGenerateSelectedSummary() {
    if (selectedIds.size === 0 && pdfFiles.length === 0) {
      setSummaryError('Please select at least one case or upload at least one PDF to summarize.');
      return;
    }

    setSummaryResponse('');
    setSummaryError('');
    setGenerating(true);

    try {
      const formData = new FormData();
      formData.append('tids', JSON.stringify(Array.from(selectedIds)));
      formData.append('prompt', promptText);
      formData.append('beforeText', beforeText);
      formData.append('afterText', afterText);

      pdfFiles.forEach((file) => {
        formData.append('files', file);
        formData.append('pdfs', file);
      });

      const response = await fetch(`${baseUrl}/api/court-cases/cases/summarize`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.summary) {
        setSummaryResponse(data.summary);
      } else if (data.summaries) {
        setSummaryResponse(JSON.stringify(data.summaries, null, 2));
      } else if (data.result) {
        setSummaryResponse(data.result);
      } else {
        setSummaryResponse('Summary generated successfully.');
      }
    } catch (err) {
      setSummaryError(err.message || 'Unable to generate summary.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleDeleteCase(item) {
    const confirmed = window.confirm(`Delete "${item.title || 'this case'}"?`);
    if (!confirmed) {
      return;
    }

    setDeleteError('');
    setDeletingTid(item.tid);

    try {
      const response = await fetch(`${baseUrl}/api/court-cases/cases/${encodeURIComponent(item.tid)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setCases((prev) => prev.filter((caseItem) => caseItem.tid !== item.tid));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.tid);
        return next;
      });
    } catch (err) {
      setDeleteError(err.message || 'Unable to delete case.');
    } finally {
      setDeletingTid(null);
    }
  }

  const fetchMetadataPreText = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/metadata/pre-text`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setBeforeText(data.text || '');
    } catch (err) {
      console.error('Error fetching metadata:', err);
      return null;
    }
  }, [baseUrl]);

  const fetchMetadataPostText = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/metadata/post-text`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setAfterText(data.text || '');
    } catch (err) {
      console.error('Error fetching metadata:', err);
      return null;
    }
  }, [baseUrl]);

  const fetchMetadataPrompt = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/metadata/prompt`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setPromptText(data.text || '');
    } catch (err) {
      console.error('Error fetching metadata:', err);
      return null;
    }
  }, [baseUrl]);

  const updateMetadataPreText = useCallback(async (text) => {
    try {
      const response = await fetch(`${baseUrl}/api/metadata/pre-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Update failed with status ${response.status}`);
      }
    } catch (err) {
      console.error('Error updating pre-text metadata:', err);
      throw err;
    }
  }, [baseUrl]);

  const updateMetadataPostText = useCallback(async (text) => {
    try {
      const response = await fetch(`${baseUrl}/api/metadata/post-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Update failed with status ${response.status}`);
      }
    } catch (err) {
      console.error('Error updating post-text metadata:', err);
      throw err;
    }
  }, [baseUrl]);

  const updateMetadataPrompt = useCallback(async (text) => {
    try {
      const response = await fetch(`${baseUrl}/api/metadata/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Update failed with status ${response.status}`);
      }
    } catch (err) {
      console.error('Error updating prompt metadata:', err);
      throw err;
    }
  }, [baseUrl]);

  const saveMetadataSettings = useCallback(async () => {
    try {
      setMetadataSaveError('');
      setMetadataSaveSuccess('');
      setSavingMetadata(true);

      await Promise.all([
        updateMetadataPreText(beforeText),
        updateMetadataPostText(afterText),
        updateMetadataPrompt(promptText),
      ]);

      setMetadataChanged(false);
      setMetadataSaveSuccess('Metadata saved successfully.');
      window.setTimeout(() => setMetadataSaveSuccess(''), 2500);
    } catch (err) {
      setMetadataSaveError(err.message || 'Unable to save metadata.');
    } finally {
      setSavingMetadata(false);
    }
  }, [afterText, beforeText, promptText, updateMetadataPostText, updateMetadataPreText, updateMetadataPrompt]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCases() {
      try {
        const baseUrl = process.env.REACT_APP_SERVER_URL || '';
        const response = await fetch(`${baseUrl}/api/court-cases/cases`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setCases(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load cases.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMetadataPreText();
    fetchMetadataPostText();
    fetchMetadataPrompt();
    fetchCases();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedCases = useMemo(() => {
    const groups = {};

    cases.forEach((item) => {
      const key = item.publishdate || 'Unknown date';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [cases]);

  return (
    <section className="page-section container">
      <h2>GST & Income Tax Cases</h2>
      <p>Listing latest cases with detailed information, Please select and generate summary</p>

      {loading && <p>Loading cases…</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {deleteError && <p style={{ color: '#b91c1c', marginBottom: '0.75rem' }}>{deleteError}</p>}

      {!loading && !error && groupedCases.length === 0 && <p>No cases available right now.</p>}

      {!loading && !error && (
        <div style={{ margin: '1.5rem 0', padding: '1.25rem', borderRadius: 16, background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <p style={{ margin: 0, marginBottom: '0.75rem', color: '#334155' }}>
            Selected cases: {selectedIds.size}
          </p>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Text before generated message</label>
          <textarea
            value={beforeText}
            onChange={(e) => {
              setBeforeText(e.target.value);
              setMetadataChanged(true);
              setMetadataSaveSuccess('');
            }}
            placeholder="Enter text to appear before the generated message"
            rows={3}
            style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', marginBottom: '0.75rem', resize: 'vertical', fontSize: '0.95rem', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.03)' }}
          />

          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Prompt / instructions</label>
          <textarea
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              setMetadataChanged(true);
              setMetadataSaveSuccess('');
            }}
            placeholder="Optional: enter a custom prompt to guide the summary generation"
            rows={15}
            style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', marginBottom: '0.75rem', resize: 'vertical', fontSize: '0.95rem', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.03)' }}
          />

          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Text after generated message</label>
          <textarea
            value={afterText}
            onChange={(e) => {
              setAfterText(e.target.value);
              setMetadataChanged(true);
              setMetadataSaveSuccess('');
            }}
            placeholder="Enter text to appear after the generated message"
            rows={8}
            style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', marginBottom: '0.75rem', resize: 'vertical', fontSize: '0.95rem', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.03)' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={saveMetadataSettings}
              disabled={!metadataChanged || savingMetadata}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 999,
                background: !metadataChanged || savingMetadata ? '#e2e8f0' : '#0f172a',
                color: !metadataChanged || savingMetadata ? '#94a3b8' : '#fff',
                border: 'none',
                cursor: !metadataChanged || savingMetadata ? 'not-allowed' : 'pointer',
                fontWeight: 700,
              }}
            >
              {savingMetadata ? 'Saving…' : 'Save prompt & text settings'}
            </button>
            {metadataSaveSuccess && <span style={{ color: '#16a34a', fontSize: '0.95rem' }}>{metadataSaveSuccess}</span>}
            {metadataSaveError && <span style={{ color: '#b91c1c', fontSize: '0.95rem' }}>{metadataSaveError}</span>}
          </div>

          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Upload PDFs (max 5)</label>
          <div style={{ border: '1px dashed #94a3b8', borderRadius: 12, padding: '0.8rem 0.9rem', background: '#fff', marginBottom: '0.75rem' }}>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handlePdfSelection}
              style={{ width: '100%' }}
            />
          </div>
          {uploadError && <p style={{ color: '#b91c1c', marginBottom: '0.75rem' }}>{uploadError}</p>}
          {pdfFiles.length > 0 && (
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem', color: '#334155' }}>
              {pdfFiles.map((file, index) => (
                <li key={`${file.name}-${index}`} style={{ marginBottom: '0.35rem' }}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removePdfFile(index)}
                    style={{ marginLeft: '0.5rem', border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={handleGenerateSelectedSummary}
            disabled={(selectedIds.size < 1 && pdfFiles.length < 1) || generating}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: 999,
              background: (selectedIds.size < 1 && pdfFiles.length < 1) || generating ? '#e2e8f0' : '#0f172a',
              color: (selectedIds.size < 1 && pdfFiles.length < 1) || generating ? '#94a3b8' : '#fff',
              border: 'none',
              cursor: (selectedIds.size < 1 && pdfFiles.length < 1) || generating ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              boxShadow: (selectedIds.size < 1 && pdfFiles.length < 1) || generating ? 'none' : '0 8px 20px rgba(15,23,42,0.12)',
            }}
          >
            {generating ? 'Generating summary…' : 'Generate summary for selected cases'}
          </button>
          {summaryError && <p style={{ color: '#b91c1c', marginTop: '0.75rem' }}>{summaryError}</p>}
          {summaryResponse && (
            <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#ffffff', borderRadius: 12, border: '1px solid rgba(15,23,42,0.08)' }}>
              <strong>Summary result</strong>
              <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: '#334155' }}>{encodeUrlsInText(summaryResponse)}</p>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const text = summaryResponse || '';
                      const url = `https://api.whatsapp.com/send/?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    } catch (e) {
                      // ignore
                    }
                  }}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 8,
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Send via WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = summaryResponse || '';
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(text).then(() => {
                        setCopiedSummary(true);
                        window.setTimeout(() => setCopiedSummary(false), 1500);
                      }).catch(() => {
                        setCopiedSummary(false);
                      });
                    }
                  }}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 8,
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  {copiedSummary ? 'Copied!' : 'Copy text'}
                </button>
                <a href={`https://api.whatsapp.com/send/?text=${encodeURIComponent(summaryResponse || '')}`} target="_blank" rel="noreferrer" style={{ color: '#0f172a', textDecoration: 'underline', fontSize: '0.9rem' }}>Open WhatsApp</a>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !error && groupedCases.map(([date, items]) => (
        <div key={date} style={{ marginTop: 24 }}>
          <h3>{formatDateLabel(date)}</h3>
          <br />
          <div className="cards">
            {items.map((item) => {
              const isSupremeCourt = /supreme court/i.test(item.docsource || '');

              return (
                <article
                  key={item._id || item.tid}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100%',
                    paddingBottom: 0,
                    border: isSupremeCourt ? '1px solid #f59e0b' : '1px solid transparent',
                    boxShadow: isSupremeCourt ? '0 0 0 2px rgba(245, 158, 11, 0.18)' : '0 6px 18px rgba(15,23,42,0.04)',
                    background: isSupremeCourt ? '#fff8e1' : '#fff'
                  }}
                >
                  <div className="card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <h4 style={{ margin: 0 }}>{item.title}</h4>
                      <button
                        type="button"
                        className="delete-case-btn"
                        aria-label={`Delete ${item.title}`}
                        onClick={() => handleDeleteCase(item)}
                        disabled={deletingTid === item.tid}
                        title="Delete case"
                      >
                        {deletingTid === item.tid ? '…' : <FaTrash />}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                      {item.headline ? item.headline.replace(/<[^>]+>/g, '').trim() : 'No summary available.'}
                    </p>
                  </div>
                  <div className="card-meta" style={{ marginTop: 'auto', marginLeft: '-1.25rem', marginRight: '-1.25rem', width: 'calc(100% + 2.5rem)', display: 'flex', flexDirection: 'column' }}>
                    <p style={{ margin: 0, padding: '0 1.25rem', fontWeight: 700, color: '#111827', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                      <span style={{ fontWeight: 500 }}>{(item.author ? item.author + ', ' : '')}</span> {item.docsource || 'Court source unavailable'}
                    </p>
                    <button
                      type="button"
                      className="select-case-btn"
                      onClick={() => toggleSelection(item)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: 0,
                        border: selectedIds.has(item.tid) ? '1px solid #0f172a' : '1px solid transparent',
                        borderTop: 'none',
                        background: selectedIds.has(item.tid) ? '#0f172a' : 'transparent',
                        color: selectedIds.has(item.tid) ? '#fff' : '#111827',
                        cursor: 'pointer',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginTop: '0.75rem',
                        marginBottom: '-1px',
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        boxSizing: 'border-box',
                      }}
                    >
                      {selectedIds.has(item.tid) ? 'Selected' : 'Select this case'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
