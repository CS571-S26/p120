import { Card } from 'react-bootstrap';

export type TopGame = {
  title: string;
  hours: number;
  rating: number;
};

type TopGamesListProps = {
  games: TopGame[];
};

function TopGamesList({ games }: TopGamesListProps) {
  return (
    <Card className="border shadow-sm h-100">
      <Card.Body>
        <p className="text-uppercase text-muted small fw-bold mb-3">Top games by hours</p>
        <ul className="list-unstyled mb-0">
          {games.map((game, i) => (
            <li
              key={game.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                borderBottom: i < games.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <span style={{ fontSize: '11px', color: '#adb5bd', width: '16px' }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{game.title}</span>
              <span style={{ fontSize: '12px', color: '#6c757d' }}>{game.hours}h</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: '#EEEDFE', color: '#3C3489', fontWeight: 500 }}>
                {game.rating.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}

export default TopGamesList;
