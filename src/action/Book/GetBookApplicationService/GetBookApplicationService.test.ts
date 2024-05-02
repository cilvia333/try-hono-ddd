import { describe, test, expect } from "vitest";

import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { InMemoryBookRepository } from "@/infrastructure/inMemory/Book/InMemoryBookRepository";
import { bookTestDataCreator } from "@/infrastructure/shared/Book/bookTestDataCreator";
import { InMemoryDB } from "@/types/repository";

import { GetBookApplicationService } from "./GetBookApplicationService";
import { BookDTO } from "../BookDTO";

describe("GetBookApplicationService", () => {
  test("指定されたIDの書籍が存在する場合、DTOに詰め替えられ、取得できる", async () => {
    const db: InMemoryDB<Book> = {};

    // テスト用データ作成
    const createdBook = await bookTestDataCreator(
      db,
      InMemoryBookRepository
    )({});

    const data = await GetBookApplicationService.execute(
      InMemoryBookRepository,
      db
    )(createdBook.bookId as BookId);

    expect(data).toEqual(BookDTO.convert(createdBook));
  });

  test("指定されたIDの書籍が存在しない場合、nullが取得できる", async () => {
    const db: InMemoryDB<Book> = {};

    const data = await GetBookApplicationService.execute(
      InMemoryBookRepository,
      db
    )("9784167158057");

    expect(data).toBeNull();
  });
});
