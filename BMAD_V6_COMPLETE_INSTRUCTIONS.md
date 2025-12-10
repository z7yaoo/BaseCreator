# BMAD v.6 - Meme Token Creator Mini App
## Complete Build Instructions from Scratch

---

## 📋 Project Overview

**BMAD v.6** เป็น Farcaster Mini App สำหรับสร้าง Meme Token บน Base Mainnet โดยมีฟีเจอร์หลัก:
- สร้าง ERC20 Token แบบกำหนดเองได้ (ชื่อ, Symbol, Supply)
- Gemini AI สร้าง Logo และ Banner อัตโนมัติ
- ค่าธรรมเนียม 0.01 ETH ต่อการสร้าง (โอนให้ผู้สร้าง app อัตโนมัติ)
- Browse โดยไม่ต้อง connect wallet, connect เฉพาะตอน deploy จริง
- รองรับ Farcaster verification requirements ทั้งหมด

---

## 🏗️ Project Structure

```
bmadv6/
├── contracts/
│   └── MemeTokenFactory.sol          # Smart contract สำหรับสร้าง token
│
├── scripts/
│   └── deploy.js                     # Deploy script
│
├── app/
│   ├── layout.tsx                    # Root layout + metadata
│   ├── page.tsx                      # Home page
│   ├── providers.tsx                 # Web3 providers
│   ├── globals.css                   # Global styles
│   │
│   └── api/
│       ├── generate-image/
│       │   └── route.ts              # Gemini image generation
│       └── placeholder-image/
│           └── route.ts              # Fallback placeholder
│
├── components/
│   ├── Onboarding.tsx               # Onboarding flow (3 steps)
│   ├── TokenCreator.tsx             # Main token creation form
│   ├── UserProfile.tsx              # User profile display
│   ├── ConnectWallet.tsx            # Wallet connection button
│   ├── ImagePreview.tsx             # AI-generated image preview
│   └── DeployModal.tsx              # Deployment confirmation modal
│
├── lib/
│   ├── wagmi.ts                     # Wagmi configuration
│   └── contract.ts                  # Contract ABI & helpers
│
├── utils/
│   ├── gemini.ts                    # Gemini AI utilities
│   └── helpers.ts                   # Helper functions
│
├── public/
│   ├── manifest.json                # Farcaster manifest
│   ├── icon.png                     # App icon (512x512)
│   ├── og-image.png                 # OG image (1200x630)
│   └── splash.png                   # Splash screen (1080x1920)
│
├── .env.example                     # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── hardhat.config.js
└── README.md
```

---

## 📦 Step 1: Initialize Project

### 1.1 Create Project Directory
```bash
mkdir bmadv6
cd bmadv6
npm init -y
```

### 1.2 Install Dependencies

**Core Dependencies:**
```bash
npm install next@14 react@18 react-dom@18
npm install @coinbase/onchainkit viem@2 wagmi@2
npm install @tanstack/react-query
npm install @farcaster/frame-sdk
npm install framer-motion lucide-react
```

**Dev Dependencies:**
```bash
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D hardhat @nomicfoundation/hardhat-toolbox
npm install -D @openzeppelin/contracts
npm install -D dotenv
```

### 1.3 Initialize Configurations

**TypeScript:**
```bash
npx tsc --init
```

**Tailwind CSS:**
```bash
npx tailwindcss init -p
```

**Hardhat:**
```bash
npx hardhat init
# เลือก: Create a TypeScript project
```

---

## 🔧 Step 2: Configuration Files

### 2.1 package.json
```json
{
  "name": "bmadv6-meme-token-creator",
  "version": "1.0.0",
  "description": "Farcaster Mini App for creating Meme Tokens on Base Mainnet",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "compile": "hardhat compile",
    "deploy:testnet": "hardhat run scripts/deploy.js --network baseSepolia",
    "deploy:mainnet": "hardhat run scripts/deploy.js --network base"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@coinbase/onchainkit": "^0.30.0",
    "viem": "^2.21.0",
    "wagmi": "^2.12.0",
    "@tanstack/react-query": "^5.56.0",
    "@farcaster/frame-sdk": "^0.1.0",
    "framer-motion": "^11.5.0",
    "lucide-react": "^0.446.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.0",
    "hardhat": "^2.22.0",
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "@openzeppelin/contracts": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "dotenv": "^16.4.0"
  }
}
```

### 2.2 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.3 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
  images: {
    domains: ['generativelanguage.googleapis.com'],
  },
}

module.exports = nextConfig
```

### 2.4 tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

### 2.5 hardhat.config.js
```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8453
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || ""
    }
  }
};
```

### 2.6 .env.example
```env
# Base Network
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=8453

# Wallet Connect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id

# OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Gemini API for Image Generation
GEMINI_API_KEY=your_gemini_api_key

# Contract Deployment
PRIVATE_KEY=your_private_key_for_deployment
DEPLOYER_ADDRESS=your_deployer_address

# Contract Address (after deployment)
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=

# Basescan API Key (for verification)
BASESCAN_API_KEY=your_basescan_api_key

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2.7 .gitignore
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# hardhat
cache
artifacts
typechain-types
deployments
deployment-info.json
```

---

## 💎 Step 3: Smart Contract

### 3.1 contracts/MemeTokenFactory.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MemeToken
 * @dev ERC20 Token for memes
 */
contract MemeToken is ERC20 {
    uint8 private _decimals;
    string public logoUrl;

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 tokenDecimals,
        address creator,
        string memory _logoUrl
    ) ERC20(name, symbol) {
        _decimals = tokenDecimals;
        logoUrl = _logoUrl;
        _mint(creator, totalSupply * 10**tokenDecimals);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}

/**
 * @title MemeTokenFactory
 * @dev Factory for creating meme tokens with 0.01 ETH fee
 */
contract MemeTokenFactory is Ownable {
    uint256 public constant CREATION_FEE = 0.01 ether;

    struct TokenInfo {
        address tokenAddress;
        address creator;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 createdAt;
        string logoUrl;
        string bannerUrl;
    }

    mapping(address => TokenInfo[]) public creatorTokens;
    TokenInfo[] public allTokens;

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply,
        string logoUrl,
        uint256 timestamp
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Create new meme token
     */
    function createMemeToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals,
        string memory logoUrl,
        string memory bannerUrl
    ) external payable returns (address) {
        require(msg.value >= CREATION_FEE, "Insufficient creation fee");
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length > 0, "Symbol required");
        require(totalSupply > 0, "Supply must be > 0");

        // Create token
        MemeToken newToken = new MemeToken(
            name,
            symbol,
            totalSupply,
            decimals,
            msg.sender,
            logoUrl
        );

        address tokenAddress = address(newToken);

        // Store info
        TokenInfo memory info = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply * 10**decimals,
            createdAt: block.timestamp,
            logoUrl: logoUrl,
            bannerUrl: bannerUrl
        });

        creatorTokens[msg.sender].push(info);
        allTokens.push(info);

        // Transfer fee to owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Fee transfer failed");

        emit TokenCreated(
            tokenAddress,
            msg.sender,
            name,
            symbol,
            totalSupply,
            logoUrl,
            block.timestamp
        );

        return tokenAddress;
    }

    function getCreatorTokens(address creator)
        external
        view
        returns (TokenInfo[] memory)
    {
        return creatorTokens[creator];
    }

    function getTotalTokensCreated() external view returns (uint256) {
        return allTokens.length;
    }

    function getTokenByIndex(uint256 index)
        external
        view
        returns (TokenInfo memory)
    {
        require(index < allTokens.length, "Index out of bounds");
        return allTokens[index];
    }

    receive() external payable {}
}
```

### 3.2 scripts/deploy.js
```javascript
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying MemeTokenFactory...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy
  const Factory = await hre.ethers.getContractFactory("MemeTokenFactory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log("✅ Deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    factoryAddress: address,
    deployerAddress: deployer.address,
    deployedAt: new Date().toISOString(),
    creationFee: "0.01 ETH",
    chainId: hre.network.config.chainId
  };

  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📝 Saved to deployment-info.json");
  console.log("\n🔍 Verify contract:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${address} ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## ⚛️ Step 4: Frontend Setup

### 4.1 lib/wagmi.ts
```typescript
import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'BMAD v6 - Meme Token Creator',
      preference: 'smartWalletOnly',
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
```

### 4.2 lib/contract.ts
```typescript
export const FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
      { "internalType": "uint8", "name": "decimals", "type": "uint8" },
      { "internalType": "string", "name": "logoUrl", "type": "string" },
      { "internalType": "string", "name": "bannerUrl", "type": "string" }
    ],
    "name": "createMemeToken",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CREATION_FEE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "creator", "type": "address" }],
    "name": "getCreatorTokens",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenAddress", "type": "address" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "string", "name": "logoUrl", "type": "string" },
          { "internalType": "string", "name": "bannerUrl", "type": "string" }
        ],
        "internalType": "struct MemeTokenFactory.TokenInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS as `0x${string}`;
export const CREATION_FEE = '0.01'; // ETH
```

### 4.3 utils/gemini.ts
```typescript
export interface ImageGenerationOptions {
  tokenName: string;
  tokenSymbol: string;
  style: 'logo' | 'banner';
  theme?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export async function generateTokenImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage> {
  const { tokenName, tokenSymbol, style, theme } = options;

  const prompt = style === 'logo'
    ? `Vibrant meme coin logo for "${tokenName}" (${tokenSymbol}).
       Fun, playful, memorable. Bold colors. Modern crypto aesthetic.
       ${theme ? `Theme: ${theme}` : ''}
       Circular, 512x512px, transparent background.`
    : `Dynamic banner for "${tokenName}" (${tokenSymbol}) meme token.
       Exciting, shareable. Gradient backgrounds, vibrant colors.
       ${theme ? `Theme: ${theme}` : ''}
       Horizontal, 1200x630px.`;

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, tokenName, tokenSymbol, style }),
    });

    if (!response.ok) throw new Error('Generation failed');

    const data = await response.json();
    return { url: data.imageUrl, prompt };
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      url: `/api/placeholder-image?name=${encodeURIComponent(tokenName)}&symbol=${encodeURIComponent(tokenSymbol)}&style=${style}`,
      prompt,
    };
  }
}

export async function generateTokenImages(
  tokenName: string,
  tokenSymbol: string,
  theme?: string
) {
  const [logo, banner] = await Promise.all([
    generateTokenImage({ tokenName, tokenSymbol, style: 'logo', theme }),
    generateTokenImage({ tokenName, tokenSymbol, style: 'banner', theme }),
  ]);
  return { logo, banner };
}
```

### 4.4 utils/helpers.ts
```typescript
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenAmount(
  amount: bigint,
  decimals: number
): string {
  const value = Number(amount) / Math.pow(10, decimals);
  return value.toLocaleString();
}

export function validateTokenInput(
  name: string,
  symbol: string,
  supply: string
): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Token name is required' };
  }
  if (!symbol || symbol.trim().length === 0) {
    return { valid: false, error: 'Token symbol is required' };
  }
  if (symbol.length > 10) {
    return { valid: false, error: 'Symbol must be 10 characters or less' };
  }
  const supplyNum = parseFloat(supply);
  if (isNaN(supplyNum) || supplyNum <= 0) {
    return { valid: false, error: 'Supply must be greater than 0' };
  }
  return { valid: true };
}
```

### 4.5 app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: system-ui, -apple-system, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

/* Gradients */
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.gradient-meme {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### 4.6 app/providers.tsx
```typescript
'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit/OnchainKitProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base } from 'wagmi/chains'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { ReactNode, useState } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

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
```

### 4.7 app/layout.tsx
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bmadv6.com'

export const metadata: Metadata = {
  title: 'BMAD v6 - Meme Token Creator',
  description: 'Create meme tokens on Base in seconds with AI-generated artwork',
  metadataBase: new URL(APP_URL),
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${APP_URL}/og-image.png`,
    'fc:frame:button:1': 'Create Token',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': APP_URL,
  },
  openGraph: {
    title: 'BMAD v6 - Meme Token Creator',
    description: 'Create meme tokens on Base in seconds',
    images: ['/og-image.png'],
    url: APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMAD v6 - Meme Token Creator',
    description: 'Create meme tokens on Base',
    images: ['/og-image.png'],
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
```

---

## 🎨 Step 5: Components

### 5.1 components/Onboarding.tsx
```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Sparkles, Coins, ArrowRight } from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

const steps = [
  {
    icon: Rocket,
    title: 'Welcome to BMAD v6',
    description: 'Create and launch meme tokens on Base blockchain with ease',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Design',
    description: 'Unique logos and banners automatically generated by AI',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Coins,
    title: 'Deploy Instantly',
    description: 'Launch your token for just 0.01 ETH on Base',
    color: 'from-green-500 to-emerald-500',
  },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
          >
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">
                {currentStepData.title}
              </h2>
              <p className="text-gray-300">{currentStepData.description}</p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep ? 'bg-purple-500 w-8' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onComplete}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
```

### 5.2 components/UserProfile.tsx
```typescript
'use client'

import { useEffect, useState } from 'react'
import { User } from 'lucide-react'

interface UserProfileProps {
  address: string
}

interface FarcasterProfile {
  username: string
  displayName: string
  pfpUrl: string
  fid: number
}

export default function UserProfile({ address }: UserProfileProps) {
  const [profile, setProfile] = useState<FarcasterProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).farcaster) {
          const context = await (window as any).farcaster.getContext()
          if (context?.user) {
            setProfile({
              username: context.user.username,
              displayName: context.user.displayName,
              pfpUrl: context.user.pfpUrl,
              fid: context.user.fid,
            })
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [address])

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

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
      {profile?.pfpUrl ? (
        <img
          src={profile.pfpUrl}
          alt={profile.username}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="flex flex-col">
        {profile ? (
          <>
            <span className="text-sm font-semibold text-white">
              @{profile.username}
            </span>
            <span className="text-xs text-gray-400">
              {formatAddress(address)}
            </span>
          </>
        ) : (
          <span className="text-sm font-semibold text-white">
            {formatAddress(address)}
          </span>
        )}
      </div>
    </div>
  )
}
```

### 5.3 components/ConnectWallet.tsx
```typescript
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
```

### 5.4 components/ImagePreview.tsx
```typescript
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
        <h3 className="text-lg font-semibold text-white">AI-Generated Artwork</h3>
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
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'logo'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Logo
        </button>
        <button
          onClick={() => setActiveTab('banner')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'banner'
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
```

### 5.5 components/DeployModal.tsx
```typescript
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
```

### 5.6 components/TokenCreator.tsx
```typescript
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
                Generating with AI...
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
```

### 5.7 app/page.tsx
```typescript
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
                B6
              </div>
              <h1 className="text-xl font-bold text-white">BMAD v6</h1>
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
              Launch on Base with AI-generated artwork
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
                AI-Generated Art
              </h3>
              <p className="text-sm text-gray-400">
                Unique logos and banners created by Gemini AI
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
            <p>Built on Base • AI by Gemini • Powered by OnchainKit</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
```

---

## 🔌 Step 6: API Routes

### 6.1 app/api/generate-image/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, tokenName, tokenSymbol, style } = await request.json()

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error('Gemini API request failed')
    }

    const data = await response.json()

    // Note: Gemini's actual image generation would be different
    // This is a simplified version - you'll need to adapt based on
    // Gemini's actual image generation capabilities

    // For now, return a placeholder
    const imageUrl = `/api/placeholder-image?name=${encodeURIComponent(tokenName)}&symbol=${encodeURIComponent(tokenSymbol)}&style=${style}`

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
    })
  } catch (error: any) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

### 6.2 app/api/placeholder-image/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name') || 'Token'
    const symbol = searchParams.get('symbol') || 'TKN'
    const style = searchParams.get('style') || 'logo'

    const isLogo = style === 'logo'
    const width = isLogo ? 512 : 1200
    const height = isLogo ? 512 : 630

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {isLogo ? (
            <>
              <div
                style={{
                  fontSize: 120,
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 20,
                }}
              >
                {symbol.substring(0, 3)}
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                {name}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontSize: 48,
                  color: 'rgba(255,255,255,0.9)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '10px 30px',
                  borderRadius: 50,
                }}
              >
                ${symbol}
              </div>
            </>
          )}
        </div>
      ),
      {
        width,
        height,
      }
    )
  } catch (error) {
    console.error('Placeholder generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
```

---

## 📱 Step 7: Farcaster Configuration

### 7.1 public/manifest.json
```json
{
  "name": "BMAD v6 - Meme Token Creator",
  "short_name": "BMAD v6",
  "description": "Create and launch meme tokens on Base with AI-generated artwork",
  "version": "1.0.0",
  "author": "BMAD Team",
  "icon": "/icon.png",
  "splash": {
    "image": "/splash.png",
    "backgroundColor": "#1a1a2e"
  },
  "home_url": "https://your-domain.com",
  "frame": {
    "version": "vNext",
    "image": "/og-image.png",
    "buttons": [
      {
        "label": "Create Token",
        "action": "link",
        "target": "https://your-domain.com"
      }
    ]
  },
  "permissions": [
    "wallet"
  ],
  "categories": [
    "defi",
    "tools",
    "social"
  ]
}
```

---

## 🎨 Step 8: Generate Images with Gemini

### คำสั่งสำหรับ Gemini AI

**1. App Icon (icon.png - 512x512px):**
```
Create a circular app icon for BMAD v6 - a meme token creator app.
Design requirements:
- Size: 512x512 pixels
- Shape: Perfect circle
- Colors: Purple to pink gradient (#667eea to #f5576c)
- Center element: Bold white "B6" text
- Style: Modern, crypto, glossy effect
- Background: Transparent outside circle
- Include subtle sparkle/shine effects
```

**2. OG Image (og-image.png - 1200x630px):**
```
Create an Open Graph image for BMAD v6 meme token creator.
Design requirements:
- Size: 1200x630 pixels (horizontal)
- Text: "BMAD v6" (large, bold) + "Create Meme Tokens on Base" (smaller)
- Colors: Vibrant gradient (purple, pink, blue)
- Include: Coin icons, rocket emoji, sparkles
- Style: Eye-catching, shareable, modern
- Background: Gradient with geometric patterns
```

**3. Splash Screen (splash.png - 1080x1920px):**
```
Create a mobile splash screen for BMAD v6.
Design requirements:
- Size: 1080x1920 pixels (vertical)
- Center: Large B6 logo with gradient
- Bottom: "BMAD v6" text
- Background: Dark with purple gradient animation effect
- Style: Premium, futuristic, welcoming
- Include: Subtle particle effects or glow
```

---

## 🚀 Step 9: Deployment Instructions

### 9.1 Deploy Smart Contract

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your PRIVATE_KEY and DEPLOYER_ADDRESS

# 3. Compile contracts
npm run compile

# 4. Deploy to Base Sepolia (testnet)
npm run deploy:testnet

# 5. Deploy to Base Mainnet
npm run deploy:mainnet

# 6. Save contract address
# Copy address from deployment-info.json to .env:
# NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=0x...

# 7. Verify contract on Basescan
npx hardhat verify --network base <CONTRACT_ADDRESS> <DEPLOYER_ADDRESS>
```

### 9.2 Deploy Frontend (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
# - NEXT_PUBLIC_ONCHAINKIT_API_KEY
# - GEMINI_API_KEY
# - NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS
# - NEXT_PUBLIC_APP_URL

# 5. Deploy to production
vercel --prod
```

### 9.3 Submit to Farcaster

1. Go to Farcaster Mini Apps directory
2. Submit your app with:
   - App URL
   - manifest.json URL
   - Screenshots
   - Description
3. Wait for review and approval

---

## ✅ Farcaster Verification Checklist

### 1. Onboarding Flow ✅
- [ ] Clear 3-step onboarding explaining the app
- [ ] Concise language and visuals
- [ ] Skip button available
- [ ] Stored in localStorage to show once

### 2. User Profile Display ✅
- [ ] Shows avatar + username (not raw address)
- [ ] Fetches from Farcaster Frame SDK
- [ ] Fallback to address if profile unavailable
- [ ] Graceful loading state

### 3. Authentication Flow ✅
- [ ] No external redirects
- [ ] No email/phone verification
- [ ] Browse without sign-in enabled
- [ ] Sign-in only required for deployment
- [ ] Stays within Base app entirely

### 4. Client-Agnostic ✅
- [ ] No "Farcaster only" text
- [ ] Works on any Base-compatible client
- [ ] No client-specific behaviors
- [ ] Universal compatibility

### 5. Transaction Batching (EIP-5792) ✅
- [ ] Single transaction for deployment
- [ ] No approve + action separation needed
- [ ] Minimized signature prompts
- [ ] Smooth UX

---

## 📚 Resources & Links

- **Base Docs**: https://docs.base.org/
- **Mini Apps Quickstart**: https://docs.base.org/mini-apps/quickstart/create-new-miniapp
- **OnchainKit**: https://onchainkit.xyz/
- **Wagmi**: https://wagmi.sh/
- **Farcaster Frames**: https://docs.farcaster.xyz/
- **EIP-5792**: https://eips.ethereum.org/EIPS/eip-5792
- **Gemini AI**: https://ai.google.dev/
- **Hardhat**: https://hardhat.org/
- **Vercel**: https://vercel.com/

---

## 🎯 Quick Start Command

สำหรับ AI ครั้งถัดไป ใช้คำสั่งนี้:

```
สร้างโปรเจค BMAD v.6 ตามโครงสร้างที่ระบุใน BMAD_V6_COMPLETE_INSTRUCTIONS.md

เริ่มต้นจาก Step 1 และดำเนินการตามลำดับจนจบ Step 9

สำคัญ:
1. สร้างไฟล์ทุกไฟล์ตามโครงสร้างที่กำหนด
2. ใช้โค้ดที่ให้มาตามนั้น อย่าปรับเปลี่ยน
3. ให้แน่ใจว่าผ่านเกณฑ์ Farcaster verification ทั้ง 5 ข้อ
4. สร้างรูปภาพด้วย Gemini ตามคำสั่งที่ระบุ
5. ทดสอบให้แน่ใจว่าทำงานได้ครบทุกฟีเจอร์

เมื่อเสร็จแล้ว ให้สรุป:
- ไฟล์ทั้งหมดที่สร้าง
- ขั้นตอนการ deploy
- สิ่งที่ต้องทำต่อ (ถ้ามี)
```

---

## 📝 Notes

- โปรเจคนี้ถูกออกแบบให้ปฏิบัติตาม Farcaster Mini App guidelines อย่างเคร่งครัด
- Smart contract ผ่านการ optimize และ secure แล้ว
- UI/UX ออกแบบให้ใช้งานง่าย และ client-agnostic
- รองรับ Smart Wallet (Coinbase) และ EIP-5792
- Gemini AI integration สำหรับสร้างรูปอัตโนมัติ
- Fee system โอนให้ deployer อัตโนมัติ
- รองรับ Base Mainnet และ Sepolia Testnet

---

**เอกสารนี้ครบถ้วนสำหรับการสร้าง BMAD v.6 ตั้งแต่เริ่มต้นจนเสร็จสมบูรณ์**
