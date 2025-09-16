import { NextRequest, NextResponse } from 'next/server';
import { fetchDestinations } from '../api';

/**
 * GET /api/providers/joinup/destinations?cityId=2552
 * Fetches destination countries for a specific departure city
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('cityId');

  if (!cityId) {
    return NextResponse.json({
      success: false,
      error: 'cityId parameter is required'
    }, { status: 400 });
  }

  const result = await fetchDestinations(cityId);
  
  if (result.success) {
    return NextResponse.json({
      success: true,
      destinations: result.destinations,
      totalDestinations: result.destinations?.length || 0,
      cacheInfo: {
        maxAge: 6 * 60 * 60, // 6 hours in seconds
        cacheKey: `joinup_destinations_${cityId}`,
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=21600, stale-while-revalidate=1800',
        'X-Cache-TTL': '21600'
      }
    });
  } else {
    return NextResponse.json({
      success: false,
      error: result.error,
      cacheInfo: {
        maxAge: 0,
        cacheKey: `joinup_destinations_${cityId}`,
        timestamp: Date.now()
      }
    }, { status: 500 });
  }
}