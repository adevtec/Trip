import { NextRequest, NextResponse } from 'next/server';

/**
 * Legacy Languages API - Disabled
 * 
 * This is legacy code that has been moved to the legacy folder.
 * The database service it depends on doesn't exist in the current codebase.
 * If languages functionality is needed, it should be reimplemented as a proper service.
 */

export async function GET() {
  return NextResponse.json(
    { error: 'Legacy API - Not implemented', message: 'This endpoint has been deprecated' },
    { status: 501 }
  );
}
