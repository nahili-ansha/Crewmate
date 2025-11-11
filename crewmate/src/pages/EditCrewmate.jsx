import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './CrewmateForm.css'

const ROLES = ['Captain', 'Engineer', 'Medic', 'Pilot', 'Scientist']
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']

export default function EditCrewmate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    role: ROLES[0],
    color: COLORS[0],
    skill_level: 3,
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCrewmate()
  }, [id])

  async function fetchCrewmate() {
    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('crewmates')
        .select('*')
        .eq('id', id)
        .single()

      if (err) throw err
      setFormData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skill_level' ? parseInt(value) : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError('Please enter a crewmate name')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const { error: err } = await supabase
        .from('crewmates')
        .update(formData)
        .eq('id', id)

      if (err) throw err
      
      // Navigate to detail page
      navigate(`/crewmate/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this crewmate?')) return

    try {
      setSaving(true)
      const { error: err } = await supabase.from('crewmates').delete().eq('id', id)
      if (err) throw err
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <div className="page"><p>Loading crewmate...</p></div>

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to Crewmates</Link>
      
      <h1>Edit Crewmate</h1>
      
      <form onSubmit={handleSubmit} className="crewmate-form">
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Crewmate Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter crewmate name"
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <div className="attribute-buttons">
            {ROLES.map(role => (
              <button
                key={role}
                type="button"
                className={`attr-btn ${formData.role === role ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role }))}
                disabled={saving}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="color">Color</label>
          <div className="attribute-buttons">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`color-btn ${formData.color === color ? 'active' : ''}`}
                style={{
                  backgroundColor: color.toLowerCase(),
                  color: ['Yellow', 'Orange'].includes(color) ? '#000' : '#fff',
                }}
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                disabled={saving}
                title={color}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skill_level">Skill Level: {formData.skill_level}/5</label>
          <input
            type="range"
            id="skill_level"
            name="skill_level"
            min="1"
            max="5"
            value={formData.skill_level}
            onChange={handleInputChange}
            disabled={saving}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/crewmate/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>

        <div className="delete-section">
          <button 
            type="button"
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={saving}
          >
            Delete Crewmate
          </button>
        </div>
      </form>
    </div>
  )
}
