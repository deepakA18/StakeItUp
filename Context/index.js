"use client"

import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { notification } from 'antd';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CheckIfWalletConnected, connectWallet, connectingWithContract, connectingNativeTokenContract, getBalance } from '../Utils/index';

const ContractContext = createContext();

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {


  const [isLoading, setIsLoading] = useState(true);

  const [provider, setProvider] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState({ raw: null, formatted: "0" });
  const [selectedContractKey, setSelectedContractKey] = useState('sevenDays');

  const [lockPeriod, setLockPeriod] = useState("0");
  const [earlyUnstakeFee, setEarlyUnstakeFee] = useState("0");
  const [minStakingAmount, setMinStakingAmount] = useState({ raw: null, formatted: "0" });
  const [maxStakingAmount, setMaxStakingAmount] = useState({ raw: null, formatted: "0" });
  const [status, setStatus] = useState("NA");
  const [additionalRewards, setAdditionalRewards] = useState({ raw: null, formatted: "0" });
  const [totalValueLocked, setTotalValueLocked] = useState({ raw: null, formatted: "0" });
  const [userLockedTokens, setUserLockedTokens] = useState({ raw: null, formatted: "0" });
  const [apy, setApy] = useState("0");
  const [numberOfStakers, setNumberOfStakers] = useState("0");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("...Loading");
  const [userDetails, setUserDetails] = useState({
    stakeAmount: null,
    rewardAmount: null,
    lastStakeTime: null,
    lastRewardCalculationTime: null,
    rewardsClaimedSoFar: null,
  });
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const formatLargeNumber = (value, decimals = 18) => {
    if (!value) return "0";
    let formattedValue;
    if (typeof value === 'object' && value._isBigNumber) {
      formattedValue = ethers.utils.formatUnits(value, decimals);
    } else if (typeof value === 'string' || typeof value === 'number') {
      formattedValue = value.toString();
    } else {
      return "0";
    }
    return parseFloat(formattedValue).toFixed(2);
  };

  const formatTimeLeft = (timeLeft) => {
    console.log("format time left",timeLeft)
    return timeLeft
      ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
      : 'Staking period ended';
  }
  
  const getStakingStatus = (startDate = new Date(), endDate = new Date()) => {
    const currentDate = new Date();
    if (currentDate < startDate) {
      return 'Inactive';
    } else if (currentDate > startDate && currentDate < endDate) {
      return 'Active';
    } else {
      return 'Staking period ended';
    }
  };

  const handleConnectWallet = async () => {
    try {
        setIsLoading(true);
        const connectedAccount = await connectWallet();
        if (!connectedAccount) return;

        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const network = await provider.getNetwork();

        if (network.chainId === 80002) {
            setAccount(connectedAccount);
            setProvider(provider);
            setIsWalletConnected(true); // Set wallet connection status

            // Load contract data only after successful connection
        } else {
          notification.error({
            message: 'Network Error',
            description: 'Please connect to the Polygon Amoy.',
          });
          return;
        }
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    } finally {
        setIsLoading(false);
    }
};


  const loadContractData = async (contractKey) => {
    if(!isWalletConnected) return;
    setIsLoading(true);
    try {
      
        const tokenContract = await connectingNativeTokenContract();
        console.log("Token Contract", tokenContract);
        setTokenContract(tokenContract);
        const balance = await tokenContract.balanceOf(account);
        console.log(account)
        setBalance({ raw: balance, formatted: formatLargeNumber(balance) });

        const stakingContract = await connectingWithContract(contractKey);
        setStakingContract(stakingContract);
        console.log("Staking contract", stakingContract);

        const user = await stakingContract.getUser(account);
        setUserDetails({
          stakeAmount: { raw: user.stakeAmount, formatted: formatLargeNumber(user.stakeAmount) },
          rewardAmount: { raw: user.rewardAmount, formatted: formatLargeNumber(user.rewardAmount) },
          lastStakeTime: new Date(user.lastStakeTime * 1000).toLocaleString(),
          lastRewardCalculationTime: new Date(user.lastRewardCalculationTime * 1000).toLocaleString(),
          rewardsClaimedSoFar: { raw: user.rewardsClaimedSoFar, formatted: formatLargeNumber(user.rewardsClaimedSoFar) },
        });

        const lockPeriod = await stakingContract.getStakeDays();
        const lockPeriodInDays = lockPeriod / (60 * 60 * 24);
        setLockPeriod(lockPeriodInDays);

        const earlyUnstakeFee = await stakingContract.getEarlyUnstakeFeePercentage();
        setEarlyUnstakeFee(earlyUnstakeFee);

        const minStakingAmount = await stakingContract.getMinimumStakingAmount();
        console.log("Max staking amount:", ethers.utils.formatEther(minStakingAmount));
        setMinStakingAmount({ raw: minStakingAmount, formatted: formatLargeNumber(minStakingAmount) });

        const maxStakingAmount = await stakingContract.getMaxStakingTokenLimit();
        console.log("Max staking amount:", ethers.utils.formatEther(maxStakingAmount));
        setMaxStakingAmount({ raw: maxStakingAmount, formatted: formatLargeNumber(maxStakingAmount) });

        

        const additionalRewards = await stakingContract.getUserEstimatedRewards();
        setAdditionalRewards({ raw: additionalRewards, formatted: formatLargeNumber(additionalRewards,13) });

        const totalValueLocked = await stakingContract.getTotalStakeTokens();
        console.log("Total value locked:", ethers.utils.formatEther(totalValueLocked));
        setTotalValueLocked({ raw: totalValueLocked, formatted: formatLargeNumber(totalValueLocked) });

        setUserLockedTokens({ raw: user.stakeAmount, formatted: formatLargeNumber(user.stakeAmount) });

        const apy = await stakingContract.getAPY();
        setApy(apy);

        const numberOfStakers = await stakingContract.getTotalUsers();
        setNumberOfStakers(numberOfStakers);

        const contractStartDate = await stakingContract.getStakeStartDate();
        // setStartDate(new Date(contractStartDate * 1000));
        const startDate = new Date(contractStartDate * 1000)
         console.log(new Date(contractStartDate * 1000))
        console.log(startDate)

        const contractEndDate = await stakingContract.getStakeEndDate();
        // setEndDate(new Date(endDate * 1000));
        const endDate = new Date(contractEndDate * 1000)
        console.log(endDate)
        setEndDate(contractEndDate);
        setIsLoading(false);
        // calculateTimeLeft(contractEndDate);

        const status = getStakingStatus(startDate,endDate);
        setStatus(status);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isWalletConnected && selectedContractKey) {
      loadContractData(selectedContractKey);
    }
  }, [selectedContractKey,isWalletConnected]);

  useEffect(() => {
    console.log("endDate changed:", endDate ? endDate.toString() : "null");
    if (!endDate) return;

    const updateTimeLeft = () => {
      const timeLeftFormatted = calculateTimeLeft(endDate);
      setTimeLeft(timeLeftFormatted);
    };

    updateTimeLeft(); // Initial update
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);
  

  const handleContractChange = async (contractKey) => {
    setSelectedContractKey(contractKey);
    await loadContractData(contractKey);
  };

  const stakeTokens = async (amount) => {
    if (stakingContract) {
      try {
        await approveTokenSpend(amount);
        console.log("SC",stakingContract)
        const tx = await stakingContract.stake(ethers.utils.parseUnits(amount, 18));
        await tx.wait();
        saveTransaction('stake', amount);
        return { success: true };
      } catch (error) {
        console.error("Staking error:", error);
        if (error.message.includes('max staking token limit reached')) {
          return { success: false, error: 'Maximum staking token limit has been reached.' };
        }
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: "Staking contract not initialized" };
  };

  const unstakeTokens = async (amount) => {
    if (stakingContract) {
      const tx = await stakingContract.unstake(ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      await loadContractData(selectedContractKey);
      saveTransaction('unstake', amount);
    }
  };

  const claimRewards = async () => {
    if (stakingContract) {
      const tx = await stakingContract.claimRewards();
      await tx.wait();
      await loadContractData(selectedContractKey);
      saveTransaction('claimRewards', 0);
    }
  };

  const approveTokenSpend = async (amount) => {
    if (tokenContract) {
      const tx = await tokenContract.approve(stakingContract.address, ethers.utils.parseUnits(amount, 18));
      await tx.wait();
    }
  }

  const saveTransaction = (type, amount) => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const newTransaction = { type, amount, date: new Date().toLocaleString() };
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  };

  const calculateTimeLeft = (endDate) => {
    const newEndDate = endDate.toNumber() * 1000;
    const now = Date.now();
    const difference = newEndDate - now;
    console.log(difference)
  
    if (difference > 0) {
      const timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
      console.log(timeLeft)
      return formatTimeLeft(timeLeft);
    } else {
      return 'Staking period ended';
    }
  };

  const refreshContractData = async () => {
    await loadContractData(selectedContractKey);
  };

  return (
    <ContractContext.Provider value={{
      
      account,
  stakeTokens,
  unstakeTokens,
  claimRewards,
  balance,
  lockPeriod,
  earlyUnstakeFee,
  minStakingAmount,
  maxStakingAmount,
  status,
  additionalRewards,
  totalValueLocked,
  userLockedTokens,
  apy,
  numberOfStakers,
  timeLeft,
  stakingContract,
  tokenContract,
  handleContractChange,
  userDetails,
  getStakingStatus,
  refreshContractData,
  handleConnectWallet
    }}>
      {children}
    </ContractContext.Provider>
  );
};
