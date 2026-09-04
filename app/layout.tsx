import { Analytics } from '@vercel/analytics/next'
import { Noto_Sans_JP } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-sans-jp' })

export const metadata: Metadata = {
  title: 'まちをまもれ！ | Levee Defense Simulator',
  description: '材料を選んで堤防を設計し、10秒間、川沿いの町を守る防災シミュレーター。',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f5f0',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" className={`bg-background ${notoSansJP.variable}`}><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
