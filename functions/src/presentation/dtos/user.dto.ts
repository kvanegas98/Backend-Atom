import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
