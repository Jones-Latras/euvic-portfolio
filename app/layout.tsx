import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import { DM_Mono, Manrope, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { getSettings } from '@/lib/data'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Portfolio | Architectural Design',
    template: '%s | Architectural Portfolio',
  },
  description: 'Showcasing architectural drafting and design work.',
  openGraph: {
    title: 'Portfolio | Architectural Design',
    description: 'Showcasing architectural drafting and design work.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  noStore()
  const settings = await getSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.querySelectorAll('[fdprocessedid]').forEach(function (node) { node.removeAttribute('fdprocessedid'); });",
          }}
        />
      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} ${dmMono.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <a
              href="#main-content"
              className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-950"
            >
              Skip to content
            </a>
            <Header studentName={settings.student_name || 'Euvic Abellano'} />
            <main id="main-content">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
