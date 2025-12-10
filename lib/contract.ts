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
