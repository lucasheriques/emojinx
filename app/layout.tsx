import "./globals.css";
import type { Metadata } from "next";
import { Inter, Chewy } from "next/font/google";
import Providers from "./providers";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import TailwindIndicator from "@/components/tailwind-indicator";
import FloatingActionButton from "@/components/floating-action-button";

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
        <NextTopLoader color="#c026d3" showSpinner={false} />
        <Providers>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex flex-1 p-4 relative">
              <div className="mx-auto max-w-7xl w-full flex">{children}</div>
            </main>

            <footer className="py-4 text-sm dark:bg-slate-900 bg-slate-100 shadow-inner flex justify-center">
              © 2023-present emojinx.
            </footer>
          </div>
          <Toaster />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
