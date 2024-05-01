import { z } from "zod";

const constants = {
  MIN: 1,
  MAX: 1000,
} as const;

const schema = z
  .string()
  .min(
    constants.MIN,
    `タイトルは${constants.MIN}文字以上、${constants.MAX}文字以下でなければなりません。`
  )
  .max(
    constants.MAX,
    `タイトルは${constants.MIN}文字以上、${constants.MAX}文字以下でなければなりません。`
  )
  .brand<"Title">();

export type Title = z.infer<typeof schema>;
export type TitleInput = z.input<typeof schema>;

function build(input: TitleInput): Title {
  return schema.parse(input);
}
function safeBuild(
  input: TitleInput
): z.SafeParseReturnType<TitleInput, Title> {
  return schema.safeParse(input);
}

export const Title = {
  build,
  safeBuild,
  schema,
  constants,
} as const;
