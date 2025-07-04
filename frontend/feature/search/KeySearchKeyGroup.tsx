import UndoIcon from "@mui/icons-material/Undo";
import clsx from "clsx";
import { Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeySearchKey, { KeySearchKeyProps } from "./KeySearchKey";
import { Orientation } from "types";
import style from "./KeySearchForm.module.sass";
import { KeySearchHandConstraint } from "./types";
import useKeySearchState from "@frontend/hooks/useKeySearchState";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useCallback } from "react";
import SvgIconButton from "@frontend/components/SvgIconButton";
import HeightOutlinedIcon from "@mui/icons-material/HeightOutlined";
import ZoomOutMapOutlinedIcon from "@mui/icons-material/ZoomOutMapOutlined";

export type KeySearchKeyGroupProps = {
  values: KeySearchKeyProps[];
  orientation: Orientation;
  orient: boolean;
  adjacent: boolean;
};

export default function KeySearchKeyGroup({
  hand,
  groupIndex,
  values,
  orientation,
  orient,
  adjacent,
  canAddGroup,
  onDeleteGroup,
  showButtons,
}: {
  hand: KeySearchHandConstraint;
  groupIndex: number;
  canAddGroup: boolean;
  onDeleteGroup: () => void;
  showButtons: boolean;
} & KeySearchKeyGroupProps) {
  const {
    setKeyGroup,
    selectKey,
    setKey,
    createKeyGroup,
    createKey,
    deleteKey,
    editing,
    setEditing,
    isProposedEditValid,
  } = useKeySearchState();

  const onToggleOrientation = useCallback(
    () =>
      values.length > 1 &&
      setKeyGroup(hand, groupIndex, {
        orientation:
          orientation === Orientation.Horizontal
            ? Orientation.Vertical
            : Orientation.Horizontal,
      }),
    [hand, groupIndex, orientation, values.length],
  );
  const onToggleEnableOrientation = useCallback(
    () =>
      values.length > 1 &&
      setKeyGroup(hand, groupIndex, {
        orient: !orient,
      }),
    [hand, groupIndex, orient, values.length],
  );

  const onAddGroup = useCallback(() => createKeyGroup(hand), [hand]);
  const onDeleteKey = useCallback(
    () => deleteKey(hand, groupIndex, values.length - 1),
    [hand, groupIndex, values.length],
  );
  const onAddKey = useCallback(
    () => createKey(hand, groupIndex),
    [hand, groupIndex],
  );
  const onEdit = useCallback(
    (value: string, keyIndex: number) => {
      const isValid = isProposedEditValid(value, hand, groupIndex, keyIndex);
      if (isValid) {
        setKey(hand, groupIndex, keyIndex, { value, selected: false });
        setEditing(false);
      } else {
        setKey(hand, groupIndex, keyIndex, { value, error: true });
      }
    },
    [isProposedEditValid, hand, groupIndex],
  );

  const isMultigram = values.length > 1;
  const canDeleteKey = values.length > 1;
  const canDeleteGroup = values.length <= 1;
  const canAddGroupInternal = canAddGroup && values.length === 0;
  const canAddKey = values.length > 0 && values.length <= 3;
  const isVertical = orientation === Orientation.Vertical;
  const isHorizontal = orientation === Orientation.Horizontal;

  return (
    <Stack
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={clsx({
        [style["adjacent"]]: adjacent,
        [style["multigram"]]: isMultigram,
        [style["horizontal"]]: isHorizontal,
        [style["vertical"]]: isVertical,
        [style["key-search-group"]]: true,
        [style["editing"]]: editing,
      })}
    >
      <Stack
        flexDirection={isHorizontal ? "column" : "row"}
        alignItems="center"
        justifyContent="center"
        sx={{ minWidth: 80, minHeight: 65 }}
      >
        <Stack className={style["key-search-group-buttons"]}>
          {orient && (
            <SvgIconButton
              Icon={HeightOutlinedIcon}
              show={isMultigram}
              onClick={onToggleEnableOrientation}
              enabled={isMultigram && !editing}
              sx={{
                transform: isHorizontal ? "rotate(90deg)" : "",
              }}
            />
          )}
          {!orient && (
            <SvgIconButton
              Icon={ZoomOutMapOutlinedIcon}
              show={isMultigram}
              onClick={onToggleEnableOrientation}
              enabled={isMultigram && !editing}
              sx={{
                transform: "rotate(45deg) scale(0.8)",
              }}
            />
          )}
        </Stack>
        <Stack className={style["key-group-wrapper"]}>
          {values.map((props, keyIndex) => (
            <KeySearchKey
              key={keyIndex}
              {...props}
              onSelect={() => selectKey(hand, groupIndex, keyIndex)}
              onEdit={(value: string) => onEdit(value, keyIndex)}
              canSelect={props.selected || !editing}
            />
          ))}
        </Stack>
        {isVertical && (
          <Stack>
            <SvgIconButton Icon={HeightOutlinedIcon} show={false} />
          </Stack>
        )}
      </Stack>
      {showButtons && orient && (
        <Stack
          flexDirection="row"
          className={style["key-search-group-buttons"]}
        >
          {isMultigram && (
            <SvgIconButton
              Icon={UndoIcon}
              className={style["orientation-button"]}
              onClick={onToggleOrientation}
              enabled={isMultigram && !editing}
            />
          )}
        </Stack>
      )}
      {showButtons && (
        <Stack
          flexDirection="row"
          className={style["key-search-group-buttons"]}
        >
          {canAddGroupInternal && (
            <SvgIconButton
              Icon={AddIcon}
              onClick={onAddGroup}
              enabled={canAddGroupInternal && !editing}
            />
          )}
          {canAddKey && (
            <SvgIconButton
              Icon={AddIcon}
              onClick={onAddKey}
              enabled={canAddKey && !editing}
            />
          )}
          {canDeleteKey && (
            <SvgIconButton
              Icon={ClearOutlinedIcon}
              onClick={onDeleteKey}
              enabled={canDeleteKey && !editing}
            />
          )}
          {canDeleteGroup && (
            <SvgIconButton
              Icon={ClearOutlinedIcon}
              onClick={onDeleteGroup}
              enabled={canDeleteGroup && !editing}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
}
