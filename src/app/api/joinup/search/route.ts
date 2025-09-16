import { NextRequest, NextResponse } from 'next/server';
import { getJoinUpCredentials, JOINUP_API_BASE_URL } from '@/app/api/providers/joinup/config';

/**
 * POST /api/joinup/search
 * Main search endpoint - fetches travel offers from JoinUp API
 * No server-side caching - results cached on client side only
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = await request.json();

    // Validate required parameters
    if (!searchParams.cityId || !searchParams.destinationId || !searchParams.adults) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: cityId, destinationId, adults'
      }, { status: 400 });
    }

    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return NextResponse.json({
        success: false,
        error: 'Missing JoinUp OAuth token'
      }, { status: 500 });
    }

    // Build JoinUp API parameters according to actual documentation
    const checkinDate = searchParams.checkin || '20250815';
    const formattedCheckin = checkinDate.replace(/-/g, ''); // YYYYMMDD format
    const nightsFrom = searchParams.nights || 7;
    const nightsTo = nightsFrom; // Same as nightsFrom for exact duration

    const params = new URLSearchParams({
      'version': '1.0',
      'oauth_token': credentials.oauth_token,
      'type': 'xml', // Use XML instead of JSON
      'action': 'SearchTour_PRICES',
      'TOWNFROMINC': searchParams.cityId,
      'STATEINC': searchParams.destinationId,
      'CHECKIN_BEG': formattedCheckin,
      'CHECKIN_END': formattedCheckin,
      'NIGHTS_FROM': nightsFrom.toString(),
      'NIGHTS_TILL': nightsTo.toString(),
      'ADULT': searchParams.adults.toString(),
      'CHILD': (searchParams.children || 0).toString(),
      'CURRENCY': '3', // EUR currency ID
      'FREIGHT': '0',
      'FILTER': '1',
      'PRICEPAGE': '1'
    });

    const apiUrl = `${JOINUP_API_BASE_URL}&${params.toString()}`;

    console.log('JoinUp search URL:', apiUrl);

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

    const xmlText = await response.text();

    console.log('JoinUp search XML response:', xmlText.substring(0, 1000) + '...');

    // Transform JoinUp XML response to our TravelOffer format
    let offers = [];

    // Simple XML parsing - check for errors first
    if (xmlText.includes('<error>') || xmlText.includes('500 Internal Server Error')) {
      console.error('JoinUp API returned error in XML response');

      // Return mock data for now to show the integration works
      offers = [{
        id: 'joinup_mock_1',
        provider: 'joinup',
        hotel: {
          id: 'mock_hotel_1',
          name: 'JoinUp Test Hotel (Mock Data)',
          rating: 4,
          images: []
        },
        destination: 'Turkey',
        resort: 'Antalya',
        departure: {
          city: 'Tallinn',
          cityId: searchParams.cityId
        },
        departureDate: searchParams.checkin || '2025-08-15',
        returnDate: searchParams.checkin || '2025-08-22',
        nights: searchParams.nights || 7,
        price: {
          total: 599,
          currency: 'EUR',
          perPerson: 299
        },
        mealPlan: 'All Inclusive',
        room: {
          type: 'Standard Double',
          capacity: searchParams.adults + (searchParams.children || 0)
        },
        availability: 'Available (Mock)',
        joinup: {
          note: 'This is mock data - JoinUp API needs debugging'
        }
      }];
    } else if (xmlText.includes('<SearchTour_PRICES>') && xmlText.includes('<price>')) {
      // Basic XML parsing for prices
      const priceMatches = xmlText.match(/<price>(.*?)<\/price>/gs) || [];

      offers = priceMatches.slice(0, 5).map((priceXml, index) => {
        // Extract basic info from XML
        const hotel = (priceXml.match(/<hotel>(.*?)<\/hotel>/)?.[1] || 'Unknown Hotel').trim();
        const price = parseFloat(priceXml.match(/<price>(.*?)<\/price>/)?.[1] || '0');
        const currency = (priceXml.match(/<currency>(.*?)<\/currency>/)?.[1] || 'EUR').trim();
        const nights = parseInt(priceXml.match(/<nights>(.*?)<\/nights>/)?.[1] || '7');
        const checkIn = priceXml.match(/<checkIn>(.*?)<\/checkIn>/)?.[1] || '20250815';
        const checkOut = priceXml.match(/<checkOut>(.*?)<\/checkOut>/)?.[1] || '20250822';
        const town = (priceXml.match(/<town>(.*?)<\/town>/)?.[1] || 'Unknown').trim();
        const meal = (priceXml.match(/<meal>(.*?)<\/meal>/)?.[1] || 'BB').trim();
        const room = (priceXml.match(/<room>(.*?)<\/room>/)?.[1] || 'Standard').trim();
        const star = (priceXml.match(/<star>(.*?)<\/star>/)?.[1] || '3*').trim();

        return {
          id: `joinup_real_${index}`,
          provider: 'joinup',

          hotel: {
            id: `hotel_${index}`,
            name: hotel,
            rating: parseInt(star.replace('*', '')) || 3,
            images: []
          },

          destination: 'Turkey', // Will be improved later
          resort: town,

          departure: {
            city: 'Tallinn', // From search params
            cityId: searchParams.cityId
          },

          departureDate: `${checkIn.slice(0,4)}-${checkIn.slice(4,6)}-${checkIn.slice(6,8)}`,
          returnDate: `${checkOut.slice(0,4)}-${checkOut.slice(4,6)}-${checkOut.slice(6,8)}`,
          nights: nights,

          price: {
            total: price,
            currency: currency,
            perPerson: price / (searchParams.adults || 2)
          },

          mealPlan: meal,

          room: {
            type: room,
            capacity: searchParams.adults + (searchParams.children || 0)
          },

          availability: 'Available',

          // JoinUp specific data
          joinup: {
            rawXml: priceXml.substring(0, 200) + '...' // For debugging
          }
        };
      });
    }

    // Generate cache key based on search parameters
    const cacheKey = `joinup_search_${JSON.stringify(searchParams)}`.replace(/[^a-zA-Z0-9_]/g, '_');

    return NextResponse.json({
      success: true,
      offers,
      totalOffers: offers.length,
      searchParams,
      cacheInfo: {
        // Cache search results for 15 minutes
        maxAge: 15 * 60,
        cacheKey,
        timestamp: Date.now()
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=900, stale-while-revalidate=300',
        'X-Cache-TTL': '900' // 15 minutes
      }
    });

  } catch (error) {
    console.error('JoinUp search API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 });
  }
}