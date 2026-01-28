import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import { getNowMs } from "@/lib/time";

type Paste = {
  content: string;
  remaining_views: number | null;
  expires_at: number | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "Paste API is running." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }

  const id = uuidv4();
  const now = getNowMs(req);

  const pasteData: Paste = {
    content,
    remaining_views: max_views ? parseInt(max_views, 10) : null,
    expires_at: ttl_seconds ? now + parseInt(ttl_seconds, 10) * 1000 : null,
  };

  // Do NOT use JSON.stringify here
  await redis.set(`paste:${id}`, pasteData);

  const baseUrl = process.env.APP_URL || `http://${req.headers.host}`;
  return res.status(201).json({ id, url: `${baseUrl}/p/${id}` });
}