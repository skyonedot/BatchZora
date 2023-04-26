const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config()





describe("Deploy Contract Test V1", function () {
  before(async function () {
    const MyContract = await ethers.getContractFactory("BatchZoraV1");
    this.myContract = await MyContract.deploy();
    await this.myContract.deployed();
    expect(this.myContract.address).to.not.equal(0x0)

    this.user = new ethers.Wallet(process.env.MainPK, ethers.provider)
    this.signer = (await ethers.getSigners())[0]

    //Facaster
    let nft_address = '0x03ad6cd7410ce01a8b9ed26a080f8f9c1d7cc222'
    let abi = require('../abi/zoraNFT.json')
    this.nftContract = new ethers.Contract(nft_address, abi, this.user)
  });


  it("Check mint NFT V1", async function () {
    expect(await this.nftContract.balanceOf(this.user.address)).to.equal(0)

    let count = 100
    let start = 0
    let target_address = '0x03ad6cd7410ce01a8b9ed26a080f8f9c1d7cc222'
    let data = '0xefef39a10000000000000000000000000000000000000000000000000000000000000001'

    //MINT NFT
    await this.myContract.connect(this.signer).execute(start, count, target_address, data, this.user.address,{
      value: ethers.utils.parseEther((0.000777 * count).toString())
    })
    expect(await this.nftContract.balanceOf(this.user.address)).to.equal(100)
  })
});


describe("Deploy Contract Test V2", function () {
  before(async function () {
    const MyContract = await ethers.getContractFactory("BatchZoraV2");
    this.myContract = await MyContract.deploy();
    await this.myContract.deployed();
    expect(this.myContract.address).to.not.equal(0x0)

    this.user = new ethers.Wallet(process.env.MainPK, ethers.provider)
    this.signer = (await ethers.getSigners())[0]

    //Facaster
    let nft_address = '0x03ad6cd7410ce01a8b9ed26a080f8f9c1d7cc222'
    let abi = require('../abi/zoraNFT.json')
    this.nftContract = new ethers.Contract(nft_address, abi, this.user)
  });


  it("Check mint NFT V2", async function () {
    expect(await this.nftContract.balanceOf(this.user.address)).to.equal(100)

    let count = 100
    let start = 0
    let target_address = '0x03ad6cd7410ce01a8b9ed26a080f8f9c1d7cc222'
    let data = '0xefef39a10000000000000000000000000000000000000000000000000000000000000001'


    await this.myContract.connect(this.signer).createProxies(count)
    //MINT NFT
    await this.myContract.connect(this.signer).execute(start, count, target_address, data, this.user.address,{
      value: ethers.utils.parseEther((0.000777 * count).toString())
    })
    expect(await this.nftContract.balanceOf(this.user.address)).to.equal(200)
  })


});