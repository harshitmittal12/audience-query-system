import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/queries';

function QueryDetailPage() {
  // useParams() extracts the ID from the URL (e.g., the '12345abc' from /query/12345abc)
  const { id } = useParams(); 
  
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        setLoading(true);
        // GET request to the new backend route we created: /api/queries/:id
        const response = await axios.get(`${API_URL}/${id}`);
        setQuery(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load query details. It may not exist.");
        setLoading(false);
        console.error("Error fetching query details:", err);
      }
    };
    fetchQueryDetails();
  }, [id]); // Re-run effect if the ID in the URL changes

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">Loading query details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/" className="btn btn-secondary mt-3">Back to Dashboard</Link>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Query data is missing.</div>
      </div>
    );
  }

  // Helper function for priority colors (copied from QueryRow)
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent": return "danger";
      case "High": return "warning";
      case "Medium": return "info";
      case "Low": default: return "secondary";
    }
  };

  // --- Final Render ---
  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-sm btn-outline-secondary mb-3">← Back to Dashboard</Link>
      
      <header className="mb-4">
        <h1>Query Details: {query.customerName}</h1>
        <p className="lead">Source: {query.source} | Assigned to: {query.assignedTo}</p>
      </header>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle text-muted mb-2">Status</h6>
              <h4 className="card-title">
                <span className={`badge bg-${query.status === 'New' ? 'primary' : 'secondary'}`}>
                  {query.status}
                </span>
              </h4>
              <p className="card-text">
                <small>Last updated: {new Date(query.updatedAt).toLocaleString()}</small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle text-muted mb-2">Priority</h6>
              <h4 className="card-title">
                <span className={`badge bg-${getPriorityBadge(query.priority)}`}>
                  {query.priority}
                </span>
              </h4>
              <p className="card-text">
                <small>Auto-detected by keywords.</small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle text-muted mb-2">Tags</h6>
              <h4 className="card-title">
                {query.tags.map((tag) => (
                  <span key={tag} className="badge bg-success me-1">
                    {tag}
                  </span>
                ))}
              </h4>
              <p className="card-text">
                <small>Customer Email: {query.customerEmail || 'N/A'}</small>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Content */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Full Message Content</h5>
        </div>
        <div className="card-body">
          <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
            {query.content}
          </p>
        </div>
      </div>

      {/* History/Timeline (Static for now, but ready for future updates) */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Activity History</h5>
        </div>
        <ul className="list-group list-group-flush">
          {/* Default entry when created */}
          <li className="list-group-item">
            <small className="text-muted">{new Date(query.createdAt).toLocaleString()}</small>
            <p className="mb-0">Query automatically logged and status set to **New**.</p>
          </li>
          
          {/* Placeholder for future notes/actions */}
          <li className="list-group-item text-muted">
            <small>Future notes (e.g., 'Assigned to John Smith') will appear here.</small>
          </li>
        </ul>
      </div>

    </div>
  );
}

export default QueryDetailPage;