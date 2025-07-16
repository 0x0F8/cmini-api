import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { Toggle } from "@/types";
import { useCallback } from "react";

export default function TripleToggle({
  onChange,
  value,
  size = "small",
  ...props
}: { value: Toggle; onChange: (event: any, value: Toggle) => void } & Omit<
  ToggleButtonGroupProps,
  "children"
>) {
  const onClick = useCallback((_, value) => {
    if (value === null) return;
    onChange && onChange(_, value);
  }, []);
  return (
    <ToggleButtonGroup
      size={size}
      exclusive
      {...props}
      value={value}
      onChange={onClick}
      sx={{
        ".MuiToggleButtonGroup-firstButton": {
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        },
        ".MuiToggleButtonGroup-lastButton": {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        },
        ":not(.Mui-selected) .MuiSvgIcon-root": {
          opacity: 0.9,
          fontWeight: "normal",
        },
        ".Mui-selected .MuiSvgIcon-root": {
          opacity: 1,
          fontWeight: "bold",
        },
      }}
    >
      <ToggleButton value={2} aria-label="left aligned">
        <HorizontalRuleIcon
          fontSize={size}
          sx={{
            "&.MuiSvgIcon-fontSizeSmall": {
              fontSize: 14,
            },
          }}
        />
      </ToggleButton>
      <ToggleButton value={1} aria-label="centered">
        <CheckIcon
          fontSize={size}
          sx={{
            "&.MuiSvgIcon-fontSizeSmall": {
              fontSize: 14,
            },
          }}
        />
      </ToggleButton>
      <ToggleButton value={0} aria-label="right aligned">
        <CloseIcon
          fontSize={size}
          sx={{
            "&.MuiSvgIcon-fontSizeSmall": {
              fontSize: 14,
            },
          }}
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
