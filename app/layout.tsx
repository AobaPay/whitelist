import type React from "react"
import type { Metadata } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Gateway de Pagamento Pix - R$ 0,78 por transação",
  description:
    "Gateway de pagamento com Pix por apenas R$ 0,78 por transação. Entre na lista de espera e seja um dos primeiros a usar nossa solução.",
  keywords: "gateway de pagamento, pix, pagamento online, taxa fixa, R$ 0,78",
  openGraph: {
    title: "Gateway de Pagamento Pix - R$ 0,78 por transação",
    description: "Gateway de pagamento com Pix por apenas R$ 0,78 por transação",
    type: "website",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`font-sans ${bricolageGrotesque.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
