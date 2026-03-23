import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { DomainError } from "../../domain/errors/DomainError";
import { logger } from "../../infrastructure/logger/Logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof DomainError) {
    if (error.statusCode >= 500) {
      logger.error({ err: error, method: req.method, url: req.url }, error.message);
    } else {
      logger.warn({ err: error, method: req.method, url: req.url }, error.message);
    }
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    logger.warn({ err: error, method: req.method, url: req.url }, "Validation error");
    res.status(422).json({
      error: "ValidationError",
      message: "Invalid input data",
      details: error.errors,
    });
    return;
  }

  logger.error({ err: error, method: req.method, url: req.url }, "Unhandled error");
  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred",
  });
}
