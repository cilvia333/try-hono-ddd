import { z } from "zod";

//NOTE: nanoid → 21 symbols
const schema = z.string().length(21).brand<"UserId">();

export type UserId = z.infer<typeof schema>;
export type UserIdInput = z.input<typeof schema>;

function build(input: UserIdInput): UserId {
  return schema.parse(input);
}
function safeBuild(
  input: UserIdInput
): z.SafeParseReturnType<UserIdInput, UserId> {
  return schema.safeParse(input);
}

export const UserId = {
  build,
  safeBuild,
  schema,
} as const;
