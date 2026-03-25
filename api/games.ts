type VercelRequest = {
  query: { page?: string };
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
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const page = Number(req.query.page) || 0;

  try {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        "Authorization": `Bearer ${process.env.IGDB_ACCESS_TOKEN!}`,
        "Accept": "application/json",
      },
      body: `
        fields id, name, cover.url, total_rating_count;
        where total_rating_count != null;
        sort total_rating_count desc;
        limit 20;
        offset ${page * 20};
      `,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("IGDB error:", text);
      return res.status(500).json({ error: "Failed to fetch IGDB" });
    }

    const data: IGDBGame[] = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}