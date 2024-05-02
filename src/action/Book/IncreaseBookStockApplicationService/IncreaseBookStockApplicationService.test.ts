import { describe, test, expect, beforeEach, assert } from "vitest";

import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { InMemoryBookRepository } from "@/infrastructure/inMemory/Book/InMemoryBookRepository";
import { bookTestDataCreator } from "@/infrastructure/shared/Book/bookTestDataCreator";
import { InMemoryDB } from "@/types/repository";

import {
  IncreaseBookStockApplicationService,
  IncreaseBookStockCommand,
} from "./IncreaseBookStockApplicationService";

describe("IncreaseBookStockApplicationService", () => {
  test("書籍の在庫を増加することができる", async () => {
    const db: InMemoryDB<Book> = {};

    // テスト用データ準備
    const bookId = "9784167158057";
    await bookTestDataCreator(
      db,
      InMemoryBookRepository
    )({
      bookId,
      quantityAvailable: 0,
    });

    const incrementAmount = 100;
    const command: Required<IncreaseBookStockCommand> = {
      bookId,
      incrementAmount,
    };

    await IncreaseBookStockApplicationService.execute(
      InMemoryBookRepository,
      db
    )(command);

    const updatedBook = await InMemoryBookRepository.find(
      db,
      BookId.build(bookId)
    );
    assert(updatedBook.result === "success");
    expect(updatedBook.data?.stock.quantityAvailable).toBe(incrementAmount);
  });

  test("書籍が存在しない場合エラーを投げる", async () => {
    const db: InMemoryDB<Book> = {};

    const bookId = "9784167158057";
    const incrementAmount = 100;
    const command: Required<IncreaseBookStockCommand> = {
      bookId,
      incrementAmount,
    };
    await expect(
      IncreaseBookStockApplicationService.execute(
        InMemoryBookRepository,
        db
      )(command)
    ).rejects.toThrow();
  });
});
