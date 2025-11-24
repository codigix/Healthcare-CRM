import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedixPro - Medical Admin Dashboard",
  description: "Professional Medical Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-primary text-white">{children}</body>
    </html>
  );
}
