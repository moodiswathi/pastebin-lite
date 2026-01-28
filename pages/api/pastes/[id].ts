import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";

interface Paste {
  content: string;
  remaining_views: number | null;
  expires_at: number | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Invalid ID" });

  try {
    const paste = await redis.get<Paste>(`paste:${id}`);
    if (!paste) return res.status(404).json({ error: "Paste not found" });

    const now = getNowMs(req);

    if (paste.expires_at && now > paste.expires_at) {
      await redis.del(`paste:${id}`);
      return res.status(404).json({ error: "Paste expired" });
    }

    if (paste.remaining_views !== null) {
      if (paste.remaining_views <= 0) {
        await redis.del(`paste:${id}`);
        return res.status(404).json({ error: "View limit reached" });
      }
      paste.remaining_views -= 1;
      if (paste.remaining_views === 0) await redis.del(`paste:${id}`);
      else await redis.set(`paste:${id}`, paste);
    }

    return res.status(200).json(paste);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}