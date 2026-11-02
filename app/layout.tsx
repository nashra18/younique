// app/layout.tsx
import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/Provider/transitionProvider";
// adjust this path to wherever your ShopProvider.tsx file is
import { ShopProvider } from "@/components/(shoppage)/ShopProvider";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Younique",
  description: "Be uniquely you. Streetwear, recycled and tailored pieces.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${instrument.variable} ${manrope.variable} flex min-h-full flex-col bg-[#F7F7F5] font-[family-name:var(--font-manrope)] text-[#1F2326]`}
      >
        <ShopProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </ShopProvider>
      </body>
    </html>
  );
}