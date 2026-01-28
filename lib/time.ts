import type { NextApiRequest } from "next";

export function getNowMs(req?: NextApiRequest): number {
  if (process.env.TEST_MODE === "1" && req) {
    const testNow = req.headers["x-test-now-ms"];
    if (testNow) return parseInt(testNow as string, 10);
  }
  return Date.now();
}
