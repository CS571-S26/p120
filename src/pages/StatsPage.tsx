import { Container, Row, Col, Card } from 'react-bootstrap';
import StatCard from '../components/StatCard';
import DoughnutChart from '../components/DoughnutChart';
import TopGamesList from '../components/TopGamesList';
import PlatformSplit from '../components/PlatformSplit';

const SAMPLE_STATS = {
  totalGames: 47,
  totalHours: 312,
  avgRating: 4.1,
  completed: 23,
  streak: 14,
  bestStreak: 31,
  platforms: [
    { name: 'PC', count: 21, color: '#534AB7' },
    { name: 'PS5', count: 14, color: '#1D9E75' },
    { name: 'Xbox', count: 8, color: '#D85A30' },
    { name: 'Switch', count: 4, color: '#BA7517' },
  ],
  topGames: [
    { title: 'Elden Ring', hours: 86, rating: 5.0 },
    { title: "Baldur's Gate 3", hours: 74, rating: 5.0 },
    { title: 'Stardew Valley', hours: 52, rating: 4.5 },
    { title: 'Hades II', hours: 38, rating: 4.0 },
    { title: 'Celeste', hours: 22, rating: 4.5 },
  ],
  genres: {
    labels: ['RPG', 'Action', 'Indie', 'Sim', 'Other'],
    data: [36, 24, 18, 12, 10],
    colors: ['#534AB7', '#1D9E75', '#D85A30', '#BA7517', '#888780'],
  },
  status: {
    labels: ['Played', 'Playing', 'Backlog'],
    data: [49, 17, 34],
    colors: ['#1D9E75', '#534AB7', '#888780'],
  },
};

function StatsPage() {
  const { totalGames, totalHours, avgRating, completed, streak, bestStreak, platforms, topGames, genres, status } = SAMPLE_STATS;
  const completionRate = Math.round((completed / totalGames) * 100);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">
        <h1 className="fw-bold mb-4">My Stats</h1>

        {/* Summary Metrics */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <StatCard label="Games owned" value={totalGames} sub="+3 this month" />
          </Col>
          <Col xs={6} md={3}>
            <StatCard label="Total played" value={`${totalHours}h`} sub="avg 26h / month" />
          </Col>
          <Col xs={6} md={3}>
            <StatCard label="Avg rating" value={avgRating.toFixed(1)} sub="out of 5" />
          </Col>
          <Col xs={6} md={3}>
            <StatCard label="Completed" value={completed} sub={`${completionRate}% completion rate`} />
          </Col>
        </Row>

        {/* Doughnut Charts */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Card className="border shadow-sm h-100">
              <Card.Body>
                <p className="text-uppercase text-muted small fw-bold mb-3">Genre breakdown</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {genres.labels.map((l, i) => (
                    <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6c757d' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: genres.colors[i], display: 'inline-block' }} />
                      {l} {genres.data[i]}%
                    </span>
                  ))}
                </div>
                <DoughnutChart id="genreChart" labels={genres.labels} data={genres.data} colors={genres.colors} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border shadow-sm h-100">
              <Card.Body>
                <p className="text-uppercase text-muted small fw-bold mb-3">Library status</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {status.labels.map((l, i) => (
                    <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6c757d' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: status.colors[i], display: 'inline-block' }} />
                      {l} {status.data[i]}%
                    </span>
                  ))}
                </div>
                <DoughnutChart id="statusChart" labels={status.labels} data={status.data} colors={status.colors} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Top Games + Platform Split */}
        <Row className="g-3">
          <Col md={6}>
            <TopGamesList games={topGames} />
          </Col>
          <Col md={6}>
            <PlatformSplit platforms={platforms} streak={streak} bestStreak={bestStreak} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default StatsPage;
