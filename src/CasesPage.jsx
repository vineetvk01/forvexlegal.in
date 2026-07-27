import { useEffect, useMemo, useState } from 'react';

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
  const baseUrl = process.env.REACT_APP_SERVER_URL || '';

  function toggleSelection(item) {
    const id = item._id || item.tid;
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
      const response = await fetch(`${baseUrl}/api/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
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

      {!loading && !error && groupedCases.length === 0 && <p>No cases available right now.</p>}

      {!loading && !error && (
        <div style={{ margin: '1.5rem 0', padding: '1rem', borderRadius: 12, background: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)' }}>
          <p style={{ margin: 0, marginBottom: '0.75rem', color: '#334155' }}>
            Selected cases: {selectedIds.size}
          </p>
          <button
            type="button"
            onClick={handleGenerateSelectedSummary}
            disabled={selectedIds.size === 0 || generating}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 999,
              background: selectedIds.size === 0 || generating ? '#e2e8f0' : '#0f172a',
              color: selectedIds.size === 0 || generating ? '#94a3b8' : '#fff',
              border: 'none',
              cursor: selectedIds.size === 0 || generating ? 'not-allowed' : 'pointer',
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
                  <div>
                    <h4>{item.title}</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                      {item.headline ? item.headline.replace(/<[^>]+>/g, '').trim() : 'No summary available.'}
                    </p>
                  </div>
                  <div style={{ marginTop: 'auto', marginLeft: '-1.25rem', marginRight: '-1.25rem', width: 'calc(100% + 2.5rem)', display: 'flex', flexDirection: 'column' }}>
                    <p style={{ margin: 0, padding: '0 1.25rem', fontWeight: 700, color: '#111827', fontSize: '0.8rem' }}>
                      {item.docsource || 'Court source unavailable'}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleSelection(item)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: 0,
                        border: selectedIds.has(item._id || item.tid) ? '1px solid #0f172a' : '1px solid transparent',
                        borderTop: 'none',
                        background: selectedIds.has(item._id || item.tid) ? '#0f172a' : 'transparent',
                        color: selectedIds.has(item._id || item.tid) ? '#fff' : '#111827',
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
                      {selectedIds.has(item._id || item.tid) ? 'Selected' : 'Select this case'}
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
