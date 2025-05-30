// src/components/AnimatedMessage.tsx

import React, { useEffect, useState } from "react";

interface Props {
  type?: "error" | "info";
  message: string;
  onHide?: () => void;
  duration?: number; // ms
}

export default function AnimatedMessage({
  type = "info",
  message,
  onHide,
  duration = 4000,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onHide && onHide(), 500); // match animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onHide]);

  return (
    <div
      className={`animated-message ${type} ${visible ? "show" : "hide"}`}
      style={{ position: "fixed", top: 40, left: 0, right: 0, margin: "auto", zIndex: 2222, width: "fit-content", minWidth: 250, maxWidth: 420 }}
    >
      {message}
    </div>
  );
}
