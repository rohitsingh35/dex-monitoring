const TokenMarketStats = require("../models/TokenMarketStats");
const ethers = require("ethers");
const TokenSpecs = require("../models/Token");
const erc20Abi = require("../abis/erc20.json");
const mongoose = require("mongoose");
const Volume = require("../models/Volume");
const Price = require("../models/Prices");

async function DexMonitor(pairAddress, pairContractAbi, provider) {
  let tokenMarketData = new Object();

  try {
    // pair contract instances
    const pairContract = new ethers.Contract(
      pairAddress,
      pairContractAbi,
      provider
    );

    // USDC token address
    const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    // usdc contract instance
    const usdcContract = new ethers.Contract(
      usdcTokenAddress,
      erc20Abi,
      provider
    );

    // Token Addresses
    const token0 = await pairContract.token0();
    const token1 = await pairContract.token1();

    const usdcSymbol = "USDC";
    const usdcDecimal = 6;
    let tokenDecimals;
    let tokenSymbol;
    let totalSupply;
    let tokenData;
    const isAtLeastOneMemberIsUSDC =
      token0
        .toLowerCase()
        .includes("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") ||
      token1
        .toLowerCase()
        .includes("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

     const isToken0NotUSDC =
      token0.toLowerCase() !== "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

    if (isAtLeastOneMemberIsUSDC) {
      if (isToken0NotUSDC) {
        const token0Contract = new ethers.Contract(
          token0.toLowerCase(),
          erc20Abi,
          provider
        );
        totalSupply = parseInt(await token0Contract.totalSupply());

        console.log(Number(totalSupply), "totalSupply");

        tokenData = await TokenSpecs.findOne({
          address: token0.toLowerCase(),
        });

        // console.log(tokenData, "tokenData");
      } else {
        const token1Contract = new ethers.Contract(
          token1.toLowerCase(),
          erc20Abi,
          provider
        );
        totalSupply = await token1Contract.totalSupply();
        // console.log(totalSupply, "totalSupply");
        tokenData = await TokenSpecs.findOne({
          address: token1.toLowerCase(),
        });
      }

      const currentBlock = await provider.getBlockNumber();
      const syncEvents = await pairContract.queryFilter(
        pairContract.filters.Sync(),
        currentBlock - 10,
        "latest"
      );
      // usdc transfer from pair
      const usdcTransferFromPair = await usdcContract.queryFilter(
        usdcContract.filters.Transfer(pairAddress, null),
        currentBlock - 100,
        "latest"
      );

      // usdc transfer to pair
      const usdcTransferToPair = await usdcContract.queryFilter(
        usdcContract.filters.Transfer(null, pairAddress),
        currentBlock - 100,
        "latest"
      );

      for (let i = 0; i < syncEvents.length; i++) {
        let { price, timestamp } = await processEvents(
          syncEvents[i],
          isToken0NotUSDC,
          tokenData
        );
        console.log("price, timestamp", price, timestamp);
        const dataTobeSaved = {
          price,
          timestamp,
          totalSupply,
          token: tokenData._id,
        };
        console.log(dataTobeSaved, "dataTobeSaved");

        // await  TokenMarketStats(TokenMarketStats).save();
      }

      /**** Calculate Volume ****/
      let volumes = [];
      for (let i = 0; i < usdcTransferFromPair.length; i++) {
        const obj = new Object();
        const blockData = await provider.getBlock(
          usdcTransferFromPair[i].blockNumber
        );
        const timestamp = blockData.timestamp;
        const usdcSwaped = parseInt(usdcTransferFromPair[i].args[2]) / 10 ** 6;
        obj.timestamp = timestamp;
        obj.volume = usdcSwaped;
        volumes.push(obj);
      }

      for (let i = 0; i < usdcTransferToPair.length; i++) {
        const obj = new Object();
        const blockData = await provider.getBlock(
          usdcTransferToPair[i].blockNumber
        );
        const timestamp = blockData.timestamp;
        const usdcSwaped = parseInt(usdcTransferToPair[i].args[2]) / 10 ** 6;
        obj.timestamp = timestamp;
        obj.volume = usdcSwaped;
        volumes.push(obj);
      }
      console.log("Volumes", volumes);
    }

    async function processEvents(syncEvent, isToken0NotUSDC, tokenData) {
      let price;
      // Block Data
      const syncBlockData = await syncEvent.getBlock(syncEvent.blockNumber);
      const timestamp = syncBlockData.timestamp;

      // Reserves
      if (isToken0NotUSDC) {
        const reserveToken0 = parseInt(
          syncEvent.args[0] / 10 ** tokenData.decimals
        );
        const reserveToken1 = parseInt(syncEvent.args[1] / 10 ** usdcDecimal);

        console.log(
          `reserveToken0- ${reserveToken0} || reserveToken1- ${reserveToken1}`
        );
        price = `${reserveToken1 / reserveToken0} ${usdcSymbol}`;
        console.log("price", price);
      } else {
        const reserveToken0 = parseInt(syncEvent.args[0] / 10 ** usdcDecimal);
        const reserveToken1 = parseInt(
          syncEvent.args[1] / 10 ** tokenData.decimals
        );

        console.log(
          `reserveToken0- ${reserveToken0} || reserveToken1- ${reserveToken1}`
        );

        price = `${reserveToken0 / reserveToken1} ${usdcSymbol}`;
        console.log("price", price);
      }

      return { price, timestamp };
    }
  } catch (error) {
    console.log("error", error);
  }

  // return tokenMarketData;
}

module.exports = {
  DexMonitor,
};
