import GoogleProvider from "@/components/GoogleProvider";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXT Commerce",
  description: "NEXT Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`lexend antialiased h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleProvider>
            <Nav />
            <div className="container mx-auto h-full">{children}</div>
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
