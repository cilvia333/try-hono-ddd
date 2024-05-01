import { describe, test, expect, assert, vi } from "vitest";
import { Status, StatusEnum } from "./Status";

describe("Status", () => {
  test("有効なステータスでインスタンスが生成されること", () => {
    const inStockStatus = Status.safeBuild(StatusEnum.InStock);
    const outOfStockStatus = Status.safeBuild(StatusEnum.OutOfStock);
    const lowStockStatus = Status.safeBuild(StatusEnum.LowStock);

    assert(inStockStatus.success);
    assert(outOfStockStatus.success);
    assert(lowStockStatus.success);

    expect(inStockStatus.data).toBe(StatusEnum.InStock);
    expect(outOfStockStatus.data).toBe(StatusEnum.OutOfStock);
    expect(lowStockStatus.data).toBe(StatusEnum.LowStock);
  });

  describe("toLabel()", () => {
    test("ステータスInStockが「在庫あり」に変換されること", () => {
      const status = Status.safeBuild(StatusEnum.InStock);

      assert(status.success);
      expect(Status.toLabel(status.data)).toBe("在庫あり");
    });

    test("ステータスOutOfStockが「在庫切れ」に変換されること", () => {
      const status = Status.safeBuild(StatusEnum.OutOfStock);

      assert(status.success);
      expect(Status.toLabel(status.data)).toBe("在庫切れ");
    });

    test("ステータスLowStockが「残りわずか」に変換されること", () => {
      const status = Status.safeBuild(StatusEnum.LowStock);

      assert(status.success);
      expect(Status.toLabel(status.data)).toBe("残りわずか");
    });
  });
});
