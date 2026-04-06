
import {Container, Button, Row, Col } from 'react-bootstrap';

function HomePage() {
  return (
    <Container className="mt-4">
      
      <section className="text-center mb-5">
        <h1>CheckPoint</h1>
        <p className="lead">Discover, rate, and track your favorite games!</p>
        <Button href="#/games" variant="primary" size="lg">Explore Games</Button>
      </section>

      <section className="mb-5">
        <Row className="text-center">
          <Col md={4}>
            <h5>Browse Games</h5>
            <p>Search by genre, rating, or release date and find your next favorite game.</p>
          </Col>
          <Col md={4}>
            <h5>Track Ratings</h5>
            <p>See ratings and release info for thousands of games from IGDB.</p>
          </Col>
          <Col md={4}>
            <h5>Bookmark Favorites</h5>
            <p>Create your own collection and never lose track of games you love.</p>
          </Col>
        </Row>
      </section>

      

      <section className="mb-5">
        <h2>How It Works</h2>
        <p>
          Use the navigation above to explore games. Click a game to view detailed information including cover art, genres, release year, and rating. Bookmark your favorites to keep track of what you want to play next!
        </p>
      </section>

    </Container>
  );
};

export default HomePage