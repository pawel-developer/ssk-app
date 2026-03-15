import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SSK — Studenckie Stowarzyszenie Kardiologiczne | Dołącz do nas",
  description:
    "Studenckie Stowarzyszenie Kardiologiczne — 200+ studentów z 15+ uczelni medycznych. Warsztaty ECHO i EKG, szkoły letnie, konferencje kardiologiczne. Dołącz do nas!",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    title: "SSK — Studenckie Stowarzyszenie Kardiologiczne",
    description:
      "200+ studentów z 15+ uczelni medycznych. Warsztaty ECHO i EKG, szkoły letnie, konferencje. Dołącz do społeczności przyszłych kardiologów!",
    url: "https://sskardio.pl/",
    locale: "pl_PL",
    images: ["/img/ssk-og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSK — Studenckie Stowarzyszenie Kardiologiczne",
    description:
      "200+ studentów z 15+ uczelni medycznych. Dołącz do społeczności przyszłych kardiologów!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1b2a4a" />
        <meta name="theme-color" content="#1b2a4a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Studenckie Stowarzyszenie Kardiologiczne",
              alternateName: "SSK",
              url: "https://sskardio.pl",
              logo: "/img/ssk-og-image.png",
              description:
                "Studenckie Stowarzyszenie Kardiologiczne — łączymy studentów z pasją do kardiologii z 15+ uczelni medycznych w całej Polsce.",
              foundingDate: "2024-10-04",
              address: {
                "@type": "PostalAddress",
                streetAddress: "ul. 1 Maja 6/61",
                addressLocality: "Warszawa",
                postalCode: "02-495",
                addressCountry: "PL",
              },
              sameAs: [
                "https://www.facebook.com/profile.php?id=61563630476411",
                "https://www.instagram.com/studenckie_kardio/",
                "https://www.linkedin.com/company/studenckie-stowarzyszenie-kardiologiczne",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "studenckiestowarzyszeniekardio@gmail.com",
                contactType: "general",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
