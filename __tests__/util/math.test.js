import { rangeProgress, progressRange } from "@util/math";

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

  test("it should convert 50,-50", () => {
    expect(rangeProgress(0.5, 50, -50)).toBe(0);
  });

  test("it should convert -50,50", () => {
    expect(rangeProgress(0.5, -50, 50)).toBe(0);
  });

  test("it should convert -10,8", () => {
    expect(rangeProgress(0.5, -10, 8)).toBe(-1);
  });
});

describe("progressRange()", () => {
  test("it should convert 0,1", () => {
    expect(progressRange(0.5, 0, 1)).toBe(0.5);
  });

  test("it should convert 1,0", () => {
    expect(progressRange(0.5, 1, 0)).toBe(0.5);
  });

  test("it should convert 50,100", () => {
    expect(progressRange(75, 50, 100)).toBe(0.5);
  });

  test("it should convert 100,50", () => {
    expect(progressRange(75, 100, 50)).toBe(0.5);
  });

  test("it should convert 50,-50", () => {
    expect(progressRange(0, 50, -50)).toBe(0.5);
  });

  test("it should convert -50,50", () => {
    expect(progressRange(0, -50, 50)).toBe(0.5);
  });

  test("it should convert 0,100 with a center", () => {
    expect(progressRange(10, 0, 100, 10)).toBe(0.5);
  });

  test("it should convert 0,100 with a center", () => {
    expect(progressRange(0, 0, 100, 10)).toBe(0);
  });

  test("it should convert 0,100 with a center", () => {
    expect(progressRange(100, 0, 100, 10)).toBe(1);
  });

  test("it should convert 0,100 with a center", () => {
    expect(progressRange(1, 0, 100, 10)).toBe(0.05);
  });

  test("it should convert 0,100 with a center", () => {
    expect(progressRange(50, 0, 100, 10)).toBe(0.7222222222222222);
  });
});
