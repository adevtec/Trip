import { NextRequest, NextResponse } from 'next/server';
import { getJoinUpCredentials, JOINUP_API_BASE_URL } from '@/app/api/providers/joinup/config';

/**
 * GET /api/joinup/checkin?cityId=2552&destinationId=123
 * Fetches available departure dates for specific city and destination
 * Based on SearchTour_CHECKIN endpoint from JoinUp API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');
    const destinationId = searchParams.get('destinationId');

    if (!cityId) {
      return NextResponse.json({
        success: false,
        error: 'cityId parameter is required'
      }, { status: 400 });
    }

    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return NextResponse.json({
        success: false,
        error: 'Missing JoinUp OAuth token'
      }, { status: 500 });
    }

    // Build JoinUp API URL for departure dates
    let apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_CHECKIN&TOWNFROMINC=${cityId}`;

    // Add destination if provided (optional parameter)
    if (destinationId) {
      apiUrl += `&STATEINC=${destinationId}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'EksootikareisidApp/1.0',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`JoinUp API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform JoinUp response to our format
    let checkinDates = [];

    if (data.SearchTour_CHECKIN) {
      checkinDates = Object.values(data.SearchTour_CHECKIN).map((checkin: any) => ({
        date: checkin.date || checkin.checkin, // Handle different response formats
        destinations: checkin.destinations || [], // Available destinations for this date
        availableOffers: checkin.offers || 0, // Number of available offers
        minPrice: checkin.minPrice || null, // Minimum price for this date
        maxPrice: checkin.maxPrice || null, // Maximum price for this date
      }));
    }

    return NextResponse.json({
      success: true,
      checkinDates,
      totalDates: checkinDates.length,
      fromCityId: cityId,
      destinationId: destinationId || null,
      cacheInfo: {
        // Cache for 6 hours (semi-dynamic data)
        maxAge: 6 * 60 * 60,
        cacheKey: `joinup_checkin_${cityId}_${destinationId || 'all'}`,
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=21600, stale-while-revalidate=1800',
        'X-Cache-TTL': '21600' // 6 hours
      }
    });

  } catch (error) {
    console.error('JoinUp checkin API error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'API connection failed',
      checkinDates: [],
      totalDates: 0,
      fromCityId: request.nextUrl.searchParams.get('cityId'),
      destinationId: request.nextUrl.searchParams.get('destinationId') || null
    }, { status: 500 });
  }
}