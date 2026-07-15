import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata = {
  title: "AURELIA | Fine Jewelry & Certified Diamonds — Manufacturer & Exporter",
  description: "AURELIA crafts and exports certified 18k gold and diamond jewelry — from single bespoke pieces to bulk wholesale orders — for retail buyers, importers, and jewelry stores worldwide.",
  keywords: "jewelry manufacturer, diamond exporter, wholesale jewelry, bespoke jewelry, GIA certified diamonds, gold jewelry factory",
};

export default function RootLayout({ children }) {
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
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
