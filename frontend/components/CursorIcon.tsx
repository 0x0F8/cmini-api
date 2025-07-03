import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";

export default function CursorIcon() {
  return (
    <HorizontalRuleOutlinedIcon
      sx={{
        transform: "rotate(90deg)",
        "@keyframes blink": {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0,
          },
        },
        animation: "blink 0.5s linear infinite",
      }}
    />
  );
}
