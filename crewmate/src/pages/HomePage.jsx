import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './HomePage.css'

export default function HomePage() {
  const [crewmates, setCrewmates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch crewmates on component mount
  useEffect(() => {
    fetchCrewmates()
  }, [])

  async function fetchCrewmates() {
    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('crewmates')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setCrewmates(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this crewmate?')) return

    try {
      const { error: err } = await supabase.from('crewmates').delete().eq('id', id)
      if (err) throw err
      
      // Remove from local state
      setCrewmates(crewmates.filter(c => c.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page"><p>Loading crewmates...</p></div>
  if (error) return <div className="page"><p className="error">Error: {error}</p></div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Crewmates</h1>
        <Link to="/create" className="btn btn-primary">
          + Add Crewmate
        </Link>
      </div>

      {crewmates.length === 0 ? (
        <p className="empty-state">No crewmates yet. Create your first one!</p>
      ) : (
        <div className="crewmates-grid">
          {crewmates.map((crewmate) => (
            <div key={crewmate.id} className="crewmate-card">
              <Link to={`/crewmate/${crewmate.id}`} className="card-link">
                <div className="card-header" style={{ backgroundColor: crewmate.color }}>
                  <h2>{crewmate.name}</h2>
                </div>
                <div className="card-body">
                  <p><strong>Role:</strong> {crewmate.role}</p>
                  <p><strong>Skill Level:</strong> {crewmate.skill_level}/5</p>
                </div>
              </Link>
              <div className="card-actions">
                <Link to={`/edit/${crewmate.id}`} className="btn btn-secondary">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(crewmate.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
