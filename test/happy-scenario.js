const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const WETH = artifacts.require("WETH");
const ERC20 = artifacts.require("ERC20");
const Arbitrage = artifacts.require('Arbitrage');
const UniswapV2Library = artifacts.require('UniswapV2Library');

contract('', (accounts) => {
  it('revert in loss', async () => {
    const erc20Instance = await ERC20.new(web3.utils.toBN(web3.utils.toWei('600000000')));
    const wbnbInstance = await WETH.new();
    const uniswapV2Factory = await UniswapV2Factory.new(accounts[2]);
    const uniswapV2Router02 = await UniswapV2Router02.new(uniswapV2Factory.address, wbnbInstance.address);
    await wbnbInstance.deposit({
      value: web3.utils.toBN(web3.utils.toWei('6'))
    });
    balance = (await wbnbInstance.balanceOf.call(accounts[0]));
    await wbnbInstance.approve(uniswapV2Router02.address, web3.utils.toBN(web3.utils.toWei('5')));
    await erc20Instance.approve(uniswapV2Router02.address, web3.utils.toBN(web3.utils.toWei('200000000')));
    await uniswapV2Router02.addLiquidity(
      wbnbInstance.address,
      erc20Instance.address,
      web3.utils.toBN(web3.utils.toWei('5')),
      web3.utils.toBN(web3.utils.toWei('200000000')),
      web3.utils.toBN(web3.utils.toWei('5')),
      web3.utils.toBN(web3.utils.toWei('200000000')),
      accounts[0],
      Math.floor(Date.now() / 1000) + 60 * 20
    )
    const arbitrageInstance = await Arbitrage.new();
    await wbnbInstance.transfer(arbitrageInstance.address, web3.utils.toBN(web3.utils.toWei('0.3')));
    try {
      await arbitrageInstance.startArbitrage(
        uniswapV2Router02.address,
        wbnbInstance.address,
        erc20Instance.address,
        web3.utils.toBN(web3.utils.toWei('0.2')),
        Math.floor(Date.now() / 1000) + 60 * 20,
        { from: accounts[1] }
      );
    } catch (ex) {
      console.log(ex.message);
      expect(ex.message).to.include("need owner");
    }
    var ethBalance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), "ether");
    try {
      await arbitrageInstance.startArbitrage(
        uniswapV2Router02.address,
        wbnbInstance.address,
        erc20Instance.address,
        web3.utils.toBN(web3.utils.toWei('0.2')),
        Math.floor(Date.now() / 1000) + 60 * 20,
      );
    } catch (ex) {
      console.log(ex.message);
      expect(ex.message).to.include(":)");
    }
    expect(web3.utils.fromWei(await wbnbInstance.balanceOf(arbitrageInstance.address), "ether")).to.equal('0.3');
    expect(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), "ether")).to.equal(ethBalance);
    try {
      await arbitrageInstance.transfer(
        wbnbInstance.address,
        accounts[0],
        web3.utils.toBN(web3.utils.toWei('0.2')),
        { from: accounts[1] }
      );
    } catch (ex) {
      console.log(ex.message);
      expect(ex.message).to.include("need owner");
    }
    await arbitrageInstance.transfer(
      wbnbInstance.address,
      accounts[0],
      web3.utils.toBN(web3.utils.toWei('0.2')),
    );
    expect(web3.utils.fromWei(await wbnbInstance.balanceOf(arbitrageInstance.address), "ether")).to.equal('0.1');
    expect(web3.utils.fromWei(await wbnbInstance.balanceOf(accounts[0]), "ether")).to.equal('0.9');
  });
});
