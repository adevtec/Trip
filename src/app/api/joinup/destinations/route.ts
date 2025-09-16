import { NextRequest, NextResponse } from 'next/server';
import { getJoinUpCredentials, JOINUP_API_BASE_URL } from '@/app/api/providers/joinup/config';

/**
 * GET /api/joinup/destinations?cityId=2552
 * Fetches destination countries for a specific departure city
 * No server-side caching - pure pass-through
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');

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

    // Fetch destinations from JoinUp API
    const apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_STATES&TOWNFROMINC=${cityId}`;

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
    if (data.SearchTour_STATES) {
      const destinations = Object.values(data.SearchTour_STATES).map((dest: any) => ({
        id: dest.id ? dest.id.toString() : 'unknown',
        name: dest.name || 'Unknown Destination',
        nameAlt: dest.nameAlt || dest.name || 'Unknown Destination',
        joinupId: dest.id || 0,
        fromCityId: cityId
      }));

      return NextResponse.json({
        success: true,
        destinations,
        totalDestinations: destinations.length,
        fromCityId: cityId,
        cacheInfo: {
          // Cache for 12 hours (semi-static data)
          maxAge: 12 * 60 * 60,
          cacheKey: `joinup_destinations_${cityId}`,
          timestamp: Date.now()
        }
      }, {
        headers: {
          'Cache-Control': 'public, max-age=43200, stale-while-revalidate=1800',
          'X-Cache-TTL': '43200' // 12 hours
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        destinations: [],
        totalDestinations: 0,
        fromCityId: cityId,
        cacheInfo: {
          maxAge: 12 * 60 * 60,
          cacheKey: `joinup_destinations_${cityId}`,
          timestamp: Date.now()
        }
      });
    }

  } catch (error) {
    console.error('JoinUp destinations API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch destinations'
    }, { status: 500 });
  }
}