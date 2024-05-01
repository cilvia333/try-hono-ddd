import { z } from "zod";

export function getZodIssueMessages(error: z.ZodError) {
  return error.issues.map((issue) => issue.message);
}
