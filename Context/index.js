"use client"

import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { notification } from 'antd';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CheckIfWalletConnected, connectWallet, connectingWithContract, connectingNativeTokenContract, getBalance } from '../Utils/index';

const ContractContext = createContext();

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState();
  const [selectedContractKey, setSelectedContractKey] = useState('sevenDays');

  const [lockPeriod, setLockPeriod] = useState(null);
  const [extendedLockOnRegistration, setExtendedLockOnRegistration] = useState(null);
  const [earlyUnstakeFee, setEarlyUnstakeFee] = useState(null);
  const [minStakingAmount, setMinStakingAmount] = useState(null);
  const [maxStakingAmount, setMaxStakingAmount] = useState(null);
  const [status, setStatus] = useState(null);
  const [additionalRewards, setAdditionalRewards] = useState(null);
  const [totalValueLocked, setTotalValueLocked] = useState(null);
  const [userLockedTokens, setUserLockedTokens] = useState(null);
  const [apy, setApy] = useState(null);
  const [numberOfStakers, setNumberOfStakers] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [userDetails, setUserDetails] = useState({
    stakeAmount: null,
    rewardAmount: null,
    lastStakeTime: null,
    lastRewardCalculationTime: null,
    rewardsClaimedSoFar: null,
  });

  const formatTimeLeft = (timeLeft) => {
    console.log("format time left",timeLeft)
    return timeLeft
      ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
      : 'Staking period ended';
  }
  
  const getStakingStatus =  (startDate,endDate) => {
    const currentDate = new Date();
    console.log(endDate)
    console.log(startDate)
    if (currentDate < startDate) {
      return 'Staking starts in ' + formatTimeLeft();
    } else if (currentDate > startDate && currentDate < endDate) {
      return 'Active - Time left: ' + formatTimeLeft();
    } else {
      return 'Staking period ended';
    }
  }


  const loadContractData = async (contractKey) => {
    try {
      const connectedAccount = await CheckIfWalletConnected();
      console.log("account", connectedAccount);
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const network = await provider.getNetwork();
      
      if (network.chainId === 80002 && connectedAccount) {
        setAccount(connectedAccount);
        setProvider(provider);

        const tokenContract = await connectingNativeTokenContract();
        console.log("Token Contract", tokenContract);
        setTokenContract(tokenContract);
        const balance = await tokenContract.balanceOf(connectedAccount);
        setBalance(balance);

        const stakingContract = await connectingWithContract(contractKey);
        setStakingContract(stakingContract);
        console.log("Staking contract", stakingContract);

        const user = await stakingContract.getUser(connectedAccount);
        setUserDetails({
          stakeAmount: ethers.utils.formatEther(user.stakeAmount.toString()),
          rewardAmount: ethers.utils.formatEther(user.rewardAmount.toString()),
          lastStakeTime: new Date(user.lastStakeTime * 1000).toLocaleString(),
          lastRewardCalculationTime: new Date(user.lastRewardCalculationTime * 1000).toLocaleString(),
          rewardsClaimedSoFar: ethers.utils.formatEther(user.rewardsClaimedSoFar.toString()),
        });

        const lockPeriod = await stakingContract.getStakeDays();
        const lockPeriodInDays = lockPeriod / (60 * 60 * 24);
        setLockPeriod(lockPeriodInDays);

        const earlyUnstakeFee = await stakingContract.getEarlyUnstakeFeePercentage();
        setEarlyUnstakeFee(earlyUnstakeFee);

        const minStakingAmount = await stakingContract.getMinimumStakingAmount();
        setMinStakingAmount(minStakingAmount);

        const maxStakingAmount = await stakingContract.getMaxStakingTokenLimit();
        setMaxStakingAmount(maxStakingAmount);

        

        const additionalRewards = await stakingContract.getUserEstimatedRewards();
        setAdditionalRewards(additionalRewards);

        const totalValueLocked = await stakingContract.getTotalStakeTokens();
        setTotalValueLocked(totalValueLocked);

        setUserLockedTokens(user.stakeAmount);

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
        

        calculateTimeLeft(contractEndDate);

        const status = getStakingStatus(startDate,endDate);
        setStatus(status);
      } else {
        notification.error({
          message: 'Network Error',
          description: 'Please connect to the Polygon Amoy.',
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
   
      loadContractData(selectedContractKey);
     
    
  }, [selectedContractKey]);

  const handleContractChange = async (contractKey) => {
    setSelectedContractKey(contractKey);
    await loadContractData(contractKey);
  };

  const stakeTokens = async (amount) => {
    if (stakingContract) {
      await approveTokenSpend(amount);
      const tx = await stakingContract.stake(ethers.utils.parseUnits(amount, 18));
      console.log("Transaction", tx);
      await tx.wait();
      saveTransaction('stake', amount);
    }
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
    console.log(endDate)
    const newEndDate = endDate.toNumber() * 1000;
    const  now = Date.now()
    console.log(now)
    const difference =  newEndDate - now;
    // const diffDate = new Date(difference)
  
    console.log(difference)
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    const formattedTimeLeft = formatTimeLeft(timeLeft);
    console.log(formattedTimeLeft);

    // setTimeLeft(timeLeft);
  };

  return (
    <ContractContext.Provider value={{
      account,
      stakeTokens,
      unstakeTokens,
      claimRewards,
      balance,
      lockPeriod,
      extendedLockOnRegistration,
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
      getStakingStatus
    }}>
      {children}
    </ContractContext.Provider>
  );
};
