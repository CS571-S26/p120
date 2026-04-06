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

    const score = Math.round(rating);

    const scoreStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 8,
        left: 8,
        width: 44,
        height: 44,
        borderRadius: '50%',
        backgroundColor: '#28a745', // bootstrap success
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

            <div style={scoreStyle} aria-label={`Rating ${score} out of 100`}>
                {score}
            </div>



        </Card>
    )


}

export default GameCard;