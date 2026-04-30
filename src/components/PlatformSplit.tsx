import { Card } from 'react-bootstrap';

export type Platform = {
  name: string;
  count: number;
  color: string;
};

type PlatformSplitProps = {
  platforms: Platform[];
  streak: number;
  bestStreak: number;
};

function PlatformSplit({ platforms, streak, bestStreak }: PlatformSplitProps) {
  const total = platforms.reduce((sum, p) => sum + p.count, 0);

  return (
    <Card className="border shadow-sm h-100">
      <Card.Body>
        {/* Proper heading */}
        <h2 className="text-uppercase text-muted small fw-bold mb-3">
          Platform split
        </h2>

        {/* Platform breakdown */}
        <div role="list" aria-label="Game platform distribution">
          {platforms.map(p => {
            const percent = total > 0 ? Math.round((p.count / total) * 100) : 0;

            return (
              <div
                key={p.name}
                role="listitem"
                style={{ marginBottom: '12px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#6c757d',
                    marginBottom: '4px',
                  }}
                >
                  <span>{p.name}</span>
                  <span aria-label={`${p.count} games, ${percent}%`}>
                    {p.count} games
                  </span>
                </div>

                {/* Accessible progress bar */}
                <div
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${p.name} platform usage ${percent} percent`}
                  style={{
                    height: '6px',
                    background: '#f0f0f0',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '3px',
                      background: p.color,
                      width: `${percent}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Streak section */}
        <section
          aria-label="Play streak statistics"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{ fontSize: '2.25rem', fontWeight: 700, color: '#534AB7' }}
            aria-label={`${streak} day streak`}
          >
            {streak}
          </div>

          <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '2px' }}>
            day play streak
          </div>

          <div
            style={{ fontSize: '11px', color: '#adb5bd', marginTop: '2px' }}
            aria-label={`Best streak is ${bestStreak} days`}
          >
            best: {bestStreak} days
          </div>
        </section>
      </Card.Body>
    </Card>
  );
}

export default PlatformSplit;