"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "@/components/error-page";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <ConvexProvider client={convex}>
        <JotaiProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </JotaiProvider>
      </ConvexProvider>
    </ErrorBoundary>
  );
}
