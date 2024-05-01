import { describe, test, expect, assert, vi } from "vitest";

import { getZodIssueMessages } from "@/util/doamin/test";

import { Stock } from "./Stock";
import { QuantityAvailable } from "./QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "./Status/Status";
import { StockId } from "./StockId/StockId";

const TEST_ID = "testIdWithExactLength";

vi.mock("nanoid", () => ({
  nanoid: () => TEST_ID,
}));

describe("Stock", () => {
  const stockId = StockId.build("abc");
  const quantityAvailable = QuantityAvailable.build(100);
  const status = Status.build(StatusEnum.InStock);

  describe("create", () => {
    test("デフォルト値で在庫を作成する", () => {
      const stock = Stock.buildSingle();

      expect(
        stock.stockId === StockId.build("testIdWithExactLength")
      ).toBeTruthy();
      expect(
        stock.quantityAvailable === QuantityAvailable.build(0)
      ).toBeTruthy();
      expect(stock.status === Status.build(StatusEnum.OutOfStock)).toBeTruthy();
    });
  });

  describe("delete", () => {
    test("在庫ありの場合はエラーを投げる", () => {
      const stock = Stock.reconstruct({ stockId, quantityAvailable, status });

      expect(() => Stock.delete(stock)).toThrow(
        "在庫がある場合削除できません。"
      );
    });

    test("在庫なしなしの場合はエラーを投げない", () => {
      const notOnSaleStatus = Status.build(StatusEnum.OutOfStock);
      const stock = Stock.reconstruct({
        stockId,
        quantityAvailable,
        status: notOnSaleStatus,
      });

      expect(() => Stock.delete(stock)).not.toThrow();
    });
  });

  describe("increaseQuantity", () => {
    test("在庫数を増やす", () => {
      let stock = Stock.reconstruct({ stockId, quantityAvailable, status });
      stock = Stock.increaseQuantity(stock)(5);

      expect(
        stock.quantityAvailable === QuantityAvailable.build(105)
      ).toBeTruthy();
    });

    test("増加量が負の数の場合はエラーを投げる", () => {
      const stock = Stock.reconstruct({ stockId, quantityAvailable, status });

      expect(() => Stock.increaseQuantity(stock)(-1)).toThrow(
        "増加量は0以上でなければなりません。"
      );
    });
  });

  describe("decreaseQuantity", () => {
    test("在庫数を減らす", () => {
      let stock = Stock.reconstruct({ stockId, quantityAvailable, status });
      stock = Stock.decreaseQuantity(stock)(5);

      expect(
        stock.quantityAvailable === QuantityAvailable.build(95)
      ).toBeTruthy();
    });

    test("減少量が負の数の場合はエラーを投げる", () => {
      const stock = Stock.reconstruct({ stockId, quantityAvailable, status });

      expect(() => Stock.decreaseQuantity(stock)(-1)).toThrow(
        "減少量は0以上でなければなりません。"
      );
    });

    test("減少後の在庫数が0未満になる場合はエラーを投げる", () => {
      const stock = Stock.reconstruct({ stockId, quantityAvailable, status });

      expect(() => Stock.decreaseQuantity(stock)(101)).toThrow();
    });

    test("在庫数が0になったらステータスを在庫切れにする", () => {
      let stock = Stock.reconstruct({ stockId, quantityAvailable, status });
      stock = Stock.decreaseQuantity(stock)(100);

      expect(
        stock.quantityAvailable === QuantityAvailable.build(0)
      ).toBeTruthy();
      expect(stock.status === Status.build(StatusEnum.OutOfStock)).toBeTruthy();
    });

    test("在庫数が10以下になったらステータスを残りわずかにする", () => {
      let stock = Stock.reconstruct({ stockId, quantityAvailable, status });
      stock = Stock.decreaseQuantity(stock)(90);

      expect(
        stock.quantityAvailable === QuantityAvailable.build(10)
      ).toBeTruthy();
      expect(stock.status === Status.build(StatusEnum.LowStock)).toBeTruthy();
    });
  });
});
