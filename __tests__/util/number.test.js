import { rangeProgress } from "@util/number";

describe("rangeProgress()", () => {
  test("it should convert 0,1", () => {
    expect(rangeProgress(0.5, 0, 1)).toBe(0.5);
  });

  test("it should convert 1,0", () => {
    expect(rangeProgress(0.5, 1, 0)).toBe(0.5);
  });

  test("it should convert 50,100", () => {
    expect(rangeProgress(0.5, 50, 100)).toBe(75);
  });

  test("it should convert 100,50", () => {
    expect(rangeProgress(0.5, 100, 50)).toBe(75);
  });
});
