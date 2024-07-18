

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { STAKING_CONTRACTS, ERC20Token_ABI, ERC20Token_ADDRESS } from "../Context/constants";

export const CheckIfWalletConnected = async () => {
  try {
    if (!window.ethereum) {
      return console.log("Install Wallet!");
    }
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts[0];
  } catch (error) {
    console.log(error);
  }
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      return console.log("Install wallet!");
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.log(error);
  }
};

const fetchContract = (address, abi, signedOrProvider) => {
  console.log("fetchContract called with:", signedOrProvider);
  try {
    const contract = new ethers.Contract(address, abi, signedOrProvider);
    return contract;
  } catch (error) {
    console.error("Error in fetchContract:", error);
  }
};

export const connectingWithContract = async (contractKey) => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const { address, abi } = STAKING_CONTRACTS[contractKey];
    const contract = fetchContract(address, abi, signer);
    
    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const getBalance = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    return await signer.getBalance();
  } catch (error) {
    console.log(error);
  }
};

const fetchTokenContract = (signedOrProvider) => {
  try {
    const contract = new ethers.Contract(ERC20Token_ADDRESS, ERC20Token_ABI, signedOrProvider);
    return contract;
  } catch (error) {
    console.error("Error in fetchTokenContract:", error);
  }
};

export const connectingNativeTokenContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    if (!signerAddress) {
      throw new Error("Signer address is null");
    }
    const contract = fetchTokenContract(signer);
    return contract;
  } catch (error) {
    console.error("Error in connectingNativeTokenContract:", error);
  }
};
