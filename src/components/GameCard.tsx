type GameCardProps = {
    title: string;
    rating: number;
    coverUrl: string;
    genres: string[];
    releaseDate: number;
    id: number;
}

import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'


const GameCard: React.FC<GameCardProps> = ({ title, rating, coverUrl, releaseDate, id }) => {

    const score = rating && !isNaN(rating) ? Math.round(rating) : null;

    const scoreStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 8,
        left: 8,
        width: 44,
        height: 44,
        borderRadius: '50%',
        backgroundColor: score ? '#28a745' : '#adb5bd',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 2,
        fontSize: 14,
    }




    const highResUrl = coverUrl.replace("t_thumb", "t_cover_big")

    const year = Number.isFinite(releaseDate) && releaseDate > 0
        ? new Date(releaseDate * 1000).getFullYear()
        : undefined


    return (

        <Card
            as={Link} // makes entire card a clickable link
            to={`/games/${id}`}
            className="text-decoration-none text-dark"
            style={{ cursor: 'pointer' }}>
            <Card.Img src={highResUrl} alt={`${title} cover`} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle>{year}</Card.Subtitle>


            </Card.Body>

            <div style={scoreStyle} aria-label={`Rating ${score ?? 'X'} out of 100`}>
                {score ?? 'X'}
            </div>



        </Card>
    )


}

export default GameCard;