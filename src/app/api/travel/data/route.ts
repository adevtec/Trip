import { NextRequest, NextResponse } from 'next/server';
import { fetchCities, fetchDestinations } from '@/app/api/providers/joinup/api';

/**
 * GET /api/travel/data?type=cities|destinations|regions|hotels|meals|ratings
 * Unified data endpoint that aggregates data from all providers
 * for use in SearchEngine dropdowns and autocomplete
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const cityId = searchParams.get('cityId');
    const destinationId = searchParams.get('destinationId');

    switch (type) {
      case 'cities':
        return await getCities();

      case 'destinations':
        return await getDestinations(cityId);

      case 'regions':
        return await getRegions(cityId, destinationId);

      case 'hotels':
        return await getHotels(searchParams.get('query') || '');

      case 'meals':
        return await getMealPlans();

      case 'ratings':
        return await getHotelRatings();

      case 'checkin':
        return await getCheckinDates(cityId, destinationId);

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use: cities, destinations, regions, hotels, meals, ratings, or checkin'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Travel data API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Get departure cities from all providers
 */
async function getCities() {
  try {
    const cities = [];

    // Add JoinUp cities
    try {
      const joinUpCitiesResult = await fetchCities();
      const joinUpCities = joinUpCitiesResult.success ? (joinUpCitiesResult.cities || []) : [];
      cities.push(...joinUpCities.map(city => ({
        id: city.id,
        name: city.name,
        nameAlt: city.nameAlt,
        country: city.country,
        provider: 'joinup',
        code: city.code
      })));
    } catch (error) {
      console.warn('Failed to fetch JoinUp cities:', error);
    }


    // Add other providers' cities here when they become available

    // Remove duplicates and sort
    const uniqueCities = Array.from(
      new Map(cities.map(city => [city.name.toLowerCase(), city])).values()
    ).sort((a, b) => a.name.localeCompare(b.name, 'et'));

    return NextResponse.json({
      success: true,
      cities: uniqueCities,
      totalCities: uniqueCities.length,
      providers: [...new Set(cities.map(c => c.provider))],
      cacheInfo: {
        maxAge: 24 * 60 * 60, // 24 hours
        cacheKey: 'travel_cities',
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600'
      }
    });

  } catch (error) {
    throw new Error(`Failed to fetch cities: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get destinations for a specific departure city
 */
async function getDestinations(cityId: string | null) {
  if (!cityId) {
    return NextResponse.json({
      success: false,
      error: 'cityId parameter is required for destinations'
    }, { status: 400 });
  }

  try {
    const destinations = [];

    // Add JoinUp destinations
    try {
      const joinUpDestinationsResult = await fetchDestinations(cityId);
      const joinUpDestinations = joinUpDestinationsResult.success ? (joinUpDestinationsResult.destinations || []) : [];
      destinations.push(...joinUpDestinations.map(dest => ({
        id: dest.id,
        name: dest.name,
        nameAlt: dest.nameAlt,
        provider: 'joinup',
        fromCityId: dest.fromCityId
      })));
    } catch (error) {
      console.warn('Failed to fetch JoinUp destinations:', error);
    }

    // Add other providers' destinations here
    // Add NovIT, TEZ, etc.

    const uniqueDestinations = Array.from(
      new Map(destinations.map(dest => [dest.name.toLowerCase(), dest])).values()
    ).sort((a, b) => a.name.localeCompare(b.name, 'et'));

    return NextResponse.json({
      success: true,
      destinations: uniqueDestinations,
      totalDestinations: uniqueDestinations.length,
      fromCityId: cityId,
      providers: [...new Set(destinations.map(d => d.provider))],
      cacheInfo: {
        maxAge: 12 * 60 * 60, // 12 hours
        cacheKey: `travel_destinations_${cityId}`,
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=43200, stale-while-revalidate=1800'
      }
    });

  } catch (error) {
    throw new Error(`Failed to fetch destinations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get regions/areas for a destination
 */
async function getRegions(cityId: string | null, destinationId: string | null) {
  // TODO: Implement JoinUp towns endpoint when available
  const regions: any[] = [];

  return NextResponse.json({
    success: true,
    regions: regions,
    totalRegions: regions.length,
    fromCityId: cityId,
    destinationId: destinationId,
    cacheInfo: {
      maxAge: 6 * 60 * 60, // 6 hours
      cacheKey: `travel_regions_${cityId}_${destinationId}`,
      timestamp: Date.now()
    }
  });
}

/**
 * Get hotels for autocomplete
 */
async function getHotels(query: string) {
  // TODO: Implement JoinUp hotels endpoint
  const hotels: any[] = [];

  return NextResponse.json({
    success: true,
    hotels: hotels,
    totalHotels: hotels.length,
    query: query
  });
}

/**
 * Get meal plans
 */
async function getMealPlans() {
  const mealPlans = [
    { id: 'uai', name: 'UAI - Ultra kõik hinnas', code: 'UAI' },
    { id: 'ai', name: 'AI - Kõik hinnas', code: 'AI' },
    { id: 'fb', name: 'FB - Hommiku-, lõuna- ja õhtusöök', code: 'FB' },
    { id: 'hb', name: 'HB - Hommiku- ja õhtusöök', code: 'HB' },
    { id: 'bb', name: 'BB - Hommikusöök', code: 'BB' },
    { id: 'ro', name: 'RO - Toitlustuseta', code: 'RO' }
  ];

  return NextResponse.json({
    success: true,
    mealPlans: mealPlans,
    totalMealPlans: mealPlans.length,
    cacheInfo: {
      maxAge: 24 * 60 * 60, // 24 hours
      cacheKey: 'travel_meal_plans',
      timestamp: Date.now()
    }
  });
}

/**
 * Get hotel ratings
 */
async function getHotelRatings() {
  const ratings = [
    { id: '3', name: '3 tärni', value: 3, stars: '⭐⭐⭐' },
    { id: '4', name: '4 tärni', value: 4, stars: '⭐⭐⭐⭐' },
    { id: '5', name: '5 tärni', value: 5, stars: '⭐⭐⭐⭐⭐' }
  ];

  return NextResponse.json({
    success: true,
    ratings: ratings,
    totalRatings: ratings.length,
    cacheInfo: {
      maxAge: 24 * 60 * 60, // 24 hours
      cacheKey: 'travel_ratings',
      timestamp: Date.now()
    }
  });
}

/**
 * Get available check-in dates for departure calendar
 */
async function getCheckinDates(cityId: string | null, destinationId: string | null) {
  if (!cityId) {
    return NextResponse.json({
      success: false,
      error: 'cityId parameter is required for checkin dates'
    }, { status: 400 });
  }

  try {
    const checkinDates = [];

    // Try to get JoinUp checkin dates
    try {
      const joinupUrl = `/api/providers/joinup/checkin?cityId=${cityId}${destinationId ? `&destinationId=${destinationId}` : ''}`;
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}${joinupUrl}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.checkinDates) {
          checkinDates.push(...data.checkinDates.map((date: any) => ({
            date: date.date,
            destinations: date.destinations,
            availableOffers: date.availableOffers,
            minPrice: date.minPrice,
            maxPrice: date.maxPrice,
            provider: 'joinup'
          })));
        }
      }
    } catch (error) {
      console.warn('Failed to fetch JoinUp checkin dates:', error);
    }

    // Add other providers' checkin dates here
    // Add NovIT, TEZ, etc.


    return NextResponse.json({
      success: true,
      checkinDates,
      totalDates: checkinDates.length,
      fromCityId: cityId,
      destinationId: destinationId,
      providers: [...new Set(checkinDates.map(d => d.provider))],
      cacheInfo: {
        maxAge: 6 * 60 * 60, // 6 hours
        cacheKey: `travel_checkin_${cityId}_${destinationId || 'all'}`,
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=21600, stale-while-revalidate=1800'
      }
    });

  } catch (error) {
    throw new Error(`Failed to fetch checkin dates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}