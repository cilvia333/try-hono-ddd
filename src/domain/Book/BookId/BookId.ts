import { z } from "zod";

const MAX_LENGTH = 13;
const MIN_LENGTH = 10;

const isbn10Schema = z.string().length(MIN_LENGTH, {
  message: `Must be ${MIN_LENGTH} or ${MAX_LENGTH} characters long`,
});
const isbn13Schema = z
  .string()
  .length(MAX_LENGTH, {
    message: `Must be ${MIN_LENGTH} or ${MAX_LENGTH} characters long`,
  })
  .startsWith("978", { message: "Must starts with 978" });
const schema = z.union([isbn13Schema, isbn10Schema]).brand<"BookId">();

export type BookId = z.infer<typeof schema>;
export type BookIdInput = z.input<typeof schema>;

function build(input: BookIdInput): BookId {
  return schema.parse(input);
}
function safeBuild(
  input: BookIdInput
): z.SafeParseReturnType<BookIdInput, BookId> {
  return schema.safeParse(input);
}

function toISBN(input: BookId): string {
  if (input.length === 10) {
    // ISBNが10桁の場合の、'ISBN' フォーマットに変換します。
    const groupIdentifier = input.substring(0, 1); // 国コードなど（1桁）
    const publisherCode = input.substring(1, 3); // 出版者コード（2桁）
    const bookCode = input.substring(3, 9); // 書籍コード（6桁）
    const checksum = input.substring(9); // チェックディジット（1桁）

    return `ISBN${groupIdentifier}-${publisherCode}-${bookCode}-${checksum}`;
  } else {
    // ISBNが13桁の場合の、'ISBN' フォーマットに変換します。
    const isbnPrefix = input.substring(0, 3); // 最初の3桁 (978 または 979)
    const groupIdentifier = input.substring(3, 4); // 国コードなど（1桁）
    const publisherCode = input.substring(4, 6); // 出版者コード（2桁）
    const bookCode = input.substring(6, 12); // 書籍コード（6桁）
    const checksum = input.substring(12); // チェックディジット（1桁）

    return `ISBN${isbnPrefix}-${groupIdentifier}-${publisherCode}-${bookCode}-${checksum}`;
  }
}

export const BookId = {
  build,
  safeBuild,
  toISBN,
  schema,
} as const;
