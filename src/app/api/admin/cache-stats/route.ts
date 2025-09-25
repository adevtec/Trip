import { NextRequest, NextResponse } from 'next/server';
import { availabilityValidator } from '@/lib/availability-validator';

/**
 * Cache Statistics and Management API
 * GET /api/admin/cache-stats - Get cache statistics
 * DELETE /api/admin/cache-stats - Clear cache
 */
export async function GET(request: NextRequest) {
  try {
    const stats = availabilityValidator.getCacheStats();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cache: stats,
      actions: {
        clearCache: '/api/admin/cache-stats (DELETE)',
        forceCleanup: '/api/admin/cache-stats?action=cleanup (POST)'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Clear all cache entries
 */
export async function DELETE(request: NextRequest) {
  try {
    const statsBefore = availabilityValidator.getCacheStats();
    availabilityValidator.clearCache();

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      clearedEntries: statsBefore.total,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Force cleanup of expired entries
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'cleanup') {
      const result = availabilityValidator.forceCleanup();

      return NextResponse.json({
        success: true,
        message: 'Expired entries cleaned up',
        ...result,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown action. Use ?action=cleanup'
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}