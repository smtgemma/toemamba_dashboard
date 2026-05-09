import "./globals.css";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "@/lib/Provider";



const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Shyfty Dashboard",
  description:
    "Accurate shift handoffs for safer, smoother operations.",
  keywords: ["Shyfty", "Shyfty Dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} font-sans antialiased`}
      >
        <Toaster position="top-center" />
        <Providers>

          {children}

        </Providers>
      </body>
    </html>
  );
}
