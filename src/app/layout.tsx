import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import SpaceToaster from "@/components/Toaster";

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
export const metadata: Metadata = {
  title: "ZeroRain",
  description:
    "Project for Nasa space apps hackathon, Will it rain on my parade",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <main>
          <SpaceToaster />
          {children}
        </main>
      </body>
    </html>
  );
}
