import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import QueryForm from '../components/QueryForm';
import QueryRow from '../components/QueryRow';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

// URL for the backend
const API_URL = '/api/queries';
function DashboardPage() {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterSource, setFilterSource] = useState('All');

    // Authentication and data fetching logic (unchanged)
    const getAuthHeaders = () => ({
        headers: { 'x-auth-token': localStorage.getItem('token') },
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL, getAuthHeaders());
                setQueries(response.data);
                setLoading(false);
            } catch (err) {
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


    // --- Renders the clean Table Layout ---
    const renderContent = () => {
        if (loading) return <div className="alert alert-info">Loading queries...</div>;
        if (error) return <div className="alert alert-danger">Error: {error}</div>;

        return (
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th style={{width: '25%'}}>Customer / Content</th>
                        <th style={{width: '20%'}}>Status / Priority</th>
                        <th style={{width: '10%'}}>Source</th>
                        <th style={{width: '20%'}}>Assigned To</th>
                        <th style={{width: '25%'}}>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQueries.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center">
                                {queries.length === 0 ? "No queries found. Submit one above!" : "No queries match your current filters."}
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
            <header className="mb-4">
                <h1>Audience Query Dashboard</h1>
                <p className="lead">Manage and track all incoming audience queries.</p>
            </header>
            
            <AnalyticsDashboard queries={filteredQueries} />
            
            <QueryForm onQueryAdded={handleQueryAdded} />

            <hr />
            
            {/* Filter Bar integrated above the table */}
            <div className="card bg-light mb-3">
                <div className="card-body">
                    <h5 className="card-title">Filter Queries</h5>
                    <div className="row g-3">
                        {/* Status Filter */}
                        <div className="col-md-4">
                            <label htmlFor="filterStatus" className="form-label">Status</label>
                            <select id="filterStatus" className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="All">All Statuses</option>
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
                            <select id="filterPriority" className="form-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                                <option value="All">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        {/* Source Filter */}
                        <div className="col-md-4">
                            <label htmlFor="filterSource" className="form-label">Source</label>
                            <select id="filterSource" className="form-select" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
                                <option value="All">All Sources</option>
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