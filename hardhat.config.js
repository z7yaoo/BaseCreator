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
