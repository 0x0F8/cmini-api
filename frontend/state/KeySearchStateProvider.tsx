"use client";

import {
  KeySearchHandConstraint,
  KeySearchState,
} from "@frontend/feature/search/types";
import React, { ReactNode, useCallback } from "react";
import { createContext, useState } from "react";
import { Orientation } from "types";
import { produce, WritableDraft } from "immer";
import { KeySearchKeyGroupProps } from "@frontend/feature/search/KeySearchKeyGroup";
import { KeySearchKeyProps } from "@frontend/feature/search/KeySearchKey";
import calculateKeySearchFormEmptiness from "@frontend/feature/search/calculateKeySearchFormEmptiness";

type SetKeySearchState = {
  setKeyGroup: (
    hand: KeySearchHandConstraint,
    groupIndex: number,
    state: Partial<KeySearchKeyGroupProps>,
  ) => void;
  setKey: (
    hand: KeySearchHandConstraint,
    groupIndex: number,
    keyIndex: number,
    state: Partial<KeySearchKeyProps>,
  ) => void;
  createKeyGroup: (hand: KeySearchHandConstraint) => void;
  deleteKeyGroup: (hand: KeySearchHandConstraint, groupIndex: number) => void;
  deleteKey: (
    hand: KeySearchHandConstraint,
    groupIndex: number,
    keyIndex: number,
  ) => void;
  createKey: (hand: KeySearchHandConstraint, groupIndex: number) => void;
  selectKey: (
    hand: KeySearchHandConstraint,
    groupIndex: number,
    keyIndex: number,
  ) => void;
  deselectKey: () => void;
  setEditing: (editing: boolean) => void;
};

function defaultKeyState(): KeySearchKeyProps {
  return {
    value: undefined,
    selected: false,
    error: false,
  };
}

function defaultKeyGroupState(): KeySearchKeyGroupProps {
  return {
    values: [defaultKeyState()],
    orientation: Orientation.Horizontal,
    orient: false,
    adjacent: true,
  };
}

const defaultState: KeySearchState = {
  left: [],
  right: [],
  either: [],
  editing: false,
  empty: true,
  valid: true,
  dirty: false,
  output: "",

  isProposedEditValid: () => false,
  getHandGroups: () => [],
  getKeyGroup: () => defaultKeyGroupState(),
};
const defaultSetState: SetKeySearchState = {
  setKeyGroup: () => {},
  setKey: () => {},
  createKeyGroup: () => {},
  deleteKeyGroup: () => {},
  deleteKey: () => {},
  selectKey: () => {},
  deselectKey: () => {},
  setEditing: () => {},
  createKey: () => {},
};

export const KeySearchContext = createContext<
  KeySearchState & SetKeySearchState
>({
  ...defaultState,
  ...defaultSetState,
});

const forEachKey = (
  state: KeySearchState,
  callback: (
    key: KeySearchKeyProps,
    currentHand: KeySearchHandConstraint,
    currentGroupIndex: number,
    currentKeyIndex: number,
    extra: {
      isFirstKey: boolean;
      isLastKey: boolean;
      isFirstGroup: boolean;
      isLastGroup: boolean;
    },
  ) => void,
) => {
  for (const currentHand of [
    KeySearchHandConstraint.Either,
    KeySearchHandConstraint.Left,
    KeySearchHandConstraint.Right,
  ]) {
    const handRef = state[currentHand];
    for (let j = 0; j < handRef.length; j++) {
      const groupRef = handRef[j];
      const isFirstGroup = j === 0;
      const isLastGroup = j === handRef.length - 1;
      for (let i = 0; i < groupRef.values.length; i++) {
        const keyRef = groupRef.values[i];
        const isFirstKey = i === 0;
        const isLastKey = i === groupRef.values.length - 1;
        callback(keyRef, currentHand, j, i, {
          isFirstKey,
          isLastKey,
          isFirstGroup,
          isLastGroup,
        });
      }
    }
  }
};

const keySearchStateToQueryString = (state: KeySearchState) => {
  let output = "";
  let groupTokens: string[] = [];

  const hands = [
    KeySearchHandConstraint.Either,
    KeySearchHandConstraint.Left,
    KeySearchHandConstraint.Right,
  ];

  for (const currentHand of hands) {
    const handRef = state[currentHand];
    let handToken = "";

    for (let j = 0; j < handRef.length; j++) {
      const isLastGroup = j === handRef.length - 1;
      const groupRef = handRef[j];
      const isSingle = groupRef.values.length <= 1;

      let command = "";
      if (
        groupRef.orientation === Orientation.Horizontal &&
        groupRef.adjacent &&
        groupRef.orient &&
        !isSingle
      ) {
        command = "h:";
      } else if (
        groupRef.orientation === Orientation.Vertical &&
        groupRef.adjacent &&
        groupRef.orient &&
        !isSingle
      ) {
        command = "v:";
      }

      const letters = groupRef.values.map((v) => v.value).join("");
      const delimiter = isLastGroup ? "" : ",";
      handToken += command + letters + delimiter;
    }

    let groupToken = "";
    if (handToken.length > 0) {
      groupToken = currentHand === KeySearchHandConstraint.Right ? "|" : "";
      groupToken += handToken;
      groupToken += currentHand === KeySearchHandConstraint.Left ? "|" : "";
    }

    if (groupToken.length > 0) {
      groupTokens.push(groupToken);
    }
  }

  for (let i = 0; i < groupTokens.length; i++) {
    const isLastGroup = i === groupTokens.length - 1;
    const delimiter = isLastGroup ? "" : "+";
    output += groupTokens[i] + delimiter;
  }

  return output;
};

const calculateFormValidity = (state: KeySearchState) => {
  let hasNonTrivialSearch = false;
  let hasBlankCharacter = false;
  let hasError = false;

  let keyLength = 0;
  for (const currentHand of [
    KeySearchHandConstraint.Either,
    KeySearchHandConstraint.Left,
    KeySearchHandConstraint.Right,
  ]) {
    const handRef = state[currentHand];
    const hasSpecificity = currentHand !== KeySearchHandConstraint.Either;

    for (const groupRef of handRef) {
      if (
        (groupRef.values.length > 0 && hasSpecificity) ||
        (groupRef.values.length > 1 && !hasSpecificity)
      ) {
        hasNonTrivialSearch = true;
      }
      keyLength += groupRef.values.length;
      for (const keyRef of groupRef.values) {
        if (keyRef.value === "undefined") {
          hasBlankCharacter = true;
          break;
        }
        if (keyRef.error) {
          hasError = true;
          break;
        }
      }
    }
  }

  const isFull = !hasBlankCharacter && hasNonTrivialSearch;
  const isEmpty = keyLength === 0;
  return (isEmpty || isFull) && !hasError && !state.editing;
};

const KeySearchStateProvider = ({
  injectedState = {},
  children,
}: {
  injectedState?: Partial<KeySearchState>;
  children: ReactNode;
}) => {
  const combinedState = {
    ...defaultState,
    ...injectedState,
  };
  const [keySearchState, setKeySearchState] = useState({
    ...combinedState,
    empty: calculateKeySearchFormEmptiness(combinedState),
  });
  const setKeySearchStateImmutable = (
    callback: (draft: WritableDraft<KeySearchState>) => void,
  ) => setKeySearchState(produce(callback));

  const getHandGroups = (hand: KeySearchHandConstraint) => keySearchState[hand];
  const getKeyGroup = (hand: KeySearchHandConstraint, index: number) =>
    keySearchState[hand][index];

  const createKeyGroup = useCallback((hand: KeySearchHandConstraint) => {
    setKeySearchStateImmutable((draft) => {
      draft[hand].push(defaultKeyGroupState());
      draft.valid = calculateFormValidity(draft);
      draft.dirty = true;
    });
    selectLastKey(hand);
  }, []);

  const deleteKeyGroup = useCallback(
    (hand: KeySearchHandConstraint, groupIndex: number) => {
      setKeySearchStateImmutable((draft) => {
        draft[hand].splice(groupIndex, 1);
        draft.output = keySearchStateToQueryString(draft);
        draft.valid = calculateFormValidity(draft);
        draft.empty = calculateKeySearchFormEmptiness(draft);
        draft.dirty = true;
      });
    },
    [],
  );

  const deleteKey = useCallback(
    (hand: KeySearchHandConstraint, groupIndex: number, keyIndex: number) => {
      setKeySearchStateImmutable((draft) => {
        draft[hand][groupIndex].values.splice(keyIndex, 1);
        draft.output = keySearchStateToQueryString(draft);
        draft.valid = calculateFormValidity(draft);
        draft.empty = calculateKeySearchFormEmptiness(draft);
        draft.dirty = true;
      });
    },
    [],
  );

  const createKey = useCallback(
    (hand: KeySearchHandConstraint, groupIndex: number) => {
      setKeySearchStateImmutable((draft) => {
        draft[hand][groupIndex].values.push(defaultKeyState());
        draft.valid = calculateFormValidity(draft);
        draft.empty = calculateKeySearchFormEmptiness(draft);
        draft.dirty = true;
      });
      selectLastKey(hand, groupIndex);
    },
    [],
  );

  const selectLastKey = useCallback(
    (hand: KeySearchHandConstraint, groupIndex = -1) => {
      setKeySearchStateImmutable((draft) => {
        draft.editing = true;
        draft.valid = false;
        draft.dirty = true;
        forEachKey(
          draft,
          (
            key,
            currentHand,
            currentGroupIndex,
            currentKeyIndex,
            { isLastKey, isLastGroup },
          ) => {
            if (
              isLastKey &&
              groupIndex === -1 &&
              isLastGroup &&
              hand === currentHand
            ) {
              key.selected = true;
            } else if (
              isLastKey &&
              groupIndex === currentGroupIndex &&
              hand === currentHand
            ) {
              key.selected = true;
            } else {
              key.selected = false;
            }
          },
        );
      });
    },
    [],
  );

  const selectKey = useCallback(
    (hand: KeySearchHandConstraint, groupIndex: number, keyIndex: number) => {
      setKeySearchStateImmutable((draft) => {
        draft.editing = true;
        draft.valid = false;
        draft.dirty = true;
        forEachKey(
          draft,
          (key, currentHand, currentGroupIndex, currentKeyIndex) => {
            if (
              currentGroupIndex === groupIndex &&
              currentKeyIndex === keyIndex &&
              hand === currentHand
            ) {
              key.selected = true;
            } else {
              key.selected = false;
            }
          },
        );
      });
    },
    [],
  );

  const isProposedEditValid = useCallback(
    (
      value: string,
      hand: KeySearchHandConstraint,
      groupIndex: number,
      keyIndex: number,
    ) => {
      const groupRef = keySearchState[hand][groupIndex];
      const doesValueExistInGroup =
        groupRef.values.filter((key) => key.value === value).length > 0;
      return !doesValueExistInGroup;
    },
    [keySearchState],
  );

  const deselectKey = useCallback(() => {
    setKeySearchStateImmutable((draft) => {
      let didDeselect = false;
      forEachKey(
        draft,
        (key, currentHand, currentGroupIndex, currentKeyIndex) => {
          const keyRef =
            draft[currentHand][currentGroupIndex].values[currentKeyIndex];
          if (keyRef.selected) {
            if (typeof keyRef.value !== "undefined") {
              key.selected = false;
              didDeselect = true;
            } else {
              key.error = true;
            }
          }
        },
      );

      if (didDeselect) {
        draft.editing = false;
      }
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateKeySearchFormEmptiness(draft);
      draft.dirty = true;
    });
  }, []);

  const setKeyGroup = useCallback(
    (
      hand: KeySearchHandConstraint,
      groupIndex: number,
      state: Partial<KeySearchKeyGroupProps>,
    ) => {
      setKeySearchStateImmutable((draft) => {
        const groupRef = draft[hand][groupIndex];
        if (typeof state.orientation !== "undefined") {
          groupRef.orientation = state.orientation;
        }
        if (typeof state.adjacent !== "undefined") {
          groupRef.adjacent = state.adjacent;
        }
        if (typeof state.values !== "undefined") {
          groupRef.values = state.values;
        }
        if (typeof state.orient !== "undefined") {
          groupRef.orient = state.orient;
        }
        draft.output = keySearchStateToQueryString(draft);
        draft.valid = calculateFormValidity(draft);
        draft.empty = calculateKeySearchFormEmptiness(draft);
        draft.dirty = true;
      });
    },
    [],
  );

  const setKey = useCallback(
    (
      hand: KeySearchHandConstraint,
      groupIndex: number,
      keyIndex: number,
      state: Partial<KeySearchKeyProps>,
    ) => {
      setKeySearchStateImmutable((draft) => {
        const keyRef = draft[hand][groupIndex].values[keyIndex];
        if (typeof state.selected !== "undefined") {
          keyRef.selected = state.selected;
        }
        if (typeof state.value !== "undefined") {
          keyRef.value = state.value;
          keyRef.error = false;
          draft.output = keySearchStateToQueryString(draft);
        }
        if (typeof state.error !== "undefined") {
          keyRef.error = state.error;
        }
        draft.valid = calculateFormValidity(draft);
        draft.empty = calculateKeySearchFormEmptiness(draft);
        draft.dirty = true;
      });
    },
    [],
  );

  const setEditing = useCallback(
    (editing: boolean) =>
      setKeySearchStateImmutable((draft) => {
        draft.editing = editing;
        if (editing) {
          draft.valid = false;
        } else {
          draft.valid = calculateFormValidity(draft);
        }
        draft.empty = calculateKeySearchFormEmptiness(draft);
        draft.dirty = true;
      }),
    [],
  );

  return (
    <KeySearchContext.Provider
      value={{
        ...keySearchState,
        setKeyGroup,
        deleteKeyGroup,
        getHandGroups,
        getKeyGroup,
        createKeyGroup,
        deleteKey,
        deselectKey,
        selectKey,
        setKey,
        setEditing,
        createKey,
        isProposedEditValid,
      }}
    >
      {children}
    </KeySearchContext.Provider>
  );
};

export default React.memo(KeySearchStateProvider);
