'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base } from 'wagmi/chains'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { ReactNode, useState, useEffect } from 'react'
import { initMiniKit } from '@/lib/minikit'

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    useEffect(() => {
        // Initialize MiniKit for Base mini app
        initMiniKit({
            appName: 'BaseCreator',
            appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            chainId: 8453, // Base mainnet
        })
    }, [])

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={base}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
