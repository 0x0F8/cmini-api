import { Orientation } from "types";
import { KeySearchKeyProps } from "./KeySearchKey";
import { KeySearchKeyGroupProps } from "./KeySearchKeyGroup";
import { KeySearchHandConstraint, KeySearchStateValues } from "./types";

export default function transformQueryStringToKeySearchState(
  query: string,
): KeySearchStateValues {
  const left: KeySearchKeyGroupProps[] = [];
  const either: KeySearchKeyGroupProps[] = [];
  const right: KeySearchKeyGroupProps[] = [];

  const queryTokens = query.split(/[\s+]/g);
  for (const queryToken of queryTokens) {
    if (queryToken === "") continue;
    for (let token of queryToken.split(",")) {
      let hand = KeySearchHandConstraint.Either;
      if (token.startsWith("|")) {
        hand = KeySearchHandConstraint.Left;
      } else if (token.endsWith("|")) {
        hand = KeySearchHandConstraint.Right;
      }

      for (let handToken of token.split("|")) {
        if (handToken !== "") {
          if (handToken === "" || handToken === "|") {
            continue;
          }

          const group: KeySearchKeyGroupProps = {
            values: [],
            orientation: Orientation.Horizontal,
            orient: false,
            adjacent: true,
          };

          if (!handToken.includes(":")) {
            handToken = ":" + handToken;
          }
          const [modifier, letters] = handToken.split(":");
          const hasModifier = modifier.length > 0;
          group.orient = hasModifier;

          if (letters.length === 0) continue;
          for (let i = 0; i < Math.min(letters.length, 4); i++) {
            const letter = letters[i];
            const key: KeySearchKeyProps = {
              value: undefined,
              selected: false,
              error: false,
            };
            key.value = letter;
            group.values.push(key);
          }

          switch (modifier) {
            case "h":
              group.orientation = Orientation.Horizontal;
              break;
            case "v":
              group.orientation = Orientation.Vertical;
              break;
            case "":
              // nop
              break;
          }

          if (hand === KeySearchHandConstraint.Right) {
            left.push(group);
          } else if (hand === KeySearchHandConstraint.Left) {
            right.push(group);
          } else if (hand === KeySearchHandConstraint.Either) {
            either.push(group);
          }
        }
      }
    }
  }
  return { left, either, right };
}
