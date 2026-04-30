import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import checkpointLogo from '../assets/CheckPointLogo.png';

function HomePage() {
  return (
    <main style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#212529' }}>
      
      {/* 1. Hero Section */}
      <section
        className="py-5 text-center"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          borderBottom: '1px solid #ced4da'
        }}
      >
        <Container className="py-5">
          {/* h1 = page title */}
          <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: '-1px' }}>
            CheckPoint
          </h1>

          <p className="lead mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            The social platform for tracking, rating, and discovering your next gaming obsession.
            Build your library and share your journey.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Button href="#/games" variant="dark" size="lg" className="px-4 py-2 fw-bold">
              Explore Games
            </Button>
            <Button href="#/library" variant="outline-dark" size="lg" className="px-4 py-2">
              My Library
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-5">

        {/* 2. Feature Cards */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="fw-bold mb-4 text-center">
            Features
          </h2>

          <Row className="mb-5 g-4">
            {[
              {
                title: "Browse Games",
                text: "Filter through thousands of titles by genre, rating, or release date.",
                icon: "🔍"
              },
              {
                title: "Track Progress",
                text: "Keep a log of what you're currently playing and your backlog.",
                icon: "🎮"
              },
              {
                title: "Rate & Review",
                text: "Share your thoughts and give every game a star rating.",
                icon: "⭐"
              }
            ].map((feature, i) => (
              <Col md={4} key={i}>
                <Card className="h-100 border shadow-sm p-3 text-center">
                  <Card.Body>
                    <div className="display-6 mb-3" aria-hidden="true">
                      {feature.icon}
                    </div>
                    <h3 className="h5 fw-bold">{feature.title}</h3>
                    <p className="small mb-0">{feature.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* 3. How it Works */}
        <section className="bg-white rounded-4 p-5 shadow-sm border mb-5" aria-labelledby="how-heading">
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 id="how-heading" className="fw-bold mb-4">
                Your Gaming Life, Organized
              </h2>

              <p className="mb-4" style={{ lineHeight: '1.7' }}>
                CheckPoint uses the <strong>IGDB database</strong> to provide you with accurate data on thousands of titles.
                Whether you're a completionist tracking every trophy or a casual player looking for
                what's trending, we've got you covered.
              </p>

              <ul className="mb-0">
                <li className="mb-2">
                  <strong>Log Sessions:</strong> Record hours and dates.
                </li>
                <li className="mb-2">
                  <strong>Filter Smart:</strong> Sort by platform or genre.
                </li>
                <li className="mb-2">
                  <strong>Save for Later:</strong> One-click backlog management.
                </li>
              </ul>
            </Col>

            <Col lg={6} className="text-center d-none d-lg-flex align-items-center justify-content-center">
              <img
                src={checkpointLogo}
                alt="CheckPoint logo representing the gaming tracking platform"
                style={{
                  width: '320px',
                  height: '320px',
                  objectFit: 'contain',
                  borderRadius: '2rem'
                }}
              />
            </Col>
          </Row>
        </section>

        {/* 4. Popular Genres */}
        <section className="text-center" aria-labelledby="genres-heading">
          <h2 id="genres-heading" className="text-uppercase fw-bold mb-4">
            Popular Genres
          </h2>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            {['RPG', 'Action', 'Indie', 'Horror', 'Platformer', 'Strategy'].map(genre => (
              <Button
                key={genre}
                variant="light"
                className="rounded-pill border px-4 shadow-sm"
                aria-label={`Browse ${genre} games`}
              >
                {genre}
              </Button>
            ))}
          </div>
        </section>

      </Container>
    </main>
  );
};

export default HomePage;