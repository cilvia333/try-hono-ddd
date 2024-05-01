import { z } from "zod";

const constants = {
  MIN: 1,
  MAX: 1000000,
} as const;

const schema = z.object({
  amount: z
    .number()
    .int()
    .min(
      constants.MIN,
      `価格は${constants.MIN}円から${constants.MAX}円の間でなければなりません。`
    )
    .max(
      constants.MAX,
      `価格は${constants.MIN}円から${constants.MAX}円の間でなければなりません。`
    )
    .brand<"PriceAmount">(),
  currency: z.enum(["JPY"]).brand<"PriceCurrency">(), // USD などの通貨を追加する場合はここに追加します
});

export type Price = z.infer<typeof schema>;
export type PriceInput = z.input<typeof schema>;

function build(input: PriceInput): Price {
  return schema.parse(input);
}
function safeBuild(
  input: PriceInput
): z.SafeParseReturnType<PriceInput, Price> {
  return schema.safeParse(input);
}

export const Price = {
  build,
  safeBuild,
  schema,
  constants,
} as const;
