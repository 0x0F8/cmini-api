import { InputBase, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import style from "./KeySearchForm.module.sass";
import { useCallback, KeyboardEvent, useRef, useEffect } from "react";
import {
  getCharFromCode,
  getDownshiftedKey,
  getPrintableChars,
} from "@util/input";
import CursorIcon from "@frontend/components/CursorIcon";

export type KeySearchKeyProps = {
  value: string | undefined;
  selected: boolean;
  error: boolean;
};

const printableChars = getPrintableChars();

export default function KeySearchKey({
  value,
  error,
  selected,
  onSelect,
  canSelect,
  onEdit,
}: KeySearchKeyProps & {
  onSelect: Function;
  onEdit: Function;
  canSelect: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onSelectInternal = useCallback(() => {
    if (!canSelect) return;
    onSelect();
    if (ref.current) {
      ref.current.focus();
    }
  }, [canSelect]);

  const onEditInternal = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!selected) return;
      const code = getCharFromCode(event.code);
      const keyCode = code.charCodeAt(0);
      const isPrintable = printableChars.includes(keyCode);
      if (!isPrintable) return;
      const char = getDownshiftedKey(String.fromCharCode(keyCode));
      onEdit(char);

      if (ref.current) {
        ref.current.blur();
      }
    },
    [ref, ref.current, selected],
  );

  useEffect(() => {
    if (selected) {
      ref.current!.focus();
    }
  }, [selected, ref, ref.current]);

  return (
    <Stack
      className={clsx({
        [style["key-search-key"]]: true,
        [style["selected"]]: selected,
        [style["error"]]: error,
      })}
      onClick={onSelectInternal}
      alignContent="center"
      justifyContent="center"
      flexDirection="row"
    >
      <Stack flexDirection="column" alignItems="center" justifyContent="center">
        {selected ? (
          <CursorIcon />
        ) : (
          <Typography sx={{ textTransform: "uppercase" }}>{value}</Typography>
        )}
      </Stack>
      <InputBase
        inputRef={ref}
        onKeyDown={onEditInternal}
        sx={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />
    </Stack>
  );
}
