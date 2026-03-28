import { useState } from 'react'
import '../styles/TestCounter.css'

function TestCounter() {
  const [counter, setCounter] = useState(0)
  const [parity, setParity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [timestamp, setTimestamp] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const callTestEndpoint = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/test`)
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Access Forbidden - Your IP is not authorized')
        }
        throw new Error(`Failed to fetch (${res.status})`)
      }
      const json = await res.json()
      
      setCounter(json.counter)
      setParity(json.parity)
      setTimestamp(json.timestamp)
      
      // Add to history
      setHistory(prev => [
        {
          id: Date.now(),
          counter: json.counter,
          parity: json.parity,
          timestamp: new Date(json.timestamp).toLocaleTimeString()
        },
        ...prev.slice(0, 9) // Keep last 10 items
      ])
    } catch (err) {
      setError(err.message)
      console.error('Test endpoint error:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="TestCounter">
      <div className="test-container">
        <h1>🔢 Test Counter API</h1>
        <p className="subtitle">Call <code>/api/test</code> to increment the server counter</p>

        {/* Main Counter Display */}
        <section className="counter-section">
          <div className="counter-display">
            <div className="counter-value">{counter}</div>
            <div className="parity-badge" data-parity={parity}>
              {parity ? parity.toUpperCase() : '---'}
            </div>
          </div>

          <button 
            onClick={callTestEndpoint} 
            disabled={loading}
            className="call-button"
          >
            {loading ? '⏳ Loading...' : '📡 Call API'}
          </button>

          {timestamp && (
            <p className="timestamp">
              Last called: {new Date(timestamp).toLocaleTimeString()}
            </p>
          )}

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="info-section">
          <h2>How It Works</h2>
          <div className="info-box">
            <p>
              Each time you call the API, the backend increments a counter and returns:
            </p>
            <ul>
              <li><strong>counter:</strong> Current counter value</li>
              <li><strong>parity:</strong> Whether it's <code>pair</code> (even) or <code>impair</code> (odd)</li>
              <li><strong>timestamp:</strong> When the request was processed</li>
              <li><strong>message:</strong> Confirmation message</li>
            </ul>
          </div>
        </section>

        {/* History */}
        {history.length > 0 && (
          <section className="history-section">
            <div className="history-header">
              <h2>Call History (Last 10)</h2>
              <button onClick={clearHistory} className="clear-button">Clear</button>
            </div>
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-counter">#{item.counter}</div>
                  <div className="history-parity" data-parity={item.parity}>
                    {item.parity.toUpperCase()}
                  </div>
                  <div className="history-time">{item.timestamp}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Response Example */}
        {counter > 0 && (
          <section className="example-section">
            <h2>Last Response</h2>
            <pre className="response-box">
{`{
  "message": "Test endpoint called",
  "counter": ${counter},
  "parity": "${parity}",
  "timestamp": "${timestamp}"
}`}
            </pre>
          </section>
        )}

        {/* Documentation */}
        <section className="docs-section">
          <h2>API Documentation</h2>
          <div className="doc-box">
            <h3>GET /api/test</h3>
            <p><strong>Description:</strong> Increments server counter and returns current value with parity</p>
            
            <h4>Response (200 OK):</h4>
            <pre>
{`{
  "message": "Test endpoint called",
  "counter": number,
  "parity": "pair" | "impair",
  "timestamp": ISO-8601 string
}`}
            </pre>

            <h4>Error Responses:</h4>
            <ul>
              <li><code>403 Forbidden</code> - Your IP is not authorized (IP whitelist enabled)</li>
              <li><code>500 Internal Server Error</code> - Server error</li>
            </ul>

            <h4>Environment Variables:</h4>
            <ul>
              <li><code>VITE_API_URL</code> - Backend API base URL (default: http://localhost:3000)</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TestCounter
