import cors from "cors";

const rawOrigins = process.env["ALLOWED_ORIGINS"];
const allowedOrigins = rawOrigins
  ? rawOrigins.split(",").map((o) => o.trim())
  : ["*"];

const allowAll = allowedOrigins.includes("*");

export const corsMiddleware = cors({
  origin: allowAll
    ? true
    : (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS policy`));
        }
      },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
