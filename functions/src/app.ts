import express from "express";
import pinoHttp from "pino-http";
import { corsMiddleware } from "./presentation/middlewares/corsMiddleware";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import taskRoutes from "./presentation/routes/taskRoutes";
import userRoutes from "./presentation/routes/userRoutes";
import { logger } from "./infrastructure/logger/Logger";

export function createApp(): express.Application {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/tasks", taskRoutes);
  app.use("/users", userRoutes);

  // El error handler debe ir después de las rutas (Express lo identifica por tener 4 parámetros)
  app.use(errorHandler);

  return app;
}
