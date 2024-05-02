import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { IBookRepository } from "@/domain/Book/IBookRepository";
import { ISBNDuplicationCheckDomainService } from "@/domain/Book/ISBNDuplicationCheckDomainService";
import { Price } from "@/domain/Book/Price/Price";
import { Title } from "@/domain/Book/Title/Title";

export type RegisterBookCommand = {
  isbn: string;
  title: string;
  priceAmount: number;
};

const execute =
  <T>(bookRepository: IBookRepository<T>, db: T) =>
  async (command: RegisterBookCommand) => {
    const isDuplicateISBN = await ISBNDuplicationCheckDomainService.execute(
      bookRepository,
      db
    )(BookId.build(command.isbn));

    if (isDuplicateISBN) {
      throw new Error("既に存在する書籍です");
    }

    const book = Book.buildSingle({
      bookId: BookId.build(command.isbn),
      title: Title.build(command.title),
      price: Price.build({ amount: command.priceAmount, currency: "JPY" }),
    });
    const res = await bookRepository.save(db, book);

    if (res.result === "failure") {
      throw new Error("Bookの保存に失敗しました。");
    }
  };

export const RegisterBookApplicationService = {
  execute,
} as const;
