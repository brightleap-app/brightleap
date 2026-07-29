import { describe, it, expect } from "vitest";

import { shuffle } from "./shuffle.js";

describe("shuffle", () => {
  it("uses Fisher-Yates swaps without mutating the source array", () => {
    const source = ["one", "two", "three"];
    const randomValues = [0, 0];
    const random = () => randomValues.shift();

    expect(shuffle(source, random)).toEqual(["two", "three", "one"]);
    expect(source).toEqual(["one", "two", "three"]);
  });
});
