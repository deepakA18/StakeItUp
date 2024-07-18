import ERC20Token from "./Token.json";
import StakingContract from "./TokenStaking.json";

export const STAKING_CONTRACTS = {
    sevenDays: {
        address: "0x4fb792011C5A11FD42062C63aE4433Fa2f51c0C2"
    },
    tenDays: {
        address: ""
    },
    thirtyDays: {
        address: ""
    },
    ninetyDays: {
        address: ""
    },
    abi: StakingContract.abi
}

export const ERC20Token_ADDRESS = "0x52Aaa35F7F3B5D763dc2f97eB416203e6bAD01Ec";
export const ERC20Token_ABI = ERC20Token.abi;
export const ERC20Token_BYTECODE = ERC20Token.bytecode;

console.log("ERC20Token_ABI:", ERC20Token_ABI);
console.log("ERC20Token_ADDRESS:", ERC20Token_ADDRESS);
console.log("StakingContracts:", STAKING_CONTRACTS);
