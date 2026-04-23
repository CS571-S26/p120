import { useState } from 'react'
import {
  Card, Button, Form, Row, Col,
  DropdownButton, Dropdown
} from 'react-bootstrap'

const STATUS_OPTIONS = ['Playing', 'Finished', 'Dropped', 'Backlogged']
const PLATFORM_OPTIONS = ['Nintendo Switch', 'Xbox', 'Playstation', 'PC']

function StarRating({
  value, onChange, disabled
}: { value: number; onChange: (n: number) => void; disabled: boolean }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          role="button"
          style={{
            fontSize: '1.4rem',
            cursor: disabled ? 'default' : 'pointer',
            color: star <= (hovered || value) ? '#ffc107' : '#dee2e6',
            transition: 'color 0.1s',
          }}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
        >
          ★
        </span>
      ))}
      {value > 0 && (
        <span className="text-muted small align-self-center ms-1">{value}/5</span>
      )}
    </div>
  )
}

export default function GameForm() {
  const [inLibrary, setInLibrary] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [platform, setPlatform] = useState<string | null>(null) // New Platform State
  const [favorited, setFavorited] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [hours, setHours] = useState('')
  const [editing, setEditing] = useState(false)

  // Expanded saved state to include platform
  const [saved, setSaved] = useState({ 
    rating: 0, 
    review: '', 
    hours: '', 
    status: null as string | null, 
    platform: null as string | null, 
    favorited: false 
  })

  function handleEdit() {
    setSaved({ rating, review, hours, status, platform, favorited })
    setEditing(true)
  }

  function handleSave() {
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
    setInLibrary(false)
    setStatus(null)
    setPlatform(null)
    setFavorited(false)
    setRating(0)
    setReview('')
    setHours('')
    setEditing(false)
  }

  return (
    <Card className="shadow-sm w-100 border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2 flex-wrap">
            {!inLibrary ? (
              <Button size="sm" variant="primary" onClick={handleAddToLibrary}>
                + Add to Library
              </Button>
            ) : editing ? (
              <>
                <Button size="sm" variant="success" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="outline-secondary" onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline-secondary" onClick={handleEdit}>✏️ Edit</Button>
                <Button size="sm" variant="outline-danger" onClick={handleRemoveFromLibrary}>Remove from Library</Button>
              </>
            )}
          </div>

          <Button
            size="sm"
            variant={favorited ? 'danger' : 'outline-danger'}
            disabled={!inLibrary || !editing}
            onClick={() => setFavorited(f => !f)}
            title={favorited ? 'Unfavorite' : 'Favorite'}
          >
            {favorited ? '♥' : '♡'}
          </Button>
        </div>

        <Form>
          {inLibrary && (
            <>
              {/* Status Row */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column xs={4} className="text-muted small">Status</Form.Label>
                <Col xs={8}>
                  <DropdownButton
                    size="sm"
                    variant="outline-secondary"
                    title={status ?? 'Select status…'}
                    disabled={!editing}
                    className="w-100 custom-dropdown-toggle"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <Dropdown.Item key={opt} onClick={() => setStatus(opt)} active={status === opt}>
                        {opt}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </Form.Group>

              {/* Platform Row */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column xs={4} className="text-muted small">Platform</Form.Label>
                <Col xs={8}>
                  <DropdownButton
                    size="sm"
                    variant="outline-secondary"
                    title={platform ?? 'Select platform…'}
                    disabled={!editing}
                  >
                    {PLATFORM_OPTIONS.map(plat => (
                      <Dropdown.Item key={plat} onClick={() => setPlatform(plat)} active={platform === plat}>
                        {plat}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </Form.Group>
            </>
          )}

          {/* Hours played */}
          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column xs={4} className="text-muted small">Hours played</Form.Label>
            <Col xs={8}>
              <Form.Control
                size="sm"
                type="number"
                min={0}
                placeholder="0"
                value={hours}
                disabled={!inLibrary || !editing}
                onChange={e => setHours(e.target.value)}
              />
            </Col>
          </Form.Group>

          {/* Star rating */}
          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column xs={4} className="text-muted small">Your rating</Form.Label>
            <Col xs={8}>
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={!inLibrary || !editing}
              />
            </Col>
          </Form.Group>

          {/* Review */}
          <Form.Group className="mb-1">
            <Form.Label className="text-muted small">Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your thoughts…"
              value={review}
              disabled={!inLibrary || !editing}
              onChange={e => setReview(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  )
}