import { describe, test, expect, assert } from "vitest";
import { Title } from "./Title";
import { getZodIssueMessages } from "@/util/doamin/test";

describe("Title", () => {
  test("Titleが1文字で作成できる", () => {
    const title = Title.safeBuild("a");

    assert(title.success);
    expect(title.data).toBe("a");
  });

  test("Titleが1000文字で作成できる", () => {
    const longTitle = "a".repeat(1000);
    const title = Title.safeBuild(longTitle);

    assert(title.success);
    expect(title.data).toBe(longTitle);
  });

  test("最小長以上の値でTitleを生成するとエラーを投げる", () => {
    const title = Title.safeBuild("");

    assert(!title.success);
    expect(getZodIssueMessages(title.error)).toContain(
      `タイトルは${Title.constants.MIN}文字以上、${Title.constants.MAX}文字以下でなければなりません。`
    );
  });

  test("最大長以上の値でTitleを生成するとエラーを投げる", () => {
    const tooLongTitle = "a".repeat(1001);
    const title = Title.safeBuild(tooLongTitle);

    assert(!title.success);

    expect(getZodIssueMessages(title.error)).toContain(
      `タイトルは${Title.constants.MIN}文字以上、${Title.constants.MAX}文字以下でなければなりません。`
    );
  });
});
