import { z } from "zod";

import { BookId } from "./BookId/BookId";
import { Price } from "./Price/Price";
import { StatusEnum } from "./Stock/Status/Status";
import { Stock } from "./Stock/Stock";
import { Title } from "./Title/Title";

const schema = z
  .object({
    bookId: BookId.schema.readonly(),
    title: Title.schema,
    price: Price.schema,
    stock: Stock.schema.readonly(),
  })
  .readonly();

export type Book = z.infer<typeof schema>;

/**
 *  functions
 */
type BookBuildInput = { bookId: BookId; title: Title; price: Price };
const buildSingle = ({ bookId, title, price }: BookBuildInput): Book => ({
  bookId: BookId.build(bookId),
  title: Title.build(title),
  price: Price.build(price),
  stock: Stock.buildSingle(),
});

const deleteSingle = (book: Book) => {
  Stock.delete(book.stock);
};

const reconstruct = (input: Book): Book => ({
  bookId: input.bookId,
  title: input.title,
  price: input.price,
  stock: input.stock,
});

const changeTitle =
  (book: Book) =>
  (newTitle: Title): Book => ({
    ...book,
    title: newTitle,
  });

const changePrice =
  (book: Book) =>
  (newPrice: Price): Book => ({
    ...book,
    price: newPrice,
  });

// 販売可能かどうか
const isSaleable = (book: Book) => (): boolean => {
  return (
    book.stock.quantityAvailable > 0 &&
    book.stock.status !== StatusEnum.OutOfStock
  );
};

const increaseStock =
  (book: Book) =>
  (amount: number): Book => ({
    ...book,
    stock: Stock.increaseQuantity(book.stock)(amount),
  });

const decreaseStock =
  (book: Book) =>
  (amount: number): Book => ({
    ...book,
    stock: Stock.decreaseQuantity(book.stock)(amount),
  });

export const Book = {
  buildSingle,
  delete: deleteSingle,
  reconstruct,
  changeTitle,
  changePrice,
  isSaleable,
  increaseStock,
  decreaseStock,
  schema,
} as const;
