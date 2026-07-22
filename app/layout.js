import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getContentData } from "@/lib/db";

export const metadata = {
  title: "CrownCarat | Fine Jewelry & Certified Diamonds — Manufacturer & Exporter",
  description: "CrownCarat crafts and exports certified 18k gold and diamond jewelry — from single bespoke pieces to bulk wholesale orders — for retail buyers, importers, and jewelry stores worldwide.",
  keywords: "jewelry manufacturer, diamond exporter, wholesale jewelry, bespoke jewelry, IGI certified diamonds, gold jewelry factory",
};

export default async function RootLayout({ children }) {
  const content = await getContentData();
  const settings = content?.settings || {
    whatsappNumber: "919427059390",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com"
  };

  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer settings={settings} />
        <WhatsAppFloat settings={settings} />
      </body>
    </html>
  );
}
