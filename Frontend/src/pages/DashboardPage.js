import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import QueryForm from '../components/QueryForm';
import QueryRow from '../components/QueryRow';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

// URL for the backend
const API_URL = 'http://localhost:5000/api/queries';

function DashboardPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterSource, setFilterSource] = useState('All');

  // --- NEW: Function to add the token to the request header ---
  const getAuthHeaders = () => ({
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });

  // --- NEW: Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    window.location.href = '/login'; // Redirect to the login page
  };

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        // Use the token in the GET request headers
        const response = await axios.get(API_URL, getAuthHeaders()); 
        setQueries(response.data);
        setLoading(false);
      } catch (err) {
        // If 401 Unauthorized, redirect to login
        if (err.response && err.response.status === 401) {
            handleLogout();
        }
        setError(err.message);
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const handleQueryAdded = (newQuery) => {
    setQueries([newQuery, ...queries]);
  };

  const handleQueryUpdated = (updatedQuery) => {
    setQueries(queries.map(q => 
      q._id === updatedQuery._id ? updatedQuery : q
    ));
  };

  const filteredQueries = useMemo(() => {
    return queries.filter(query => {
      const statusMatch = (filterStatus === 'All') || (query.status === filterStatus);
      const priorityMatch = (filterPriority === 'All') || (query.priority === filterPriority);
      const sourceMatch = (filterSource === 'All') || (query.source === filterSource);
      return statusMatch && priorityMatch && sourceMatch;
    });
  }, [queries, filterStatus, filterPriority, filterSource]);


  const renderContent = () => {
    // ... (rest of this function is unchanged) ...
    if (loading) {
      return <div className="alert alert-info">Loading queries...</div>;
    }
    if (error) {
      // Show login error if status code is 401
      if (error.includes('401')) {
        return <div className="alert alert-danger">Authorization failed. Please log in again.</div>;
      }
      return <div className="alert alert-danger">Error: {error}</div>;
    }
    
    return (
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Status</th>
            <th>Priority</th>
            <th>Source</th>
            <th>Customer</th>
            <th>Content</th>
            <th>Assigned To</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredQueries.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                {queries.length === 0 ? "No queries found." : "No queries match your filters."}
              </td>
            </tr>
          )}
          {filteredQueries.map((query) => (
            <QueryRow 
              key={query._id} 
              query={query} 
              onQueryUpdated={handleQueryUpdated} 
            />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mt-4">
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1>Audience Query Inbox</h1>
          <p className="lead">A unified dashboard for all incoming messages.</p>
        </div>
        
        {/* --- NEW: Logout Button --- */}
        <button 
          onClick={handleLogout} 
          className="btn btn-danger btn-sm"
        >
          Logout
        </button>
      </header>
      
      <AnalyticsDashboard queries={filteredQueries} />
      
      {/* NOTE: We are leaving the QueryForm visible so public users can submit messages
          even if they aren't logged in. The POST route is public. */}
      <QueryForm onQueryAdded={handleQueryAdded} />

      <hr />
      
      <div className="card bg-light mb-3">
        {/* ... (Filter Bar is unchanged) ... */}
        <div className="card-body">
          <h5 className="card-title">Filters</h5>
          <div className="row g-3">
            {/* Status Filter */}
            <div className="col-md-4">
              <label htmlFor="filterStatus" className="form-label">Status</label>
              <select 
                id="filterStatus" 
                className="form-select" 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            {/* Priority Filter */}
            <div className="col-md-4">
              <label htmlFor="filterPriority" className="form-label">Priority</label>
              <select 
                id="filterPriority" 
                className="form-select" 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            {/* Source Filter */}
            <div className="col-md-4">
              <label htmlFor="filterSource" className="form-label">Source</label>
              <select 
                id="filterSource" 
                className="form-select" 
                value={filterSource} 
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <option value="All">All</option>
                <option value="WebForm">Web Form</option>
                <option value="Email">Email</option>
                <option value="Chat">Chat</option>
                <option value="Social">Social</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main>
        <h3>Current Queries ({filteredQueries.length})</h3>
        {renderContent()}
      </main>
    </div>
  );
}

export default DashboardPage;