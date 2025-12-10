import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://basecreator.vercel.app'

export const metadata: Metadata = {
    title: 'BaseCreator',
    description: 'Create meme tokens on Base',
    metadataBase: new URL(APP_URL),
    other: {
        'base:app_id': '6939a9f4e6be54f5ed71d527',
        'fc:frame': 'vNext',
        'fc:frame:image': `${APP_URL}/og-image.png`,
        'fc:frame:button:1': 'Create Token',
        'fc:frame:button:1:action': 'link',
        'fc:frame:button:1:target': APP_URL,
    },
    openGraph: {
        title: 'BaseCreator',
        description: 'Create meme tokens on Base',
        images: ['/og-image.png'],
        url: APP_URL,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BaseCreator',
        description: 'Create meme tokens on Base',
        images: ['/og-image.png'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
