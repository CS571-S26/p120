import  { useState, useMemo, useRef, useEffect } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLibrary } from '../useLibrary'

// ─── Wheel ─────────────────────────────────────────
const WheelCanvas = ({ games, rotation, size }: any) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || games.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const n = games.length
    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 6
    const slice = (2 * Math.PI) / n

    ctx.clearRect(0, 0, size, size)

    games.forEach((g: any, i: number) => {
      const start = i * slice
      const end = start + slice

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.fillStyle = `hsl(${(i * 360) / n}, 70%, 75%)`
      ctx.fill()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + slice / 2)
      ctx.fillStyle = '#212529'
      ctx.font = '600 12px system-ui'
      ctx.textAlign = 'right'
      ctx.fillText(g.title.slice(0, 18), r - 10, 4)
      ctx.restore()
    })
  }, [games, size])

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      aria-label="Game selection wheel"
      role="img"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s linear'
      }}
    />
  )
}

// ─── Page ─────────────────────────────────────────
const PlayNextPage = () => {
  const { games } = useLibrary()

  const backlog = useMemo(
    () => games.filter(g => g.status === 'Backlog'),
    [games]
  )

  const [genre, setGenre] = useState('All Genres')
  const [platform, setPlatform] = useState('All Platforms')

  const genres = ['All Genres', ...Array.from(new Set(backlog.map(g => g.genre).filter(Boolean)))]
  const platforms = ['All Platforms', ...Array.from(new Set(backlog.map(g => g.platform).filter(Boolean)))]

  const filtered = backlog.filter(g =>
    (genre === 'All Genres' || g.genre === genre) &&
    (platform === 'All Platforms' || g.platform === platform)
  )

  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<any>(null)

  function easeOut(t: number) {
    return 1 - Math.pow(1 - t, 4)
  }

  const spin = () => {
    if (spinning || filtered.length === 0) return

    setSpinning(true)
    setWinner(null)

    const n = filtered.length
    const slice = 360 / n

    const extra = 360 * (5 + Math.random() * 2)
    const target = rotation + extra

    const start = performance.now()
    const duration = 3500

    function animate(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = easeOut(t)

      const current = rotation + (target - rotation) * eased
      setRotation(current)

      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        const finalRotation = target % 360
        const pointerAngle = (360 - finalRotation + 270) % 360
        const index = Math.floor(pointerAngle / slice)

        setRotation(target)
        setWinner(filtered[index])
        setSpinning(false)
      }
    }

    requestAnimationFrame(animate)
  }

  // ─── Empty ──────────────────────────────────────
  if (backlog.length === 0) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: '100vh' }}>
        <main>
          <h1 className="fw-bold mb-4">Play Next</h1>
          <p>No games in your backlog yet.</p>
          <Link to="/games" className="btn btn-dark mt-3">
            Browse Games
          </Link>
        </main>
      </Container>
    )
  }

  return (
    <main style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">

        <h1 className="fw-bold mb-4">Play Next</h1>

        {/* Filters */}
        <section aria-label="Filters">
          <Row className="mb-4 g-2">

            <Col md={3}>
              <Form.Label className="visually-hidden">Filter by genre</Form.Label>
              <Form.Select value={genre} onChange={e => setGenre(e.target.value)}>
                {genres.map(g => <option key={g}>{g}</option>)}
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Label className="visually-hidden">Filter by platform</Form.Label>
              <Form.Select value={platform} onChange={e => setPlatform(e.target.value)}>
                {platforms.map(p => <option key={p}>{p}</option>)}
              </Form.Select>
            </Col>

            <Col className="d-flex align-items-center">
              <span aria-live="polite" className="fw-bold">
                {filtered.length} games available
              </span>
            </Col>

          </Row>
        </section>

        {/* Wheel */}
        <section className="d-flex flex-column align-items-center mb-5" aria-label="Spin wheel selector">
          <div style={{ position: 'relative', padding: 20, borderRadius: '50%' }}>

            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 24
              }}
            >
              ▼
            </div>

            <WheelCanvas games={filtered} rotation={rotation} size={320} />
          </div>

          <Button
            className="mt-4 px-4 fw-bold"
            onClick={spin}
            disabled={spinning}
            aria-live="polite"
          >
            {spinning ? 'Spinning...' : 'Spin Wheel'}
          </Button>
        </section>

        {/* Result */}
        {winner && (
          <section className="bg-white p-4 rounded-4 shadow-sm text-center mb-5" aria-live="polite">
            <p className="small text-muted mb-1">NEXT GAME</p>
            <h2 className="fw-bold">{winner.title}</h2>

            <div className="mt-2">
              {winner.genre && <span className="badge bg-light text-dark me-2">{winner.genre}</span>}
              {winner.platform && <span className="badge bg-light text-dark">{winner.platform}</span>}
            </div>

            <div className="mt-3">
              <Link to={`/games/${winner.id}`} className="btn btn-dark me-2">
                View Game
              </Link>
              <Button variant="outline-secondary" onClick={spin}>
                Re-roll
              </Button>
            </div>
          </section>
        )}

        {/* Backlog List */}
        <section aria-label="Backlog list">
          <Row className="g-3">
            {filtered.map(g => (
              <Col key={g.id} xs={12} md={6} lg={4}>
                <div className="bg-white p-3 rounded-4 shadow-sm">
                  <div className="fw-bold">{g.title}</div>
                  <div className="text-muted small">{g.genre} • {g.platform}</div>
                </div>
              </Col>
            ))}
          </Row>
        </section>

      </Container>
    </main>
  )
}

export default PlayNextPage