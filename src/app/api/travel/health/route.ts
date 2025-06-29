import { NextResponse } from 'next/server';
import { getDefaultAggregator } from '@/services';

/**
 * Travel Providers Health Check
 * GET /api/travel/health
 */
export async function GET() {
  try {
    const aggregator = getDefaultAggregator();
    
    // Get provider statistics
    const stats = aggregator.getStats();
    
    // Check health of all providers
    const healthChecks = await aggregator.healthCheck();
    
    // Count healthy providers
    const healthyProviders = Object.values(healthChecks).filter(Boolean).length;
    const totalProviders = Object.keys(healthChecks).length;

    return NextResponse.json({
      success: true,
      status: healthyProviders > 0 ? 'operational' : 'degraded',
      providers: healthChecks,
      stats: {
        ...stats,
        healthyProviders,
        healthPercentage: totalProviders > 0 ? Math.round((healthyProviders / totalProviders) * 100) : 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Health check error:', error);
    
    return NextResponse.json({
      success: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
