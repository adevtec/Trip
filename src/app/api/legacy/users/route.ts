import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Legacy API - Not implemented", message: "This endpoint has been deprecated" },
    { status: 501 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Legacy API - Not implemented", message: "This endpoint has been deprecated" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Legacy API - Not implemented", message: "This endpoint has been deprecated" },
    { status: 501 }
  );
}
