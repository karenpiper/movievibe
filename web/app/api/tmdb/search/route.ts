import { NextRequest } from 'next/server';
import { getAuthHeaders, getEnv } from '@/lib/server/env';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) {
    return new Response(JSON.stringify({ error: 'Missing q' }), { status: 400 });
  }

  const headers = getAuthHeaders();
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`;
  const res = await fetch(url, { headers, cache: 'no-store' });
  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'tmdb_error', details: data }), { status: 502 });
  }

  // Normalize minimal shape your UI expects
  const results = (data.results || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    release_date: m.release_date,
    genre_ids: m.genre_ids,
    overview: m.overview,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    runtime: undefined,
    vote_average: m.vote_average,
  }));

  return Response.json({ results });
}

