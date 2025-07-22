"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Briefcase,
  Users,
  BarChart3,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Building2,
  Clock,
  LocateIcon as Location,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentCompany, setCurrentCompany] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const router = useRouter();

  // Enhanced stats with animations
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    companies: 0,
    jobs: 0,
    success: 0,
  })

  const finalStats = {
    students: 15000,
    companies: 750,
    jobs: 3200,
    success: 98,
  }

  // Animate numbers on component mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    const intervals = Object.keys(finalStats).map((key) => {
      const finalValue = finalStats[key]
      const increment = finalValue / steps
      let currentValue = 0

      return setInterval(() => {
        currentValue += increment
        if (currentValue >= finalValue) {
          currentValue = finalValue
          clearInterval(intervals.find((interval) => interval === this))
        }
        setAnimatedStats((prev) => ({
          ...prev,
          [key]: Math.floor(currentValue),
        }))
      }, stepDuration)
    })

    return () => intervals.forEach(clearInterval)
  }, [])

  const features = [
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      title: "Job Listings",
      description: "Browse through hundreds of internship and job opportunities from top companies.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Student Dashboard",
      description: "Manage your profile, track applications, and discover new opportunities.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Recruiter Dashboard",
      description: "Post jobs, manage applications, and find the perfect candidates for your company.",
    },
  ]

  // Top Companies Data
  const topCompanies = [
    { name: "Google", logo: "🔍", employees: "150K+", rating: 4.8, openings: 45 },
    { name: "Microsoft", logo: "🪟", employees: "220K+", rating: 4.7, openings: 38 },
    { name: "Amazon", logo: "📦", employees: "1.5M+", rating: 4.5, openings: 67 },
    { name: "Apple", logo: "🍎", employees: "164K+", rating: 4.9, openings: 23 },
    { name: "Meta", logo: "📘", employees: "87K+", rating: 4.6, openings: 29 },
    { name: "Netflix", logo: "🎬", employees: "12K+", rating: 4.8, openings: 15 },
    { name: "Tesla", logo: "⚡", employees: "127K+", rating: 4.4, openings: 34 },
    { name: "Spotify", logo: "🎵", employees: "9K+", rating: 4.7, openings: 18 },
  ]

  // Customer Reviews/Testimonials
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      college: "IIT Delhi",
      image: "👩‍💻",
      rating: 5,
      text: "ZIDIO Connect helped me land my dream job at Google! The platform made it so easy to connect with recruiters and track my applications.",
    },
    {
      name: "Rahul Kumar",
      role: "Data Scientist at Microsoft",
      college: "IIT Bombay",
      image: "👨‍💼",
      rating: 5,
      text: "Amazing platform! I got multiple interview calls within a week of creating my profile. The job recommendations were spot on.",
    },
    {
      name: "Ananya Patel",
      role: "Product Manager at Amazon",
      college: "BITS Pilani",
      image: "👩‍🎓",
      rating: 5,
      text: "The user interface is incredibly intuitive. I loved how I could filter jobs by location, salary, and company culture.",
    },
    {
      name: "Arjun Singh",
      role: "Frontend Developer at Flipkart",
      college: "NIT Trichy",
      image: "👨‍💻",
      rating: 5,
      text: "ZIDIO Connect's career guidance and resume tips were invaluable. Highly recommend to all students!",
    },
  ]

  // Trending Jobs
  const trendingJobs = [
    {
      title: "AI/ML Engineer",
      company: "OpenAI",
      location: "Remote",
      salary: "₹25-40 LPA",
      type: "Full-time",
      trending: "+45%",
      logo: "🤖",
    },
    {
      title: "Full Stack Developer",
      company: "Stripe",
      location: "Bangalore",
      salary: "₹18-30 LPA",
      type: "Full-time",
      trending: "+38%",
      logo: "💳",
    },
    {
      title: "Data Scientist",
      company: "Uber",
      location: "Hyderabad",
      salary: "₹20-35 LPA",
      type: "Full-time",
      trending: "+42%",
      logo: "🚗",
    },
    {
      title: "Product Designer",
      company: "Figma",
      location: "Mumbai",
      salary: "₹15-25 LPA",
      type: "Full-time",
      trending: "+33%",
      logo: "🎨",
    },
    {
      title: "DevOps Engineer",
      company: "Docker",
      location: "Pune",
      salary: "₹22-38 LPA",
      type: "Full-time",
      trending: "+40%",
      logo: "🐳",
    },
    {
      title: "Cybersecurity Analyst",
      company: "CrowdStrike",
      location: "Delhi",
      salary: "₹16-28 LPA",
      type: "Full-time",
      trending: "+35%",
      logo: "🔒",
    },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate companies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompany((prev) => (prev + 4) % topCompanies.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = document.querySelectorAll("[data-animate]")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 animate-in slide-in-from-top duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left duration-700">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ZIDIO Connect
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 animate-in fade-in slide-in-from-top duration-700 delay-200">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105">
                Home
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
              >
                About
              </a>
              <a
                href="#companies"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
              >
                Companies
              </a>
              <a href="#jobs" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105">
                Jobs
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
              >
                Contact
              </a>
            </nav>

            <button
              onClick={() => router.push("/auth")}
              className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-right duration-700"
            >
              Get Started
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 duration-300"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 duration-300"
                >
                  About
                </a>
                <a
                  href="#companies"
                  className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 duration-300"
                >
                  Companies
                </a>
                <a
                  href="#jobs"
                  className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 duration-300"
                >
                  Jobs
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 transition-colors hover:translate-x-2 duration-300"
                >
                  Contact
                </a>
                <button
                  onClick={() => router.push("/auth")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg w-fit transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Connect Your Future with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                ZIDIO Connect
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
              The ultimate platform bridging students and recruiters. Discover internships, find your dream job, and
              build your career with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-1000 delay-600">
              <button
                onClick={() => router.push("/auth")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Visit Our Website
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-in fade-in slide-in-from-top duration-1000">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-lg animate-in fade-in slide-in-from-top duration-1000 delay-200">
              Join the fastest-growing career platform in India
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-100 transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {animatedStats.students.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-lg">Students Registered</div>
              <div className="text-sm text-blue-200 mt-1">↗️ +15% this month</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-200 transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                {animatedStats.companies.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-lg">Partner Companies</div>
              <div className="text-sm text-blue-200 mt-1">🏢 Fortune 500 included</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-300 transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                {animatedStats.jobs.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-lg">Job Opportunities</div>
              <div className="text-sm text-blue-200 mt-1">🔥 +50 added daily</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-400 transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                {animatedStats.success}%
              </div>
              <div className="text-blue-100 text-lg">Success Rate</div>
              <div className="text-sm text-blue-200 mt-1">⭐ Industry leading</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-animate>
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.about ? "animate-in fade-in slide-in-from-bottom" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ZIDIO Connect?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers comprehensive tools for students and recruiters to connect seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-100 group ${isVisible.about ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200}` : "opacity-0 translate-y-10"}`}
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section
        id="companies"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50"
        data-animate
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.companies ? "animate-in fade-in slide-in-from-top" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Companies Hiring</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with industry leaders and start your dream career
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {topCompanies.slice(currentCompany, currentCompany + 4).map((company, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border border-gray-100 group ${isVisible.companies ? `animate-in fade-in slide-in-from-bottom delay-${index * 100}` : "opacity-0 translate-y-10"}`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {company.logo}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{company.employees} employees</p>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{company.rating}</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {company.openings} openings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Jobs Section */}
      <section id="jobs" className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-animate>
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.jobs ? "animate-in fade-in slide-in-from-top" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending Jobs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most in-demand positions in the market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trendingJobs.map((job, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border border-gray-100 group ${isVisible.jobs ? `animate-in fade-in slide-in-from-bottom delay-${index * 100}` : "opacity-0 translate-y-10"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                    {job.logo}
                  </div>
                  <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {job.trending}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {job.title}
                </h3>
                <p className="text-gray-600 mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {job.company}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Location className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.type}
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews/Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50"
        data-animate
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.testimonials ? "animate-in fade-in slide-in-from-top" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students who landed their dream jobs through ZIDIO Connect
            </p>
          </div>

          <div
            className={`relative bg-white rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-1000 ${isVisible.testimonials ? "animate-in fade-in slide-in-from-bottom delay-300" : "opacity-0 translate-y-10"}`}
          >
            <div className="absolute top-6 left-6 text-blue-600 opacity-20">
              <Quote className="w-12 h-12" />
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">{testimonials[currentTestimonial].image}</div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                <p className="text-blue-600 font-medium">{testimonials[currentTestimonial].role}</p>
                <p className="text-gray-500 text-sm">{testimonials[currentTestimonial].college}</p>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=100 height=100 viewBox=0 0 100 100 xmlns=http://www.w3.org/2000/svg%3E%3Cpath d=M50 50m-40 0a40,40 0 1,1 80,0a40,40 0 1,1 -80,0 stroke=%23ffffff strokeWidth=1 fill=none opacity=0.1/%3E%3C/svg%3E')] animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already found their dream careers through ZIDIO Connect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/auth")}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Join Now - It's Free!
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2 animate-in fade-in slide-in-from-left duration-1000">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <span className="text-2xl font-bold">ZIDIO Connect</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connecting talented students with amazing opportunities. Your career journey starts here.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer transform hover:scale-110 duration-300">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer transform hover:scale-110 duration-300">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors cursor-pointer transform hover:scale-110 duration-300">
                  <span className="text-white font-bold">in</span>
                </div>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#home"
                    className="hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#companies"
                    className="hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    Companies
                  </a>
                </li>
                <li>
                  <a
                    href="#jobs"
                    className="hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    Jobs
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="hover:text-white transition-colors hover:translate-x-1 duration-300 inline-block"
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                  <span>hr@zidio.in</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                  <span>Bangalore, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 animate-in fade-in slide-in-from-bottom duration-1000 delay-600">
            <p>&copy; 2024 ZIDIO Connect. All rights reserved. Made with ❤️ for students and recruiters.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}