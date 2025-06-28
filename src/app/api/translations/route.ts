import { NextRequest, NextResponse } from 'next/server';
import { getTranslations, createTranslation, updateTranslation } from '@/services/translations/translationService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang') || 'et';

  try {
    const translations = await getTranslations(lang);
    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Translation service error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await createTranslation(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Translation service error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await updateTranslation(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Translation service error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
