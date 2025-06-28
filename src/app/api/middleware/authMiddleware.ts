import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '../lib/jwt';

// List of paths that don't require authentication
const publicPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/languages',
  '/',
  '/privaatsuspoliitika',
  '/reisitingimused'
];

// Define role-based access paths
const adminOnlyPaths = [
  '/api/users',
  '/api/translations'
];

export async function authMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Get the token from the request headers
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    // Verify the token
    const decoded = verifyToken(token);
    
    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Id', decoded.userId);
    requestHeaders.set('X-User-Email', decoded.email);

    // Check admin access for protected routes
    if (adminOnlyPaths.some(adminPath => path.startsWith(adminPath))) {
      const userRole = await getUserRole(decoded.userId);
      if (userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }
    }

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

// Helper function to get user role from database
async function getUserRole(userId: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/users/${userId}`);
    const userData = await response.json();
    return userData.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|favicon.ico|robots.txt).*)',
  ],
};