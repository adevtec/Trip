import { NextResponse } from 'next/server';
import { fetchCities } from '../api';

/**
 * GET /api/providers/joinup/cities
 * Fetches departure cities from JoinUp API
 * No server-side caching - pure pass-through with client caching
 */
export async function GET() {
  try {
    const result = await fetchCities();

    if (result.success) {
      return NextResponse.json({
        success: true,
        cities: result.cities,
        totalCities: result.cities?.length || 0,
        cacheInfo: {
          maxAge: 0, // No server caching
          cacheKey: 'joinup_cities',
          timestamp: Date.now()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        cacheInfo: {
          maxAge: 0,
          cacheKey: 'joinup_cities',
          timestamp: Date.now()
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('JoinUp cities endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cacheInfo: {
        maxAge: 0,
        cacheKey: 'joinup_cities',
        timestamp: Date.now()
      }
    }, { status: 500 });
  }
}