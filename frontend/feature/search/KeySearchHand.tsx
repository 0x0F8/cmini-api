import { Box, Stack, StackProps, Typography } from "@mui/material";
import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import AddIcon from "@mui/icons-material/Add";
import { KeySearchHandConstraint } from "./types";
import useKeySearchState from "@frontend/hooks/useKeySearchState";
import KeySearchKeyGroup, { KeySearchKeyGroupProps } from "./KeySearchKeyGroup";
import { useCallback } from "react";
import SvgIconButton from "@frontend/components/SvgIconButton";

function AddGroup({ onClick, enabled }) {
  return (
    <Stack
      onClick={onClick}
      alignItems="center"
      justifyContent="center"
      sx={{
        opacity: enabled ? 1 : 0.2,
        cursor: enabled ? "pointer" : "default",
        minWidth: 150,
        minHeight: 150,
      }}
    >
      <SvgIconButton Icon={AddIcon} enabled={enabled} clickable />
      <Typography>Add</Typography>
    </Stack>
  );
}

function HandIdentifier({ hand }: { hand: KeySearchHandConstraint }) {
  switch (hand) {
    case KeySearchHandConstraint.Left:
      return (
        <Stack alignItems="center" justifyContent="center">
          <BackHandOutlinedIcon sx={{ transform: "scaleX(-1)" }} />
          <Typography>Left Hand</Typography>
        </Stack>
      );
    case KeySearchHandConstraint.Right:
      return (
        <Stack alignItems="center" justifyContent="center">
          <BackHandOutlinedIcon />
          <Typography>Right Hand</Typography>
        </Stack>
      );
    case KeySearchHandConstraint.Either:
      return (
        <Stack alignItems="center" justifyContent="center">
          <Typography>Either Hand</Typography>
        </Stack>
      );
  }
}

export default function KeySearchHand({
  hand,
  groups,
  sx = {},
  ...props
}: {
  hand: KeySearchHandConstraint;
  groups: KeySearchKeyGroupProps[];
} & StackProps) {
  const { createKeyGroup, deleteKeyGroup, deselectKey, editing } =
    useKeySearchState();
  const onAddGroup = useCallback(
    () => !editing && createKeyGroup(hand),
    [hand, editing],
  );
  const onDeleteGroup = useCallback(
    (groupIndex: number) => !editing && deleteKeyGroup(hand, groupIndex),
    [hand, editing],
  );
  const onBackgroundClick = useCallback(() => deselectKey, []);
  const canAddGroup = groups.length <= 3;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      margin={2}
      minHeight={200}
      padding={4}
      sx={{ ...sx, border: "3px solid black", borderRadius: 4 }}
      {...props}
    >
      <Stack
        sx={{ width: "100%" }}
        flex={0.8}
        minHeight={150}
        alignItems="center"
        onClick={onBackgroundClick}
      >
        <Stack
          flexDirection="row"
          onClick={onBackgroundClick}
          justifyContent="space-between"
        >
          {groups.map((keyGroup, index) => (
            <KeySearchKeyGroup
              key={index}
              {...keyGroup}
              groupIndex={index}
              hand={hand}
              canAddGroup={canAddGroup}
              onDeleteGroup={() => onDeleteGroup(index)}
              showButtons
            />
          ))}
          {canAddGroup && (
            <AddGroup onClick={onAddGroup} enabled={canAddGroup && !editing} />
          )}
        </Stack>
      </Stack>
      <Stack
        flex={0.2}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        sx={{ minWidth: 50, minHeight: 50 }}
        onClick={onBackgroundClick}
      >
        <HandIdentifier hand={hand} />
      </Stack>
    </Stack>
  );
}
