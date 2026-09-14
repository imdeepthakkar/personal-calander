import type { Metadata, Viewport } from "next";
import { Nunito, DM_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-nunito",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Personal Calendar | Multi-Timezone Workload Planner",
  description: "High-density multi-timezone workload calendar and To-Do workspace",
  manifest: "/personal-calendar/manifest.json",
  icons: {
    icon: "/personal-calendar/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${dmSans.variable}`}>
      <head>
        <link rel="manifest" href="manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Personal Calendar" />
      </head>
      <body className="font-dm-sans antialiased select-none bg-clay-canvas text-clay-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
