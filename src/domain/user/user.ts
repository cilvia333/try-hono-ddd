import { z } from "zod";

import { UserId } from "./userId";

const schema = z.object({
  id: UserId.schema,
  displayId: z.string(),
  name: z.string(),
  email: z.string(),
});

export type User = Readonly<z.infer<typeof schema>>;
export type UserInput = z.input<typeof schema>;

function buildSingle(input: UserInput): User {
  return schema.parse(input);
}

export const User = {
  schema,
  buildSingle,
} as const;
