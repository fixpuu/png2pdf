import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PNG to PDF Pro | Unisci Immagini PNG in PDF ad Alta Risoluzione",
  description:
    "Web app moderna e veloce per combinare più immagini PNG in un unico documento PDF. Riordino facile con drag-and-drop o pulsanti freccia, 100% client-side nel tuo browser.",
  keywords: [
    "png to pdf",
    "unisci png in pdf",
    "convertitore png pdf",
    "combina immagini pdf",
    "pdf client side",
    "alta risoluzione",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
