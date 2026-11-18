import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask the Silk | 36 Family",
  description: "Ask a question. Get a response. Definitely not legal advice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-navy antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
