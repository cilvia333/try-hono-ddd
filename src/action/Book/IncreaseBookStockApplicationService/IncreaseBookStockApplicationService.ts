import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { IBookRepository } from "@/domain/Book/IBookRepository";

export type IncreaseBookStockCommand = {
  bookId: string;
  incrementAmount: number;
};

const execute =
  <T>(bookRepository: IBookRepository<T>, db: T) =>
  async (command: IncreaseBookStockCommand): Promise<void> => {
    const res = await bookRepository.find(db, BookId.build(command.bookId));

    if (res.result === "failure" || !res.data) {
      throw new Error("書籍が存在しません");
    }

    let book = res.data;
    book = Book.increaseStock(book)(command.incrementAmount);

    await bookRepository.save(db, book);
  };

export const IncreaseBookStockApplicationService = {
  execute,
} as const;
