import { SvgIconProps, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useCallback } from "react";

export default function SvgIconButton({
  Icon,
  enabled = true,
  show = true,
  clickable = false,
  onClick,
  sx = {},
  ...props
}: {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  enabled?: boolean;
  show?: boolean;
  clickable?: boolean;
  onClick?: () => void;
} & Omit<SvgIconProps, "onClick">) {
  const onClickInternal = useCallback(
    () => enabled && onClick && onClick(),
    [enabled, onClick],
  );
  return (
    <Icon
      sx={{
        opacity: !show ? 0 : enabled ? 1 : 0.6,
        cursor:
          show && enabled && (onClick || clickable) ? "pointer" : "default",
        ...sx,
      }}
      onClick={onClickInternal}
      {...props}
    />
  );
}
