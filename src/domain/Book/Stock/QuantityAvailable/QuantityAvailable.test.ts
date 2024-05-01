import { describe, test, expect, assert } from "vitest";
import { getZodIssueMessages } from "@/util/doamin/test";
import { QuantityAvailable } from "./QuantityAvailable";

describe("QuantityAvailable", () => {
  test("許容される範囲内の在庫数を設定できる", () => {
    const validQuantityAvailable = 500;
    const quantity = QuantityAvailable.safeBuild(validQuantityAvailable);

    assert(quantity.success);
    expect(quantity.data).toBe(validQuantityAvailable);
  });

  test("MIN未満の値でQuantityAvailableを生成するとエラーを投げる", () => {
    const lessThanMin = QuantityAvailable.constants.MIN - 1;
    const quantity = QuantityAvailable.safeBuild(lessThanMin);

    assert(!quantity.success);
    expect(getZodIssueMessages(quantity.error)).toContain(
      `在庫数は${QuantityAvailable.constants.MIN}から${QuantityAvailable.constants.MAX}の間でなければなりません。`
    );
  });

  test("MAX超の値でQuantityAvailableを生成するとエラーを投げる", () => {
    const moreThanMax = QuantityAvailable.constants.MAX + 1;
    const quantity = QuantityAvailable.safeBuild(moreThanMax);

    assert(!quantity.success);
    expect(getZodIssueMessages(quantity.error)).toContain(
      `在庫数は${QuantityAvailable.constants.MIN}から${QuantityAvailable.constants.MAX}の間でなければなりません。`
    );
  });

  describe("increment", () => {
    test("正の数を加算すると、在庫数が増加する", () => {
      const initialQuantity = QuantityAvailable.safeBuild(10);
      assert(initialQuantity.success);

      const incrementAmount = 5;
      const newQuantity = QuantityAvailable.increment(initialQuantity.data)(
        incrementAmount
      );

      expect(newQuantity);
      expect(newQuantity.data).toBe(15);
    });

    test("最大値を超える加算を試みるとエラーが発生する", () => {
      const initialQuantity = QuantityAvailable.safeBuild(
        QuantityAvailable.constants.MAX
      );
      assert(initialQuantity.success);

      const incrementAmount = 1;
      const newQuantity = QuantityAvailable.increment(initialQuantity.data)(
        incrementAmount
      );

      assert(!newQuantity.success);
      expect(getZodIssueMessages(newQuantity.error)).contain(
        `在庫数は${QuantityAvailable.constants.MIN}から${QuantityAvailable.constants.MAX}の間でなければなりません。`
      );
    });
  });

  describe("decrement", () => {
    test("正の数を減算すると、在庫数が減少する", () => {
      const initialQuantity = QuantityAvailable.safeBuild(10);
      assert(initialQuantity.success);

      const decrementAmount = 5;
      const newQuantity = QuantityAvailable.decrement(initialQuantity.data)(
        decrementAmount
      );

      expect(newQuantity);
      expect(newQuantity.data).toBe(5);
    });

    test("在庫数を負の数に減算しようとするとエラーが発生する", () => {
      const initialQuantity = QuantityAvailable.safeBuild(
        QuantityAvailable.constants.MIN
      );
      assert(initialQuantity.success);

      const decrementAmount = 1;
      const newQuantity = QuantityAvailable.decrement(initialQuantity.data)(
        decrementAmount
      );

      assert(!newQuantity.success);
      expect(getZodIssueMessages(newQuantity.error)).contain(
        `在庫数は${QuantityAvailable.constants.MIN}から${QuantityAvailable.constants.MAX}の間でなければなりません。`
      );
    });
  });
});
