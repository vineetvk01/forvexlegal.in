import { useEffect, useMemo, useState } from 'react';
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

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [summaryResponse, setSummaryResponse] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deletingTid, setDeletingTid] = useState(null);
  const [promptText, setPromptText] = useState(`You are a legal research assistant specializing in Indian taxation law.

Your task is to analyse the Delhi,Bombay High court & Supreme court judgements shared above

For each judgment shared above, provide the following details in a concise and clear manner, formatted for WhatsApp:
1. Case Title (Petitioner vs Respondent) - Court Name
2. Case Number
3. Date of Judgment
4. Brief Summary (2-3 lines max — what the case was about and the outcome)
5. Key Section / Provision involved (e.g. Section 148 Income Tax Act, Section 74 CGST Act)
6. Direct PDF link to open the judgment

---

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (WhatsApp friendly):

📅 *DAILY TAX DIGEST — [Todays Indian time DATE]* Income Tax & GST Judgments_

---

🔹 *1. [Case Title]* [Court Name]
<blank line>
📁 Case No: [Case Number]
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
🔗 [Tap to open judgment PDF](PDF LINK)

---

🔹 *2. [Case Title]* [Court Name]
<blank>
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
🔗 [Tap to open judgment PDF](PDF LINK)

---

and soo on for all selected judgments. For each judgment, provide the above details in the same format.

RULES:
- Focus on the areas related to Income Tax and GST. 
- Keep good spaces — this will be read on WhatsApp.
- Use bold and italics as shown — WhatsApp renders * for bold and _ for italics.
- Always include the direct PDF link. If PDF is not directly accessible, include the case detail page link.
- Do not add any extra commentary outside the format above.`);
  const baseUrl = process.env.REACT_APP_SERVER_URL || '';

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

  async function handleGenerateSelectedSummary() {
    if (selectedIds.size === 0) {
      setSummaryError('Please select at least one case to summarize.');
      return;
    }

    setSummaryResponse('');
    setSummaryError('');
    setGenerating(true);

    try {
      const response = await fetch(`${baseUrl}/api/cases/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tids: Array.from(selectedIds), prompt: promptText }),
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
      const response = await fetch(`${baseUrl}/api/cases/${encodeURIComponent(item.tid)}`, {
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

  useEffect(() => {
    let isMounted = true;

    async function fetchCases() {
      try {
        const baseUrl = process.env.REACT_APP_SERVER_URL || '';
        const response = await fetch(`${baseUrl}/api/cases`);
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
        <div style={{ margin: '1.5rem 0', padding: '1rem', borderRadius: 12, background: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)' }}>
          <p style={{ margin: 0, marginBottom: '0.75rem', color: '#334155' }}>
            Selected cases: {selectedIds.size}
          </p>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Optional: enter a custom prompt to guide the summary generation"
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid rgba(15,23,42,0.08)', marginBottom: '0.75rem', resize: 'vertical' }}
          />
          <button
            type="button"
            onClick={handleGenerateSelectedSummary}
            disabled={selectedIds.size < 1 || generating}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 999,
              background: selectedIds.size < 1|| generating ? '#e2e8f0' : '#0f172a',
              color: selectedIds.size < 1 || generating ? '#94a3b8' : '#fff',
              border: 'none',
              cursor: selectedIds.size < 1 || generating ? 'not-allowed' : 'pointer',
              fontWeight: 700,
            }}
          >
            {generating ? 'Generating summary…' : 'Generate summary for selected cases'}
          </button>
          {summaryError && <p style={{ color: '#b91c1c', marginTop: '0.75rem' }}>{summaryError}</p>}
          {summaryResponse && (
            <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#ffffff', borderRadius: 12, border: '1px solid rgba(15,23,42,0.08)' }}>
              <strong>Summary result</strong>
              <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: '#334155' }}>{summaryResponse}</p>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const text = summaryResponse || '';
                      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
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
                <a href={`https://wa.me/?text=${encodeURIComponent(summaryResponse || '')}`} target="_blank" rel="noreferrer" style={{ color: '#0f172a', textDecoration: 'underline', fontSize: '0.9rem' }}>Open WhatsApp</a>
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
