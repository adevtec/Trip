import { NextRequest, NextResponse } from 'next/server';
import { fetchCheckinDates } from '../api';

/**
 * JoinUp API - Get Available Check-in Dates
 * GET /api/providers/joinup/checkin-dates
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

    const result = await fetchCheckinDates(cityId, destinationId || undefined);

    return NextResponse.json(result);

  } catch (error) {
    console.error('JoinUp check-in dates API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}