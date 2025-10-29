"use client";
import React from "react";

interface Props {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
    />
  );
}
