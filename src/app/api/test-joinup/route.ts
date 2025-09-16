import { NextRequest, NextResponse } from 'next/server';
import { getJoinUpCredentials, JOINUP_API_BASE_URL } from '@/app/api/providers/joinup/config';

export async function GET(request: NextRequest) {
  try {
    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return NextResponse.json({
        error: 'Missing JoinUp OAuth token',
        message: 'Please set JOINUP_DEV_OAUTH_TOKEN in .env.local'
      }, { status: 500 });
    }

    // Test basic connection with TOWNFROMS endpoint
    const testUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_TOWNFROMS`;

    console.log('Testing JoinUp API connection:', testUrl);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'EksootikareisidApp/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if we got valid response
    if (data.SearchTour_TOWNFROMS) {
      const cities = Object.values(data.SearchTour_TOWNFROMS).map((city: any) => ({
        id: city.id,
        name: city.name,
        country: city.stateFromName
      }));

      return NextResponse.json({
        success: true,
        message: 'JoinUp API connection successful!',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        apiUrl: JOINUP_API_BASE_URL,
        cities: cities,
        totalCities: cities.length
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid API response format',
        data: data
      }, { status: 500 });
    }

  } catch (error) {
    console.error('JoinUp API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      apiUrl: JOINUP_API_BASE_URL
    }, { status: 500 });
  }
}