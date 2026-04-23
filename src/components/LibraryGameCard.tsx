import React from 'react';
import { Col, Card, Badge, Button } from 'react-bootstrap';

export type Game = {
  id: number;
  title: string;
  thumbnail: string;
  status: 'Playing' | 'Played' | 'Backlog';
  platform: string;
  rating?: number;
  genre: string;
  favorite?: boolean;
};

type LibraryGameCardProps = {
  game: Game;
  onToggleFavorite?: (id: number) => void;
};

const LibraryGameCard: React.FC<LibraryGameCardProps> = ({ game, onToggleFavorite }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card className="h-100 shadow-sm">
        <div style={{ position: 'relative' }}>
          <Card.Img variant="top" src={game.thumbnail} alt={game.title} />
          {onToggleFavorite && (
            <Button
              variant="link"
              onClick={() => onToggleFavorite(game.id)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '4px',
                lineHeight: 1,
                background: 'none',
                border: 'none',
              }}
              aria-label={game.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={game.favorite ? '#e0245e' : 'none'}
                stroke={game.favorite ? '#e0245e' : '#000000'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Button>
          )}
        </div>
        <Card.Body>
          <Card.Title className="mb-2">{game.title}</Card.Title>
          <div className="mb-2">
            <Badge bg="info" className="me-1">{game.platform}</Badge>
            <Badge bg="secondary">{game.status}</Badge>
          </div>
          {game.rating && (
            <Card.Text className="small">
              <strong>Rating:</strong> {game.rating} / 5
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default LibraryGameCard;