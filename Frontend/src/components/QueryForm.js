import React, { useState } from 'react';
import axios from 'axios';

const API_URL = '/api/queries';
function QueryForm({ onQueryAdded }) {
  const [content, setContent] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [source, setSource] = useState('WebForm');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !customerName) {
      setError('Content and Customer Name are required.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const newQuery = { content, customerName, customerEmail, source };
      // Get token for the authorized POST request
      const token = localStorage.getItem('token'); 
      const response = await axios.post(API_URL, newQuery, {
        headers: { 'x-auth-token': token }
      });

      onQueryAdded(response.data);
      // Clear form after successful submission
      setContent('');
      setCustomerName('');
      setCustomerEmail('');
      setSource('WebForm');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // We use a card for a clean, contained look
    <div className="card bg-light mb-4 shadow-sm">
      <div className="card-body">
        <h3 className="card-title">Submit a New Query</h3>
        
        {/* Error message display */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* --- Bootstrap Grid Layout --- */}
          <div className="row g-3">
            
            {/* Customer Name (Left Column) */}
            <div className="col-md-6">
              <label htmlFor="customerName" className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            {/* Customer Email (Right Column) */}
            <div className="col-md-6">
              <label htmlFor="customerEmail" className="form-label">Customer Email</label>
              <input
                type="email"
                className="form-control"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            {/* Source (Full Width) */}
            <div className="col-12">
              <label htmlFor="source" className="form-label">Source</label>
              <select
                className="form-select"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="WebForm">Web Form</option>
                <option value="Email">Email</option>
                <option value="Chat">Chat</option>
                <option value="Social">Social</option>
              </select>
            </div>

            {/* Content / Message (Full Width) */}
            <div className="col-12">
              <label htmlFor="content" className="form-label">Content / Message</label>
              <textarea
                className="form-control"
                id="content"
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            
            {/* Submit Button (Full Width) */}
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Query'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default QueryForm;