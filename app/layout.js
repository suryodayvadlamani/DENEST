import { AuthProvider } from "./lib/Provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@components/ThemeProvider";
import { Toaster } from "@UI/toaster";
import { siteConfig } from "@/config/site";
import TanstackProvider from "@components/providers/TanstackProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="referrer" content="no-referrer" />
      <body
        className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <TanstackProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              <main className="w-screen relative flex min-h-screen flex-col">
                {children}
                <Toaster />
              </main>
            </TanstackProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
