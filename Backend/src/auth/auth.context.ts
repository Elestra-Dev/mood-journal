import { Request } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtUser } from "./auth.types";

export function getUserFromReq(req: Request): JwtUser | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtUser;
  } catch {
    return null;
  }
}
