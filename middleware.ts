import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = [
  '/student-dashboard',
  '/recruiter-dashboard',
]

// Add paths that should redirect to dashboard if already logged in
const authPaths = [
  '/auth', // Only redirect from auth page when logged in
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  )

  // Check if the path is an auth path (login/register)
  const isAuthPath = authPaths.some(authPath => 
    path === authPath
  )

  // If trying to access protected route without token
  if (isProtectedPath && !token) {
    const url = new URL('/auth', request.url)
    return NextResponse.redirect(url)
  }

  // If trying to access auth pages with token
  if (isAuthPath && token) {
    try {
      // Decode the JWT token to get the role
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      const { role } = JSON.parse(jsonPayload)
      
      // Redirect based on role
      const dashboardPath = role === 'STUDENT' ? '/student-dashboard' : '/recruiter-dashboard'
      const url = new URL(dashboardPath, request.url)
      return NextResponse.redirect(url)
    } catch (error) {
      // If token is invalid, clear it and redirect to auth
      const response = NextResponse.redirect(new URL('/auth', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 