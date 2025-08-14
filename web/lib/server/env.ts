export const getEnv = () => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN; // v4 bearer
  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  return { TMDB_API_KEY, TMDB_ACCESS_TOKEN, OMDB_API_KEY };
};

export const getAuthHeaders = () => {
  const { TMDB_ACCESS_TOKEN } = getEnv();
  if (!TMDB_ACCESS_TOKEN) return {} as Record<string, string>;
  return {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  } as Record<string, string>;
};

