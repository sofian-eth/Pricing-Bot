// // Install ethere.js and uniswap sdk

// const { abi: Quoterabi } = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json');
// const { abi: Qouter2abi } = require('@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json');

// const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
// const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
// const QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
// const QUOTER2_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

// require('dotenv').config()
// const INFURA_URL_MIANNET = process.env.INFURA_URL_MIANNET

// const { ethers } = require('ethers');

// const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_MIANNET);

// const tokenIn = WETH_ADDRESS;
// const tokenOut = USDC_ADDRESS;
// const amoutIn = ethers.utils.parseEther('1');
// const fee = '3000';
// const sqrtPriceLimitX96 = '0';

// const quoterContract = new ethers.Contract(QUOTER_ADDRESS, Quoterabi, provider);
// const quoter2Contract = new ethers.Contract(QUOTER2_ADDRESS, Qouter2abi, provider);

// const getPrice = async () => {
//     const price = await quoterContract.callStatic.quoteExactInputSingle(
//         tokenIn,
//         tokenOut,
//         fee,
//         amoutIn,
//         sqrtPriceLimitX96
//     );
//     console.log('expectedAmout', ethers.utils.formatUnits(price.toString(), 6));

//     console.log("...................................................");

//     const params = {
//         tokenIn: tokenIn,
//         tokenOut: tokenOut,
//         fee: fee,
//         amountIn: amoutIn,
//         sqrtPriceLimitX96: sqrtPriceLimitX96,
//     };

//     const price2 = await quoter2Contract.callStatic.quoteExactInputSingle(params);

//     console.log('sqrtPriceLimitX96AfterQuote', price2.sqrtPriceX96After.toString());
//     console.log('initilizedTicksCrossed', price2.initializedTicksCrossed.toString());
//     console.log('gasEstimate', price2.gasEstimate.toString());
// }
// getPrice();

const { abi: Quoterabi } = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json');
const { abi: Qouter2abi } = require('@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json');

const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
const QUOTER2_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

require('dotenv').config()
const INFURA_URL_MIANNET = process.env.INFURA_URL_MIANNET

const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_MIANNET);

const tokenIn = WETH_ADDRESS;
const tokenOut = USDC_ADDRESS;
const amoutIn = ethers.utils.parseEther('1');
const fee = '3000';
const sqrtPriceLimitX96 = '0';

const quoterContract = new ethers.Contract(QUOTER_ADDRESS, Quoterabi, provider);
const quoter2Contract = new ethers.Contract(QUOTER2_ADDRESS, Qouter2abi, provider);

const getPrice = async () => {
    const price = await quoterContract.callStatic.quoteExactInputSingle(
        tokenIn,
        tokenOut,
        fee,
        amoutIn,
        sqrtPriceLimitX96
    );
    console.log('expectedAmout', ethers.utils.formatUnits(price.toString(), 6));

    console.log("...................................................");

    const params = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: fee,
        amountIn: amoutIn,
        sqrtPriceLimitX96: sqrtPriceLimitX96,
    };

    const price2 = await quoter2Contract.callStatic.quoteExactInputSingle(params);

    console.log('sqrtPriceLimitX96AfterQuote', price2.sqrtPriceX96After.toString());
    console.log('initilizedTicksCrossed', price2.initializedTicksCrossed.toString());
    console.log('gasEstimate', price2.gasEstimate.toString());
}

const sync = async () => {
    const currentPrice = await getPrice();
    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        const newPrice = await getPrice();
        if (currentPrice !== newPrice) {
            console.log('Price has changed:', newPrice);
            currentPrice = newPrice;
        }
    }
};

sync();
