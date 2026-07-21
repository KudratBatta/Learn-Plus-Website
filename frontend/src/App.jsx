import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout essentials
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';


// Route guards
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogDetail from './pages/BlogDetail.jsx';

// Student Workspace
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import StudentProfile from './pages/student/Profile.jsx';

// Mentor Workspace
import MentorDashboard from './pages/mentor/MentorDashboard.jsx';
import ManageCourses from './pages/mentor/ManageCourses.jsx';
import CreateCourse from './pages/mentor/CreateCourse.jsx';
import EditCourse from './pages/mentor/EditCourse.jsx';
import ManageBlogs from './pages/mentor/ManageBlogs.jsx';
import CreateBlog from './pages/mentor/CreateBlog.jsx';
import EditBlog from './pages/mentor/EditBlog.jsx';
import MentorProfile from './pages/mentor/Profile.jsx';
import MentorDetails from './pages/MentorDetails.jsx';


export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500/20 antialiased">
      {/* Dynamic Glassmorphic Navigation Bar */}
      <Navbar />

      {/* Global scroll reset on route change */}
      <ScrollToTop />

      {/* Main Routing Container */}
      <main className="flex-grow">
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - Access requires login */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
            }
          />

          {/* Student Protected routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* Mentor Protected routes */}
          <Route
            path="/mentor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/courses"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <ManageCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/courses/new"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/courses/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/blogs"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <ManageBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/blogs/new"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/blogs/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/profile"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <MentorProfile />
              </ProtectedRoute>
            }
          />

          {/* Public mentor details */}
          <Route path="/mentors/:id" element={<MentorDetails />} />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Dark Footer */}
      <Footer />
    </div>
  );
}
