import { BookId } from "@/domain/Book/BookId/BookId";
import { IBookRepository } from "@/domain/Book/IBookRepository";
import { BookDTO } from "../BookDTO";

const execute =
  <T>(bookRepository: IBookRepository<T>, db: T) =>
  async (isbn: string) => {
    const res = await bookRepository.find(db, BookId.build(isbn));

    if (res.result === "failure") {
      throw new Error("Bookの取得に失敗しました。");
    }

    return res.data ? BookDTO.convert(res.data) : null;
  };

export const GetBookApplicationService = {
  execute,
} as const;
