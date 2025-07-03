import { md5, isHash } from "@util/crypto";
import { keysStr, keysId } from "../data";

describe("md5()", () => {
  test("it should calculate a hash", () => {
    expect(md5(keysStr)).toBe(keysId);
  });
});

describe("isHash()", () => {
  test("it should return true given a hash", () => {
    expect(isHash(keysId)).toBe(true);
  });

  test("it should return false given not a hash", () => {
    expect(isHash("-1")).toBe(false);
    expect(isHash("0000000000000000000000000000000")).toBe(false);
    expect(isHash("12")).toBe(false);
    expect(isHash("test")).toBe(false);
  });
});
