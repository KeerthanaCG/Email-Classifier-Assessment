"use client";
import React from "react";

interface Props {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "danger";
}

export default function Button({ label, onClick, variant = "primary" }: Props) {
  const base = "px-4 py-2 rounded font-semibold text-white";
  const cls =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-red-600 hover:bg-red-700";
  return (
    <button onClick={onClick} className={`${base} ${cls}`}>
      {label}
    </button>
  );
}
