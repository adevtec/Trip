import { NextResponse } from 'next/server';
import { getJoinUpCredentials, JOINUP_API_BASE_URL } from '@/app/api/providers/joinup/config';

/**
 * GET /api/joinup/cities
 * Fetches departure cities from JoinUp API
 * No server-side caching - pure pass-through with client caching
 */
export async function GET() {
  try {
    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return NextResponse.json({
        success: false,
        error: 'Missing JoinUp OAuth token'
      }, { status: 500 });
    }

    // Fetch departure cities from JoinUp API
    const apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_TOWNFROMS`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'EksootikareisidApp/1.0',
      },
      // No caching on server side
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`JoinUp API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform JoinUp response to our format and filter out unwanted cities
    if (data.SearchTour_TOWNFROMS) {
      const allCities = Object.values(data.SearchTour_TOWNFROMS).map((city: any) => ({
        id: city.id.toString(),
        name: city.name,
        nameAlt: city.nameAlt,
        country: city.stateFromName,
        countryAlt: city.stateFromNameAlt,
        code: city.id.toString(), // JoinUp uses ID as code
        joinupId: city.id
      }));

      // Filter out cities from Moldova or other unwanted countries
      const filteredCities = allCities.filter((city: any) => {
        // Case-insensitive filtering of unwanted countries
        const countryLower = city.country?.toLowerCase() || '';
        const countryAltLower = city.countryAlt?.toLowerCase() || '';
        
        // Countries we don't sell trips from
        const unwantedCountries = [
          'moldova', 
          'молдова', 
          'moldavia',
          'republic of moldova',
          'moldova republic'
        ];
        
        return !unwantedCountries.some(unwanted => 
          countryLower.includes(unwanted) || 
          countryAltLower.includes(unwanted)
        );
      });

      return NextResponse.json({
        success: true,
        cities: filteredCities,
        totalCities: filteredCities.length,
        filteredOut: allCities.length - filteredCities.length,
        cacheInfo: {
          // Client should cache for 24 hours (static data)
          maxAge: 24 * 60 * 60, // 24 hours in seconds
          cacheKey: 'joinup_cities',
          timestamp: Date.now()
        }
      }, {
        headers: {
          // Instruct client to cache but allow revalidation
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
          'X-Cache-TTL': '86400' // 24 hours
        }
      });
    } else {
      throw new Error('Invalid response format from JoinUp API');
    }

  } catch (error) {
    console.error('JoinUp cities API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch cities',
      cacheInfo: {
        // Don't cache errors
        maxAge: 0,
        cacheKey: 'joinup_cities',
        timestamp: Date.now()
      }
    }, { status: 500 });
  }
}