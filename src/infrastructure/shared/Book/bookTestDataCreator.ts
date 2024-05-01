import { Book } from "@/domain/Book/Book";
import { BookId } from "@/domain/Book/BookId/BookId";
import { IBookRepository } from "@/domain/Book/IBookRepository";
import { Price } from "@/domain/Book/Price/Price";
import { QuantityAvailable } from "@/domain/Book/Stock/QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "@/domain/Book/Stock/Status/Status";
import { Stock } from "@/domain/Book/Stock/Stock";
import { StockId } from "@/domain/Book/Stock/StockId/StockId";
import { Title } from "@/domain/Book/Title/Title";

export const bookTestDataCreator =
  <T>(db: T, repository: IBookRepository<T>) =>
  async ({
    bookId = "9784167158057",
    title = "吾輩は猫である",
    priceAmount = 770,
    stockId = "test-stock-id",
    quantityAvailable = 0,
    status = StatusEnum.OutOfStock,
  }): Promise<Book> => {
    const entity = Book.reconstruct({
      bookId: BookId.build(bookId),
      title: Title.build(title),
      price: Price.build({ amount: priceAmount, currency: "JPY" }),
      stock: Stock.reconstruct({
        stockId: StockId.build(stockId),
        quantityAvailable: QuantityAvailable.build(quantityAvailable),
        status: Status.build(status),
      }),
    });

    await repository.save(db, entity);

    return entity;
  };
