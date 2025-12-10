'use client'

import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { CREATION_FEE } from '@/lib/contract'

interface DeployModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    tokenName: string
    tokenSymbol: string
    totalSupply: string
    isDeploying: boolean
    deploySuccess: boolean
    contractAddress?: string
    error?: string
}

export default function DeployModal({
    isOpen,
    onClose,
    onConfirm,
    tokenName,
    tokenSymbol,
    totalSupply,
    isDeploying,
    deploySuccess,
    contractAddress,
    error,
}: DeployModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                        {deploySuccess ? 'Success!' : isDeploying ? 'Deploying...' : 'Confirm Deployment'}
                    </h3>
                    {!isDeploying && (
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    )}
                </div>

                {deploySuccess ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <p className="text-gray-300 mb-4">
                            Your token has been deployed successfully!
                        </p>
                        <div className="bg-gray-900 rounded-lg p-3 mb-4">
                            <p className="text-xs text-gray-400 mb-1">Contract Address</p>
                            <p className="text-sm text-white font-mono break-all">
                                {contractAddress}
                            </p>
                        </div>
                        <a
                            href={`https://basescan.org/address/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                            View on Basescan →
                        </a>
                    </div>
                ) : isDeploying ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-300">Deploying your token...</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Please confirm the transaction in your wallet
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Token Name</span>
                                <span className="text-white font-semibold">{tokenName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Symbol</span>
                                <span className="text-white font-semibold">{tokenSymbol}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Supply</span>
                                <span className="text-white font-semibold">
                                    {parseFloat(totalSupply).toLocaleString()}
                                </span>
                            </div>
                            <div className="border-t border-gray-700 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Creation Fee</span>
                                    <span className="text-white font-semibold">{CREATION_FEE} ETH</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold"
                            >
                                Deploy Token
                            </button>
                        </div>
                    </>
                )}

                {deploySuccess && (
                    <button
                        onClick={onClose}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold"
                    >
                        Create Another Token
                    </button>
                )}
            </div>
        </div>
    )
}
