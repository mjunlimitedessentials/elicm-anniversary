import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SITE } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#e3a83c",
          colorBackground: "#0a0a0b",
          colorInputBackground: "#17171a",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#9ca3af",
          borderRadius: "9999px",
        },
        elements: {
          card: "bg-transparent shadow-none",
          formButtonPrimary:
            "bg-gold text-black font-bold hover:opacity-90 shadow-none",
          socialButtonsBlockButton: "bg-surface border border-border text-white",
          footer: "hidden",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="min-h-screen bg-background font-sans text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
