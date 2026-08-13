"use client";

import { useEffect } from "react";

export default function FeedbackHashScroll() {
  useEffect(() => {
    if (window.location.hash !== "#product-feedback") return;
    requestAnimationFrame(() => {
      document.getElementById("product-feedback")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return null;
}
