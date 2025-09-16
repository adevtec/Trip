import { NextRequest, NextResponse } from 'next/server';
import { fetchCheckinDates } from '../api';

/**
 * GET /api/providers/joinup/checkin?cityId=2552&destinationId=123
 * Fetches available departure dates for specific city and destination
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('cityId');
  const destinationId = searchParams.get('destinationId');

  if (!cityId) {
    return NextResponse.json({
      success: false,
      error: 'cityId parameter is required'
    }, { status: 400 });
  }

  const result = await fetchCheckinDates(cityId, destinationId || undefined);
  
  if (result.success) {
    return NextResponse.json({
      success: true,
      checkinDates: result.checkinDates,
      totalDates: result.checkinDates?.length || 0,
      cacheInfo: {
        maxAge: 3 * 60 * 60, // 3 hours in seconds
        cacheKey: `joinup_checkin_${cityId}_${destinationId || 'all'}`,
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=10800, stale-while-revalidate=900',
        'X-Cache-TTL': '10800'
      }
    });
  } else {
    return NextResponse.json({
      success: false,
      error: result.error,
      cacheInfo: {
        maxAge: 0,
        cacheKey: `joinup_checkin_${cityId}_${destinationId || 'all'}`,
        timestamp: Date.now()
      }
    }, { status: 500 });
  }
}