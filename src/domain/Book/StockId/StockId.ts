import { nanoid } from "nanoid";
import { z } from "zod";

const constants = {
  MIN: 1,
  MAX: 100,
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
  .default(nanoid)
  .brand<"StockId">();

export type StockId = z.infer<typeof schema>;
export type StockIdInput = z.input<typeof schema>;

function build(input?: StockIdInput): StockId {
  return schema.parse(input);
}
function safeBuild(
  input?: StockIdInput
): z.SafeParseReturnType<StockIdInput, StockId> {
  return schema.safeParse(input);
}

export const StockId = {
  build,
  safeBuild,
  schema,
  constants,
} as const;
