import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware factory that validates req.body against a Zod schema.
 * On success, replaces req.body with the parsed (and coerced) data.
 * On failure, responds 422 immediately — the request never reaches the controller.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({
        error: "ValidationError",
        message: "Invalid input data",
        details: result.error.errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
}

/**
 * Middleware factory that validates req.query against a Zod schema.
 * On success, replaces req.query with the parsed (and coerced) data.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(422).json({
        error: "ValidationError",
        message: "Invalid query parameters",
        details: result.error.errors,
      });
      return;
    }

    req.query = result.data;
    next();
  };
}
