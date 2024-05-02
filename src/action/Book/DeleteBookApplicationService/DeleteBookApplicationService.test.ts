import { describe, test, expect, beforeEach, assert } from "vitest";

import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { InMemoryBookRepository } from "@/infrastructure/inMemory/Book/InMemoryBookRepository";
import { bookTestDataCreator } from "@/infrastructure/shared/Book/bookTestDataCreator";
import { InMemoryDB } from "@/types/repository";

import {
  DeleteBookApplicationService,
  DeleteBookCommand,
} from "./DeleteBookApplicationService";

describe("DeleteBookApplicationService", () => {
  test("書籍を削除することができる", async () => {
    const db: InMemoryDB<Book> = {};

    // テスト用データ作成
    const bookId = "9784167158057";
    await bookTestDataCreator(
      db,
      InMemoryBookRepository
    )({
      bookId,
    });

    const command: Required<DeleteBookCommand> = { bookId };
    await DeleteBookApplicationService.execute(
      InMemoryBookRepository,
      db
    )(command);

    const deletedBook = await InMemoryBookRepository.find(
      db,
      BookId.build(bookId)
    );

    assert(deletedBook.result === "success");
    expect(deletedBook.data).toBe(null);
  });
});
