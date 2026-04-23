// /api/games.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const page = Math.max(0, Number(req.query.page) || 0);
  const id = req.query.id;

  // Validate id to prevent injection
  if (id !== undefined && !/^\d+$/.test(String(id))) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const accessToken = process.env.IGDB_ACCESS_TOKEN;

  if (!clientId || !accessToken) {
    console.error("Missing IGDB credentials in environment");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    let body: string;

    if (id) {
      body = `
        fields id, name, cover.url, total_rating_count, aggregated_rating, first_release_date, genres, summary;
        where id = ${id};
      `;
    } else {
      body = `
        fields id, name, cover.url, total_rating_count, aggregated_rating, first_release_date, genres;
        where total_rating_count != null;
        sort total_rating_count desc;
        limit 24;
        offset ${page * 24};
      `;
    }

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Content-Type": "text/plain",
      },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("IGDB error:", response.status, text);
      return res.status(502).json({ error: "Failed to fetch from IGDB" });
    }

    const data: IGDBGame[] = await response.json();

    if (id) {
      if (!data.length) {
        return res.status(404).json({ error: "Game not found" });
      }
      return res.status(200).json(data[0]);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}