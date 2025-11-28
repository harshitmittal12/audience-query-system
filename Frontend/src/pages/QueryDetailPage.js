import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Relative path for production
const API_URL = '/api/queries';

// Helper function for priority colors
const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'danger';
      case 'High':
      case 'Medium':
        return 'warning';
      case 'Low':
      default:
        return 'secondary';
    }
};

function QueryDetailPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Local state for editable fields
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState(''); 

    // --- DELETE FUNCTION WITH LOGIC ---
    const handleDelete = async () => {
        // 1. Logic Check: Is it Resolved or Closed?
        if (status !== 'Resolved' && status !== 'Closed') {
            alert("Action Denied: You can only delete queries that are marked as 'Resolved' or 'Closed'.");
            return;
        }

        // 2. Confirmation
        if (window.confirm("Are you sure you want to delete this query? This cannot be undone.")) {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');

                await axios.delete(`${API_URL}/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                
                // Redirect to dashboard after successful delete
                navigate('/'); 
            } catch (err) {
                console.error("Error deleting query:", err);
                alert("Failed to delete query. Ensure the Backend DELETE route is set up.");
            }
        }
    };

    // Function to handle updates (PUT request)
    const handleUpdate = async (field, value) => {
        try {
             const token = localStorage.getItem('token');
             if (!token) return navigate('/login');

            const response = await axios.put(`${API_URL}/${id}`, {
                [field]: value,
            }, {
                headers: { 'x-auth-token': token }
            });

            // Update state with the response data
            setQuery(response.data); 
            if (field === 'status') setStatus(response.data.status);
            if (field === 'assignedTo') setAssignedTo(response.data.assignedTo);
            if (field === 'priority') setPriority(response.data.priority);

        } catch (err) {
            console.error("Error updating query:", err);
            alert('Failed to update query. Check console for details.');
        }
    };

    // Handlers for dropdowns
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        handleUpdate('status', newStatus);
    };
    const handleAssigneeChange = (e) => {
        const newAssignee = e.target.value;
        setAssignedTo(newAssignee);
        handleUpdate('assignedTo', newAssignee);
    };
    const handlePriorityChange = (e) => {
        const newPriority = e.target.value;
        setPriority(newPriority);
        handleUpdate('priority', newPriority);
    };

    // Fetch the specific query data
    useEffect(() => {
        const fetchQuery = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');

                const response = await axios.get(`${API_URL}/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setQuery(response.data);
                
                setStatus(response.data.status);
                setAssignedTo(response.data.assignedTo);
                setPriority(response.data.priority);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching query:", err);
                setError('Failed to load query details. It may not exist or the server is down.');
                setLoading(false);
            }
        };
        fetchQuery();
    }, [id, navigate]); 

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p>Loading query details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
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

    // --- Final Render ---
    return (
        <div className="container mt-4 mb-5"> 
            
            <h1 className="mb-0">Query Details: {query.customerName}</h1>
            <p className="lead text-muted">Query ID: {query._id}</p>

            <div className="row">
                {/* --- Left Column: Core Details and Message Content --- */}
                <div className="col-lg-8">
                    {/* Full Message Content Card */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-dark text-white">
                            Full Message Content
                        </div>
                        <div className="card-body">
                            <p className="card-text fs-5" style={{ whiteSpace: 'pre-wrap' }}>
                                {query.content}
                            </p>
                            <hr />
                            <p className="text-muted small">
                                Received from **{query.source}** on {new Date(query.createdAt).toLocaleString()}.
                            </p>
                            <div className="mt-3">
                                <span className="fw-bold me-2">Tags:</span>
                                {query.tags.length > 0 ? (
                                    query.tags.map((tag) => (
                                        <span key={tag} className="badge bg-primary me-1">{tag}</span>
                                    ))
                                ) : (
                                    <span className="badge bg-secondary">None</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activity History Card */}
                    <h2 className="mt-4">Activity History</h2>
                    <div className="card mb-4 shadow-sm">
                        <ul className="list-group list-group-flush">
                            {query.history.slice().reverse().map((entry, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between">
                                        <span className="fw-bold">{entry.action}</span>
                                        <small className="text-muted">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                    <p className="mb-0 small text-secondary">{entry.notes}</p>
                                </li>
                            ))}
                            <li className="list-group-item list-group-item-success">
                                <div className="d-flex w-100 justify-content-between">
                                    <span className="fw-bold">Query Created</span>
                                    <small className="text-success">
                                        {new Date(query.createdAt).toLocaleString()}
                                    </small>
                                </div>
                                <p className="mb-0 small text-success">Initial submission.</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- Right Column: Workflow Management (Editable) --- */}
                <div className="col-lg-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-dark text-white">
                            Workflow & Status
                        </div>
                        <div className="card-body">
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Customer Email</label>
                                <p className="form-control-static">{query.customerEmail || 'N/A'}</p>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Priority</label>
                                <select 
                                    className={`form-select bg-${getPriorityBadge(priority)} text-white`} 
                                    value={priority} 
                                    onChange={handlePriorityChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Status</label>
                                <select className="form-select" value={status} onChange={handleStatusChange}>
                                    <option value="New">New</option>
                                    <option value="Open">Open</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Assigned To</label>
                                <select className="form-select" value={assignedTo} onChange={handleAssigneeChange}>
                                    <option value="Unassigned">Unassigned</option>
                                    <option value="Support Team">Support Team</option>
                                    <option value="Sales Team">Sales Team</option>
                                    <option value="Billing Team">Billing Team</option>
                                </select>
                            </div>

                            <hr />
                            
                            <hr />
                            
                            {/* --- DELETE BUTTON --- */}
                            {/* We disable the button if the status is not allowed */}
                            <button 
                                className="btn btn-outline-danger w-100" 
                                onClick={handleDelete}
                                disabled={status !== 'Resolved' && status !== 'Closed'}
                            >
                                <i className="bi bi-trash me-2"></i> Delete Query
                            </button>
                            
                            {/* Helper text to explain why it's disabled */}
                            {status !== 'Resolved' && status !== 'Closed' && (
                                <p className="text-muted small text-center mt-2 mb-0">
                                    *Query must be <strong>Resolved</strong> or <strong>Closed</strong> to delete.
                                </p>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QueryDetailPage;