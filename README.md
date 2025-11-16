# 🚀 Audience Query Management System

**A full-stack MERN application built for the [Hackathon Name] to centralize, track, and manage all incoming audience queries.**

This system provides a secure, authenticated, single-source-of-truth dashboard for support, sales, and billing teams to handle customer messages efficiently, ensuring no query is lost or delayed.

**Working Demo URL:** [**https://audience-query-system.onrender.com**](https://audience-query-system.onrender.com)

---

## 🌟 Key Features

* **Secure Authentication:** The entire dashboard is protected. Users must register and log in using a secure **JWT (JSON Web Token)** strategy.
* **Unified Dashboard:** A central "Inbox" displays all incoming queries from multiple sources (Web, Email, Chat, Social) in a clean, filterable table.
* **Dynamic Filtering:** Users can instantly filter the entire query list by **Status** (New, Open, Pending), **Priority**, or **Source**.
* **Smart Analytics:** The dashboard features a real-time analytics bar showing:
    * Total Pending Queries
    * Urgent / High-Priority Items
    * A breakdown of queries by source.
* **Intelligent Automation:**
    * **Auto-Tagging:** The backend scans incoming messages for keywords (e.g., "billing," "refund") and automatically applies relevant tags.
    * **Priority Detection:** The system analyzes content for urgent words (e.g., "angry," "urgent") and automatically escalates the query's priority.
* **Complete Workflow Management:**
    * Users can update a query's **Status**, **Priority**, or **Assignment** directly from the dashboard or the detail page.
* **Detailed Query View:** Clicking any query opens a dedicated detail page.
* **Full Audit History:** The detail page features a complete, chronological **Activity History**, logging every single change (e.g., "Status changed from New to Open by User...") for full accountability.

---

## 🛠️ Tech Stack

This project is a full-stack MERN application, built with a "monorepo" structure for the frontend and backend.

### **Backend**
* **Node.js:** Event-driven, non-blocking I/O server.
* **Express.js:** Fast, minimalist web framework for building the RESTful API.
* **MongoDB:** NoSQL database (hosted on MongoDB Atlas) to store queries, users, and history.
* **Mongoose:** Elegant object data modeling (ODM) library for MongoDB and Node.js.
* **JSON Web Token (JWT):** For generating secure, stateless authentication tokens.
* **bcrypt:** For hashing and salting user passwords before storing them.
* **CORS & dotenv:** For resource sharing and environment variable management.

### **Frontend**
* **React:** A JavaScript library for building user interfaces.
* **React Router:** For client-side routing and creating a multi-page feel.
* **Bootstrap 5:** For a modern, responsive, and clean UI/UX.
* **Bootstrap Icons:** For clean, professional iconography.
* **Axios:** Promise-based HTTP client for making requests to the backend API.

### **Deployment**
* **Render:** A unified cloud platform used to host the Node.js server, which serves both the backend API and the static React `build` files.

---

## 🚀 Setup and Installation (For Developers)

To run this project locally, you will need to run the frontend and backend servers separately.

### Prerequisites
* Node.js (v18.x or higher)
* npm
* A free MongoDB Atlas account

### 1. Clone the Repository
```bash
git clone [https://github.com/harshitmittal12/audience-query-system.git](https://github.com/harshitmittal12/audience-query-system.git)
cd audience-query-system
