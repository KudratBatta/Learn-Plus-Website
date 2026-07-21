# Learn Plus — Modern Online Learning Platform
<img width="1236" height="538" alt="Image" src="https://github.com/user-attachments/assets/6fb8ff1f-4d27-4ec1-a6a5-07fefabed256" />
Learn Plus is a full-stack MERN online learning portal featuring verified peer mentors and student dashboards. Students can enroll in free courses, track their completion timeline, read blogs, comment on discussions, and claim canvas-generated credentials. Mentors can construct syllabi, manage course outlines, compose technical guides, and check enrollment statistics.

---

## 🚀 Quick Start Guide

### 📦 Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` OR a MongoDB Atlas cluster URI)

---

### 1. ⚙️ Setup the Backend API

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment configurations in `backend/.env`:
   - An `.env` file has been created with default localhost settings:
     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/learnplus
     JWT_SECRET=learnplus_jwt_super_secret_key_2024_change_in_production
     JWT_EXPIRE=30d
     PORT=5000
     CLIENT_URL=http://localhost:5173
     ```
   - *If using MongoDB Atlas, replace `MONGO_URI` with your connection string.*

4. **Seed the database** (creates demo users + 130 courses across 14 categories):
   ```bash
   npm run seed
   ```
5. Launch the API server:
   ```bash
   npm run dev
   ```
   *The server starts on port `5000`.*

---

### 2. 💻 Setup the Frontend Client

1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client launches at `http://localhost:5173`.*

---

## 🔑 Demo Access Credentials

The database seeder automatically creates the following profiles for testing roles out of the box:

| Role | Email | Password | Details |
|---|---|---|---|
| **🎓 Student** | `student@learnplus.com` | `password123` | Completed one course (UI Design) & enrolled in 2 others. |
| **👨‍🏫 Mentor 1** | `sarah@learnplus.com` | `password123` | Ph.D. Sarah. Author of Web, DevOps, Cloud and Blockchain courses. |
| **👨‍🏫 Mentor 2** | `alex@learnplus.com` | `password123` | Prof. Alex. Author of ML, AI, Data Science and DSA courses. |

---

## 🎨 Design & Features

### 🖼️ Project Design
- **Glassmorphism UI theme** with dark, high-contrast panels and soft blur overlays.
- **Responsive layouts** for dashboards (Student/Mentor) and course content pages.
- **Curated visuals** (Unsplash-style thumbnails) across cards and listings.
- **Progress-focused UX**: clear progress timeline indicators and completion feedback.

### ✨ Key Features
1. **Verified peer mentors**: mentor dashboard and authoring tools for managing course content.
2. **125+ Free Courses** (seeded): 14 categories with outcomes, syllabus structure, and handouts.
3. **Course enrollments & progress tracking**: students can enroll and track completion up to 100%.
4. **Canvas-generated certificates**: when a course reaches completion, a credential is rendered and downloadable.
5. **Author Hub**: create/edit courses and build syllabus week/lesson structures.
6. **Blogs & content hub**: read course-related posts with dedicated blog pages.
7. **Mentor/student dashboards**: role-specific home views showing relevant stats and actions.
8. **Toast stacking notifications**: smooth success/warning alerts that stack during interactions.

---

## 🧰 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Certificates:** Canvas-based client rendering

---

## 📁 Project Structure

- `backend/` — Express API, models, routes, controllers, and middleware
- `frontend/` — React UI (pages/components), routes, and API helpers

---

## 🌍 Environment Variables

Create an `.env` file inside `backend/`.

```env
MONGO_URI=mongodb://127.0.0.1:27017/learnplus
JWT_SECRET=learnplus_jwt_super_secret_key_2024_change_in_production
JWT_EXPIRE=30d
PORT=5000
CLIENT_URL=http://localhost:5173
```

> If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

---

## 🧾 Available Scripts

### Backend (`backend/`)
- `npm install` — Install backend dependencies
- `npm run seed` — Seed demo users + courses into MongoDB
- `npm run dev` — Start API server (development)

### Frontend (`frontend/`)
- `npm install` — Install frontend dependencies
- `npm run dev` — Start Vite dev server

