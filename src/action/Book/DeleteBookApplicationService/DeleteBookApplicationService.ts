import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { IBookRepository } from "@/domain/Book/IBookRepository";

export type DeleteBookCommand = {
  bookId: string;
};

const execute =
  <T>(bookRepository: IBookRepository<T>, db: T) =>
  async (command: DeleteBookCommand): Promise<void> => {
    const res = await bookRepository.find(db, BookId.build(command.bookId));

    if (res.result === "failure" || !res.data) {
      throw new Error("書籍が存在しません");
    }

    let book = res.data;
    Book.delete(book);

    await bookRepository.delete(db, book.bookId as BookId);
  };

export const DeleteBookApplicationService = {
  execute,
} as const;
