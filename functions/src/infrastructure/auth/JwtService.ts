import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

const SECRET = process.env["JWT_SECRET"] ?? "dev-secret-change-in-production";
const EXPIRES_IN = "7d";

export class JwtService {
  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, SECRET) as JwtPayload;
  }
}
