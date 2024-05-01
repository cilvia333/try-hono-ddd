import { describe, test, expect, assert } from "vitest";
import { Price } from "./Price";
import { getZodIssueMessages } from "@/util/doamin/test";

describe("Price", () => {
  // 正常系
  test("正しい値と通貨コードJPYで有効なPriceを作成する", () => {
    const validAmount = 500;
    const price = Price.safeBuild({ amount: validAmount, currency: "JPY" });
    assert(price.success);
    expect(price.data.amount).toBe(validAmount);
    expect(price.data.currency).toBe("JPY");
  });

  // 異常系
  test("MIN未満の値でPriceを生成するとエラーを投げる", () => {
    const lessThanMin = Price.constants.MIN - 1;
    const price = Price.safeBuild({ amount: lessThanMin, currency: "JPY" });

    assert(!price.success);
    expect(getZodIssueMessages(price.error)).toContain(
      `価格は${Price.constants.MIN}円から${Price.constants.MAX}円の間でなければなりません。`
    );
  });

  test("MAX超の値でPriceを生成するとエラーを投げる", () => {
    const moreThanMax = Price.constants.MAX + 1;
    const price = Price.safeBuild({ amount: moreThanMax, currency: "JPY" });

    assert(!price.success);
    expect(getZodIssueMessages(price.error)).toContain(
      `価格は${Price.constants.MIN}円から${Price.constants.MAX}円の間でなければなりません。`
    );
  });
});
