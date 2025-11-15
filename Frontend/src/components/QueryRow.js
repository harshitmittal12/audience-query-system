import { useNavigate } from 'react-router-dom'; // 1. Use 'useNavigate'
import React, { useState } from "react";
import axios from "axios";

const API_URL = '/api/queries';

// Helper function for priority colors
const getPriorityBadge = (priority) => {
  switch (priority) {
    case "Urgent":
      return "danger"; // Red
    case "High":
      return "warning"; // Orange/Yellow
    case "Medium":
      return "info"; // Blue
    case "Low":
    default:
      return "secondary"; // Gray
  }
};

// Helper for row highlight color
const getRowBgColor = (priority) => {
    switch (priority) {
        case "Urgent": return 'table-danger';
        case "High": return 'table-warning';
        default: return ''; // Default no color
    }
}

function QueryRow({ query, onQueryUpdated }) {
  const [status, setStatus] = useState(query.status);
  const [assignedTo, setAssignedTo] = useState(query.assignedTo);
  const navigate = useNavigate(); // 2. Initialize navigate

  const getAuthHeaders = () => ({
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });

  const handleUpdate = async (field, value) => {
    try {
      const response = await axios.put(`${API_URL}/${query._id}`, {
        [field]: value,
      }, getAuthHeaders());
      onQueryUpdated(response.data);
    } catch (err) {
      console.error("Error updating query:", err);
      if (field === "status") setStatus(query.status);
      if (field === "assignedTo") setAssignedTo(query.assignedTo);
    }
  };

  const handleStatusChange = (e) => {
    e.stopPropagation(); // 3. Stop row click when changing status
    const newStatus = e.target.value;
    setStatus(newStatus);
    handleUpdate("status", newStatus);
  };

  const handleAssigneeChange = (e) => {
    e.stopPropagation(); // 4. Stop row click when changing assignee
    const newAssignee = e.target.value;
    setAssignedTo(newAssignee);
    handleUpdate("assignedTo", newAssignee);
  };

  // 5. Function to handle the row click
  const handleRowClick = () => {
    navigate(`/query/${query._id}`);
  };

  return (
    // 6. Add onClick handler and cursor style to the row
    <tr 
      className={getRowBgColor(query.priority)} 
      style={{ verticalAlign: 'middle', cursor: 'pointer' }}
      onClick={handleRowClick}
    >
      
      {/* 1. Customer / Content (Matches header) */}
      <td>
        <span className="text-decoration-none fw-bold text-dark">
          {query.customerName}
        </span>
        <p className="text-muted small mb-0" title={query.content}>
          {query.content.substring(0, 55)}...
        </p>
      </td>

      {/* 2. Status / Priority Dropdowns (Matches header) */}
      <td>
        <div className="mb-1">
            <select
                className="form-select form-select-sm"
                value={status}
                onClick={(e) => e.stopPropagation()} // Keep this
                onChange={handleStatusChange}
            >
                <option value="New">New</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
            </select>
        </div>
        <span className={`badge bg-${getPriorityBadge(query.priority)}`}>
          {query.priority}
        </span>
      </td>

      {/* 3. Source (Matches header) */}
      <td>{query.source}</td>

      {/* 4. Assigned To Dropdown (Matches header) */}
      <td>
        <select
          className="form-select form-select-sm"
          value={assignedTo}
          onClick={(e) => e.stopPropagation()} // Keep this
          onChange={handleAssigneeChange}
        >
          <option value="Unassigned">Unassigned</option>
          <option value="Support Team">Support Team</option>
          <option value="Sales Team">Sales Team</option>
          <option value="Billing Team">Billing Team</option>
        </select>
      </td>
      
      {/* 5. Tags Column (Matches header) */}
      <td>
        {query.tags.map((tag) => (
          <span key={tag} className="badge bg-primary me-1 mb-1">
            {tag}
          </span>
        ))}
      </td>
    </tr>
  );
}

export default QueryRow;