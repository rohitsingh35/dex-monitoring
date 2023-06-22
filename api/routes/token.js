const express = require("express");
const router = express.Router();
const axios = require("axios");
const tokenService = require("../services/tokenService.js");
const uniswapV2FactoryAbi = require("../abis/uniswapV2FactoryAbi.json");
const pairContractAbi = require("../abis/pairContractAbi.json");
const erc20ABI = require("../abis/erc20.json");
const TokenSpecs = require("../models/Token");

const ethers = require("ethers");
const { DexMonitor } = require("../services/marketdataService");
const connection =
  "https://mainnet.infura.io/v3/e5e1f07bbce3486598aeee1d006b7c91";

const provider = new ethers.providers.JsonRpcProvider(connection);
const factoryContractAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`https://api.1inch.io/v5.0/1/tokens`);
    const { tokens } = response.data;

    await Promise.all(Object.values(tokens).map(async(item) => 
      await TokenSpecs(item).save()

    ))

    res.status(200).json({
        data: tokens,
        message: "Hello from demo api",
      });
  } catch (error) {
    res.status(500).json({
        data: error,
        message:error.message,
      });
  }
});


router.post("/", async (req, res) => {
  try {
    const dexFactoryContractInstance = tokenService.getDexFactoryContract(
      factoryContractAddress,
      uniswapV2FactoryAbi,
      provider 
    );
    const dex = [];
    for (let i = 0; i < 1; i++) {  
      const pairAddress = await dexFactoryContractInstance.allPairs(i);
      
      dex.push(await DexMonitor(pairAddress, pairContractAbi, provider));

    }
    res.status(200).json({
      data: Promise.all(dex),
      message: "Hello from demo api",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: true,
    });
  }
});


module.exports = router;
