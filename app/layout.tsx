import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "NyaSakura Server",
  description: "一个充满创意与欢乐的 Minecraft 服务器",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <div className="max-w-screen-2xl mx-auto">
              <Navbar />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
