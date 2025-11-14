import React from 'react';

function AnalyticsDashboard({ queries }) {
  // 1. Calculate Total Pending Queries (New or Open)
  const pendingQueries = queries.filter(
    (q) => q.status === 'New' || q.status === 'Open'
  ).length;

  // 2. Calculate Urgent/High Priority Queries
  const urgentQueries = queries.filter(
    (q) => q.priority === 'Urgent' || q.priority === 'High'
  ).length;

  // 3. Calculate Queries by Source
  // We use reduce() to count occurrences of each source
  const sourceBreakdown = queries.reduce((acc, query) => {
    const source = query.source;
    if (acc[source]) {
      acc[source]++; // Add to existing count
    } else {
      acc[source] = 1; // Start count at 1
    }
    return acc;
  }, {}); // Start with an empty object {}

  // --- Render the Stat Cards ---
  return (
    <div className="row mb-4">
      {/* Total Pending Card */}
      <div className="col-md-4">
        <div className="card text-white bg-primary shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Pending Queries</h5>
            <p className="card-text fs-1 fw-bold">{pendingQueries}</p>
          </div>
        </div>
      </div>

      {/* Urgent Queries Card */}
      <div className="col-md-4">
        <div className="card text-white bg-danger shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Urgent / High Priority</h5>
            <p className="card-text fs-1 fw-bold">{urgentQueries}</p>
          </div>
        </div>
      </div>

      {/* Source Breakdown Card */}
      <div className="col-md-4">
        <div className="card bg-light shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Queries by Source</h5>
            {/* List the sources we found */}
            <ul className="list-group list-group-flush">
              {Object.entries(sourceBreakdown).map(([source, count]) => (
                <li key={source} className="list-group-item d-flex justify-content-between align-items-center bg-light">
                  {source}
                  <span className="badge bg-primary rounded-pill">{count}</span>
                </li>
              ))}
              {/* Show message if no queries */}
              {queries.length === 0 && <li className="list-group-item bg-light">No data</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;