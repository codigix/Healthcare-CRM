import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/Layout/ClientLayout";
import MedixProAI from "@/components/MedixProAI";
import { ThemeProvider } from "@/components/ThemeProvider";

const publicSans = Public_Sans({
 subsets: ["latin"],
 weight: ["400", "500", "600", "700"],
 variable: "--font-public-sans",
});

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
    <html lang="en" className={publicSans.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientLayout>
            {children}
          </ClientLayout>
          <MedixProAI />
        </ThemeProvider>
      </body>
    </html>
  );
}
