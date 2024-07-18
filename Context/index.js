"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CheckIfWalletConnected, connectWallet, connectingWithContract, connectingNativeTokenContract, getBalance } from '../Utils/index';
import { ethers } from 'ethers';

const ContractContext = createContext();


export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [selectedContractKey, setSelectedContractKey] = useState('sevenDays');

  const [balance, setBalance] = useState()
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
  const [timeLeft, setTimeLeft] = useState(null);


  const loadContractData = async (contractKey, userAddress) => {
    try {

      const connectedAccount = await CheckIfWalletConnected();
      console.log("address connected",connectedAccount);

      if (connectedAccount) {
       const balance = await getBalance();
       setBalance(ethers.utils.formatEther(balance.toString()));
       setAccount(connectedAccount);

       const tokenContract = await connectingNativeTokenContract();
       setTokenContract(tokenContract);

      }


    const stakingContract = await connectingWithContract(contractKey);
    setStakingContract(stakingContract);
    
    const lockPeriod = await stakingContract.lockPeriod();
    setLockPeriod(lockPeriod);

    const extendedLockOnRegistration = await stakingContract.extendedLockOnRegistration();
    setExtendedLockOnRegistration(extendedLockOnRegistration);

    const earlyUnstakeFee = await stakingContract.earlyUnstakeFee();
    setEarlyUnstakeFee(earlyUnstakeFee);

    const minStakingAmount = await stakingContract.minStakingAmount();
    setMinStakingAmount(minStakingAmount);

    const maxStakingAmount = await stakingContract.maxStakingAmount();
    setMaxStakingAmount(maxStakingAmount);

    const status = await stakingContract.status();
    setStatus(status);

    const additionalRewards = await stakingContract.additionalRewards();
    setAdditionalRewards(additionalRewards);

    const totalValueLocked = await stakingContract.totalValueLocked();
    setTotalValueLocked(totalValueLocked);

    const userLockedTokens = await stakingContract.lockedTokens(userAddress);
    setUserLockedTokens(userLockedTokens);

    const apy = await stakingContract.apy();
    setApy(apy);

    const numberOfStakers = await stakingContract.numberOfStakers();
    setNumberOfStakers(numberOfStakers);

    const timeLeft = await stakingContract.timeLeft();
    setTimeLeft(timeLeft);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
    
  };

  useEffect(()=> {
    loadContractData(selectedContractKey, account);
  },[account, selectedContractKey])

  const handleContractChange = async (contractKey) => {
    setSelectedContractKey(contractKey);
    await loadContractData(contractKey, account);
  };

  const stakeTokens = async (amount) => {
    if (stakingContract) {
      const tx = await stakingContract.stake(ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      await loadContractData(selectedContractKey, account); // Refresh data after staking
    }
  };

  const unstakeTokens = async (amount) => {
    if (stakingContract) {
      const tx = await stakingContract.unstake(ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      await loadContractData(selectedContractKey, account); // Refresh data after unstaking
    }
  };

  const claimRewards = async () => {
    if (stakingContract) {
      const tx = await stakingContract.claimRewards();
      await tx.wait();
      await loadContractData(selectedContractKey, account); // Refresh data after claiming rewards
    }
  };

  return (
    <ContractContext.Provider value={{
      account,
      stakeTokens,
      unstakeTokens,
      claimRewards,
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
    }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
