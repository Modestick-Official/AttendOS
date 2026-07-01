import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'AttendOS - Enterprise RFID Dashboard',
  description: 'Industrial RFID Telemetry & Edge-Sync Architecture for enterprise access control and workforce management',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#070b16] text-slate-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
