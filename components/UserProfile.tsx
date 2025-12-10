'use client'

import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { getMiniKit } from '@/lib/minikit'

interface UserProfileProps {
    address: string
}

export default function UserProfile({ address }: UserProfileProps) {
    const [displayName, setDisplayName] = useState<string>('')
    const [avatarUrl, setAvatarUrl] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const miniKit = getMiniKit()
                const user = miniKit.getUser()

                // Always display username/avatar, never raw address
                setDisplayName(miniKit.getDisplayName())
                setAvatarUrl(miniKit.getAvatar())
            } catch (error) {
                console.error('Failed to load profile:', error)
                // Fallback to generated profile (never show raw address)
                setDisplayName(`Player${address.slice(-4)}`)
                setAvatarUrl(`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`)
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [address])

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                        // Fallback to default avatar on error
                        (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/identicon/svg?seed=default'
                    }}
                />
            ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                    {displayName}
                </span>
                <span className="text-xs text-gray-400">
                    Connected
                </span>
            </div>
        </div>
    )
}