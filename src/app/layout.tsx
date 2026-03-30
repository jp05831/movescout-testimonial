import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Share Your Story | MoveScout",
  description: "Leave a video testimonial and earn $100 in ad credits for your moving company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-gray-900">{children}</body>
    </html>
  );
}
