import { describe, test, expect, beforeEach, assert } from "vitest";

import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { InMemoryBookRepository } from "@/infrastructure/inMemory/Book/InMemoryBookRepository";
import { bookTestDataCreator } from "@/infrastructure/shared/Book/bookTestDataCreator";
import { InMemoryDB } from "@/types/repository";

import {
  RegisterBookApplicationService,
  RegisterBookCommand,
} from "./RegisterBookApplicationService";

describe("RegisterBookApplicationService", () => {
  test("重複書籍が存在しない場合書籍が正常に作成できる", async () => {
    const command: Required<RegisterBookCommand> = {
      isbn: "9784167158057",
      title: "吾輩は猫である",
      priceAmount: 770,
    };
    const db: InMemoryDB<Book> = {};

    await RegisterBookApplicationService.execute(
      InMemoryBookRepository,
      db
    )(command);

    const createdBook = await InMemoryBookRepository.find(
      db,
      BookId.build(command.isbn)
    );
    assert(createdBook.result === "success");
    expect(createdBook.data).not.toBeNull();
  });

  test("重複書籍が存在する場合エラーを投げる", async () => {
    const db: InMemoryDB<Book> = {};

    // 重複させるデータを準備
    const bookID = "9784167158057";
    await bookTestDataCreator(
      db,
      InMemoryBookRepository
    )({
      bookId: bookID,
    });

    const command: Required<RegisterBookCommand> = {
      isbn: bookID,
      title: "吾輩は猫である",
      priceAmount: 770,
    };
    await expect(
      RegisterBookApplicationService.execute(
        InMemoryBookRepository,
        db
      )(command)
    ).rejects.toThrow();
  });
});
