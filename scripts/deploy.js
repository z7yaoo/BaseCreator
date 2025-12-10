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
