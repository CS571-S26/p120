import { useState, useEffect } from 'react'
import { Row, Col, Pagination, Spinner, FormControl, Dropdown } from 'react-bootstrap'
import GameCard from '../components/GameCard'
import '../App.css'

type Game = {
    cover: { id: number; url: string }
    id: number
    name: string
    total_rating_count: number
    genres: string[]
    first_release_date: number
    aggregated_rating: number
}

function GamesPage() {
    const [pageData, setPageData] = useState<Game[]>([])
    const [page, setPage] = useState(0) // current page
    const totalPages = 10
    const [loading, setLoading] = useState(false) // loading state

    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('All Genres');
    const [miscFilter, setMiscFilter] = useState('Most Popular');

    const API_URL = import.meta.env.DEV
        ? "/api/games"
        : "https://p120.vercel.app/api/games"

    // Fetch new page whenever `page` changes
    useEffect(() => {
        setLoading(true) // start loading
        fetch(`${API_URL}?page=${page}`)
            .then(res => res.json())
            .then(data => {
                setPageData(data.items || data) // API may return { items } or array
                setLoading(false) // done loading
            })
            .catch(() => setLoading(false)) // stop loading on error too
    }, [page])

    // Build pagination items
    const paginationItems = []
    for (let i = 0; i < totalPages; i++) {
        paginationItems.push(
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                {i + 1}
            </Pagination.Item>
        )
    }

    return (
        <>
            {/* Filter bar */}
      <Row className="g-2 mb-3">
        <Col xs={12} sm={4}>
          <FormControl
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col xs={12} sm={4}>
          <Dropdown className="w-100">
            <Dropdown.Toggle variant="secondary" className="w-100">
              {genre}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              {['All Genres', 'Action', 'RPG', 'Strategy', 'Horror', 'Indie', 'Platformer'].map(g => (
                <Dropdown.Item key={g} onClick={() => setGenre(g)}>
                  {g}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col xs={12} sm={4}>
          <Dropdown className="w-100">
            <Dropdown.Toggle variant="secondary" className="w-100">
              {miscFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              {['Most Popular', 'Top Rated', 'A-Z', 'Recently Released', 'Upcoming'].map(f => (
                <Dropdown.Item key={f} onClick={() => setMiscFilter(f)}>
                  {f}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
            {loading ? (
                // Centered loading spinner
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div
                    style={{
                        position: 'relative',
                        paddingBottom: '100px'
                    }}>
                    {/* Game grid */}
                    <Row className='gy-3'>
                        {pageData.map(game => (
                            <Col key={game.id} xs={12} sm={6} md={4} lg={3} xl={2.4} className="d-flex">
                                <GameCard
                                    title={game.name}
                                    rating={game.aggregated_rating}
                                    coverUrl={game.cover?.url}
                                    genres={game.genres}
                                    releaseDate={game.first_release_date}
                                    id={game.id}
                                />
                            </Col>
                        ))}
                    </Row>

                    {/* Floating Pagination */}
                    <div
                        style={{
                            position: 'fixed',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            zIndex: 9999,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Pagination className="mb-0">
                            <Pagination.Prev
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            />
                            {paginationItems}
                            <Pagination.Next
                                disabled={page === totalPages - 1}
                                onClick={() => setPage(page + 1)}
                            />
                        </Pagination>
                    </div>
                </div>
            )}
        </>
    )
}


export default GamesPage;