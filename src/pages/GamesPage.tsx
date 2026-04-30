import { useState, useEffect, useRef } from 'react'
import { Row, Col, Pagination, Spinner, FormControl, Dropdown, Container, Form } from 'react-bootstrap'
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

const GENRE_MAP: Record<string, { field: 'genres' | 'themes'; id: number }> = {
    'Action':     { field: 'themes', id: 1 },
    'RPG':        { field: 'genres', id: 12 },
    'Strategy':   { field: 'genres', id: 15 },
    'Horror':     { field: 'themes', id: 19 },
    'Indie':      { field: 'genres', id: 32 },
    'Platformer': { field: 'genres', id: 8 },
    'Shooter':    { field: 'genres', id: 5 },
}

const SORT_OPTIONS: { label: string; slug: string }[] = [
    { label: 'Most Popular', slug: 'popular' },
    { label: 'Top Rated', slug: 'rated' },
    { label: 'A-Z', slug: 'az' },
    { label: 'Recently Released', slug: 'recent' },
]

function GamesPage() {
    const [pageData, setPageData] = useState<Game[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(10)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [genre, setGenre] = useState('All Genres')
    const [sortOption, setSortOption] = useState('popular')
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const API_URL = import.meta.env.DEV ? "/api/games" : "https://p120.vercel.app/api/games"

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams()
        params.set('page', String(page))
        if (search) params.set('search', search)
        if (genre !== 'All Genres') params.set('genre', JSON.stringify(GENRE_MAP[genre]))
        params.set('sort', sortOption)

        fetch(`${API_URL}?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                const items = data.items || data
                setPageData(Array.isArray(items) ? items : [])
                if (Array.isArray(items) && items.length === 24) {
                    setTotalPages(prev => Math.max(prev, page + 2))
                } else if (Array.isArray(items) && items.length < 24) {
                    setTotalPages(page + 1)
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [page, search, genre, sortOption])

    const handleSearchChange = (value: string) => {
        setSearchInput(value)
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
            setSearch(value)
            setPage(0)
        }, 400)
    }

    const handleGenreChange = (g: string) => {
        setGenre(g)
        setPage(0)
    }

    const handleSortChange = (s: string) => {
        setSortOption(s)
        setPage(0)
    }

    const paginationItems = []
    const windowSize = 5
    const start = Math.max(0, page - Math.floor(windowSize / 2))
    const end = Math.min(totalPages, start + windowSize)

    for (let i = start; i < end; i++) {
        paginationItems.push(
            <Pagination.Item
                key={i}
                active={i === page}
                onClick={() => { setPage(i); window.scrollTo(0, 0) }}
                aria-current={i === page ? 'page' : undefined}
            >
                {i + 1}
            </Pagination.Item>
        )
    }

    return (
        <main>
            <Container className="py-4">
                {/* Page Title */}
                <h1 className="mb-4 fw-bold">Browse Games</h1>

                {/* Filter Section */}
                <section aria-labelledby="filters-heading" className="bg-white border rounded-3 p-3 mb-5 shadow-sm">
                    <h2 id="filters-heading" className="visually-hidden">Filter and search games</h2>

                    <Row className="g-3 align-items-center">
                        {/* Search */}
                        <Col xs={12} md={4}>
                            <Form.Group controlId="searchGames">
                                <Form.Label className="visually-hidden">Search games</Form.Label>
                                <div className="position-relative">
                                    <FormControl
                                        className="ps-5 border bg-light"
                                        style={{ height: '45px' }}
                                        placeholder="Search thousands of games..."
                                        value={searchInput}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        aria-describedby="searchHelp"
                                    />
                                    <span
                                        className="position-absolute top-50 start-0 translate-middle-y ms-3"
                                        aria-hidden="true"
                                    >
                                        🔍
                                    </span>
                                </div>
                            </Form.Group>
                        </Col>

                        {/* Genre */}
                        <Col xs={6} md={3}>
                            <Dropdown className="w-100">
                                <Dropdown.Toggle
                                    variant="light"
                                    className="w-100 border text-start d-flex justify-content-between align-items-center bg-white"
                                    style={{ height: '45px' }}
                                    aria-label="Select genre"
                                >
                                    <span className="fw-bold me-2">Genre:</span>
                                    <span>{genre}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100 shadow-sm border">
                                    {['All Genres', ...Object.keys(GENRE_MAP)].map(g => (
                                        <Dropdown.Item
                                            key={g}
                                            onClick={() => handleGenreChange(g)}
                                            active={genre === g}
                                        >
                                            {g}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>

                        {/* Sort */}
                        <Col xs={6} md={3}>
                            <Dropdown className="w-100">
                                <Dropdown.Toggle
                                    variant="light"
                                    className="w-100 border text-start d-flex justify-content-between align-items-center bg-white"
                                    style={{ height: '45px' }}
                                    aria-label="Sort games"
                                >
                                    <span className="fw-bold me-2">Sort:</span>
                                    <span>{SORT_OPTIONS.find(s => s.slug === sortOption)?.label ?? sortOption}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100 shadow-sm border">
                                    {SORT_OPTIONS.map(f => (
                                        <Dropdown.Item
                                            key={f.slug}
                                            onClick={() => handleSortChange(f.slug)}
                                            active={sortOption === f.slug}
                                        >
                                            {f.label}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>

                        {/* Results count */}
                        <Col xs={12} md={2} className="text-md-end">
                            <span
                                className="fw-bold"
                                aria-live="polite"
                            >
                                {pageData.length} results
                            </span>
                        </Col>
                    </Row>
                </section>

                {/* Results Section */}
                <section aria-labelledby="results-heading">
                    <h2 id="results-heading" className="visually-hidden">Game results</h2>

                    {loading ? (
                        <div
                            className="d-flex flex-column justify-content-center align-items-center"
                            style={{ height: '50vh' }}
                            role="status"
                            aria-live="polite"
                        >
                            <Spinner animation="grow" />
                            <span className="visually-hidden">Loading games...</span>
                        </div>
                    ) : pageData.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="fs-5">No games found{search ? ` for "${search}"` : ''}.</p>
                            {(search || genre !== 'All Genres') && (
                                <button
                                    className="btn btn-outline-dark btn-sm mt-2"
                                    onClick={() => {
                                        setSearch('')
                                        setSearchInput('')
                                        setGenre('All Genres')
                                        setSortOption('popular')
                                        setPage(0)
                                    }}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
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
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav
                        aria-label="Pagination"
                        style={{
                            position: 'fixed',
                            bottom: 30,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            zIndex: 9999,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            border: '1px solid #ced4da'
                        }}
                    >
                        <Pagination className="mb-0">
                            <Pagination.First disabled={page === 0} onClick={() => setPage(0)} />
                            <Pagination.Prev disabled={page === 0} onClick={() => setPage(page - 1)} />
                            {paginationItems}
                            <Pagination.Next disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} />
                        </Pagination>
                    </nav>
                )}
            </Container>
        </main>
    )
}

export default GamesPage