# 🚀 Content Broadcasting System

A scalable backend system for managing, approving, and broadcasting educational content with role-based access, time-based rotation, caching, and analytics.

---

## 📌 Overview

This system allows teachers to upload subject-based content, which is then reviewed by a principal before being made publicly available. Approved content is delivered through a time-based rotation engine and optimized using Redis caching.

---
API-Documentation-Link : https://content-broadcasting-system-65gt.onrender.com/api-docs


## ✨ Features

- 🔐 JWT Authentication & Role-Based Access Control (Teacher / Principal)
- 📤 Content Upload with file handling (Multer, max 10MB limit)
- ✅ Approval / ❌ Rejection workflow (with optional reason)
- 🔄 Time-based content rotation per subject
- ⏱ Scheduling with start & end time validation
- ⚡ Redis caching for public APIs
- 🚫 Rate limiting for public endpoints
- 📄 Pagination & filtering (subject, teacher, status)
- 📊 Analytics (content views, top content, subject usage)
- 👨‍🏫 Teacher dashboard (private APIs)
- 🧑‍💼 Principal dashboard (moderation APIs)
- 🌐 Public API for live content
- 📘 Swagger API documentation

---

## 🏗️ Tech Stack

- Backend: Node.js, Express.js  
- Database: MySQL  
- Cache: Redis  
- Authentication: JWT  
- File Upload: Multer  
- API Docs: Swagger (OpenAPI)

---

## 📁 Project Structure


src/<br>
├── config/<br>
├── controllers/<br>
├── routes/<br>
├── services/<br>
├── middlewares/<br>
├── models/<br>
└── app.js<br>
server.js


---

## ⚙️ Setup Instructions

### 1. Clone Repository


git clone https://github.com/your-username/content-broadcasting-system.git

cd content-broadcasting-system


---

### 2. Install Dependencies


npm install


---

### 3. Setup Environment Variables

Create a `.env` file:


PORT=5000<br>

DB_HOST=localhost<br>
DB_USER=root<br>
DB_PASS=yourpassword<br>
DB_NAME=broadcast_system<br>

JWT_SECRET=your_secret_key<br>
REDIS_HOST=127.0.0.1<br>
REDIS_PORT=6379<br>


---

### 4. Start MySQL & Redis

Ensure both services are running.

Test Redis:

redis-cli ping


---

### 5. Run Server


node server.js


---

### 6. Open Swagger Docs


http://localhost:5000/api-docs


---

## 🔐 Authentication Flow

1. Register user (teacher/principal)
2. Login → get JWT token
3. Use token in requests:


Authorization: Bearer <token>


---

## 🔄 Core Workflow


Teacher → Upload content (pending)
Principal → Approve / Reject
Approved → Scheduled → Rotated → Public API


---

## 🔁 Rotation Logic

- Content grouped by subject
- Each content has rotation order & duration
- Active content determined using:


(now - start_time) % total_cycle


---

## 📡 API Overview

### Auth
- POST `/auth/register`
- POST `/auth/login`

### Content
- POST `/content`
- GET `/content/my`

### Approval (Principal)
- POST `/approval/approve/:id`
- POST `/approval/reject/:id`
- GET `/approval/all`

### Teacher
- GET `/teacher/content`

### Public
- GET `/public/live/:teacherId`

### Analytics
- GET `/analytics/top-content`
- GET `/analytics/most-active-subject`
- GET `/analytics/subject-usage`

---

## ⚡ Caching Strategy

- Redis caches public API responses
- Key: `live:{teacherId}`
- TTL aligned with rotation duration
- Reduces database load

---

## 📊 Analytics

Tracks:
- Content views
- Most active subject
- Top viewed content

---

## 🛡️ Security

- JWT authentication
- RBAC middleware
- Rate limiting
- Input validation

---

## 🧠 Design Decisions

- Subject-based grouping via `content_slots`
- Rotation managed via `content_schedule`
- Modular architecture for scalability
- Async DB initialization before server start

---

## 🚀 Future Improvements

- WebSocket real-time updates
- Queue-based processing (Kafka/Bull)
- Cloud storage (AWS S3)
- Horizontal scaling

---

## 👨‍💻 Author

Built with focus on real-world backend architecture and scalability.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
