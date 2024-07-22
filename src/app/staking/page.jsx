"use client"

import React, { useState } from "react";
import { ethers } from "ethers";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useContract } from '../../../Context/index'
import { notification } from "antd";

const Page = () => {
  const {
    handleContractChange,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    lockPeriod,
    earlyUnstakeFee,
    balance,
    minStakingAmount,
    maxStakingAmount,
    status,
    additionalRewards,
    totalValueLocked,
    userDetails,
    apy,
    numberOfStakers,
    timeLeft,
    refreshContractData
  } = useContract();

  const handleSelectChange = (e) => {
    console.log(e);
    handleContractChange(e);
  };

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');

  const handleStake = async (e) => {
    e.preventDefault();
    try {
      console.log("Current total staked:", ethers.utils.formatEther(totalValueLocked || '0'));
      console.log("Max staking amount:", ethers.utils.formatEther(maxStakingAmount || '0'));
      console.log("Attempting to stake:", stakeAmount);
      if (status?.toString() === 'Staking period ended') {
        throw new Error('Staking period has ended');
      }
      
      // Check if staking amount exceeds max limit
      if (ethers.BigNumber.from(stakeAmount).gt(ethers.BigNumber.from(maxStakingAmount))) {
        throw new Error('Staking amount exceeds maximum limit');
      }
  
      // Attempt to stake tokens
      const result = await stakeTokens(stakeAmount);
      
      if (result && result.success) {
        notification.success({
          message: "Staking successful!",
          description: `You have staked ${stakeAmount} tokens.`
        });
        setStakeAmount('');
        await refreshContractData();
      } else {
        throw new Error(result.error || 'Staking failed');
      }
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('max staking token limit reached')) {
        errorMessage = 'Maximum staking token limit has been reached. Unable to stake more tokens at this time.';
      }
      notification.error({
        message: "Staking failed",
        description: errorMessage
      });
    }
  };

  const handleUnstake = async (e) => {
    e.preventDefault();
    await unstakeTokens(unstakeAmount);
  };

  const handleClaimRewards = async (e) => {
    e.preventDefault();
    await claimRewards();
  };

  return (
    <div className="flex flex-col md:flex-row p-4">
      <Card className="w-full md:w-2/3 mt-10 h-auto rounded-3xl">
        <CardHeader>
          <CardTitle>Stake and Earn</CardTitle>
          <CardDescription>Yield is waiting for you!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <ul className="space-y-2">
                <li>
                  <strong>Lock Period: </strong>
                  <span className="font-semibold">{lockPeriod?.toString()}</span>
                </li>
                <li>
                  <strong>Early Unstake Fee: </strong>
                  <span className="font-semibold">{earlyUnstakeFee?.toString()}</span>
                </li>
                <li>
                  <strong>Min Staking Amount: </strong>
                  <span className="font-semibold">{minStakingAmount.formatted}</span>
                </li>
                <li>
                  <strong>Max Staking Amount: </strong>
                  <span className="font-semibold">{maxStakingAmount.formatted}</span>
                </li>
                <li>
                  <strong>Status: </strong>
                  <span className="font-semibold">{status?.toString()}</span>
                </li>
                <li>
                  <strong>Additional Rewards: </strong>
                  <span className="font-semibold">{additionalRewards.formatted}</span>
                </li>
              </ul>
            </div>
            <div className="text-3xl font-medium flex md:ml-10 mt-4 md:mt-0">
              <span>{apy?.toString()}</span>
              <span className="ml-1">APY*</span>
            </div>
          </div>
          <div className="mt-7 text-xl font-semibold">
            <p>Balance: {balance.formatted}</p>
          </div>
          <form className="mt-5">
            <div className="grid w-full items-center gap-y-8">
              <div className="flex flex-col space-y-1.5">
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="sevenDays">7 Days</SelectItem>
                    <SelectItem value="tenDays">10 Days</SelectItem>
                    <SelectItem value="thirtyDays">30 Days</SelectItem>
                    <SelectItem value="ninetyDays">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <Input type="number" id="stake" placeholder="Amount to Stake" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="w-full md:w-auto"/>
                <Button onClick={handleStake} className="mt-4 md:mt-0 md:ml-2 w-full md:w-auto">Stake</Button>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <Input type="number" id="withdraw" placeholder="Amount to Withdraw" value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} className="w-full md:w-auto"/>
                <Button onClick={handleUnstake} className="mt-4 md:mt-0 md:ml-2 w-full md:w-auto">Withdraw</Button>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <Input type="number" id="reward" placeholder="Amount of Reward" value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value)} className="w-full md:w-auto"/>
                <Button onClick={handleClaimRewards} className="mt-4 md:mt-0 md:ml-2 w-full md:w-auto">Reward</Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* Add any footer content here if needed */}
        </CardFooter>
      </Card>
      <div className="mt-10 md:mt-0 md:ml-10 w-full md:w-1/3">
        <div className="grid gap-4">
          <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-medium">{totalValueLocked.formatted}</h3>
            <p className="mt-2">Total Value Locked</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-medium">{userDetails.stakeAmount ? userDetails.stakeAmount.formatted : "0"}</h3>
            <p className="mt-2">Your Locked Token</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-medium">{apy?.toString()}</h3>
            <p className="mt-2">APY</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-medium">{numberOfStakers?.toString()}</h3>
            <p className="mt-2">Number of Stakers</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-medium">{timeLeft?.toString()}</h3>
            <p className="mt-2">Time Left, Hurry Up!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;
