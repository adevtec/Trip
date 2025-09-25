import { NextRequest, NextResponse } from 'next/server';
import { getDefaultAggregator, SearchParams } from '@/app/api';

/**
 * Travel Search API Route
 * Uses the new unified travel aggregator system
 * 
 * GET /api/travel/search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const params: SearchParams = {
      departureCities: searchParams.get('departureCities')?.split(',') || ['Tallinn'],
      destination: searchParams.get('destination') || undefined,
      areas: searchParams.get('areas')?.split(',') || undefined,
      resorts: searchParams.get('resorts')?.split(',') || undefined,
      departureDate: searchParams.get('departureDate') ? new Date(searchParams.get('departureDate')!) : undefined,
      returnDate: searchParams.get('returnDate') ? new Date(searchParams.get('returnDate')!) : undefined,
      nights: searchParams.get('nights') ? parseInt(searchParams.get('nights')!) : undefined,
      adults: parseInt(searchParams.get('adults') || '2'),
      children: parseInt(searchParams.get('children') || '0'),
      childrenAges: searchParams.get('childrenAges')?.split(',').map(age => parseInt(age)) || undefined,
      hotelRating: searchParams.get('hotelRating')?.split(',').map(rating => parseInt(rating)) || undefined,
      mealPlans: searchParams.get('mealPlans')?.split(',') || undefined,
      priceRange: {
        min: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
        max: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined
      }
    };

    // Get aggregator and search
    const aggregator = getDefaultAggregator();
    const results = await aggregator.search(params);

    // Get combined offers if requested
    const sortBy = searchParams.get('sortBy') as 'price' | 'rating' | 'provider' | 'popularity' || 'popularity';
    const combined = searchParams.get('combined') === 'true';

    if (combined) {
      const offers = await aggregator.getCombinedOffers(params, sortBy);
      return NextResponse.json({
        success: true,
        combined: true,
        offers,
        totalOffers: offers.length,
        providers: aggregator.getProviders(),
        searchTime: Date.now()
      });
    }

    return NextResponse.json({
      success: true,
      results,
      totalProviders: results.length,
      successfulProviders: results.filter(r => r.success).length,
      totalOffers: results.reduce((sum, r) => sum + r.totalCount, 0),
      providers: aggregator.getProviders()
    });

  } catch (error) {
    console.error('❌ Travel search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: []
    }, { status: 500 });
  }
}

/**
 * POST /api/travel/search
 * Alternative endpoint for complex search requests
 */
export async function POST(request: NextRequest) {
  try {
    const params: SearchParams = await request.json();
    
    // Validate required fields
    if (!params.departureCities || params.departureCities.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one departure city is required'
      }, { status: 400 });
    }

    if (!params.adults || params.adults < 1) {
      return NextResponse.json({
        success: false,
        error: 'At least one adult is required'
      }, { status: 400 });
    }

    const aggregator = getDefaultAggregator();
    const results = await aggregator.search(params);

    return NextResponse.json({
      success: true,
      results,
      totalProviders: results.length,
      successfulProviders: results.filter(r => r.success).length,
      totalOffers: results.reduce((sum, r) => sum + r.totalCount, 0),
      providers: aggregator.getProviders()
    });

  } catch (error) {
    console.error('❌ Travel search POST API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: []
    }, { status: 500 });
  }
}
