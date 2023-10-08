// const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
// const UniswapV2Factory = artifacts.require("UniswapV2Factory");
// const ERC20 = artifacts.require("ERC20");
// const UniswapV2ERC20 = artifacts.require("UniswapV2ERC20");
const Arbitrage = artifacts.require('Arbitrage');

module.exports = async function(deployer) {
  // await deployer.deploy(ERC20, "KARAM", "KRM");
  // await deployer.deploy(WBNB);
  // await deployer.deploy(UniswapV2Factory, "0xa49d094b7DF494bf30184324405C6Edf8beb0027");
  // await deployer.deploy(UniswapV2Router02, UniswapV2Factory.address, WBNB.address);
  // await deployer.deploy(UniswapV2ERC20);
  await deployer.deploy(Arbitrage);
};
