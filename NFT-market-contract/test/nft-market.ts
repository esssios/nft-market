const { expect } = require("chai");
const { ethers } = require("hardhat");

interface Account {
  address: string;
}
describe("Market", function () {
  let fustd, market, nft, accountA: Account, accountB: Account;

  // beforeEach 为每次测试初始化相同的环境
  beforeEach(async () => {
    [accountA, accountB] = await ethers.getSigners();

    // 合约部署
    const FUSTD = await ethers.getContractFactory("fUSTD");
    fustd = await FUSTD.deploy();

    const MyNFT = await ethers.getContractFactory("NFTM");
    nft = await MyNFT.deploy(accountA.address);

    const Market = await ethers.getContractFactory("Market");
    market = await Market.deploy(fustd.target, nft.target);

    // 给accountB挖两个nft
    await nft.safeMint(accountB.address);
    await nft.safeMint(accountB.address);

    // accountA 授权 market合约 可操作的 fustd 数量为 1*10e24
    await fustd.connect(accountA).approve(market.target, "1000000000000000000000000");
  });

  it("its erc20 address should be fustd", async function () {
    expect(await market.erc20()).to.equal(fustd.target);
  })

  it("its erc721 address should be nft", async function () {
    expect(await market.erc721()).to.equal(nft.target);
  })

  it("accountA should have fustd", async function () {
    expect(await fustd.balanceOf(accountA.address)).to.equal("100000000000000000000000000");
  })

  it("accountB should have 2 nft", async function () {
    expect(await nft.balanceOf(accountB.address)).to.equal(2);
  })

  // accountB can list two nfts to market
  it("accountB can list two nft to market", async function () {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";

    // ["safeTransferFrom(address,address,uint256,bytes)"] 指定调用有4个参数的safeTransferFrom方法
    // accountB 调用safeTransferFrom方法 上架 _tokenId = 0 的 nft
    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 0, price)).to.emit(market, "NewOrder");
    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 1, price)).to.emit(market, "NewOrder");

    expect(await nft.balanceOf(accountA.address)).to.equal(0);
    expect(await nft.balanceOf(accountB.address)).to.equal(0);
    expect(await nft.balanceOf(market.target)).to.equal(2);
    // 调用market.isListed方法（参数为ntf的tokenId）判断nft是否上架
    expect(await market.isListed(0)).to.equal(true);
    expect(await market.isListed(1)).to.equal(true);

    // market.getAllNFTs())[0][x], x: 0, 1, 2 对应 seller, tokenId, price
    expect((await market.getAllNFTs())[0][0]).to.equal(accountB.address);
    expect((await market.getAllNFTs())[0][1]).to.equal(0);
    expect((await market.getAllNFTs())[0][2]).to.equal(price);
    expect((await market.getAllNFTs())[1][0]).to.equal(accountB.address);
    expect((await market.getAllNFTs())[1][1]).to.equal(1);
    expect((await market.getAllNFTs())[1][2]).to.equal(price);
    expect(await market.getOrderLength()).to.equal(2);
  })

  it("accountB can unlist nft from market", async function () {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";

    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 0, price)).to.emit(market, "NewOrder");
    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 1, price)).to.emit(market, "NewOrder");

    expect(await market.connect(accountB).cancelOrder(0)).to.emit(market, "cancelOrder");
    expect(await market.getOrderLength()).to.equal(1);
    expect((await market.getAllNFTs()).length).to.equal(1);
    expect(await market.isListed(0)).to.equal(false);
  })

  it("accountB can change price", async function () {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";

    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 0, price)).to.emit(market, "NewOrder");
    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 1, price)).to.emit(market, "NewOrder");

    expect(await market.connect(accountB).changePrice(0, "10000000000000000000000")).to.emit(market, "priceChanged");
    expect((await market.getAllNFTs())[0][2]).to.equal("10000000000000000000000");
  })

  it("accountA can buy nft", async function () {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";

    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 0, price)).to.emit(market, "NewOrder");
    expect(await nft.connect(accountB)["safeTransferFrom(address,address,uint256,bytes)"](accountB.address, market.target, 1, price)).to.emit(market, "NewOrder");

    expect(await market.connect(accountA).buy(0)).to.emit(market, "Deal");

    expect(await nft.balanceOf(accountA.address)).to.equal(1);
    expect(await nft.ownerOf(0)).to.equal(accountA.address);
  })
})