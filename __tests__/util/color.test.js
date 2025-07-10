import {
  rgbToHex,
  hexToRgb,
  gradientValue,
  gradientValueFromArray,
} from "@util/color";

describe("rgbToHex()", () => {
  test("it should convert rgb to hex", () => {
    expect(rgbToHex([255, 255, 255])).toBe("#FFFFFF");
    expect(rgbToHex([255, 0, 255])).toBe("#FF00FF");
  });
});

describe("hexToRgb()", () => {
  test("it should convert hex to rgb", () => {
    expect(hexToRgb("#FFFFFF")).toStrictEqual([255, 255, 255]);
    expect(hexToRgb("#FF00FF")).toStrictEqual([255, 0, 255]);
  });
});

describe("gradientValue()", () => {
  test("it should return with progress of 1", () => {
    expect(gradientValue(1, "#000000", "#FFFFFF")).toBe("#FFFFFF");
  });

  test("it should return with progress of 0", () => {
    expect(gradientValue(0, "#000000", "#FFFFFF")).toBe("#000000");
  });

  test("it should return with progress of 0", () => {
    expect(gradientValue(0, "#DE6563", "#DE2020")).toBe("#DE6563");
  });

  test("it should return with progress of 0.5", () => {
    expect(gradientValue(0.5, "#000000", "#FFFFFF")).toBe("#808080");
  });

  test("it should return with progress of 0.5", () => {
    expect(gradientValue(0.5, "#FFFFFF", "#000000")).toBe("#808080");
  });
});

describe("gradientValueFromArray()", () => {
  test("it should return with progress of 1", () => {
    expect(gradientValueFromArray(1, ["#000000", "#FFFFFF"])).toBe("#FFFFFF");
  });

  test("it should return with progress of 0", () => {
    expect(gradientValueFromArray(0, ["#000000", "#FFFFFF"])).toBe("#000000");
  });

  test("it should return with progress of 0.5", () => {
    expect(gradientValueFromArray(0.5, ["#000000", "#FFFFFF"])).toBe("#808080");
  });

  test("it should return with progress of 0.5, 3 colors", () => {
    expect(gradientValueFromArray(0.5, ["#000000", "#333333", "#FFFFFF"])).toBe(
      "#333333",
    );
  });

  test("it should return with progress of 0.75, 3 colors", () => {
    expect(
      gradientValueFromArray(0.75, ["#000000", "#333333", "#FFFFFF"]),
    ).toBe("#999999");
  });

  test("it should return with progress of 0.5, 4 colors", () => {
    expect(
      gradientValueFromArray(0.5, ["#000000", "#333333", "#FFFFFF", "#888888"]),
    ).toBe("#999999");
  });

  test("it should return with progress of 0.75, 4 colors", () => {
    expect(
      gradientValueFromArray(0.75, [
        "#000000",
        "#333333",
        "#000000",
        "#FFFFFF",
      ]),
    ).toBe("#404040");
  });

  test("it should return with progress of 1, 4 colors", () => {
    expect(
      gradientValueFromArray(1, ["#000000", "#333333", "#FFFFFF", "#888888"]),
    ).toBe("#888888");
  });

  test("it should return with given color array", () => {
    const colors = [
      "#20DE2E",
      "#63DE6C",
      "#DEDD63",
      "#DEDD20",
      "#DE6563",
      "#DE2020",
    ];
    expect(gradientValueFromArray(0, colors)).toBe(colors[0]);
    expect(gradientValueFromArray(0.2, colors)).toBe(colors[1]);
    expect(gradientValueFromArray(0.4, colors)).toBe(colors[2]);
    expect(gradientValueFromArray(0.6, colors)).toBe(colors[3]);
    expect(gradientValueFromArray(0.8, colors)).toBe(colors[4]);
    expect(gradientValueFromArray(1, colors)).toBe(colors[5]);
  });
});
