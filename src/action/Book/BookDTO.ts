import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { Status, StatusLabel } from "@/domain/Book/Stock/Status/Status";
import { StockId } from "@/domain/Book/Stock/StockId/StockId";

type BookDTOConvertResponse = {
  readonly bookId: string;
  readonly title: string;
  readonly price: number;
  readonly stockId: string;
  readonly quantityAvailable: number;
  readonly status: StatusLabel;
};

const convert = (book: Book): BookDTOConvertResponse => {
  return {
    bookId: book.bookId as BookId,
    title: book.title,
    price: book.price.amount,
    stockId: book.stock.stockId as StockId,
    quantityAvailable: book.stock.quantityAvailable,
    status: Status.toLabel(book.stock.status),
  } as const;
};

export const BookDTO = {
  convert,
} as const;
