import { useMemo } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import StatCard from '../components/StatCard';
import DoughnutChart from '../components/DoughnutChart';
import TopGamesList from '../components/TopGamesList';
import PlatformSplit from '../components/PlatformSplit';
import { useLibrary } from '../useLibrary';

const PLATFORM_COLORS: Record<string, string> = {
  'PC': '#534AB7',
  'PS5': '#1D9E75',
  'PlayStation': '#1D9E75',
  'Xbox': '#D85A30',
  'Switch': '#BA7517',
  'Nintendo Switch': '#BA7517',
};

const GENRE_COLORS = ['#534AB7', '#1D9E75', '#D85A30', '#BA7517', '#888780', '#E07B54', '#3C9EE8'];

function StatsPage() {
  const { games } = useLibrary();

  const stats = useMemo(() => {
    const totalGames = games.length;
    const totalHours = games.reduce((sum, g) => sum + (g.hours ?? 0), 0);

    const ratedGames = games.filter(g => g.rating && g.rating > 0);
    const avgRating =
      ratedGames.length > 0
        ? ratedGames.reduce((sum, g) => sum + (g.rating ?? 0), 0) / ratedGames.length
        : 0;

    const completed = games.filter(g => g.status === 'Played').length;
    const completionRate = totalGames > 0 ? Math.round((completed / totalGames) * 100) : 0;

    const platformCounts: Record<string, number> = {};
    for (const g of games) {
      if (g.platform) platformCounts[g.platform] = (platformCounts[g.platform] ?? 0) + 1;
    }

    const platforms = Object.entries(platformCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({
        name,
        count,
        color: PLATFORM_COLORS[name] ?? GENRE_COLORS[i % GENRE_COLORS.length],
      }));

    const topGames = [...games]
      .filter(g => g.hours && g.hours > 0)
      .sort((a, b) => (b.hours ?? 0) - (a.hours ?? 0))
      .slice(0, 5)
      .map(g => ({ title: g.title, hours: g.hours ?? 0, rating: g.rating ?? 0 }));

    const genreCounts: Record<string, number> = {};
    for (const g of games) {
      if (g.genre) genreCounts[g.genre] = (genreCounts[g.genre] ?? 0) + 1;
    }

    const genreEntries = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    const genreTotal = genreEntries.reduce((s, [, c]) => s + c, 0);

    const genreLabels = genreEntries.map(([l]) => l);
    const genreData = genreEntries.map(([, c]) =>
      Math.round((c / genreTotal) * 100)
    );
    const genreColors = genreLabels.map((_, i) => GENRE_COLORS[i % GENRE_COLORS.length]);

    const statusCounts = {
      Played: games.filter(g => g.status === 'Played').length,
      Playing: games.filter(g => g.status === 'Playing').length,
      Backlog: games.filter(g => g.status === 'Backlog').length,
    };

    const statusTotal = Object.values(statusCounts).reduce((s, c) => s + c, 0);
    const statusLabels = Object.keys(statusCounts) as (keyof typeof statusCounts)[];
    const statusData = statusLabels.map(k =>
      statusTotal > 0 ? Math.round((statusCounts[k] / statusTotal) * 100) : 0
    );

    const statusColors = ['#1D9E75', '#534AB7', '#888780'];

    return {
      totalGames,
      totalHours,
      avgRating,
      completed,
      completionRate,
      platforms,
      topGames,
      genres: { labels: genreLabels, data: genreData, colors: genreColors },
      status: { labels: statusLabels, data: statusData, colors: statusColors },
    };
  }, [games]);

  if (games.length === 0) {
    return (
      <main style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container className="py-5 text-center">
          <h1 className="fw-bold mb-4">My Stats</h1>
          <span role="img" aria-label="chart" className="fs-1 mb-3 d-block">
            📊
          </span>
          <p className="fs-5 text-muted">
            No stats yet — add games to your library first!
          </p>
        </Container>
      </main>
    );
  }

  const {
    totalGames,
    totalHours,
    avgRating,
    completed,
    completionRate,
    platforms,
    topGames,
    genres,
    status,
  } = stats;

  return (
    <main style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">

        <h1 className="fw-bold mb-4">My Stats</h1>

        {/* Summary */}
        <section aria-label="Summary statistics">
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <StatCard label="Games in library" value={totalGames} sub={`${completed} completed`} />
            </Col>
            <Col xs={6} md={3}>
              <StatCard
                label="Total hours logged"
                value={`${totalHours}h`}
                sub={totalGames > 0 ? `avg ${Math.round(totalHours / totalGames)}h / game` : '—'}
              />
            </Col>
            <Col xs={6} md={3}>
              <StatCard
                label="Average rating"
                value={avgRating > 0 ? avgRating.toFixed(1) : '—'}
                sub="out of 5"
              />
            </Col>
            <Col xs={6} md={3}>
              <StatCard
                label="Completion rate"
                value={`${completionRate}%`}
                sub={`${completed} of ${totalGames} finished`}
              />
            </Col>
          </Row>
        </section>

        {/* Charts */}
        <section aria-label="Breakdown charts">
          <Row className="g-3 mb-4">

            <Col md={6}>
              <Card className="border shadow-sm h-100">
                <Card.Body>
                  <h2 className="text-uppercase text-muted small fw-bold mb-3">
                    Genre breakdown
                  </h2>

                  {genres.labels.length > 0 ? (
                    <>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {genres.labels.map((l, i) => (
                          <span key={l} className="small text-muted d-flex align-items-center gap-1">
                            <span
                              aria-hidden="true"
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                background: genres.colors[i],
                                display: 'inline-block',
                              }}
                            />
                            {l} {genres.data[i]}%
                          </span>
                        ))}
                      </div>

                      <DoughnutChart
                        id="genreChart"
                        labels={genres.labels}
                        data={genres.data}
                        colors={genres.colors}
                      />
                    </>
                  ) : (
                    <p className="text-muted small">No genre data yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border shadow-sm h-100">
                <Card.Body>
                  <h2 className="text-uppercase text-muted small fw-bold mb-3">
                    Library status
                  </h2>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {status.labels.map((l, i) => (
                      <span key={l} className="small text-muted d-flex align-items-center gap-1">
                        <span
                          aria-hidden="true"
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            background: status.colors[i],
                            display: 'inline-block',
                          }}
                        />
                        {l} {status.data[i]}%
                      </span>
                    ))}
                  </div>

                  <DoughnutChart
                    id="statusChart"
                    labels={status.labels}
                    data={status.data}
                    colors={status.colors}
                  />
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </section>

        {/* Bottom sections */}
        <section aria-label="Top games and platform breakdown">
          <Row className="g-3">

            <Col md={6}>
              {topGames.length > 0 ? (
                <TopGamesList games={topGames} />
              ) : (
                <Card className="border shadow-sm h-100">
                  <Card.Body>
                    <h2 className="text-uppercase text-muted small fw-bold mb-3">
                      Top games by hours
                    </h2>
                    <p className="text-muted small">
                      Log some hours on your games to see them here.
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Col>

            <Col md={6}>
              {platforms.length > 0 ? (
                <PlatformSplit platforms={platforms} streak={0} bestStreak={0} />
              ) : (
                <Card className="border shadow-sm h-100">
                  <Card.Body>
                    <h2 className="text-uppercase text-muted small fw-bold mb-3">
                      Platform split
                    </h2>
                    <p className="text-muted small">
                      Add games with platforms to see your split.
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Col>

          </Row>
        </section>

      </Container>
    </main>
  );
}

export default StatsPage;