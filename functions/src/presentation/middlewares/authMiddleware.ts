import { Request, Response, NextFunction } from "express";
import { JwtService, JwtPayload } from "../../infrastructure/auth/JwtService";
import { UnauthorizedError } from "../../domain/errors/DomainError";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing or invalid authorization header"));
  }

  const token = authHeader.slice(7);

  try {
    req.user = JwtService.verify(token);
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}
