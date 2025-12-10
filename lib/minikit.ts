// MiniKit SDK Implementation for Base Mini Apps
// Provides wallet connection and user profile management

import { type Address } from 'viem'

export interface MiniKitUser {
  address?: Address
  username?: string
  avatar?: string
  isGuest: boolean
}

export interface MiniKitConfig {
  appName: string
  appUrl: string
  chainId: number
}

class MiniKit {
  private user: MiniKitUser = { isGuest: true }
  private config: MiniKitConfig

  constructor(config: MiniKitConfig) {
    this.config = config
    this.loadUserFromStorage()
  }

  // Initialize MiniKit
  async init() {
    // Check if we're in a Base app context
    const isInBaseApp = this.detectBaseApp()

    if (isInBaseApp) {
      // Try to get user info from Base app
      await this.getUserFromBaseApp()
    }

    return this
  }

  // Detect if running inside Base app
  private detectBaseApp(): boolean {
    // Check for Base app injected provider
    if (typeof window !== 'undefined') {
      return !!(window as any).baseWallet || !!(window as any).ethereum?.isBase
    }
    return false
  }

  // Get user info from Base app
  private async getUserFromBaseApp() {
    try {
      if (typeof window !== 'undefined' && (window as any).baseWallet) {
        const baseWallet = (window as any).baseWallet

        // Get address from Base wallet
        const accounts = await baseWallet.request({ method: 'eth_accounts' })
        if (accounts && accounts.length > 0) {
          this.user.address = accounts[0] as Address
          this.user.isGuest = false

          // Get profile info if available
          if (baseWallet.getProfile) {
            const profile = await baseWallet.getProfile()
            this.user.username = profile.username || this.formatAddress(accounts[0])
            this.user.avatar = profile.avatar || this.generateAvatar(accounts[0])
          } else {
            // Fallback to formatted address and generated avatar
            this.user.username = this.formatAddress(accounts[0])
            this.user.avatar = this.generateAvatar(accounts[0])
          }
        }
      }
    } catch (error) {
      console.error('Failed to get user from Base app:', error)
    }
  }

  // Load user from localStorage for persistence
  private loadUserFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('minikit_user')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          this.user = { ...this.user, ...data }
        } catch (e) {
          console.error('Failed to load user from storage:', e)
        }
      }
    }
  }

  // Save user to localStorage
  private saveUserToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minikit_user', JSON.stringify(this.user))
    }
  }

  // Format address for display (never show raw address)
  private formatAddress(address: string): string {
    if (!address) return 'Guest Player'
    // Return a friendly username format
    return `Player${address.slice(-4)}`
  }

  // Generate avatar from address
  private generateAvatar(address: string): string {
    // Generate a deterministic avatar URL based on address
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`
  }

  // Get current user
  getUser(): MiniKitUser {
    return this.user
  }

  // Connect wallet (stays in-app, no redirects)
  async connectWallet(): Promise<MiniKitUser> {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = (window as any).ethereum

        // Request accounts
        const accounts = await provider.request({
          method: 'eth_requestAccounts'
        })

        if (accounts && accounts.length > 0) {
          this.user.address = accounts[0] as Address
          this.user.isGuest = false
          this.user.username = this.formatAddress(accounts[0])
          this.user.avatar = this.generateAvatar(accounts[0])

          this.saveUserToStorage()
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }

    return this.user
  }

  // Disconnect wallet
  disconnect() {
    this.user = { isGuest: true }
    this.saveUserToStorage()
  }

  // Check if user is connected
  isConnected(): boolean {
    return !this.user.isGuest && !!this.user.address
  }

  // Get display name (never shows raw address)
  getDisplayName(): string {
    if (this.user.username) return this.user.username
    if (this.user.address) return this.formatAddress(this.user.address)
    return 'Guest Player'
  }

  // Get avatar URL
  getAvatar(): string {
    if (this.user.avatar) return this.user.avatar
    if (this.user.address) return this.generateAvatar(this.user.address)
    return 'https://api.dicebear.com/7.x/identicon/svg?seed=guest'
  }
}

// Export singleton instance
let miniKitInstance: MiniKit | null = null

export const initMiniKit = async (config: MiniKitConfig) => {
  if (!miniKitInstance) {
    miniKitInstance = new MiniKit(config)
    await miniKitInstance.init()
  }
  return miniKitInstance
}

export const getMiniKit = (): MiniKit => {
  if (!miniKitInstance) {
    throw new Error('MiniKit not initialized. Call initMiniKit first.')
  }
  return miniKitInstance
}

export default MiniKit