import { NextRequest, NextResponse } from 'next/server';
import { searchOffers } from '../api';

/**
 * POST /api/providers/joinup/search
 * Main search endpoint - searches travel offers from JoinUp API
 */
export async function POST(request: NextRequest) {
  const searchParams = await request.json();

  const result = await searchOffers(searchParams);
  
  if (result.success) {
    return NextResponse.json({
      success: true,
      offers: result.offers,
      totalOffers: result.offers?.length || 0,
      cacheInfo: {
        maxAge: 5 * 60, // 5 minutes for search results
        cacheKey: `joinup_search_${JSON.stringify(searchParams)}`,
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        'X-Cache-TTL': '300'
      }
    });
  } else {
    return NextResponse.json({
      success: false,
      error: result.error,
      cacheInfo: {
        maxAge: 0,
        cacheKey: `joinup_search_${JSON.stringify(searchParams)}`,
        timestamp: Date.now()
      }
    }, { status: 500 });
  }
}