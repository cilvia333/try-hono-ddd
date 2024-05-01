import { describe, test, expect, assert, vi } from "vitest";
import { StockId } from "./StockId";
import { getZodIssueMessages } from "@/util/doamin/test";

const TEST_ID = "testIdWithExactLength";

vi.mock("nanoid", () => ({
  nanoid: () => TEST_ID,
}));

describe("StockId", () => {
  test("デフォルトの値でStockIdを生成する", () => {
    const stockId = StockId.safeBuild();

    assert(stockId.success);
    expect(stockId.data).toBe(TEST_ID);
  });

  test("指定された値でStockIdを生成する", () => {
    const value = "customId";
    const stockId = StockId.safeBuild(value);

    assert(stockId.success);
    expect(stockId.data).toBe(value);
  });

  test("最小長以上の値でStockIdを生成するとエラーを投げる", () => {
    const stockId = StockId.safeBuild("");

    assert(!stockId.success);
    expect(getZodIssueMessages(stockId.error)).toContain(
      `タイトルは${StockId.constants.MIN}文字以上、${StockId.constants.MAX}文字以下でなければなりません。`
    );
  });

  test("最大長以上の値でStockIdを生成するとエラーを投げる", () => {
    const tooLongStockId = "a".repeat(StockId.constants.MAX + 1);
    const stockId = StockId.safeBuild(tooLongStockId);

    assert(!stockId.success);

    expect(getZodIssueMessages(stockId.error)).toContain(
      `タイトルは${StockId.constants.MIN}文字以上、${StockId.constants.MAX}文字以下でなければなりません。`
    );
  });
});
