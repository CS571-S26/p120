import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner, Container, Row, Col, Badge } from 'react-bootstrap'
import GameForm from '../components/GameForm'

type Game = {
    cover: { id: number; url: string }
    id: number
    name: string
    aggregated_rating: number
    genres: string[]
    first_release_date: number
    summary?: string
}

const GameDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const [game, setGame] = useState<Game | null>(null)
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.DEV ? "/api/games" : "https://p120.vercel.app/api/games"

    useEffect(() => {
        if (!id) return
        setLoading(true)
        fetch(`${API_URL}?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setGame(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '80vh' }}
            role="status"
            aria-live="polite"
        >
            <Spinner animation="border" variant="dark" />
            <span className="visually-hidden">Loading game details...</span>
        </div>
    )

    if (!game) return (
        <Container className="py-5">
            <h1 className="h3">Game not found</h1>
        </Container>
    )

    const releaseYear = game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : 'TBA'

    const thumbnailUrl = game.cover?.url
        ? game.cover.url.replace('t_thumb', 't_cover_big')
        : ''

    const primaryGenre = game.genres?.[0] ?? ''

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#212529' }}>
            {/* Header Area */}
            <header style={{ backgroundColor: '#e9ecef', padding: '48px 0', borderBottom: '1px solid #ced4da' }}>
                <Container>
                    <Row className="align-items-center g-4">
                        <Col lg={4} md={5} xs={12}>
                            <div className="rounded-3 overflow-hidden border shadow-sm bg-white">
                                <img
                                    src={game.cover?.url.replace('t_thumb', 't_720p')}
                                    alt={`Cover art for ${game.name}`}
                                    className="img-fluid w-100 d-block"
                                />
                            </div>
                        </Col>

                        <Col lg={8} md={7} xs={12}>
                            {/* h1 = page title */}
                            <h1
                                className="fw-bold mb-2"
                                style={{ letterSpacing: '-1px', fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
                            >
                                {game.name}
                            </h1>

                            <div className="d-flex flex-wrap align-items-center gap-3">
                                <span className="h5 mb-0 fw-normal">{releaseYear}</span>

                                <div className="vr mx-1 d-none d-sm-block"></div>

                                <div className="d-flex gap-2 flex-wrap" aria-label="Genres">
                                    {game.genres?.map(g => (
                                        <Badge
                                            key={g}
                                            bg="dark"
                                            className="rounded-pill px-3 py-2 fw-normal"
                                        >
                                            {g}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Row className="mt-4 pt-4 border-top g-3">
                                <Col sm={4}>
                                    <h2 className="visually-hidden">Rating</h2>
                                    <div className="fw-bold text-uppercase mb-1">Rating</div>
                                    <div className="h3 mb-0 fw-bold">
                                        {Math.round(game.aggregated_rating) || 'N/A'}
                                        <span className="fs-6"> / 100</span>
                                    </div>
                                </Col>

                                <Col sm={8}>
                                    <h2 className="visually-hidden">Release Date</h2>
                                    <div className="fw-bold text-uppercase mb-1">Release date</div>
                                    <div className="h5 mb-0 fw-semibold">
                                        {game.first_release_date
                                            ? new Date(game.first_release_date * 1000).toLocaleDateString(undefined, { dateStyle: 'long' })
                                            : 'Unknown'}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </header>

            <main>
                <Container className="py-5">
                    {/* Summary Section */}
                    <section className="mb-5">
                        <Row className="justify-content-center">
                            <Col lg={8}>
                                <h2 className="text-uppercase fw-bold mb-3">
                                    Summary
                                </h2>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                                    {game.summary || 'No description provided for this title.'}
                                </p>
                            </Col>
                        </Row>
                    </section>

                    <hr className="my-5" />

                    {/* Activity Section */}
                    <section>
                        <Row>
                            <Col xs={12}>
                                <h2 className="fw-bold mb-4 text-center text-uppercase">
                                    Your Activity
                                </h2>

                                <div
                                    className="p-3 bg-white rounded-3 border shadow-sm mx-auto"
                                    style={{ maxWidth: '800px' }}
                                >
                                    {/* 
                                        GameForm must internally:
                                        - use <label htmlFor=...>
                                        - ensure inputs are keyboard accessible
                                        - include aria attributes where needed
                                    */}
                                    <GameForm
                                        gameId={game.id}
                                        gameTitle={game.name}
                                        gameThumbnail={thumbnailUrl}
                                        gameGenre={primaryGenre}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </section>
                </Container>
            </main>
        </div>
    )
}

export default GameDetailPage