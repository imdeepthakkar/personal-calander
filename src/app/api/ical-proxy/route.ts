import { NextRequest, NextResponse } from 'next/server';
import { parseICalFeed } from '@/lib/sync/icalParser';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  const name = req.nextUrl.searchParams.get('name') || 'External Calendar';
  const color = req.nextUrl.searchParams.get('color') || '#059669';

  if (!url) {
    return NextResponse.json({ error: 'Missing calendar url parameter' }, { status: 400 });
  }

  try {
    // Normalise webcal:// to https://
    const targetUrl = url.replace(/^webcal:\/\//i, 'https://');

    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'PersonalCalendar/1.0',
        Accept: 'text/calendar, text/plain, */*',
      },
      next: { revalidate: 300 }, // Cache on edge for 5 mins
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Remote calendar server returned status ${res.status}` },
        { status: 502 }
      );
    }

    const icsText = await res.text();
    const events = parseICalFeed(icsText, name, color);

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    console.error('Error in iCal proxy:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch external calendar' },
      { status: 500 }
    );
  }
}
