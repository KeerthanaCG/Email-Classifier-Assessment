"use client";
import { Chip } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BlockIcon from "@mui/icons-material/Block";
import { JSX } from "react";

const categoryConfig: Record<string, { color: string; icon: JSX.Element }> = {
  Important: { color: "#06b6d4", icon: <WorkIcon /> },
  Promotions: { color: "#0284c7", icon: <LocalOfferIcon /> },
  Social: { color: "#7c3aed", icon: <PersonIcon /> },
  Marketing: { color: "#f97316", icon: <LocalOfferIcon /> },
  Spam: { color: "#ef4444", icon: <BlockIcon /> },
  General: { color: "#64748b", icon: <BlockIcon /> },
};

export default function CategoryChip({ category }: { category?: string }) {
  const cfg = categoryConfig[category || "General"] || categoryConfig.General;
  return (
    <Chip
      icon={cfg.icon}
      label={category || "General"}
      sx={{ bgcolor: cfg.color, color: "white", fontWeight: 600 }}
    />
  );
}
