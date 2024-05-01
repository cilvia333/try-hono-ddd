import { assertNever, getUnionEnumValues } from "@/util/share";
import { z } from "zod";

export const StatusEnum = {
  InStock: "InStock",
  LowStock: "LowStock",
  OutOfStock: "OutOfStock",
} as const;

const schema = z.enum(getUnionEnumValues(StatusEnum)).brand<"Status">();

export type Status = z.infer<typeof schema>;
export type StatusInput = z.input<typeof schema>;
export type StatusLabel = "在庫あり" | "残りわずか" | "在庫切れ";

function build(input?: StatusInput): Status {
  return schema.parse(input);
}
function safeBuild(
  input?: StatusInput
): z.SafeParseReturnType<StatusInput, Status> {
  return schema.safeParse(input);
}

const toLabel = (status: Status): StatusLabel => {
  switch (status) {
    case StatusEnum.InStock:
      return "在庫あり";
    case StatusEnum.LowStock:
      return "残りわずか";
    case StatusEnum.OutOfStock:
      return "在庫切れ";
    default:
      return assertNever(status);
  }
};

export const Status = {
  build,
  safeBuild,
  schema,
  toLabel,
} as const;
