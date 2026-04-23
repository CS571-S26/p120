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
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <Spinner animation="border" variant="dark" />
        </div>
    )

    if (!game) return <Container className="py-5"><h3>Game not found</h3></Container>

    const releaseYear = game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : 'TBA'

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            {/* Header Area */}
            <div style={{ backgroundColor: '#f1f3f5', padding: '48px 0', borderBottom: '1px solid #e9ecef' }}>
                <Container>
                    <Row className="align-items-center g-4">
                        <Col lg={4} md={5} xs={6}>
                            <div className="rounded-3 overflow-hidden border shadow-sm bg-white">
                                <img
                                    src={game.cover?.url.replace('t_thumb', 't_720p')}
                                    alt={game.name}
                                    className="img-fluid w-100 d-block"
                                />
                            </div>
                        </Col>
                        <Col lg={8} md={7} xs={6}>
                            <h1 className="fw-bold mb-2" style={{ letterSpacing: '-1px', fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
                                {game.name}
                            </h1>
                            <div className="d-flex flex-wrap align-items-center gap-3">
                                <span className="h5 mb-0 text-muted fw-light">{releaseYear}</span>
                                <div className="vr mx-1 d-none d-sm-block"></div>
                                <div className="d-flex gap-2 flex-wrap">
                                    {game.genres?.map(g => (
                                        <Badge key={g} bg="dark" className="rounded-pill px-3 py-2 fw-normal">
                                            {g}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Row className="mt-4 pt-4 border-top g-3">
                                <Col sm={4}>
                                    <div className="text-muted small fw-bold text-uppercase mb-1">Rating</div>
                                    <div className="h3 mb-0 fw-bold">
                                        {Math.round(game.aggregated_rating) || 'N/A'}
                                        <span className="text-muted fs-6"> / 100</span>
                                    </div>
                                </Col>
                                <Col sm={8}>
                                    <div className="text-muted small fw-bold text-uppercase mb-1">Release date</div>
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
            </div>

            <Container className="py-5">
                {/* Summary */}
                <Row className="mb-5 justify-content-center">
                    <Col lg={8} className="text-center">
                        <h5 className="text-uppercase small fw-bold text-muted mb-3">Summary</h5>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
                            {game.summary || 'No description provided for this title.'}
                        </p>
                    </Col>
                </Row>

                <hr className="my-5" />

                {/* Activity form */}
                <Row>
                    <Col xs={12}>
                        <h4 className="fw-bold mb-4 text-center text-uppercase small">Your Activity</h4>
                        <div className="p-3 bg-white rounded-3 border shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
                            <GameForm />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default GameDetailPage