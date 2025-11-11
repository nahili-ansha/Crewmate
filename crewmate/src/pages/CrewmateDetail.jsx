import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './CrewmateDetail.css'

export default function CrewmateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [crewmate, setCrewmate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      setCrewmate(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this crewmate?')) return

    try {
      const { error: err } = await supabase.from('crewmates').delete().eq('id', id)
      if (err) throw err
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page"><p>Loading crewmate...</p></div>
  if (error) return <div className="page"><p className="error">Error: {error}</p></div>
  if (!crewmate) return <div className="page"><p>Crewmate not found</p></div>

  const createdDate = new Date(crewmate.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to Crewmates</Link>

      <div className="detail-container">
        <div className="detail-header" style={{ backgroundColor: crewmate.color }}>
          <h1>{crewmate.name}</h1>
        </div>

        <div className="detail-body">
          <div className="detail-info">
            <h2>Crewmate Details</h2>
            <p><strong>ID:</strong> {crewmate.id}</p>
            <p><strong>Role:</strong> {crewmate.role}</p>
            <p><strong>Color:</strong> {crewmate.color}</p>
            <p><strong>Skill Level:</strong> {crewmate.skill_level}/5</p>
            <p><strong>Created:</strong> {createdDate}</p>
          </div>

          <div className="detail-actions">
            <Link to={`/edit/${crewmate.id}`} className="btn btn-primary">
              Edit Crewmate
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Crewmate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
