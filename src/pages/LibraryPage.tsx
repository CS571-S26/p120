import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Nav, Badge, Form, InputGroup } from 'react-bootstrap';
import LibraryGameCard, { type Game } from '../components/LibraryGameCard';

const SAMPLE_GAMES: Game[] = [
  { id: 1, title: 'Elden Ring', thumbnail: 'https://assetsio.gnwcdn.com/elden-ring-cover-art.jpg?width=1200&height=1200&fit=crop&quality=100&format=png&enable=upscale&auto=webp', status: 'Playing', platform: 'PS5', genre: 'Action RPG', favorite: true },
  { id: 2, title: 'Hades II', thumbnail: 'https://sm.ign.com/ign_mear/cover/h/hades-ii/hades-ii_3363.jpg', status: 'Playing', platform: 'PC', genre: 'Roguelike', favorite: false },
  { id: 3, title: "Baldur's Gate 3", thumbnail: 'https://live-production.wcms.abc-cdn.net.au/6fb825b2cc3e8a5e1f90fb65ca6a57ee?impolicy=wcms_crop_resize&cropH=2160&cropW=2160&xPos=40&yPos=0&width=862&height=862', status: 'Played', rating: 5, platform: 'PC', genre: 'RPG', favorite: true },
  { id: 4, title: 'Cyberpunk 2077', thumbnail: 'https://i1.sndcdn.com/artworks-kb2KdSqUgEytRcfh-VkRYyg-t500x500.jpg', status: 'Backlog', platform: 'Xbox', genre: 'Action RPG', favorite: false },
  { id: 5, title: 'Stardew Valley', thumbnail: 'https://i1.sndcdn.com/artworks-000198079448-hdj5mj-t1080x1080.jpg', status: 'Played', platform: 'PC', genre: 'Simulation', favorite: true },
];

export const LibraryPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>(SAMPLE_GAMES);
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All Platforms');

  const genres = useMemo(() => ['All Genres', ...new Set(games.map(g => g.genre))], [games]);
  const platforms = useMemo(() => ['All Platforms', ...new Set(games.map(g => g.platform))], [games]);

  const toggleFavorite = (id: number) => {
    setGames(prev => prev.map(g => g.id === id ? { ...g, favorite: !g.favorite } : g));
  };

  const filteredGames = games.filter(game => {
    // Skip status check on Favorites tab — game.status never equals 'Favorites'
    const matchesStatus = activeStatus === 'All' || activeStatus === 'Favorites' || game.status === activeStatus;
    const matchesGenre = selectedGenre === 'All Genres' || game.genre === selectedGenre;
    const matchesPlatform = selectedPlatform === 'All Platforms' || game.platform === selectedPlatform;
    return matchesStatus && matchesGenre && matchesPlatform;
  });

  const favoriteGames = filteredGames.filter(g => g.favorite);

  return (
    <Container className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header className="mb-5">
        <h1 className="fw-bold mb-4 text-dark">Library</h1>

        <Row className="gy-3 align-items-center">
          <Col lg={6}>
            <Nav variant="pills" className="gap-2">
              {['All', 'Played', 'Playing', 'Backlog', 'Favorites'].map((status) => (
                <Nav.Item key={status}>
                  <Nav.Link
                    active={activeStatus === status}
                    onClick={() => setActiveStatus(status)}
                    className={activeStatus === status ? 'bg-dark text-white' : 'bg-white text-dark border'}
                  >
                    {status === 'Favorites' ? '♥ Favorites' : status}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>

          <Col lg={6}>
            <div className="d-flex gap-2">
              <Form.Select
                size="sm"
                className="border-0 shadow-sm"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </Form.Select>

              <Form.Select
                size="sm"
                className="border-0 shadow-sm"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </Form.Select>

              <InputGroup size="sm" style={{ maxWidth: '200px' }}>
                <Form.Control placeholder="Search..." className="border-0 shadow-sm" />
              </InputGroup>
            </div>
          </Col>
        </Row>
      </header>

      <main>
        {/* Favorites tab — only show favorites */}
        {activeStatus === 'Favorites' && (
          <>
            {favoriteGames.length > 0 ? (
              <section className="mb-5">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h5 className="text-uppercase mb-0 text-secondary small fw-bold">
                    ♥ Favorites <Badge bg="light" text="dark" className="ms-1 border">{favoriteGames.length}</Badge>
                  </h5>
                </div>
                <Row>
                  {favoriteGames.map(game => (
                    <LibraryGameCard key={game.id} game={game} onToggleFavorite={toggleFavorite} />
                  ))}
                </Row>
              </section>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No favorites yet. Tap the ♥ on a game to add it here.</p>
              </div>
            )}
          </>
        )}

        {/* All / status tabs */}
        {activeStatus !== 'Favorites' && (
          <>
            {activeStatus === 'All' && favoriteGames.length > 0 && (
              <section className="mb-5">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h5 className="text-uppercase mb-0 text-secondary small fw-bold">
                    ♥ Favorites <Badge bg="light" text="dark" className="ms-1 border">{favoriteGames.length}</Badge>
                  </h5>
                </div>
                <Row>
                  {favoriteGames.map(game => (
                    <LibraryGameCard key={game.id} game={game} onToggleFavorite={toggleFavorite} />
                  ))}
                </Row>
              </section>
            )}

            {['Playing', 'Played', 'Backlog'].map((status) => {
              const sectionGames = filteredGames.filter(g => g.status === status);
              if (sectionGames.length === 0) return null;
              return (
                <section key={status} className="mb-5">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h5 className="text-uppercase mb-0 text-secondary small fw-bold">
                      {status} <Badge bg="light" text="dark" className="ms-1 border">{sectionGames.length}</Badge>
                    </h5>
                  </div>
                  <Row>
                    {sectionGames.map(game => (
                      <LibraryGameCard key={game.id} game={game} onToggleFavorite={toggleFavorite} />
                    ))}
                  </Row>
                </section>
              );
            })}

            {filteredGames.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No games found matching these filters.</p>
              </div>
            )}
          </>
        )}
      </main>
    </Container>
  );
};

export default LibraryPage;
