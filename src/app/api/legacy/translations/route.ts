import { NextRequest, NextResponse } from 'next/server';

/**
 * Legacy Translations API - Disabled
 * 
 * This is legacy code that has been moved to the legacy folder.
 * The translation service it depends on doesn't exist in the current codebase.
 * If translations functionality is needed, it should be reimplemented as a proper service.
 */

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Legacy API - Not implemented', message: 'This endpoint has been deprecated' },
    { status: 501 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Legacy API - Not implemented', message: 'This endpoint has been deprecated' },
    { status: 501 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'Legacy API - Not implemented', message: 'This endpoint has been deprecated' },
    { status: 501 }
  );
}
