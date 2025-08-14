import { NextRequest } from 'next/server';
import { getAuthHeaders, getEnv } from '@/lib/server/env';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const headers = getAuthHeaders();
  const tmdbUrl = `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,reviews`;
  const tmdbRes = await fetch(tmdbUrl, { headers, cache: 'no-store' });
  const tmdb = await tmdbRes.json();
  if (!tmdbRes.ok) {
    return new Response(JSON.stringify({ error: 'tmdb_error', details: tmdb }), { status: 502 });
  }

  // Optional IMDb enrichment via OMDb
  let imdb = null as any;
  const { OMDB_API_KEY } = getEnv();
  if (OMDB_API_KEY && tmdb.imdb_id) {
    try {
      const omdbRes = await fetch(`https://www.omdbapi.com/?i=${tmdb.imdb_id}&apikey=${OMDB_API_KEY}`, { cache: 'no-store' });
      imdb = await omdbRes.json();
    } catch {}
  }

  return Response.json({ tmdb, imdb });
}

