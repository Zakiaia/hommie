import { NextRequest, NextResponse } from 'next/server';

/** OpenStreetMap Nominatim — Israel-focused suggestions for area preferences */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'json');
    url.searchParams.set('q', q);
    url.searchParams.set('countrycodes', 'il');
    url.searchParams.set('limit', '10');
    url.searchParams.set('addressdetails', '1');

    const res = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Hommie/1.0 (real-estate onboarding; contact via app owner)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [], error: 'upstream' }, { status: 502 });
    }

    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;

    const results = data.map((row) => ({
      label: row.display_name.split(',').slice(0, 3).join(',').trim(),
      fullLabel: row.display_name,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lon),
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: 'fetch' }, { status: 500 });
  }
}
