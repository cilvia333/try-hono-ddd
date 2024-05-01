import { z } from "zod";

const constants = {
  MIN: 0,
  MAX: 1000000,
} as const;

const schema = z
  .number()
  .min(
    constants.MIN,
    `在庫数は${constants.MIN}から${constants.MAX}の間でなければなりません。`
  )
  .max(
    constants.MAX,
    `在庫数は${constants.MIN}から${constants.MAX}の間でなければなりません。`
  )
  .brand<"QuantityAvailable">();

export type QuantityAvailable = z.infer<typeof schema>;
export type QuantityAvailableInput = z.input<typeof schema>;

function build(input: QuantityAvailableInput): QuantityAvailable {
  return schema.parse(input);
}
function safeBuild(
  input: QuantityAvailableInput
): z.SafeParseReturnType<QuantityAvailableInput, QuantityAvailable> {
  return schema.safeParse(input);
}

const increment = (quantityAvailable: QuantityAvailable) => (amount: number) =>
  QuantityAvailable.safeBuild(quantityAvailable + amount);

const decrement = (quantityAvailable: QuantityAvailable) => (amount: number) =>
  QuantityAvailable.safeBuild(quantityAvailable - amount);

export const QuantityAvailable = {
  build,
  safeBuild,
  schema,
  constants,
  increment,
  decrement,
} as const;
