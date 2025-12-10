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
        'fc:miniapp': JSON.stringify({
            version: '1',
            imageUrl: `${APP_URL}/frame-image.png`,
            button: {
                title: 'Create Token',
                action: {
                    type: 'launch_miniapp',
                    url: APP_URL,
                },
            },
        }),
        'fc:frame': JSON.stringify({
            version: '1',
            imageUrl: `${APP_URL}/frame-image.png`,
            button: {
                title: 'Create Token',
                action: {
                    type: 'launch_frame',
                    url: APP_URL,
                },
            },
        }),
    },
    openGraph: {
        type: 'website',
        title: 'BaseCreator',
        description: 'Create meme tokens on Base',
        siteName: 'BaseCreator',
        url: APP_URL,
        images: [
            {
                url: `${APP_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'BaseCreator - Create meme tokens on Base',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BaseCreator',
        description: 'Create meme tokens on Base',
        images: [`${APP_URL}/og-image.png`],
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
