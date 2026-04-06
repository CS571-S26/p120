// /api/games.ts
type VercelRequest = {
  query: { page?: string; id?: string };
  body?: any;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: any) => void;
};

type IGDBGame = {
  id: number;
  name: string;
  cover?: { url: string };
  total_rating_count?: number;
  aggregated_rating?: number;
  first_release_date?: number;
  genres?: string[];
  summary?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const page = Number(req.query.page) || 0;
  const id = req.query.id;

  try {
    let body: string;

    if (id) {
      // Fetch single game by ID
      body = `
        fields id, name, cover.url, total_rating_count, aggregated_rating, first_release_date, genres, summary;
        where id = ${id};
      `;
    } else {
      // Fetch paginated list
      body = `
        fields id, name, cover.url, total_rating_count, aggregated_rating, first_release_date, genres;
        where total_rating_count != null;
        sort total_rating_count desc;
        limit 20;
        offset ${page * 20};
      `;
    }

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        "Authorization": `Bearer ${process.env.IGDB_ACCESS_TOKEN!}`,
        "Accept": "application/json",
      },
      body,
    });
    

    if (!response.ok) {
      const text = await response.text();
      console.error("IGDB error:", text);
      return res.status(500).json({ error: "Failed to fetch IGDB" });
    }

    const data: IGDBGame[] = await response.json();

    if (id) {
      // Return single game object
      return res.status(200).json(data[0] || null);
    } else {
      // Return paginated list
      return res.status(200).json(data);
    }
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}