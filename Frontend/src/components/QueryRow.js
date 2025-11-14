import { Link } from 'react-router-dom';
import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/queries";

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

function QueryRow({ query, onQueryUpdated }) {
  // Use local state to manage dropdown changes immediately
  const [status, setStatus] = useState(query.status);
  const [assignedTo, setAssignedTo] = useState(query.assignedTo);

  // This function sends the update to the backend
  const handleUpdate = async (field, value) => {
    try {
      // Send a PUT request to update the specific query
      const response = await axios.put(`${API_URL}/${query._id}`, {
        [field]: value, // e.g., { status: "Open" }
      });

      // Tell the parent (DashboardPage) to update its list
      onQueryUpdated(response.data);
    } catch (err) {
      console.error("Error updating query:", err);
      // If error, revert the change in the UI
      if (field === "status") setStatus(query.status);
      if (field === "assignedTo") setAssignedTo(query.assignedTo);
    }
  };

  // Handler for the status dropdown
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // Update UI immediately
    handleUpdate("status", newStatus); // Send to backend
  };

  // Handler for the assignment dropdown
  const handleAssigneeChange = (e) => {
    const newAssignee = e.target.value;
    setAssignedTo(newAssignee); // Update UI immediately
    handleUpdate("assignedTo", newAssignee); // Send to backend
  };

  // --- Render the table row ---
  return (
    <tr style={{ cursor: 'pointer' }}>
      {/* Status Dropdown */}
      <td>
        <select
          className="form-select form-select-sm"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="New">New</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </td>

      {/* Priority */}
      <td>
        <span className={`badge bg-${getPriorityBadge(query.priority)}`}>
          {query.priority}
        </span>
      </td>

      {/* Source */}
      <td>{query.source}</td>

      {/* --- CUSTOMER (NOW A CLICKABLE LINK) --- */}
      <td>
        <Link 
          to={`/query/${query._id}`} 
          className="text-decoration-none fw-bold"
          // We apply the color based on priority for quick visibility
          style={{ color: getPriorityBadge(query.priority) === 'danger' ? 'red' : 'inherit' }}
        >
          {query.customerName}
        </Link>
      </td>

      {/* Content */}
      <td>{query.content.substring(0, 50)}...</td>

      {/* Assigned To Dropdown */}
      <td>
        <select
          className="form-select form-select-sm"
          value={assignedTo}
          onChange={handleAssigneeChange}
        >
          <option value="Unassigned">Unassigned</option>
          <option value="Support Team">Support Team</option>
          <option value="Sales Team">Sales Team</option>
          <option value="Billing Team">Billing Team</option>
        </select>
      </td>
      
      {/* Tags Column (Added back) */}
      <td>
        {query.tags.map((tag) => (
          <span key={tag} className="badge bg-primary me-1">
            {tag}
          </span>
        ))}
      </td>
    </tr>
  );
}

export default QueryRow;