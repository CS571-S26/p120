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
        {/* Proper heading instead of <p> */}
        <h2 className="text-uppercase text-muted small fw-bold mb-3">
          Top games by hours
        </h2>

        {/* Accessible list */}
        <ol className="list-unstyled mb-0" aria-label="Top games by play time">
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
              {/* Rank */}
              <span
                style={{ fontSize: '11px', color: '#adb5bd', width: '16px' }}
                aria-label={`Rank ${i + 1}`}
              >
                {i + 1}
              </span>

              {/* Title */}
              <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>
                {game.title}
              </span>

              {/* Hours */}
              <span
                style={{ fontSize: '12px', color: '#6c757d' }}
                aria-label={`${game.hours} hours played`}
              >
                {game.hours}h
              </span>

              {/* Rating */}
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: '#EEEDFE',
                  color: '#3C3489',
                  fontWeight: 500,
                }}
                aria-label={`Rating ${game.rating.toFixed(1)} out of 5`}
              >
                {game.rating.toFixed(1)}
              </span>
            </li>
          ))}
        </ol>
      </Card.Body>
    </Card>
  );
}

export default TopGamesList;