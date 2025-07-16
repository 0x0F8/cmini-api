import {
  CminiBoardLayout,
  CminiFinger,
  CminiKey,
  CminiLayout,
} from "../backend/cmini/types";
import { md5 } from "./crypto";

export function decodeKeys(input: string) {
  const keys: CminiKey[] = [];
  for (let i = 0; i < input.length; i += 7) {
    const line = input.substring(i, i + 7);
    // 76 00 00 4
    const charCode = parseInt(line.substring(0, 2), 16);
    const column = parseInt(line.substring(2, 4), 16);
    const row = parseInt(line.substring(4, 6), 16);
    const finger = Number(line.substring(6, 7));
    const key: CminiKey = {
      column,
      row,
      key: charCode,
      finger,
    };
    keys.push(key);

    const nextChar = input[i + 7];
    if (nextChar === "-") {
      i += 1;
    }
  }
  return keys;
}

export function encodePaddedHex(input: number) {
  return input.toString(16).padStart(2, "0");
}

export function encodeKeys(keys: CminiKey[]) {
  let output: string = "";
  let lastRow: number | undefined = undefined;
  for (const data of keys) {
    const delimiter =
      typeof lastRow !== "undefined" && data.row !== lastRow ? "-" : "";
    lastRow = data.row;
    const ch = encodePaddedHex(data.key);
    const c = encodePaddedHex(data.column);
    const r = encodePaddedHex(data.row);
    const f = data.finger;
    const line = `${delimiter}${ch}${c}${r}${f}`;
    output += line;
  }
  return output;
}

export function calculateBoardHash(
  layout: CminiLayout,
  boardLayout: CminiBoardLayout,
) {
  return md5(layout.encodedKeys + boardLayout.board);
}

export function calculateLayoutHash(layout: CminiLayout) {
  return md5(layout.encodedKeys);
}

export function homerow(layout: CminiLayout) {
  const keys: (CminiKey | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const fingers = [
    CminiFinger.LT,
    CminiFinger.LP,
    CminiFinger.LR,
    CminiFinger.LM,
    CminiFinger.LI,
    CminiFinger.RI,
    CminiFinger.RM,
    CminiFinger.RR,
    CminiFinger.RP,
    CminiFinger.RT,
  ];
  for (const k of layout.keys) {
    if (k.row !== layout.homerow && k.row !== layout.rows - 1) continue;
    if (k.row === layout.homerow) {
      const isLeft = k.finger <= 4;

      const i = fingers.indexOf(k.finger);
      if (
        !keys[i] ||
        (isLeft && k.column < keys[i]!.column) ||
        (!isLeft && k.column > keys[i]!.column)
      ) {
        keys[i] = k;
      }
    } else {
      if (k.finger === CminiFinger.LT || k.finger === CminiFinger.RT) {
        const i = fingers.indexOf(k.finger);
        if (typeof keys[i] === "undefined") {
          keys[i] = k;
        }
      }
    }
  }
  return keys;
}
