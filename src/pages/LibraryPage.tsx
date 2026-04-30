import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Nav, Badge, Form, InputGroup } from 'react-bootstrap';
import LibraryGameCard from '../components/LibraryGameCard';
import { useLibrary } from '../useLibrary';

export const LibraryPage: React.FC = () => {
  const { games, toggleFavorite } = useLibrary();
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All Platforms');
  const [searchText, setSearchText] = useState<string>('');

  const genres = useMemo(() => ['All Genres', ...Array.from(new Set(games.map(g => g.genre).filter(Boolean)))], [games]);
  const platforms = useMemo(() => ['All Platforms', ...Array.from(new Set(games.map(g => g.platform).filter(Boolean)))], [games]);

  const filteredGames = games.filter(game => {
    const matchesStatus = activeStatus === 'All' || activeStatus === 'Favorites' || game.status === activeStatus;
    const matchesGenre = selectedGenre === 'All Genres' || game.genre === selectedGenre;
    const matchesPlatform = selectedPlatform === 'All Platforms' || game.platform === selectedPlatform;
    const matchesSearch = !searchText || game.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesGenre && matchesPlatform && matchesSearch;
  });

  const favoriteGames = filteredGames.filter(g => g.favorite);

  return (
    <main style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#212529' }}>
      <Container className="py-5">

        {/* Header */}
        <header className="mb-5">
          <h1 className="fw-bold mb-4">Library</h1>

          <Row className="gy-3 align-items-center">
            {/* Status Filters */}
            <Col lg={6}>
              <h2 className="visually-hidden">Filter by status</h2>
              <Nav variant="pills" className="gap-2" aria-label="Filter games by status">
                {['All', 'Played', 'Playing', 'Backlog', 'Favorites'].map((status) => (
                  <Nav.Item key={status}>
                    <Nav.Link
                      role="button"
                      tabIndex={0}
                      active={activeStatus === status}
                      onClick={() => setActiveStatus(status)}
                      onKeyDown={(e) => e.key === 'Enter' && setActiveStatus(status)}
                      className={activeStatus === status ? 'bg-dark text-white' : 'bg-white text-dark border'}
                    >
                      <span aria-hidden={status === 'Favorites'}>
                        {status === 'Favorites' ? '♥ ' : ''}
                      </span>
                      {status}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>

            {/* Filters */}
            <Col lg={6}>
              <Form>
                <Row className="g-2">

                  <Col xs={4}>
                    <Form.Group controlId="genreSelect">
                      <Form.Label className="visually-hidden">Filter by genre</Form.Label>
                      <Form.Select
                        size="sm"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                      >
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={4}>
                    <Form.Group controlId="platformSelect">
                      <Form.Label className="visually-hidden">Filter by platform</Form.Label>
                      <Form.Select
                        size="sm"
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                      >
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={4}>
                    <Form.Group controlId="searchLibrary">
                      <Form.Label className="visually-hidden">Search library</Form.Label>
                      <InputGroup size="sm">
                        <Form.Control
                          placeholder="Search games"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                </Row>
              </Form>
            </Col>
          </Row>
        </header>

        {/* Empty Library */}
        {games.length === 0 ? (
          <section className="text-center py-5">
            <h2 className="visually-hidden">Empty library</h2>
            <p className="fs-1" aria-hidden="true">🎮</p>
            <p className="fs-5">Your library is empty.</p>
            <p>Add a game to start tracking your progress.</p>
          </section>
        ) : (
          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="visually-hidden">Library results</h2>

            {/* Favorites Tab */}
            {activeStatus === 'Favorites' && (
              <>
                {favoriteGames.length > 0 ? (
                  <section className="mb-5" aria-labelledby="favorites-heading">
                    <h3 id="favorites-heading" className="fw-bold border-bottom pb-2 mb-3">
                      Favorites <Badge bg="light" text="dark" className="ms-2 border">{favoriteGames.length}</Badge>
                    </h3>

                    <Row className="g-4">
                      {favoriteGames.map(game => (
                        <Col key={game.id} xs={6} md={4} lg={3} className="d-flex">
                          <Link
                            to={`/games/${game.id}`}
                            className="text-decoration-none text-dark w-100 d-flex"
                          >
                            <LibraryGameCard game={game} onToggleFavorite={toggleFavorite} />
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  </section>
                ) : (
                  <div className="text-center py-5">
                    <p>No favorites yet. Use the favorite button on a game to add it here.</p>
                  </div>
                )}
              </>
            )}

            {/* Other Tabs */}
            {activeStatus !== 'Favorites' && (
              <>
                {['Playing', 'Played', 'Backlog'].map((status) => {
                  const sectionGames = filteredGames.filter(g => g.status === status);
                  if (sectionGames.length === 0) return null;

                  return (
                    <section key={status} className="mb-5" aria-labelledby={`${status}-heading`}>
                      <h3 id={`${status}-heading`} className="fw-bold border-bottom pb-2 mb-3">
                        {status} <Badge bg="light" text="dark" className="ms-2 border">{sectionGames.length}</Badge>
                      </h3>

                      <Row className="g-4">
                        {sectionGames.map(game => (
                          <Col key={game.id} xs={6} md={4} lg={3} className="d-flex">
                            <Link
                              to={`/games/${game.id}`}
                              className="text-decoration-none text-dark w-100 d-flex"
                            >
                              <LibraryGameCard game={game} onToggleFavorite={toggleFavorite} />
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    </section>
                  );
                })}

                {filteredGames.length === 0 && (
                  <div className="text-center py-5">
                    <p>No games found matching these filters.</p>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </Container>
    </main>
  );
};

export default LibraryPage;