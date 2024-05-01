import { env } from "cloudflare:test";
import { describe, test, expect, beforeEach, assert } from "vitest";
import { drizzle } from "drizzle-orm/d1";

import { Price } from "@/domain/Book/Price/Price";
import { Title } from "@/domain/Book/Title/Title";
import { BookId } from "@/domain/Book/BookId/BookId";
import { Book } from "@/domain/Book/Book";
import { Stock } from "@/domain/Book/Stock/Stock";
import { QuantityAvailable } from "@/domain/Book/Stock/QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "@/domain/Book/Stock/Status/Status";
import { bookTestDataCreator } from "@/infrastructure/shared/Book/bookTestDataCreator";

import { DrizzleBookRepository } from "./DrizzleBookRepository";
import * as schema from "../schema";

const db = drizzle(env.DB, { schema });

describe("PrismaBookRepository", () => {
  beforeEach(async () => {
    // テストごとにデータを初期化する
    await db.batch([db.delete(schema.books)]);
  });

  test("saveした集約がfindで取得できる", async () => {
    const bookId = BookId.build("9784167158057");
    const title = Title.build("吾輩は猫である");
    const price = Price.build({
      amount: 770,
      currency: "JPY",
    });
    const book = Book.buildSingle({ bookId, title, price });
    await DrizzleBookRepository.save(db, book);

    const createdEntity = await DrizzleBookRepository.find(db, bookId);
    assert(createdEntity.result === "success");
    expect(createdEntity.data?.bookId === bookId).toBeTruthy();
    expect(createdEntity.data?.title === title).toBeTruthy();
    expect(createdEntity.data?.price).toMatchObject(price);
    expect(
      createdEntity.data?.stock.stockId === book.stock.stockId
    ).toBeTruthy();
    expect(
      createdEntity.data?.stock.quantityAvailable ===
        book.stock.quantityAvailable
    ).toBeTruthy();
    expect(createdEntity.data?.stock.status === book.stock.status).toBeTruthy();
  });

  test("updateできる", async () => {
    const createdEntity = await bookTestDataCreator(
      db,
      DrizzleBookRepository
    )({});

    const stock = Stock.reconstruct({
      stockId: createdEntity.stock.stockId,
      quantityAvailable: QuantityAvailable.build(100),
      status: Status.build(StatusEnum.InStock),
    });

    const book = Book.reconstruct({
      bookId: createdEntity.bookId,
      title: Title.build("吾輩は猫である(改訂版))"),
      price: Price.build({
        amount: 800,
        currency: "JPY",
      }),
      stock,
    });

    await DrizzleBookRepository.save(db, book);
    const updatedEntity = await DrizzleBookRepository.find(
      db,
      createdEntity.bookId as BookId
    );
    assert(updatedEntity.result === "success");
    expect(updatedEntity.data?.bookId === book.bookId).toBeTruthy();
    expect(updatedEntity.data?.title === book.title).toBeTruthy();
    expect(updatedEntity.data?.price).toMatchObject(book.price);
    expect(
      updatedEntity.data?.stock.stockId === book.stock.stockId
    ).toBeTruthy();
    expect(
      updatedEntity.data?.stock.quantityAvailable ===
        book.stock.quantityAvailable
    ).toBeTruthy();
    expect(updatedEntity.data?.stock.status === book.stock.status).toBeTruthy();
  });

  test("deleteできる", async () => {
    const createdEntity = await bookTestDataCreator(
      db,
      DrizzleBookRepository
    )({});

    const readEntity = await DrizzleBookRepository.find(
      db,
      createdEntity.bookId as BookId
    );
    assert(readEntity.result === "success");
    expect(readEntity.data).not.toBeNull();

    await DrizzleBookRepository.delete(db, createdEntity.bookId as BookId);
    const deletedEntity = await DrizzleBookRepository.find(
      db,
      createdEntity.bookId as BookId
    );
    assert(deletedEntity.result === "success");
    expect(deletedEntity.data).toBeNull();
  });
});
