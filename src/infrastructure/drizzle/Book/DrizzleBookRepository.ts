import { eq } from "drizzle-orm";

import type { IBookRepository } from "@/domain/Book/IBookRepository";
import { BookId } from "@/domain/Book/BookId/BookId";
import { StockId } from "@/domain/Book/Stock/StockId/StockId";
import { Book } from "@/domain/Book/Book";
import { Title } from "@/domain/Book/Title/Title";
import { Price } from "@/domain/Book/Price/Price";
import { Stock } from "@/domain/Book/Stock/Stock";
import { QuantityAvailable } from "@/domain/Book/Stock/QuantityAvailable/QuantityAvailable";
import { Status } from "@/domain/Book/Stock/Status/Status";
import type { DrizzleD1DatabaseWithSchema } from "@/types/repository";

import { stocks, books } from "../schema";

const save: IBookRepository.Save<DrizzleD1DatabaseWithSchema> = async (
  db,
  book
) => {
  try {
    await db.batch([
      db
        .insert(books)
        .values({
          bookId: book.bookId as BookId,
          title: book.title,
          priceAmount: book.price.amount,
        })
        .onConflictDoUpdate({
          target: books.bookId,
          set: {
            title: book.title,
            priceAmount: book.price.amount,
          },
        }),
      db
        .insert(stocks)
        .values({
          stockId: book.stock.stockId as StockId,
          bookId: book.bookId as BookId,
          quantityAvailable: book.stock.quantityAvailable,
          status: book.stock.status,
        })
        .onConflictDoUpdate({
          target: stocks.stockId,
          set: {
            bookId: book.bookId as BookId,
            quantityAvailable: book.stock.quantityAvailable,
            status: book.stock.status,
          },
        }),
    ]);

    return {
      result: "success",
      data: undefined,
    };
  } catch (e: unknown) {
    return {
      result: "failure",
      error: "Failure insert or update book",
    };
  }
};

const deleteSingle: IBookRepository.Delete<
  DrizzleD1DatabaseWithSchema
> = async (db, bookId) => {
  try {
    await db.delete(books).where(eq(books.bookId, bookId));

    return {
      result: "success",
      data: undefined,
    };
  } catch (e: unknown) {
    return {
      result: "failure",
      error: "Failure delete book",
    };
  }
};

const find: IBookRepository.Find<DrizzleD1DatabaseWithSchema> = async (
  db,
  bookId
) => {
  try {
    const data = await db.query.books.findFirst({
      where: eq(books.bookId, bookId),
      with: {
        stocks: true,
      },
    });

    return {
      result: "success",
      data:
        data && data.stocks
          ? Book.reconstruct({
              bookId: BookId.build(data.bookId),
              title: Title.build(data.title),
              price: Price.build({ amount: data.priceAmount, currency: "JPY" }),
              stock: Stock.reconstruct({
                stockId: StockId.build(data.stocks.stockId),
                quantityAvailable: QuantityAvailable.build(
                  data.stocks?.quantityAvailable
                ),
                status: Status.build(data.stocks.status),
              }),
            })
          : null,
    };
  } catch (e: unknown) {
    return {
      result: "failure",
      error: "Failure find book",
    };
  }
};

export const DrizzleBookRepository = {
  save,
  delete: deleteSingle,
  find,
} as const;
