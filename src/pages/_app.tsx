import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  adjustFontFallback: true,
  display: "swap",
  preload: true,
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <main className={montserrat.className}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </SessionProvider>
    </QueryClientProvider>
  );
}
