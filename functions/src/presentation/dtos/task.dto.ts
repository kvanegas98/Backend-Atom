import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .max(200, "title must be at most 200 characters"),
  description: z
    .string()
    .max(1000, "description must be at most 1000 characters")
    .default(""),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["pending", "completed"]).optional(),
});

export const GetTasksQuerySchema = z.object({
  limit: z.coerce
    .number({ invalid_type_error: "limit must be a number" })
    .int("limit must be an integer")
    .min(1, "limit must be at least 1")
    .max(100, "limit must be at most 100")
    .optional(),
  cursor: z
    .string()
    .datetime({ message: "cursor must be a valid ISO 8601 date" })
    .optional(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
export type GetTasksQueryDto = z.infer<typeof GetTasksQuerySchema>;
