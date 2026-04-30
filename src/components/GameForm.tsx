import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Card, Button, Form, Row, Col,
  DropdownButton, Dropdown
} from 'react-bootstrap'
import { useLibrary, type LibraryGame } from '../useLibrary'

const STATUS_OPTIONS: LibraryGame['status'][] = ['Playing', 'Played', 'Backlog']
const PLATFORM_OPTIONS = ['PC', 'PlayStation', 'PS5', 'Xbox', 'Nintendo Switch']

function StarRating({
  value,
  onChange,
  disabled
}: {
  value: number
  onChange: (n: number) => void
  disabled: boolean
}) {
  const [hovered, setHovered] = useState(0)


  return (
    <div
      role="radiogroup"
      aria-label="Star rating"
      className="d-flex justify-content-center align-items-center gap-2 w-100"
    >
      <div className="d-flex gap-1 justify-content-center">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            role="radio"
            aria-checked={value === star}
            tabIndex={disabled ? -1 : 0}
            aria-label={`${star} star`}
            style={{
              fontSize: '1.6rem',
              cursor: disabled ? 'default' : 'pointer',
              color: star <= (hovered || value) ? '#ffc107' : '#dee2e6',
              outline: 'none',
              transition: 'color 0.1s',
            }}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => !disabled && setHovered(0)}
            onKeyDown={(e) => {
              if (disabled) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onChange(star)
              }
            }}
          >
            ★
          </span>
        ))}
      </div>

      {value > 0 && (
        <span className="text-muted small ms-2 align-self-center">
          {value}/5
        </span>
      )}
    </div>
  )
}

type GameFormProps = {
  gameId?: number
  gameTitle?: string
  gameThumbnail?: string
  gameGenre?: string
}

export default function GameForm({
  gameId,
  gameTitle = '',
  gameThumbnail = '',
  gameGenre = ''
}: GameFormProps) {

  const { id: paramId } = useParams<{ id: string }>()
  const resolvedId = gameId ?? (paramId ? Number(paramId) : undefined)

  const { getGame, upsertGame, removeGame } = useLibrary()

  const existing = resolvedId ? getGame(resolvedId) : null

  const [inLibrary, setInLibrary] = useState(!!existing)
  const [status, setStatus] = useState<LibraryGame['status'] | null>(existing?.status ?? null)
  const [platform, setPlatform] = useState<string | null>(existing?.platform ?? null)
  const [favorited, setFavorited] = useState(existing?.favorite ?? false)
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [review, setReview] = useState(existing?.review ?? '')
  const [hours, setHours] = useState(String(existing?.hours ?? ''))
  const [editing, setEditing] = useState(false)

  const [saved, setSaved] = useState({
    rating: existing?.rating ?? 0,
    review: existing?.review ?? '',
    hours: String(existing?.hours ?? ''),
    status: existing?.status ?? null as LibraryGame['status'] | null,
    platform: existing?.platform ?? null as string | null,
    favorited: existing?.favorite ?? false,
  })

  useEffect(() => {
    const entry = resolvedId ? getGame(resolvedId) : null
    if (entry) {
      setInLibrary(true)
      setStatus(entry.status)
      setPlatform(entry.platform)
      setFavorited(entry.favorite)
      setRating(entry.rating ?? 0)
      setReview(entry.review ?? '')
      setHours(String(entry.hours ?? ''))
    }
  }, [resolvedId])

  function persist(overrides: Partial<LibraryGame> = {}) {
    if (!resolvedId) return
    upsertGame({
      id: resolvedId,
      title: gameTitle,
      thumbnail: gameThumbnail,
      genre: gameGenre,
      status: status ?? 'Backlog',
      platform: platform ?? '',
      favorite: favorited,
      rating: rating || undefined,
      review: review || undefined,
      hours: hours ? Number(hours) : undefined,
      addedAt: existing?.addedAt ?? Date.now(),
      ...overrides,
    })
  }

  function handleEdit() {
    setSaved({ rating, review, hours, status, platform, favorited })
    setEditing(true)
  }

  function handleSave() {
    persist()
    setEditing(false)
  }

  function handleCancel() {
    setRating(saved.rating)
    setReview(saved.review)
    setHours(saved.hours)
    setStatus(saved.status)
    setPlatform(saved.platform)
    setFavorited(saved.favorited)
    setEditing(false)
  }

  function handleAddToLibrary() {
    setInLibrary(true)
    setEditing(true)
  }

  function handleRemoveFromLibrary() {
    if (resolvedId) removeGame(resolvedId)
    setInLibrary(false)
    setStatus(null)
    setPlatform(null)
    setFavorited(false)
    setRating(0)
    setReview('')
    setHours('')
    setEditing(false)
  }

  function handleToggleFavorite() {
    const next = !favorited
    setFavorited(next)
    if (inLibrary && !editing) {
      persist({ favorite: next })
    }
  }

  return (
    <Card className="shadow-sm w-100 border-0">
      <Card.Body>

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div className="d-flex gap-2 flex-wrap">

            {!inLibrary ? (
              <Button
                size="sm"
                variant="primary"
                aria-label="Add game to library"
                onClick={handleAddToLibrary}
              >
                + Add to Library
              </Button>
            ) : editing ? (
              <>
                <Button size="sm" variant="success" onClick={handleSave}>
                  Save changes
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={handleCancel}>
                  Cancel editing
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline-secondary" onClick={handleEdit}>
                  Edit game
                </Button>
                <Button size="sm" variant="outline-danger" onClick={handleRemoveFromLibrary}>
                  Remove from library
                </Button>
              </>
            )}

          </div>

          <Button
            size="sm"
            variant={favorited ? 'danger' : 'outline-danger'}
            disabled={!inLibrary}
            onClick={handleToggleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            ♥
          </Button>

        </div>

        <Form aria-label="Game tracking form">

          {inLibrary && (
            <>
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column xs={4} className="text-muted small">
                  Status
                </Form.Label>
                <Col xs={8}>
                  <DropdownButton
                    size="sm"
                    variant="outline-secondary"
                    title={status ?? 'Select status'}
                    disabled={!editing}
                    aria-label="Game status"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <Dropdown.Item
                        key={opt}
                        onClick={() => setStatus(opt)}
                        active={status === opt}
                      >
                        {opt}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column xs={4} className="text-muted small">
                  Platform
                </Form.Label>
                <Col xs={8}>
                  <DropdownButton
                    size="sm"
                    variant="outline-secondary"
                    title={platform ?? 'Select platform'}
                    disabled={!editing}
                    aria-label="Game platform"
                  >
                    {PLATFORM_OPTIONS.map(p => (
                      <Dropdown.Item
                        key={p}
                        onClick={() => setPlatform(p)}
                        active={platform === p}
                      >
                        {p}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </Form.Group>
            </>
          )}

          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column xs={4} className="text-muted small">
              Hours played
            </Form.Label>
            <Col xs={8}>
              <Form.Control
                type="number"
                min={0}
                value={hours}
                disabled={!inLibrary || !editing}
                onChange={e => setHours(e.target.value)}
                aria-label="Hours played"
              />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-muted small">
              Your rating
            </Form.Label>
            <StarRating
              value={rating}
              onChange={setRating}
              disabled={!inLibrary || !editing}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-muted small">
              Review
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={review}
              disabled={!inLibrary || !editing}
              onChange={e => setReview(e.target.value)}
              aria-label="Game review"
            />
          </Form.Group>

        </Form>

      </Card.Body>
    </Card>
  )
}