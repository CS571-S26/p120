// /api/games.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

type IGDBGame = {
  id: number;
  name: string;
  cover?: { url: string };
  total_rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  first_release_date?: number;
  genres?: any[];
  themes?: any[];
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
  const search = req.query.search ? String(req.query.search).trim() : "";
  const genreParam = req.query.genre ? String(req.query.genre) : null;
  const genreFilter = genreParam
    ? (JSON.parse(genreParam) as { field: string; id: number })
    : null;
  const sort = req.query.sort ? String(req.query.sort).trim() : "popular";

  if (id !== undefined && !/^\d+$/.test(String(id))) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const accessToken = process.env.IGDB_ACCESS_TOKEN;

  if (!clientId || !accessToken) {
    console.error("Missing IGDB credentials in environment");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const baseFields = `
    fields id, name, cover.url, total_rating_count, aggregated_rating, rating, first_release_date, genres.name, themes.name, summary;
  `;

  try {
    let body: string;

    // =========================
    // GET SINGLE GAME BY ID
    // =========================
    if (id) {
      body = `
        ${baseFields}
        where id = ${id};
      `;
    } else {
      // =========================
      // SEARCH MODE (NEW LOGIC)
      // =========================
      if (search) {
        // IMPORTANT:
        // - No heavy where filters here (they break search)
        // - Let IGDB return best matches
        body = `
          search "${search.replace(/"/g, "")}";
          ${baseFields}
          limit 24;
          offset ${page * 24};
        `;
      } else {
        // =========================
        // NORMAL BROWSING MODE
        // =========================
        const conditions: string[] = [];
        conditions.push("cover != null");

        if (sort === "rated") {
          conditions.push("aggregated_rating != null");
          conditions.push("aggregated_rating_count >= 7");
        } else if (sort === "recent") {
          conditions.push("first_release_date != null");
          conditions.push(
            "first_release_date < " + Math.floor(Date.now() / 1000)
          );
        } else {
          conditions.push("total_rating_count != null");
        }

        if (genreFilter) {
          conditions.push(genreFilter.field + " = [" + genreFilter.id + "]");
        }

        const whereClause = "where " + conditions.join(" & ") + ";";

        let orderClause = "sort total_rating_count desc;";
        if (sort === "rated") {
          orderClause = "sort aggregated_rating desc;";
        } else if (sort === "az") {
          orderClause = "sort name asc;";
        } else if (sort === "recent") {
          orderClause = "sort first_release_date desc;";
        }

        body = `
          ${baseFields}
          ${whereClause}
          ${orderClause}
          limit 24;
          offset ${page * 24};
        `;
      }
    }

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
        "Content-Type": "text/plain",
      },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("IGDB error:", response.status, text);
      return res.status(502).json({ error: "Failed to fetch from IGDB" });
    }

    let data: IGDBGame[] = await response.json();

    // =========================
    // 🔥 FALLBACK SEARCH (NEW)
    // =========================
    if (search && !id && data.length === 0) {
  const cleaned = search.replace(/"/g, "").toLowerCase();

  // Split into tokens (e.g. ["the", "witcher", "3"])
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  // Remove useless words (optional but helpful)
  const stopWords = ["the", "a", "an", "of", "and"];
  const filteredTokens = tokens.filter(t => !stopWords.includes(t));

  // Build AND query: name ~ *"witcher"* & name ~ *"3"*
  const tokenQuery = filteredTokens
    .map(t => `name ~ *"${t}"*`)
    .join(" & ");

  const fallbackBody = `
    fields id, name, cover.url, total_rating_count, aggregated_rating, first_release_date;
    where ${tokenQuery};
    limit 24;
  `;

  const fallbackResponse = await fetch(
    "https://api.igdb.com/v4/games",
    {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
        "Content-Type": "text/plain",
      },
      body: fallbackBody,
    }
  );

  if (fallbackResponse.ok) {
    data = await fallbackResponse.json();
  }
}
    // =========================
    // NORMALIZE RESPONSE
    // =========================
    if (id) {
      if (!data.length) {
        return res.status(404).json({ error: "Game not found" });
      }

      const game = data[0];
      const normalized = {
        ...game,
        genres: [
          ...(Array.isArray(game.genres)
            ? game.genres.map((g: any) => (typeof g === "object" ? g.name : g))
            : []),
          ...(Array.isArray(game.themes)
            ? game.themes.map((t: any) => (typeof t === "object" ? t.name : t))
            : []),
        ],
      };

      return res.status(200).json(normalized);
    }

    // Merge genres + themes + filter cover CLIENT-SIDE (important)
    const normalized = data
      .map((game: any) => ({
        ...game,
        genres: [
          ...(Array.isArray(game.genres)
            ? game.genres.map((g: any) =>
                typeof g === "object" ? g.name : g
              )
            : []),
          ...(Array.isArray(game.themes)
            ? game.themes.map((t: any) =>
                typeof t === "object" ? t.name : t
              )
            : []),
        ],
      }))
      .filter((game: any) => game.cover);

    return res.status(200).json(normalized);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}