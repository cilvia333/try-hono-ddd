import { describe, test, expect, beforeEach } from "vitest";

import { InMemoryBookRepository } from "@/infrastructure/inMemory/Book/InMemoryBookRepository";
import { InMemoryDB } from "@/types/repository";

import { ISBNDuplicationCheckDomainService } from "./ISBNDuplicationCheckDomainService";
import { BookId } from "./BookId/BookId";
import { Book } from "./Book";
import { Title } from "./Title/Title";
import { Price } from "./Price/Price";

describe("ISBNDuplicationCheckDomainService", () => {
  let db: InMemoryDB<Book> = {};

  beforeEach(() => {
    // テスト前に初期化する
    db = {};
  });

  test("重複がない場合、falseを返す", async () => {
    const isbn = BookId.build("9784167158057");
    const result = await ISBNDuplicationCheckDomainService.execute(
      InMemoryBookRepository,
      db
    )(isbn);
    expect(result).toBeFalsy();
  });

  test("重複がある場合、trueを返す", async () => {
    const isbn = BookId.build("9784167158057");
    const title = Title.build("吾輩は猫である");
    const price = Price.build({
      amount: 770,
      currency: "JPY",
    });
    const book = Book.buildSingle({ bookId: isbn, title, price });

    await InMemoryBookRepository.save(db, book);

    const result = await ISBNDuplicationCheckDomainService.execute(
      InMemoryBookRepository,
      db
    )(isbn);
    expect(result).toBeTruthy();
  });

  test("異なるISBNで重複がない場合、falseを返す", async () => {
    const existingIsbn = BookId.build("9784167158057");
    const newIsbn = BookId.build("9784167158064");
    const title = Title.build("テスト書籍");
    const price = Price.build({ amount: 500, currency: "JPY" });
    const book = Book.buildSingle({ bookId: existingIsbn, title, price });

    await InMemoryBookRepository.save(db, book);

    const result = await ISBNDuplicationCheckDomainService.execute(
      InMemoryBookRepository,
      db
    )(newIsbn);
    expect(result).toBeFalsy();
  });
});
