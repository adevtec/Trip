/**
 * JoinUp Baltic API Functions
 * Unified API functions for all JoinUp endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJoinUpCredentials, JOINUP_API_BASE_URL } from './config';

export interface JoinUpCity {
  id: string;
  name: string;
  nameAlt: string;
  country: string;
  countryAlt: string;
  code: string;
  joinupId: number;
}

export interface JoinUpDestination {
  id: string;
  name: string;
  nameAlt: string;
  joinupId: number;
  fromCityId: string;
}

export interface JoinUpCheckinDate {
  date: string;
  destinations: string[];
  availableOffers: number;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface JoinUpOffer {
  id: string;
  provider: 'joinup';
  hotel: {
    id?: string;
    name: string;
    rating: number;
    images: string[];
  };
  destination: string;
  resort: string;
  departure: {
    city: string;
    cityId: string;
  };
  departureDate: string;
  returnDate: string;
  nights: number;
  price: {
    total: number;
    currency: string;
    perPerson: number | null;
  };
  mealPlan: string;
  room: {
    type: string;
    capacity: number;
  };
  availability: string;
  joinup?: {
    hotelId: any;
    tourId: any;
    priceId: any;
  };
}

/**
 * Fetch departure cities from JoinUp API
 */
export async function fetchCities(): Promise<{ success: boolean; cities?: JoinUpCity[]; error?: string }> {
  try {
    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return {
        success: false,
        error: 'Missing JoinUp OAuth token'
      };
    }

    // Fetch departure cities from JoinUp API
    const apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_TOWNFROMS`;

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
    
    // Debug: Log the response structure
    // console.log('🏙️ JoinUp Cities API Response keys:', Object.keys(data));
    // if (data.SearchTour_TOWNFROMS) {
    //   console.log('🏙️ Cities count:', Object.keys(data.SearchTour_TOWNFROMS).length);
    // }

    // Transform JoinUp response to our format and filter out unwanted cities
    if (data.SearchTour_TOWNFROMS) {
      const allCities = Object.values(data.SearchTour_TOWNFROMS).map((city: any) => ({
        id: city.id.toString(),
        name: city.name,
        nameAlt: city.nameAlt,
        country: city.stateFromName,
        countryAlt: city.stateFromNameAlt,
        code: city.id.toString(),
        joinupId: city.id
      }));

      // Filter out cities from Moldova or other unwanted countries
      const filteredCities = allCities.filter((city: any) => {
        const countryLower = city.country?.toLowerCase() || '';
        const countryAltLower = city.countryAlt?.toLowerCase() || '';
        
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

      return {
        success: true,
        cities: filteredCities
      };
    } else {
      throw new Error('Invalid response format from JoinUp API');
    }

  } catch (error) {
    console.error('JoinUp cities API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch cities'
    };
  }
}

/**
 * Fetch destinations for a specific departure city
 */
export async function fetchDestinations(cityId: string): Promise<{ success: boolean; destinations?: JoinUpDestination[]; error?: string }> {
  try {
    if (!cityId) {
      return {
        success: false,
        error: 'cityId parameter is required'
      };
    }

    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return {
        success: false,
        error: 'Missing JoinUp OAuth token'
      };
    }

    // Fetch destinations from JoinUp API using actual parameter names (API expects TOWNFROMINC not townfrom_id)
    const apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_STATES&TOWNFROMINC=${cityId}`;

    // console.log('🔗 JoinUp Destinations API URL:', apiUrl.replace(credentials.oauth_token, 'TOKEN_HIDDEN'));

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
    
    // Debug: Log the actual response to understand the structure
    // console.log('🔍 JoinUp API Response:', JSON.stringify(data, null, 2));

    if (data.SearchTour_STATES) {
      const destinations = Object.values(data.SearchTour_STATES).map((destination: any, index: number) => {
        // Debug: Log each destination to see what's missing
        // console.log(`🎯 Destination ${index}:`, destination);
        
        if (!destination.id) {
          console.warn(`⚠️ Destination ${index} missing ID:`, destination);
          return null; // Skip invalid destinations
        }
        
        return {
          id: destination.id.toString(),
          name: destination.name || 'Unknown',
          nameAlt: destination.nameAlt || destination.name || 'Unknown',
          joinupId: destination.id,
          fromCityId: cityId
        };
      }).filter(dest => dest !== null); // Remove invalid destinations

      return {
        success: true,
        destinations
      };
    } else {
      console.log('❌ No SearchTour_STATES in response:', Object.keys(data));
      throw new Error('Invalid response format from JoinUp API');
    }

  } catch (error) {
    console.error('JoinUp destinations API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch destinations'
    };
  }
}

/**
 * Fetch available checkin dates for a city and destination
 */
export async function fetchCheckinDates(cityId: string, destinationId?: string): Promise<{ success: boolean; checkinDates?: JoinUpCheckinDate[]; error?: string }> {
  try {
    if (!cityId) {
      return {
        success: false,
        error: 'cityId parameter is required'
      };
    }

    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return {
        success: false,
        error: 'Missing JoinUp OAuth token'
      };
    }

    // Build API URL using correct parameter names from documentation
    let apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_CHECKIN&townfrom_id=${cityId}`;

    if (destinationId) {
      apiUrl += `&state_id=${destinationId}`;
    }

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

    if (data.SearchTour_CHECKIN) {
      const checkinDates = Object.entries(data.SearchTour_CHECKIN).map(([date, info]: [string, any]) => ({
        date,
        destinations: info.destinations || [],
        availableOffers: info.availableOffers || 0,
        minPrice: info.minPrice || null,
        maxPrice: info.maxPrice || null
      }));

      return {
        success: true,
        checkinDates
      };
    } else {
      return {
        success: true,
        checkinDates: []
      };
    }

  } catch (error) {
    console.error('JoinUp checkin dates API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch checkin dates'
    };
  }
}

/**
 * Fetch regions/towns for a specific destination
 */
export async function fetchRegions(destinationId: string, departureCityId?: string): Promise<{ success: boolean; regions?: any[]; error?: string }> {
  try {
    if (!destinationId) {
      return {
        success: false,
        error: 'destinationId parameter is required'
      };
    }

    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return {
        success: false,
        error: 'Missing JoinUp OAuth token'
      };
    }

    // Default to Tallinn (city ID 2552) if no departure city specified
    const townFromId = departureCityId || '2552';

    // Fetch regions/towns from JoinUp API with both TOWNFROMINC and STATEINC
    const apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_TOWNS&TOWNFROMINC=${townFromId}&STATEINC=${destinationId}`;

    // console.log('🏖️ JoinUp Regions API URL:', apiUrl.replace(credentials.oauth_token, 'TOKEN_HIDDEN'));

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

    console.log('🏖️ JoinUp SearchTour_TOWNS Response:', JSON.stringify(data, null, 2));

    // Debug: Log a single region to see its structure
    if (data.SearchTour_TOWNS && Object.keys(data.SearchTour_TOWNS).length > 0) {
      const firstRegion = Object.values(data.SearchTour_TOWNS)[0];
      // console.log('🔍 First region structure:', JSON.stringify(firstRegion, null, 2));
    }

    if (data.SearchTour_TOWNS) {
      const regions = Object.values(data.SearchTour_TOWNS).map((region: any) => ({
        id: region.id?.toString() || region.townKey?.toString(),
        name: region.name || region.town || 'Unknown',
        nameAlt: region.nameAlt || region.name || 'Unknown',
        provider: 'joinup',
        destinationId: destinationId,
        joinupId: region.id || region.townKey,
        // Include JoinUp hierarchy fields (only if they exist)
        ...(region.region && { region: region.region }),
        ...(region.regionAlt && { regionAlt: region.regionAlt }),
        ...(region.regionKey && { regionKey: region.regionKey })
      }));

      // API now returns correct regions with proper TOWNFROMINC + STATEINC parameters

      return {
        success: true,
        regions
      };
    } else {
      console.log('❌ No SearchTour_TOWNS in response:', Object.keys(data));
      return {
        success: true,
        regions: []
      };
    }

  } catch (error) {
    console.error('JoinUp regions API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch regions'
    };
  }
}

/**
 * Search for travel offers using SearchTour_PRICES endpoint
 */
export async function searchOffers(searchParams: any): Promise<{ success: boolean; offers?: JoinUpOffer[]; error?: string }> {
  try {
    // Validate required parameters as per JoinUp API documentation
    if (!searchParams.cityId || !searchParams.destinationId || !searchParams.adults || !searchParams.checkin || !searchParams.nights) {
      return {
        success: false,
        error: 'Missing required parameters: cityId, destinationId, adults, checkin, nights'
      };
    }

    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return {
        success: false,
        error: 'Missing JoinUp OAuth token'
      };
    }

    // Build SearchTour_PRICES API URL - use correct parameter names from documentation
    const checkinDate = searchParams.checkin; // Format: YYYY-MM-DD
    const checkinFormatted = checkinDate.replace(/-/g, ''); // Convert to YYYYMMDD
    
    const apiUrl = `${JOINUP_API_BASE_URL}&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_PRICES` +
      `&TOWNFROMINC=${searchParams.cityId}` +
      `&STATEINC=${searchParams.destinationId}` +
      `&CHECKIN_BEG=${checkinFormatted}` +
      `&CHECKIN_END=${checkinFormatted}` +
      `&NIGHTS_FROM=${searchParams.nights}` +
      `&NIGHTS_TILL=${searchParams.nights}` +
      `&ADULT=${searchParams.adults}` +
      `&CHILD=${searchParams.children || 0}` +
      `&CURRENCY=3` + // EUR currency ID (from documentation)
      `&FREIGHT=0` + // Show all tours
      `&FILTER=1`; // Hide stopsale hotels

    console.log('🔍 JoinUp SearchTour_PRICES API URL:', apiUrl.replace(credentials.oauth_token, 'TOKEN_HIDDEN'));

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
    
    // Debug: Log the response structure
    console.log('🎯 JoinUp SearchTour_PRICES Response:', JSON.stringify(data, null, 2));

    // Process response based on JoinUp documentation format
    if (data.SearchTour_PRICES) {
      const pricesData = data.SearchTour_PRICES;
      
      // Handle error response
      if (pricesData.error && pricesData.error !== 0) {
        console.log(`❌ JoinUp API error ${pricesData.error}: ${pricesData.message}`);
        return {
          success: true,
          offers: []
        };
      }
      
      // Handle successful response with prices array
      if (pricesData.prices && Array.isArray(pricesData.prices)) {
        const offers = pricesData.prices.map((price: any, index: number) => {
          console.log(`🏨 Processing price ${index}:`, price);
          
          return {
            id: `joinup-${price.hotelKey}-${price.checkIn}`,
            provider: 'joinup' as const,
            hotel: {
              id: price.hotelKey,
              name: price.hotel || 'Unknown Hotel',
              rating: parseInt(price.starKey) || 0,
              images: ['/placeholder-hotel.svg'], // Use placeholder SVG instead of hotelUrl
            },
            destination: price.town || 'Unknown',
            resort: price.town || 'Unknown',
            departure: {
              city: 'Tallinn', // Map from cityId if needed
              cityId: searchParams.cityId,
            },
            departureDate: price.checkIn ? 
              `${price.checkIn.substr(0,4)}-${price.checkIn.substr(4,2)}-${price.checkIn.substr(6,2)}` : 
              searchParams.checkin,
            returnDate: price.checkOut ? 
              `${price.checkOut.substr(0,4)}-${price.checkOut.substr(4,2)}-${price.checkOut.substr(6,2)}` : 
              new Date(new Date(searchParams.checkin).getTime() + (searchParams.nights * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            nights: parseInt(price.nights) || parseInt(searchParams.nights),
            price: {
              total: parseFloat(price.price || '0'),
              currency: price.currency || 'EUR',
              perPerson: parseFloat(price.price || '0') / parseInt(searchParams.adults),
            },
            mealPlan: price.meal || 'Unknown',
            room: {
              type: price.room || 'Standard',
              capacity: parseInt(searchParams.adults) + parseInt(searchParams.children || '0'),
            },
            availability: price.color === 'green' ? 'Available' : 
                         price.color === 'white' ? 'On Request' : 
                         'Not Available',
            joinup: {
              hotelId: price.hotelKey,
              tourId: price.tourKey,
              priceId: price.id,
            },
          };
        });

        console.log(`✅ JoinUp search completed: ${offers.length} offers found`);
        
        return {
          success: true,
          offers
        };
      }
    }
    
    // Handle empty response or unexpected format
    console.log('✅ JoinUp search completed: 0 offers found (no prices available)');
    return {
      success: true,
      offers: []
    };

  } catch (error) {
    console.error('JoinUp search API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search offers'
    };
  }
}

/**
 * Get detailed hotel information including images
 */
export async function getHotelInfo(hotelId: string): Promise<{ success: boolean; hotel?: any; error?: string }> {
  try {
    const credentials = getJoinUpCredentials();

    if (!credentials.oauth_token) {
      return { success: false, error: 'JoinUp OAuth token not configured' };
    }

    const url = `${JOINUP_API_BASE_URL}?samo_action=api&version=1.0&oauth_token=${credentials.oauth_token}&type=json&action=SearchTour_HOTELINFO&HOTELINC=${hotelId}&LANG=EN`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Eksootikareisid/1.0',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const hotelData = data.SearchTour_HOTELINFO?.[0];

    if (!hotelData) {
      return { success: false, error: 'Hotel information not found' };
    }

    // Extract images from media section
    const images = (hotelData.media || [])
      .filter((item: any) => item.type === 'image')
      .map((item: any) => item.url);

    const hotel = {
      id: hotelData.hoteldata?.id || hotelId,
      name: hotelData.hoteldata?.name || 'Unknown Hotel',
      category: hotelData.hoteldata?.category || 3,
      images: images
    };

    return { success: true, hotel };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch hotel information'
    };
  }
}