import { SvgIconProps, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useCallback } from "react";

export default function SvgIconButton({
  Icon,
  enabled = true,
  onClick,
  ...props
}: {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  enabled?: boolean;
  onClick?: () => void;
} & Omit<SvgIconProps, "onClick">) {
  const onClickInternal = useCallback(
    () => enabled && onClick && onClick(),
    [enabled, onClick],
  );
  return (
    <Icon
      sx={{
        opacity: enabled ? 1 : 0.6,
        cursor: enabled ? "pointer" : "default",
      }}
      onClick={onClickInternal}
      {...props}
    />
  );
}
