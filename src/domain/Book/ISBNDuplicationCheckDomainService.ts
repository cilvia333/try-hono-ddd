import type { BookId } from "./BookId/BookId";
import type { IBookRepository } from "./IBookRepository";

const execute =
  <T>(bookRepository: IBookRepository<T>, db: T) =>
  async (isbn: BookId): Promise<boolean> => {
    const duplicateISBNBook = await bookRepository.find(db, isbn);

    if (duplicateISBNBook.result === "failure") {
      throw new Error("Failed to connect to db");
    }

    const isDuplicateISBN = !!duplicateISBNBook.data;

    return isDuplicateISBN;
  };

export const ISBNDuplicationCheckDomainService = {
  execute,
} as const;
