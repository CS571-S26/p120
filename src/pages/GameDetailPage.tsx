import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

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

    const API_URL = import.meta.env.DEV
        ? "/api/games"
        : "https://p120.vercel.app/api/games"

    useEffect(() => {
        if (!id) return
        setLoading(true)
        fetch(`${API_URL}?id=${id}`) // or your actual API
            .then(res => res.json())
            .then(data => {
                setGame(data)
                console.log(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>)
    if (!game) return <p>Game not found</p>

    return (
        <div>
            <h1>{game.name}</h1>
            <img src={game.cover?.url.replace('t_thumb', 't_cover_big')} alt={game.name} />
            <p>Rating: {Math.round(game.aggregated_rating)}</p>
            <p>Genres: {game.genres.join(', ')}</p>
            <p>Release Year: {game.first_release_date && new Date(game.first_release_date * 1000).getFullYear()}</p>
            {game.summary && <p>{game.summary}</p>}
            <GameForm></GameForm>
        </div>
    )
}

export default GameDetailPage;