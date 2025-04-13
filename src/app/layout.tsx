import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'Prashantkumar Khatri | Full Stack Developer',
  description: 'Portfolio of Prashantkumar Khatri, Full Stack Developer and Automation Expert',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
