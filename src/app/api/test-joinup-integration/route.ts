import { NextResponse } from 'next/server';

/**
 * Test endpoint for JoinUp integration
 * Tests the full flow: cities -> destinations -> search
 */
export async function GET() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3002';

    // Step 1: Get cities
    console.log('Fetching cities...');
    const citiesResponse = await fetch(`${baseUrl}/api/joinup/cities`);
    const citiesData = await citiesResponse.json();

    if (!citiesData.success) {
      throw new Error('Failed to fetch cities');
    }

    const tallinnCity = citiesData.cities.find((city: any) => city.name === 'Tallinn');
    if (!tallinnCity) {
      throw new Error('Tallinn not found in cities');
    }

    // Step 2: Get destinations for Tallinn
    console.log('Fetching destinations for Tallinn...');
    const destinationsResponse = await fetch(`${baseUrl}/api/joinup/destinations?cityId=${tallinnCity.id}`);
    const destinationsData = await destinationsResponse.json();

    if (!destinationsData.success) {
      throw new Error('Failed to fetch destinations');
    }

    const turkeyDestination = destinationsData.destinations.find((dest: any) => dest.name === 'Turkey');
    if (!turkeyDestination) {
      throw new Error('Turkey not found in destinations');
    }

    // Step 3: Search for offers
    console.log('Searching for offers...');
    const searchParams = {
      cityId: tallinnCity.id,
      destinationId: turkeyDestination.id,
      adults: 2,
      children: 0,
      checkin: '2025-07-15',
      nights: 7
    };

    const searchResponse = await fetch(`${baseUrl}/api/joinup/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });

    const searchData = await searchResponse.json();

    return NextResponse.json({
      success: true,
      message: 'JoinUp integration test completed successfully!',
      results: {
        cities: {
          total: citiesData.cities.length,
          tallinn: tallinnCity
        },
        destinations: {
          total: destinationsData.destinations.length,
          forTallinn: destinationsData.destinations.map((d: any) => d.name),
          turkey: turkeyDestination
        },
        search: {
          params: searchParams,
          success: searchData.success,
          totalOffers: searchData.offers ? searchData.offers.length : 0,
          sampleOffer: searchData.offers && searchData.offers.length > 0 ? {
            hotel: searchData.offers[0].hotel.name,
            price: searchData.offers[0].price.total,
            currency: searchData.offers[0].price.currency,
            destination: searchData.offers[0].destination,
            resort: searchData.offers[0].resort
          } : null,
          error: searchData.error || null
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('JoinUp integration test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Integration test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}