import { Fab, Zoom } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState, useEffect, useCallback } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const onClick = useCallback(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          transition: "transform 0.3s ease-in-out",
        }}
        aria-label="back to top"
        onClick={onClick}
      >
        <ArrowUpwardIcon />
      </Fab>
    </Zoom>
  );
}
