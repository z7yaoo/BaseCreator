// EIP-5792 Transaction Batching Implementation
// Batches multiple sequential on-chain actions into a single transaction

import { type Address, type Hex, encodeFunctionData } from 'viem'
import { FACTORY_ABI, FACTORY_ADDRESS } from './contract'

export interface BatchCall {
  to: Address
  data?: Hex
  value?: bigint
}

// Batch token creation with approval if needed
export function prepareBatchedTokenCreation(
  tokenName: string,
  tokenSymbol: string,
  totalSupply: bigint,
  decimals: number,
  logoUrl: string,
  bannerUrl: string,
  creationFee: bigint
): BatchCall[] {
  // Single call for token creation (already optimized)
  const createTokenData = encodeFunctionData({
    abi: FACTORY_ABI,
    functionName: 'createMemeToken',
    args: [tokenName, tokenSymbol, totalSupply, decimals, logoUrl, bannerUrl],
  })

  return [
    {
      to: FACTORY_ADDRESS,
      data: createTokenData,
      value: creationFee,
    },
  ]
}

// Batch approve + swap operations (example for future DEX integration)
export function prepareBatchedSwap(
  tokenAddress: Address,
  spenderAddress: Address,
  amount: bigint,
  swapData: Hex
): BatchCall[] {
  // Example of batching approve + swap
  const approveData = encodeFunctionData({
    abi: [
      {
        name: 'approve',
        type: 'function',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ],
    functionName: 'approve',
    args: [spenderAddress, amount],
  })

  return [
    {
      to: tokenAddress,
      data: approveData,
      value: 0n,
    },
    {
      to: spenderAddress,
      data: swapData,
      value: 0n,
    },
  ]
}

// Execute batched transactions using EIP-5792
export async function executeBatchedTransactions(
  calls: BatchCall[],
  walletClient: any
): Promise<string> {
  // Check if wallet supports EIP-5792
  const capabilities = await walletClient.getCapabilities?.()
  const supportsBatching = capabilities?.['8453']?.atomicBatch?.supported

  if (supportsBatching && walletClient.sendCalls) {
    // Use EIP-5792 batch transactions
    const result = await walletClient.sendCalls({
      calls,
      chainId: 8453, // Base mainnet
    })
    return result
  } else {
    // Fallback to sequential transactions if batching not supported
    if (calls.length === 1) {
      // Single transaction
      const tx = await walletClient.sendTransaction({
        to: calls[0].to,
        data: calls[0].data,
        value: calls[0].value,
      })
      return tx
    } else {
      // Multiple transactions (warn user)
      console.warn('Wallet does not support EIP-5792 batching. Executing sequentially.')

      const results = []
      for (const call of calls) {
        const tx = await walletClient.sendTransaction({
          to: call.to,
          data: call.data,
          value: call.value,
        })
        results.push(tx)
      }

      return results[results.length - 1] // Return last transaction hash
    }
  }
}

// Hook for using batched transactions in components
export function useBatchedTransactions() {
  const executeBatch = async (
    calls: BatchCall[],
    walletClient: any
  ): Promise<string> => {
    return executeBatchedTransactions(calls, walletClient)
  }

  return { executeBatch }
}