import { useState, useEffect } from 'react'
import { Row, Col, Pagination, Spinner, FormControl, Dropdown, Container } from 'react-bootstrap'
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
    const [page, setPage] = useState(0)
    const totalPages = 10
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('All Genres')
    const [miscFilter, setMiscFilter] = useState('Most Popular')

    const API_URL = import.meta.env.DEV ? "/api/games" : "https://p120.vercel.app/api/games"

    useEffect(() => {
        setLoading(true)
        fetch(`${API_URL}?page=${page}`)
            .then(res => res.json())
            .then(data => {
                setPageData(data.items || data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [page])

    const paginationItems = []
    for (let i = 0; i < totalPages; i++) {
        paginationItems.push(
            <Pagination.Item
                key={i}
                active={i === page}
                onClick={() => { setPage(i); window.scrollTo(0, 0); }}
            >
                {i + 1}
            </Pagination.Item>
        )
    }

    return (
        <Container className="py-4">
            {/* Filter Bar */}
            <div className="bg-white border rounded-3 p-3 mb-5 shadow-sm">
                <Row className="g-3 align-items-center">
                    <Col xs={12} md={4}>
                        <div className="position-relative">
                            <FormControl
                                className="ps-5 border-0 bg-light"
                                style={{ height: '45px' }}
                                placeholder="Search thousands of games..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">🔍</span>
                        </div>
                    </Col>

                    <Col xs={6} md={3}>
                        <Dropdown className="w-100">
                            <Dropdown.Toggle variant="light" className="w-100 border text-start d-flex justify-content-between align-items-center bg-white" style={{ height: '45px' }}>
                                <span className="text-muted small me-2">GENRE</span>
                                <strong>{genre}</strong>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 shadow-sm border-0">
                                {['All Genres', 'Action', 'RPG', 'Strategy', 'Horror', 'Indie', 'Platformer'].map(g => (
                                    <Dropdown.Item key={g} onClick={() => setGenre(g)}>{g}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>

                    <Col xs={6} md={3}>
                        <Dropdown className="w-100">
                            <Dropdown.Toggle variant="light" className="w-100 border text-start d-flex justify-content-between align-items-center bg-white" style={{ height: '45px' }}>
                                <span className="text-muted small me-2">SORT</span>
                                <strong>{miscFilter}</strong>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 shadow-sm border-0">
                                {['Most Popular', 'Top Rated', 'A-Z', 'Recently Released'].map(f => (
                                    <Dropdown.Item key={f} onClick={() => setMiscFilter(f)}>{f}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>

                    <Col xs={12} md={2} className="text-md-end">
                        <span className="text-muted small fw-bold">{pageData.length} RESULTS</span>
                    </Col>
                </Row>
            </div>

            {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spinner animation="grow" variant="primary" />
                    <p className="mt-3 text-muted fw-bold">Loading Games...</p>
                </div>
            ) : (
                <div style={{ paddingBottom: '100px' }}>
                    {/* Game Grid — 2 cols on mobile, 3 on md, 4 on lg */}
                    <Row className="g-4">
                        {pageData.map(game => (
                            <Col key={game.id} xs={6} md={4} lg={3} className="d-flex">
                                <GameCard
                                    title={game.name}
                                    rating={game.aggregated_rating}
                                    coverUrl={game.cover?.url?.replace('t_thumb', 't_cover_big')}
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
                            bottom: 30,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            zIndex: 9999,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}
                    >
                        <Pagination className="mb-0 custom-pagination">
                            <Pagination.Prev
                                disabled={page === 0}
                                onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
                            />
                            {paginationItems}
                            <Pagination.Next
                                disabled={page === totalPages - 1}
                                onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
                            />
                        </Pagination>
                    </div>
                </div>
            )}
        </Container>
    )
}

export default GamesPage