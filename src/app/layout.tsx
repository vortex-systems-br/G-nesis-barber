import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gênesis Barbearia | Corte e Barba em Araçatuba–SP",
  description: "Corte de cabelo, barba, limpeza de pele e assinatura mensal na Gênesis Barbearia, no Residencial Paquere II em Araçatuba–SP.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "Gênesis Barbearia",
  telephone: "+5518981212959",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. 2 de Dezembro, 149 - Residencial Paquere II",
    addressLocality: "Araçatuba",
    addressRegion: "SP",
    addressCountry: "BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${oswald.variable} dark`}>
      <body className="bg-zinc-950 text-zinc-50 font-sans antialiased selection:bg-amber-500 selection:text-zinc-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
