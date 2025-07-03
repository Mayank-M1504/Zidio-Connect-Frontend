"use client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landing-page"
import AuthPage from "./pages/auth-page"
import StudentDashboard from "./pages/student-dashboard"
import RecruiterDashboard from "./pages/recruiter-dashboard"
import AdminPanel from "./pages/admin-panel"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  )
}
