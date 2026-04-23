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
        <p className="text-uppercase text-muted small fw-bold mb-3">Platform split</p>
        {platforms.map(p => (
          <div key={p.name} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
              <span>{p.name}</span>
              <span>{p.count} games</span>
            </div>
            <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '3px', background: p.color, width: `${Math.round((p.count / total) * 100)}%` }} />
            </div>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#534AB7' }}>{streak}</div>
          <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '2px' }}>day play streak</div>
          <div style={{ fontSize: '11px', color: '#adb5bd', marginTop: '2px' }}>best: {bestStreak} days</div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PlatformSplit;
