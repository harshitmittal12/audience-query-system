# 🚀 Audience Query Management System

### 🔴 **Live Demo:** [https://audience-query-system.onrender.com/](https://audience-query-system.onrender.com/)

> A centralized dashboard for marketing teams to track, categorize, and automate responses to audience queries from multiple social platforms.

---

## 💡 The Problem
Brands receive thousands of messages across Twitter, Email, and Chat daily. Important complaints often get buried, leading to dissatisfied customers and delayed responses. Manual tracking is slow, disconnected, and error-prone.

## 🎯 The Solution
This web application acts as a **Smart Unified Inbox** that:
1.  **Aggregates** messages from multiple channels into one view.
2.  **Auto-Tags** content (e.g., identifying "complaints" vs "sales") using keyword analysis.
3.  **Prioritizes** urgent issues automatically.
4.  **Assigns** tasks to the correct internal teams (Support vs Sales).

---

## ✨ Key Features

* **Unified Dashboard:** View simulated messages from Twitter, Email, and Chat in a single list.
* **🤖 Smart Automation:**
    * *Auto-tagging:* Detects keywords like "broken", "angry" → Tags as **High Priority**.
    * *Auto-routing:* Detects "price", "buy" → Tags as **Sales Opportunity**.
* **Real-Time Simulation:** Built-in simulator to generate test traffic (Tweets/Emails) instantly for demonstration.
* **Status Tracking:** Workflow to move tickets from `New` → `In Progress` → `Resolved`.
* **Responsive Design:** Built with React and Bootstrap 5.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Bootstrap 5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Cloud)
* **Deployment:** Render.com

---

## ⚙️ How to Run Locally

If you want to run this project on your local machine instead of the live link:

### 1. Clone the Repository
```bash
git clone [https://github.com/harshitmittal12/audience-query-system.git](https://github.com/harshitmittal12/audience-query-system.git)
cd audience-query-system

2. Setup Backend

cd Backend
npm install
# Note: You need a valid MONGO_URI in your server.js file
npm start
# Server runs on http://localhost:5000

Setup Frontend
Open a new terminal window:

Bash

cd Frontend
npm install
npm start
# App runs on http://localhost:3000
