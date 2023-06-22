const Demo = require('../models/demo');
const ethers = require("ethers");
const axios = require("axios");
const TokenSpecs = require("../models/Token");

const getDemos = ()=>{
    return Demo.find();
}

const getDexFactoryContract = (factoryContractAddress, abi, provider) =>{
    return new ethers.Contract(factoryContractAddress,abi,provider)
}

const getDataFromPairContract = async (pairAddress, pairContractAbi, provider) =>{
    try {
        const pairContract = new ethers.Contract(pairAddress, pairContractAbi, provider);

        const token0 = await pairContract.token0();
        const token1 = await pairContract.token1();
        
        if (token0.toLowerCase().includes("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") || token1.toLowerCase().includes("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")) {
            const response = await axios.get(`https://api.1inch.io/v5.0/1/tokens`);
            const {tokens} = response.data;

            if(token0.toLowerCase() !== "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
                const tokenspecs = tokens[token0.toLowerCase()]
                console.log(tokenspecs, "tokenspecs")
                await new TokenSpecs(tokenspecs).save()
                return tokenspecs;
            } else {
                const tokenspecs = tokens[token1.toLowerCase()]
                await new TokenSpecs(tokenspecs).save()
                return tokenspecs;
            }
        }
    } catch (error) {
        console.log({error})
    }
}


const statsService = {
    getDemos
}

module.exports = {
    getDataFromPairContract,
    getDexFactoryContract
};
