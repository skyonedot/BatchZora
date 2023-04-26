// const ethers = require('ethers')
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BatchZoraV1 = await ethers.getContractFactory("BatchZoraV1");
  const batchZoraV1 = await BatchZoraV1.deploy();
  console.log("Tx Hash", batchZoraV1.deployTransaction.hash);
  console.log("BatchZora address:", batchZoraV1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
