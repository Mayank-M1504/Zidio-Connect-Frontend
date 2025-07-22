"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, User, Briefcase, Shield } from "lucide-react"
import { register, StudentRegisterRequest, RecruiterRegisterRequest, login } from "@/lib/api"
import { toast } from "sonner"
import { cookies } from 'next/headers'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("student")
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    college: "",
    company: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)

  // Add this useEffect to handle tab switching when toggling between login/register
  React.useEffect(() => {
    // If switching to register mode and admin tab is active, switch to student tab
    if (!isLogin && activeTab === "admin") {
      setActiveTab("student")
    }
  }, [isLogin, activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        // Handle login
        const loginData = {
          email: formData.email,
          password: formData.password,
          role: activeTab.toUpperCase() as 'STUDENT' | 'RECRUITER' | 'ADMIN'
        }

        console.log('Attempting login with:', JSON.stringify(loginData, null, 2))
        const response = await login(loginData)
        console.log('Login successful:', response)

        // Store the token in localStorage for Authorization header
        localStorage.setItem('token', response.token);

        // Redirect based on role
        if (activeTab === 'student') {
          router.push('/student/dashboard')
        } else if (activeTab === 'recruiter') {
          router.push('/recruiter/dashboard')
        } else if (activeTab === 'admin') {
          router.push('/admin-panel')
        }
    } else {
        // Handle registration
        if (formData.password !== formData.confirmPassword) {
          setFormError("Passwords don't match")
          return
        }

        if (formData.password.length < 8) {
          setFormError("Password must be at least 8 characters long")
          return
        }

        const registrationData = activeTab === 'student' 
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              role: 'STUDENT' as const,
              college: formData.college
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              role: 'RECRUITER' as const,
              company: formData.company
            }

        console.log('Attempting registration with:', JSON.stringify(registrationData, null, 2))
        const response = await register(registrationData)
        console.log('Registration successful:', response)

        // Show success message and switch to login
        toast.success('Registration successful! Please login.')
        setIsLogin(true)
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          college: '',
          company: ''
        })
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setFormError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null) // Clear error when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending reset email
    setResetEmailSent(true)
    setTimeout(() => {
      setResetEmailSent(false)
      setShowForgotPassword(false)
      setForgotPasswordEmail("")
    }, 3000)
  }

  const tabs = [
    { id: "student", label: "Student", icon: <User className="w-4 h-4" /> },
    { id: "recruiter", label: "Recruiter", icon: <Briefcase className="w-4 h-4" /> },
    { id: "admin", label: "Admin", icon: <Shield className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom duration-500 relative overflow-hidden">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{isLogin ? "Welcome Back" : "Join ZIDIO Connect"}</h1>
            <p className="text-gray-600 mt-2">{isLogin ? "Sign in to your account" : "Create your account"}</p>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {tabs
              .filter((tab) => isLogin || tab.id !== "admin") // Only show admin tab in login mode
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            {!isLogin && activeTab === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College/University</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your college name"
                  required
                />
              </div>
            )}

            {!isLogin && activeTab === "recruiter" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your company name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          {!(activeTab === 'admin') && (
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors duration-200"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
          )}
          {/* Forgot Password Overlay */}
          {showForgotPassword && (
            <div className="absolute inset-0 bg-white rounded-2xl flex flex-col justify-center p-8 animate-in fade-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">Z</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
              </div>

              {!resetEmailSent ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600">Reset instructions sent to your email</p>
                </div>
              )}

              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setForgotPasswordEmail("")
                    setResetEmailSent(false)
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 