import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await redis.ping();
    if (response === "PONG" || response === "OK") {
      return res.status(200).json({ ok: true });
    }
    throw new Error();
  } catch {
    return res.status(500).json({ ok: false });
  }
}