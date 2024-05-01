import type { Book } from "@/domain/Book/Book";
import type { BookId } from "@/domain/Book/BookId/BookId";
import type { IBookRepository } from "@/domain/Book/IBookRepository";
import type { InMemoryDB } from "@/types/repository";

const save: IBookRepository.Save<InMemoryDB<Book>> = async (db, book) => {
  const index = book.bookId as BookId;
  db[index] = book;
  return {
    result: "success",
    data: undefined,
  };
};

const deleteSingle: IBookRepository.Delete<InMemoryDB<Book>> = async (
  db,
  bookId
) => {
  delete db[bookId];
  return {
    result: "success",
    data: undefined,
  };
};

const find: IBookRepository.Find<InMemoryDB<Book>> = async (db, bookId) => {
  const book = Object.entries(db).find(([id]) => {
    return bookId === id;
  });

  return {
    result: "success",
    data: book ? book[1] : null,
  };
};

export const InMemoryBookRepository = {
  save,
  delete: deleteSingle,
  find,
} as const;
