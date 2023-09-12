import "./globals.css";
import type { Metadata } from "next";
import { Inter, Chewy, Mystery_Quest } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chewy",
});

export const metadata: Metadata = {
  title: "emojinx",
  description: "A fun and interactive emoji matching game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${chewy.variable} font-sans`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex flex-1 p-4">{children}</main>
            <footer className="py-4 text-sm dark:bg-slate-900 bg-slate-100 shadow-inner flex justify-center">
              © 2023-present emojinx.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
