import { describe, test, expect, vi } from "vitest";

import { Book } from "./Book";
import { BookId } from "./BookId/BookId";
import { Title } from "./Title/Title";
import { Price } from "./Price/Price";
import { Stock } from "./Stock/Stock";
import { StockId } from "./Stock/StockId/StockId";
import { QuantityAvailable } from "./Stock/QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "./Stock/Status/Status";

const TEST_ID = "testIdWithExactLength";

// nanoid() をモックする
vi.mock("nanoid", () => ({
  nanoid: () => TEST_ID,
}));

describe("Book", () => {
  const stockId = StockId.build("abc");
  const quantityAvailable = QuantityAvailable.build(100);
  const status = Status.build(StatusEnum.InStock);
  const stock = Stock.reconstruct({ stockId, quantityAvailable, status });

  const bookId = BookId.build("9784167158057");
  const title = Title.build("吾輩は猫である");
  const price = Price.build({
    amount: 770,
    currency: "JPY",
  });

  describe("create", () => {
    test("デフォルト値で在庫を作成する", () => {
      const book = Book.buildSingle({ bookId, title, price });

      expect(book.bookId === bookId).toBeTruthy();
      expect(book.title === title).toBeTruthy();
      expect(book.price).toMatchObject(price);
      expect(book.stock.stockId === StockId.build(TEST_ID)).toBeTruthy();
      expect(
        book.stock.quantityAvailable === QuantityAvailable.build(0)
      ).toBeTruthy();
      expect(
        book.stock.status === Status.build(StatusEnum.OutOfStock)
      ).toBeTruthy();
    });
  });

  describe("delete", () => {
    test("在庫ありの場合はエラーを投げる", () => {
      const book = Book.reconstruct({ bookId, title, price, stock });

      expect(() => Book.delete(book)).toThrow("在庫がある場合削除できません。");
    });

    test("在庫なしの場合はエラーを投げない", () => {
      const stock = Stock.reconstruct({
        stockId,
        quantityAvailable: QuantityAvailable.build(0),
        status: Status.build(StatusEnum.OutOfStock),
      });
      const book = Book.reconstruct({ bookId, title, price, stock });

      expect(() => Book.delete(book)).not.toThrow();
    });
  });

  describe("isSaleable", () => {
    test("在庫あり、在庫数が整数の場合はtrueを返す", () => {
      const book = Book.reconstruct({ bookId, title, price, stock });
      expect(Book.isSaleable(book)()).toBeTruthy();
    });

    test("在庫なし、在庫数0の場合はfalseを返す", () => {
      const stock = Stock.reconstruct({
        stockId,
        quantityAvailable: QuantityAvailable.build(0),
        status: Status.build(StatusEnum.OutOfStock),
      });
      const book = Book.reconstruct({ bookId, title, price, stock });
      expect(Book.isSaleable(book)()).toBeFalsy();
    });
  });

  describe("increaseStock", () => {
    test("stock.increaseQuantityが呼ばれる", () => {
      let book = Book.reconstruct({ bookId, title, price, stock });
      const spy = vi.spyOn(Stock, "increaseQuantity");
      book = Book.increaseStock(book)(10);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("decreaseStock", () => {
    test("stock.decreaseQuantityが呼ばれる", () => {
      let book = Book.reconstruct({ bookId, title, price, stock });
      const spy = vi.spyOn(Stock, "decreaseQuantity");
      book = Book.decreaseStock(book)(10);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("changeTitle", () => {
    test("titleを変更する", () => {
      let book = Book.reconstruct({ bookId, title, price, stock });
      const newTitle = Title.build("坊ちゃん");
      book = Book.changeTitle(book)(newTitle);
      expect(book.title === newTitle).toBeTruthy();
    });
  });

  describe("changePrice", () => {
    test("priceを変更する", () => {
      let book = Book.reconstruct({ bookId, title, price, stock });
      const newPrice = Price.build({
        amount: 880,
        currency: "JPY",
      });
      book = Book.changePrice(book)(newPrice);
      expect(book.price === newPrice).toBeTruthy();
    });
  });
});
