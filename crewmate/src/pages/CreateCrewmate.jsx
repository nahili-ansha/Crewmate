import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './CrewmateForm.css'

const ROLES = ['Captain', 'Engineer', 'Medic', 'Pilot', 'Scientist']
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']

export default function CreateCrewmate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    role: ROLES[0],
    color: COLORS[0],
    skill_level: 3,
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .from('crewmates')
        .insert([formData])
        .select()

      if (err) throw err
      
      // Navigate to the new crewmate's detail page
      navigate(`/crewmate/${data[0].id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to Crewmates</Link>
      
      <h1>Create New Crewmate</h1>
      
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
            disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Crewmate'}
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
