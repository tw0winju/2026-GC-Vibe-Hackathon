import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  userId: number;
}

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
  } as SignOptions);

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  } as SignOptions);

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
