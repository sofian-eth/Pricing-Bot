const Big = require("big.js");
const blk = require("./blockchain");
const UniswapV2Pair = require("./abi/IUniswapV2Pair.json");

const PAIR_ADDRESS = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11";
const PAIR_NAME = "ETH/USDT";
const INTERVAL = 2000;

const PairContractHTTP = new blk.web3http.eth.Contract(
    UniswapV2Pair.abi,
    PAIR_ADDRESS
);

const getReserves = async (ContractObj) => {

    const _reserves = await ContractObj.methods.getReserves().call();

    return [Big(_reserves.reserve0), Big(_reserves.reserve1)];
};

const PairContractWSS = new blk.web3ws.eth.Contract(
    UniswapV2Pair.abi,
    PAIR_ADDRESS
);

const state = {
    blockNumber: undefined,
    token0: undefined,
    token1: undefined,
}

const updateState = (data) => {
    state.token0 = Big(data.returnValues.reserve0);
    state.token1 = Big(data.returnValues.reserve1);
    state.blockNumber = data.blockNumber;

    console.log(`${state.blockNumber} Price ${PAIR_NAME} : ${state.token0.div(state.token1).toString()}`);
}

const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(resolve, timeInMs))

const main = async () => {
    while(true) {
        const [amtToken0, amtToken1] = await getReserves(PairContractHTTP);

        console.log(`Price ${PAIR_NAME} : ${amtToken0.div(amtToken1).toString()}`);

        await sleep(INTERVAL);
    }
}

mainWSS = async () => {

    [state.token0, state.token1] = await getReserves(PairContractHTTP);

    state.blockNumber = await blk.web3http.eth.getBlockNumber();

    PairContractWSS.events.Sync({}).on("data", (data) => updateState(data));

    console.log(`${state.blockNumber} Price ${PAIR_NAME} : ${state.token0.div(state.token1).toString()}`);
}

mainWSS();