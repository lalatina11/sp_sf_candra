"use client";
import { useTheme } from "next-themes";
import React from "react";
import { Toaster } from "sonner";

const ToastProvider = () => {
  const { theme } = useTheme();
  return <Toaster invert={theme === "light"} />;
};

export default ToastProvider;
