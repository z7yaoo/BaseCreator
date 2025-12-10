'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Onboarding from '@/components/Onboarding'
import TokenCreator from '@/components/TokenCreator'
import UserProfile from '@/components/UserProfile'
import ConnectWallet from '@/components/ConnectWallet'

export default function Home() {
    const [showOnboarding, setShowOnboarding] = useState(true)
    const { address, isConnected } = useAccount()

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
        if (hasSeenOnboarding === 'true') {
            setShowOnboarding(false)
        }
    }, [])

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenOnboarding', 'true')
        setShowOnboarding(false)
    }

    if (showOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-meme rounded-full flex items-center justify-center text-white font-bold text-lg">
                                BC
                            </div>
                            <h1 className="text-xl font-bold text-white">BaseCreator</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {isConnected && address && <UserProfile address={address} />}
                            <ConnectWallet />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-12 animate-fadeIn">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Create Your Meme Token
                        </h2>
                        <p className="text-lg text-gray-300 mb-2">
                            Launch on Base blockchain instantly
                        </p>
                        <p className="text-sm text-gray-400">
                            Browse freely • Connect to deploy • 0.01 ETH fee
                        </p>
                    </div>

                    {/* Creator */}
                    <TokenCreator isConnected={isConnected} />

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                            <div className="text-3xl mb-3">🎨</div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Custom Artwork
                            </h3>
                            <p className="text-sm text-gray-400">
                                Unique logos and banners for your token
                            </p>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                            <div className="text-3xl mb-3">⚡</div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Instant Deploy
                            </h3>
                            <p className="text-sm text-gray-400">
                                One transaction deployment on Base
                            </p>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                            <div className="text-3xl mb-3">💎</div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Low Cost
                            </h3>
                            <p className="text-sm text-gray-400">
                                Just 0.01 ETH to create your token
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-black/20 backdrop-blur-sm mt-20">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-gray-400">
                        <p>Built on Base • Powered by OnchainKit</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
