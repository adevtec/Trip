import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { aggregatorService } from '@/services/search/aggregatorService';
import { SearchFilters } from '@/types/search';

// Validation schema for search request
const searchRequestSchema = z.object({
  departureCities: z.array(z.string()).min(1, 'At least one departure city is required'),
  destination: z.string().optional(),
  areas: z.array(z.string()).optional(),
  resorts: z.array(z.string()).optional(),
  departureDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  returnDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  nights: z.number().optional().default(7), // Default to 7 nights if not specified
  adults: z.number().min(1, 'At least one adult is required').default(1), // Default to 1 adult
  children: z.number().default(0),
  childrenAges: z.array(z.number()).optional(),
  hotelRating: z.array(z.number()).optional(),
  mealPlans: z.array(z.string()).optional(),
  hotelNames: z.array(z.string()).optional(),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional(),
  page: z.number().default(1),
  pageSize: z.number().default(20),
  sortBy: z.string().default('price'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

/**
 * POST /api/search
 * Search for travel packages across multiple agencies
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request
    const validatedData = searchRequestSchema.parse(body);

    // Convert to SearchFilters
    const filters: SearchFilters = {
      ...validatedData
    };

    // Perform search
    const searchResponse = await aggregatorService.search(filters);

    // Remove agency information before sending to client
    const sanitizedResults = searchResponse.results.map(result => {
      // Create a new object without agency information
      const { agencyId, agencyName, deepLink, ...sanitizedResult } = result;
      return sanitizedResult;
    });

    // Return results with agency information removed
    return NextResponse.json({
      ...searchResponse,
      results: sanitizedResults
    });
  } catch (error) {
    console.error('Search API error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'An error occurred while processing your search' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/search
 * Simple GET endpoint for testing
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;

    // Create basic filters from query parameters
    const filters: SearchFilters = {
      departureCities: searchParams.get('departureCities')?.split(',') || ['tallinn'],
      destination: searchParams.get('destination') || undefined,
      adults: parseInt(searchParams.get('adults') || '1', 10),
      children: parseInt(searchParams.get('children') || '0', 10),
      nights: parseInt(searchParams.get('nights') || '7', 10), // Default to 7 nights
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '20', 10),
      sortBy: searchParams.get('sortBy') || 'price',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'
    };

    // Handle optional date parameter
    const departureDateStr = searchParams.get('departureDate');
    if (departureDateStr) {
      filters.departureDate = new Date(departureDateStr);
    }

    // Handle optional hotel ratings
    const hotelRatings = searchParams.getAll('hotelRating');
    if (hotelRatings.length > 0) {
      filters.hotelRating = hotelRatings.map(r => parseInt(r, 10));
    }

    // Handle optional meal plans
    const mealPlans = searchParams.getAll('mealPlan');
    if (mealPlans.length > 0) {
      filters.mealPlans = mealPlans;
    }

    // Handle optional areas
    const areas = searchParams.getAll('area');
    if (areas.length > 0) {
      filters.areas = areas;
    }

    // Perform search
    const searchResponse = await aggregatorService.search(filters);

    // Remove agency information before sending to client
    const sanitizedResults = searchResponse.results.map(result => {
      // Create a new object without agency information
      const { agencyId, agencyName, deepLink, ...sanitizedResult } = result;
      return sanitizedResult;
    });

    // Return results with agency information removed
    return NextResponse.json({
      ...searchResponse,
      results: sanitizedResults
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your search' },
      { status: 500 }
    );
  }
}
