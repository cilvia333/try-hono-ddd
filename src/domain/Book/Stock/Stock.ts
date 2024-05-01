import { z } from "zod";

import { QuantityAvailable } from "./QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "./Status/Status";
import { StockId } from "./StockId/StockId";

const schema = z
  .object({
    stockId: StockId.schema.readonly(),
    quantityAvailable: QuantityAvailable.schema,
    status: Status.schema,
  })
  .readonly();

export type Stock = z.infer<typeof schema>;

/**
 *  functions
 */
const buildSingle = (): Stock => ({
  stockId: StockId.build(),
  quantityAvailable: QuantityAvailable.build(0),
  status: Status.build(StatusEnum.OutOfStock),
});

const deleteSingle = (stock: Stock) => {
  if (stock.status !== StatusEnum.OutOfStock) {
    throw new Error("在庫がある場合削除できません。");
  }
};

const reconstruct = (input: Stock): Stock => ({
  stockId: input.stockId,
  quantityAvailable: input.quantityAvailable,
  status: input.status,
});

// 在庫数を増やす
const increaseQuantity =
  (stock: Stock) =>
  (amount: number): Stock => {
    if (amount < 0) {
      throw new Error("増加量は0以上でなければなりません。");
    }

    const newQuantity = QuantityAvailable.increment(stock.quantityAvailable)(
      amount
    );

    if (!newQuantity.success) {
      throw new Error(newQuantity.error.message);
    }

    return {
      stockId: stock.stockId,
      quantityAvailable: newQuantity.data,
      status:
        newQuantity.data <= 10
          ? Status.build(StatusEnum.LowStock) // 在庫数が10以下ならステータスを残りわずかにする
          : stock.status,
    };
  };

// 在庫数を減らす
const decreaseQuantity =
  (stock: Stock) =>
  (amount: number): Stock => {
    if (amount < 0) {
      throw new Error("減少量は0以上でなければなりません。");
    }

    const newQuantity = QuantityAvailable.decrement(stock.quantityAvailable)(
      amount
    );

    if (!newQuantity.success) {
      throw new Error(newQuantity.error.message);
    }

    return {
      stockId: stock.stockId,
      quantityAvailable: newQuantity.data,
      status:
        newQuantity.data === 0
          ? Status.build(StatusEnum.OutOfStock) // 在庫数が0になったらステータスを在庫切れにする
          : newQuantity.data <= 10
          ? Status.build(StatusEnum.LowStock) // 在庫数が10以下ならステータスを残りわずかにする
          : stock.status,
    };
  };

export const Stock = {
  buildSingle,
  delete: deleteSingle,
  reconstruct,
  increaseQuantity,
  decreaseQuantity,
  schema,
} as const;
