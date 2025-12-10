import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bmadv6.com'

export const metadata: Metadata = {
    title: 'BaseCreator - Meme Token Creator',
    description: 'Create meme tokens on Base in seconds',
    metadataBase: new URL(APP_URL),
    other: {
        'fc:frame': 'vNext',
        'fc:frame:image': `${APP_URL}/og-image.png`,
        'fc:frame:button:1': 'Create Token',
        'fc:frame:button:1:action': 'link',
        'fc:frame:button:1:target': APP_URL,
    },
    openGraph: {
        title: 'BaseCreator - Meme Token Creator',
        description: 'Create meme tokens on Base in seconds',
        images: ['/og-image.png'],
        url: APP_URL,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BaseCreator - Meme Token Creator',
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
