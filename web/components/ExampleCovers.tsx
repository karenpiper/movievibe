import { useEffect, useState } from 'react';

type ExampleCoversProps = {
  titles: string[];
};

type Cover = {
  title: string;
  posterPath?: string;
};

export default function ExampleCovers({ titles }: ExampleCoversProps) {
  const [covers, setCovers] = useState<Cover[]>([]);

  useEffect(() => {
    let aborted = false;
    (async () => {
      const results: Cover[] = [];
      for (const title of titles.slice(0, 3)) {
        try {
          const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(title)}`);
          const data = await res.json();
          const first = Array.isArray(data.results) ? data.results[0] : undefined;
          results.push({ title, posterPath: first?.poster_path });
        } catch {
          results.push({ title });
        }
      }
      if (!aborted) setCovers(results);
    })();
    return () => {
      aborted = true;
    };
  }, [titles.join('|')]);

  if (covers.length === 0) return null;

  return (
    <div className="flex justify-center gap-3">
      {covers.map((c) => (
        <div key={c.title} className="w-16">
          {c.posterPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={c.title}
              src={`https://image.tmdb.org/t/p/w154${c.posterPath}`}
              className="w-16 h-24 object-cover rounded-md shadow"
            />
          ) : (
            <div className="w-16 h-24 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
              {c.title}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

