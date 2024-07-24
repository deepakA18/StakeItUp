import ERC20Token from "./Token.json";
import StakingContract from "./TokenStaking.json";

export const STAKING_CONTRACTS = {
    sevenDays: {
        address: "0x648a7E9A6c22d816EA66Dce56e4e3a578D7534C1"
    },
    tenDays: {
        address: "0x612Bb3fdC265d9a29b677236d33F8Dcb5516cAAF"
    },
    thirtyDays: {
        address: "0xA87f64C683A55884C0B01F59a587fBEf8431EaA2"
    },
    ninetyDays: {
        address: "0x015dFf0746620D1a315655d73FA3f72D7ce8719f"
    },
    abi: StakingContract.abi
}

export const ERC20Token_ADDRESS = "0x52Aaa35F7F3B5D763dc2f97eB416203e6bAD01Ec";
export const ERC20Token_ABI = ERC20Token.abi;
export const ERC20Token_BYTECODE = ERC20Token.bytecode;

// console.log("ERC20Token_ABI:", ERC20Token_ABI);

