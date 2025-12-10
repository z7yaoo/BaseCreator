'use client'

import { ConnectWallet as OnchainConnectWallet } from '@coinbase/onchainkit/wallet'
import { Wallet } from '@coinbase/onchainkit/wallet'
import { WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet'

export default function ConnectWallet() {
    return (
        <Wallet>
            <OnchainConnectWallet>
                <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold cursor-pointer">
                    Connect Wallet
                </div>
            </OnchainConnectWallet>
            <WalletDropdown>
                <WalletDropdownDisconnect />
            </WalletDropdown>
        </Wallet>
    )
}
