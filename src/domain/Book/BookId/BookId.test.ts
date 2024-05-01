import { describe, test, expect, assert } from "vitest";

import { BookId } from "./BookId";
import { getZodIssueMessages } from "@/util/doamin/test";

describe("BookId", () => {
  // 正常系
  test("有効なフォーマットの場合正しい変換結果を期待", () => {
    assert(BookId.safeBuild("9784167158057").success);
    assert(BookId.safeBuild("4167158051").success);
  });

  test("equals", () => {
    const bookId1 = BookId.build("9784167158057");
    const bookId2 = BookId.build("9784167158057");
    const bookId3 = BookId.build("9781234567890");
    expect(bookId1 === bookId2).toBeTruthy();
    expect(bookId1 === bookId3).toBeFalsy();
  });

  test("toISBN() 13桁", () => {
    const bookId = BookId.safeBuild("9784167158057");
    assert(bookId.success);
    expect(BookId.toISBN(bookId.data)).toBe("ISBN978-4-16-715805-7");
  });
  test("toISBN() 10桁", () => {
    const bookId = BookId.safeBuild("4167158051");
    assert(bookId.success);
    expect(BookId.toISBN(bookId.data)).toBe("ISBN4-16-715805-1");
  });

  // 異常系
  test("不正な文字数の場合にエラーを投げる", () => {
    // 境界値のテスト
    const maxBookId = BookId.safeBuild("1".repeat(101));
    assert(!maxBookId.success);
    expect(maxBookId.error.issues.map((issue) => issue.message)).toContain(
      "Must be 10 or 13 characters long"
    );

    const minBookId = BookId.safeBuild("1".repeat(9));
    assert(!minBookId.success);
    expect(getZodIssueMessages(minBookId.error)).toContain(
      "Must be 10 or 13 characters long"
    );
  });
  test("不正なフォーマットの場合にエラーを投げる", () => {
    const bookId = BookId.safeBuild("9994167158057");
    assert(!bookId.success);
    expect(getZodIssueMessages(bookId.error)).toContain("Must starts with 978");
  });
});
