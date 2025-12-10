'use client'

import { useState } from 'react'
import { X, Download } from 'lucide-react'
import Image from 'next/image'

interface ImagePreviewProps {
    logoUrl: string
    bannerUrl: string
    tokenName: string
    onClose?: () => void
}

export default function ImagePreview({
    logoUrl,
    bannerUrl,
    tokenName,
    onClose,
}: ImagePreviewProps) {
    const [activeTab, setActiveTab] = useState<'logo' | 'banner'>('logo')

    const handleDownload = (url: string, filename: string) => {
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
    }

    return (
        <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Token Artwork</h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('logo')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeTab === 'logo'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    Logo
                </button>
                <button
                    onClick={() => setActiveTab('banner')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeTab === 'banner'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    Banner
                </button>
            </div>

            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                {activeTab === 'logo' ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="relative w-64 h-64">
                            <Image
                                src={logoUrl}
                                alt={`${tokenName} logo`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full" style={{ paddingTop: '52.5%' }}>
                        <Image
                            src={bannerUrl}
                            alt={`${tokenName} banner`}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </div>

            <button
                onClick={() =>
                    handleDownload(
                        activeTab === 'logo' ? logoUrl : bannerUrl,
                        `${tokenName}-${activeTab}.png`
                    )
                }
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Download className="w-4 h-4" />
                Download {activeTab === 'logo' ? 'Logo' : 'Banner'}
            </button>
        </div>
    )
}
