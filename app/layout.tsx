import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emoji Match",
  description: "A fun and interactive emoji matching game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="py-4 text-sm bg-slate-900 flex justify-center">
              © 2023-present Emoji Match.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
