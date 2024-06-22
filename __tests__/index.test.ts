import { parse, convert } from "../lib/index";

describe("Cosense to JSON Converter", () => {
  describe("parse", () => {
    it("should parse a simple Cosense dialogue correctly", () => {
      const input = `こんちは[user1.icon]
  ようこそ！
  どうも！[user2.icon]
    はじめまして[user1.icon]`;

      const result = parse(input);

      expect(result).toEqual([
        { id: 1, author: "user1", content: "こんちは", parent: null },
        { id: 2, author: "user1", content: "ようこそ！", parent: 1 },
        { id: 3, author: "user2", content: "どうも！", parent: 1 },
        {
          id: 4,
          author: "user1",
          content: "はじめまして",
          parent: 3,
        },
      ]);
    });

    it("should handle empty input", () => {
      const input = "";
      const result = parse(input);
      expect(result).toEqual([
        {
          author: null,
          content: "",
          id: 1,

          parent: null,
        },
      ]);
    });

    it("should handle input without authors", () => {
      const input = `こんにちは
  はい、こんにちは`;

      const result = parse(input);

      expect(result).toEqual([
        { id: 1, author: null, content: "こんにちは", parent: null },
        {
          id: 2,
          author: null,
          content: "はい、こんにちは",
          parent: 1,
        },
      ]);
    });

    it("should inherit author from parent when not specified", () => {
      const input = `こんにちは[user1.icon]
  はい、こんにちは
    お元気ですか？
  元気です[user2.icon]
    はい、元気です`;

      const result = parse(input);

      expect(result).toEqual([
        {
          id: 1,
          author: "user1",
          content: "こんにちは",
          parent: null,
        },
        {
          id: 2,
          author: "user1",
          content: "はい、こんにちは",
          parent: 1,
        },
        {
          id: 3,
          author: "user1",
          content: "お元気ですか？",
          parent: 2,
        },
        { id: 4, author: "user2", content: "元気です", parent: 1 },
        {
          id: 5,
          author: "user2",
          content: "はい、元気です",
          parent: 4,
        },
      ]);
    });

    it("should use the last top-level author for top-level messages without icons", () => {
      const input = `こんにちは[user1.icon]
  はい、こんにちは
どうも
  お元気ですか？[user2.icon]
こんばんは
  おやすみなさい`;

      const result = parse(input);

      expect(result).toEqual([
        {
          id: 1,
          author: "user1",
          content: "こんにちは",
          parent: null,
        },
        {
          id: 2,
          author: "user1",
          content: "はい、こんにちは",
          parent: 1,
        },
        { id: 3, author: "user1", content: "どうも", parent: null },
        {
          id: 4,
          author: "user2",
          content: "お元気ですか？",
          parent: 3,
        },
        {
          id: 5,
          author: "user1",
          content: "こんばんは",
          parent: null,
        },
        {
          id: 6,
          author: "user1",
          content: "おやすみなさい",
          parent: 5,
        },
      ]);
    });
  });

  it("should handle mixed input with and without authors", () => {
    const input = `[user1.icon]
こんにちは
はい、こんにちは
どうも
[user2.icon]
お元気ですか？
はい、元気です`;

    const result = parse(input);

    expect(result).toEqual([
      { id: 1, author: "user1", content: "こんにちは", parent: null },
      {
        id: 2,
        author: "user1",
        content: "はい、こんにちは",
        parent: null,
      },
      { id: 3, author: "user1", content: "どうも", parent: null },
      {
        id: 4,
        author: "user2",
        content: "お元気ですか？",
        parent: null,
      },
      {
        id: 5,
        author: "user2",
        content: "はい、元気です",
        parent: null,
      },
    ]);
  });

  it("should handle text with icon header that is not on top-level and after texts", () => {
    const input = `[2021/06/22]
[user1.icon]
  おはよう`;

    const result = parse(input);

    expect(result).toEqual([
      {
        id: 1,
        author: null,
        content: "[2021/06/22]",
        parent: null,
      },
      { id: 2, author: "user1", content: "おはよう", parent: null },
    ]);
  });

  it("should handle author changes correctly", () => {
    const input = `[user1.icon]
  こんにちは
  はい、こんにちは
[user2.icon]
  どうも
  お元気ですか？
[user1.icon]
  はい、元気です`;

    const result = parse(input);

    expect(result).toEqual([
      { id: 1, author: "user1", content: "こんにちは", parent: null },
      {
        id: 2,
        author: "user1",
        content: "はい、こんにちは",
        parent: null,
      },
      { id: 3, author: "user2", content: "どうも", parent: null },
      {
        id: 4,
        author: "user2",
        content: "お元気ですか？",
        parent: null,
      },
      {
        id: 5,
        author: "user1",
        content: "はい、元気です",
        parent: null,
      },
    ]);
  });

  it("should handle multiple icons", () => {
    const input = `どうも[user1.icon*2]`;

    const result = parse(input);

    expect(result).toEqual([
      { id: 1, author: "user1", content: "どうも", parent: null },
    ]);
  });

  describe("convert", () => {
    it("should convert Cosense dialogue to JSON string", () => {
      const input = `こんちは[user1.icon]
  ようこそ！`;

      const result = convert(input);
      const expected = JSON.stringify(
        [
          {
            id: 1,
            author: "user1",
            content: "こんちは",
            parent: null,
          },
          {
            id: 2,
            author: "user1",
            content: "ようこそ！",
            parent: 1,
          },
        ],
        null,
        2
      );

      expect(result).toBe(expected);
    });

    it("should return an empty array JSON string for empty input", () => {
      const input = "";
      const result = convert(input);
      const expected = JSON.stringify(
        [
          {
            id: 1,
            author: null,
            content: "",
            parent: null,
          },
        ],
        null,
        2
      );
      expect(result).toBe(expected);
    });
  });
});
