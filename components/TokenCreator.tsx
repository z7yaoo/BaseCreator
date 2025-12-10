'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Sparkles, Loader2, Rocket } from 'lucide-react'
import { FACTORY_ABI, FACTORY_ADDRESS, CREATION_FEE } from '@/lib/contract'
import { generateTokenImages } from '@/utils/gemini'
import { validateTokenInput } from '@/utils/helpers'
import ImagePreview from './ImagePreview'
import DeployModal from './DeployModal'

interface TokenCreatorProps {
    isConnected: boolean
}

export default function TokenCreator({ isConnected }: TokenCreatorProps) {
    const { address } = useAccount()

    // Form state
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [totalSupply, setTotalSupply] = useState('')
    const [decimals, setDecimals] = useState('18')
    const [theme, setTheme] = useState('')

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false)
    const [logoUrl, setLogoUrl] = useState('')
    const [bannerUrl, setBannerUrl] = useState('')
    const [showPreview, setShowPreview] = useState(false)

    // Deploy state
    const [showDeployModal, setShowDeployModal] = useState(false)
    const [error, setError] = useState('')

    const { writeContract, data: hash, isPending: isDeploying } = useWriteContract()
    const { isSuccess: deploySuccess } = useWaitForTransactionReceipt({ hash })

    const handleGenerateImages = async () => {
        const validation = validateTokenInput(tokenName, tokenSymbol, totalSupply)
        if (!validation.valid) {
            setError(validation.error || '')
            return
        }

        setError('')
        setIsGenerating(true)

        try {
            const images = await generateTokenImages(tokenName, tokenSymbol, theme)
            setLogoUrl(images.logo.url)
            setBannerUrl(images.banner.url)
            setShowPreview(true)
        } catch (err) {
            setError('Failed to generate images. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDeploy = () => {
        if (!isConnected) {
            setError('Please connect your wallet first')
            return
        }

        if (!logoUrl || !bannerUrl) {
            setError('Please generate images first')
            return
        }

        const validation = validateTokenInput(tokenName, tokenSymbol, totalSupply)
        if (!validation.valid) {
            setError(validation.error || '')
            return
        }

        setShowDeployModal(true)
    }

    const confirmDeploy = async () => {
        try {
            writeContract({
                address: FACTORY_ADDRESS,
                abi: FACTORY_ABI,
                functionName: 'createMemeToken',
                args: [
                    tokenName,
                    tokenSymbol,
                    BigInt(totalSupply),
                    Number(decimals),
                    logoUrl,
                    bannerUrl,
                ],
                value: parseEther(CREATION_FEE),
            })
        } catch (err: any) {
            setError(err.message || 'Deployment failed')
        }
    }

    const resetForm = () => {
        setTokenName('')
        setTokenSymbol('')
        setTotalSupply('')
        setDecimals('18')
        setTheme('')
        setLogoUrl('')
        setBannerUrl('')
        setShowPreview(false)
        setShowDeployModal(false)
        setError('')
    }

    return (
        <>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Create Your Token</h2>

                <div className="space-y-4">
                    {/* Token Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Token Name
                        </label>
                        <input
                            type="text"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            placeholder="e.g., Doge Moon"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Token Symbol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Symbol
                        </label>
                        <input
                            type="text"
                            value={tokenSymbol}
                            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                            placeholder="e.g., DMOON"
                            maxLength={10}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors uppercase"
                        />
                    </div>

                    {/* Total Supply & Decimals */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Total Supply
                            </label>
                            <input
                                type="number"
                                value={totalSupply}
                                onChange={(e) => setTotalSupply(e.target.value)}
                                placeholder="1000000"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Decimals
                            </label>
                            <select
                                value={decimals}
                                onChange={(e) => setDecimals(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="18">18 (Standard)</option>
                                <option value="9">9</option>
                                <option value="6">6</option>
                                <option value="0">0</option>
                            </select>
                        </div>
                    </div>

                    {/* Theme (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Theme (Optional)
                        </label>
                        <input
                            type="text"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            placeholder="e.g., space, neon, retro"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Generate Images Button */}
                    <button
                        onClick={handleGenerateImages}
                        disabled={isGenerating}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate Logo & Banner
                            </>
                        )}
                    </button>

                    {/* Deploy Button */}
                    {logoUrl && bannerUrl && (
                        <button
                            onClick={handleDeploy}
                            disabled={!isConnected || isDeploying}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
                        >
                            {!isConnected ? (
                                'Connect Wallet to Deploy'
                            ) : isDeploying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Deploying...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-5 h-5" />
                                    Deploy Token ({CREATION_FEE} ETH)
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Image Preview */}
            {showPreview && logoUrl && bannerUrl && (
                <div className="mt-6">
                    <ImagePreview
                        logoUrl={logoUrl}
                        bannerUrl={bannerUrl}
                        tokenName={tokenName}
                        onClose={() => setShowPreview(false)}
                    />
                </div>
            )}

            {/* Deploy Modal */}
            <DeployModal
                isOpen={showDeployModal}
                onClose={() => setShowDeployModal(false)}
                onConfirm={confirmDeploy}
                tokenName={tokenName}
                tokenSymbol={tokenSymbol}
                totalSupply={totalSupply}
                isDeploying={isDeploying}
                deploySuccess={deploySuccess}
                contractAddress={hash}
                error={error}
            />
        </>
    )
}
