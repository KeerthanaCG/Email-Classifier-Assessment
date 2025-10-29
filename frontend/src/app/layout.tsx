import "./globals.css";
import { SessionProvider } from "../context/SessionContext";

export const metadata = {
  title: "Email Classifier",
  description: "AI-powered email classification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
