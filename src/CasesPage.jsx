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

  useEffect(() => {
    let isMounted = true;

    async function fetchCases() {
      try {
        const response = await fetch('http://localhost:3005/api/cases');
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
      <h2>Case Studies</h2>
      <p>Explore representative matters and the legal support approaches we bring to complex commercial issues.</p>

      {loading && <p>Loading cases…</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

      {!loading && !error && groupedCases.length === 0 && <p>No cases available right now.</p>}

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
                    justifyContent: 'space-between',
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
                  <p style={{ marginTop: '1rem', fontWeight: 700, color: '#111827', fontSize: '0.8rem' }}>
                    {item.docsource || 'Court source unavailable'}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
