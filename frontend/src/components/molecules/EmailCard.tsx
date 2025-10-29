"use client";
import { Card, CardContent, Typography } from "@mui/material";
import CategoryChip from "../atoms/CategoryChip";

export default function EmailCard({
  email,
  onClick,
}: {
  email: any;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      sx={{ bgcolor: "#0b1220", color: "#fff", cursor: "pointer" }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ color: "#cbd5e1" }}>
          {email.subject || email.snippet}
        </Typography>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-slate-400">{email.from}</div>
          <CategoryChip category={email.category} />
        </div>
      </CardContent>
    </Card>
  );
}
