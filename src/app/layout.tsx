import type { Metadata } from "next";
import "./globals.css";
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: "Eksootikareisid",
  description: "Eksootilised reisid parimatelt reisikorraldajatelt",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
