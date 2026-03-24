// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "IMI Scribe - AI Medical Scribe",
  description: "Automate clinical documentation with IMI Scribe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}