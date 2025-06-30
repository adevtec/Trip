import { NextRequest, NextResponse } from 'next/server';

/**
 * Legacy Swagger API - Disabled
 * 
 * This is legacy code that has been moved to the legacy folder.
 * The swagger service it depends on doesn't exist in the current codebase.
 * If swagger documentation is needed, it should be reimplemented as a proper service.
 */

export async function GET() {
  return NextResponse.json(
    { error: 'Legacy API - Not implemented', message: 'This endpoint has been deprecated' },
    { status: 501 }
  );
}