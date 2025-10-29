"use client";
import EmailCard from "../molecules/EmailCard";

export default function EmailGrid({ emails }: { emails: any[] }) {
  if (!emails || emails.length === 0)
    return <div className="text-slate-400 p-4">No emails to display</div>;
  return (
    <div className="grid grid-cols-1 gap-3">
      {emails.map((e) => (
        <EmailCard key={e.id} email={e} />
      ))}
    </div>
  );
}
