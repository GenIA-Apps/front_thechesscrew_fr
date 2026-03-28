import { useState, useEffect } from 'react'
import './App.css'
import TestCounter from './pages/TestCounter'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    // Check backend health on mount
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`)
      if (res.ok) {
        const json = await res.json()
        setStatus(json)
      }
    } catch (err) {
      setError('Backend not available')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/data`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchHello = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/hello`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Render different pages based on currentPage state
  if (currentPage === 'test') {
    return (
      <>
        <nav className="App-nav">
          <button onClick={() => setCurrentPage('home')} className="nav-button">← Back Home</button>
        </nav>
        <TestCounter />
      </>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 ia_thechesscrew_fr</h1>
        <p>React + Vite Frontend | Node.js + Express Backend</p>
      </header>

      <main className="container">
        {/* Status Section */}
        <section className="section">
          <h2>Backend Status</h2>
          {status ? (
            <div className="status-box success">
              <p>✅ {status.message}</p>
              <small>{status.status}</small>
            </div>
          ) : error ? (
            <div className="status-box error">
              <p>❌ {error}</p>
              <button onClick={checkHealth}>Retry</button>
            </div>
          ) : (
            <p>Checking...</p>
          )}
        </section>

        {/* API Calls Section */}
        <section className="section">
          <h2>API Examples</h2>
          <div className="button-group">
            <button onClick={fetchHello} disabled={loading}>
              {loading ? 'Loading...' : 'Say Hello'}
            </button>
            <button onClick={fetchData} disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
            <button onClick={() => setCurrentPage('test')} className="nav-button-main">
              🔢 Test Counter
            </button>
          </div>
        </section>

        {/* Results Section */}
        {data && (
          <section className="section">
            <h2>Response</h2>
            <pre className="response-box">
              {JSON.stringify(data, null, 2)}
            </pre>
          </section>
        )}

        {error && (
          <section className="section">
            <div className="error-box">
              <p>❌ Error: {error}</p>
            </div>
          </section>
        )}
      </main>

      <footer className="App-footer">
        <p>Backend running on: <code>{API_URL}</code></p>
      </footer>
    </div>
  )
}

export default App
