"use client"

import  React, { useState } from "react";

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
// import { Label } from "@/components/ui/label"
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
    extendedLockOnRegistration,
    earlyUnstakeFee,
    balance,
    minStakingAmount,
    maxStakingAmount,
    status,
    additionalRewards,
    totalValueLocked,
    userLockedTokens,
    apy,
    numberOfStakers,
    timeLeft,
    getStakingStatus,
    userDetails

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
      const stakingStatus = getStakingStatus();
      if (stakingStatus === 'Staking period ended') {
        throw new Error('Staking period has ended');
      }
      await stakeTokens(stakeAmount);
    } catch (err) {
      notification.info(
        {
          message: "Staking period has ended!"
        }
      )
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
    <div className="flex">
    <Card className="w-[700px] mt-10  h-[750px]  rounded-3xl">
      <CardHeader>
        <CardTitle>Stake and Earn</CardTitle>
        <CardDescription>Yield is waiting for you!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
        <div>
        <ul className="space-y-2">
          <li>
            <strong>Lock Period:</strong>
            <span>{lockPeriod?.toString()}</span>
          </li>
          <li>
            <strong>Extended Lock on Registration:</strong>
            <span>{extendedLockOnRegistration?.toString()}</span>
          </li>
          <li>
            <strong>Early Unstake Fee:</strong>
            <span>{earlyUnstakeFee?.toString()}</span>
          </li>
          <li>
            <strong>Mini Staking Amount:</strong>
            <span>{minStakingAmount?.toString()}</span>
          </li>
          <li>
            <strong>Maximum Staking Amount:</strong>
            <span>{maxStakingAmount?.toString()}</span>
          </li>
          <li>
            <strong>Status</strong>
            <span>{status?.toString()}</span>
          </li>
          <li>
            <strong>Additional Rewards</strong>
            <span>{additionalRewards?.toString()}</span>
          </li>
        
        </ul>
        </div>
        <div className="text-3xl font-medium flex ml-40">
          <span>{apy?.toString()}</span>
          <span>APY*</span>
        </div>
        </div>
        <div className="mt-7 text-xl font-semibold">
          <p>Balance: {balance?.toString()}</p>
        </div>
        <form className="mt-5">
          <div className="grid w-full items-center gap-y-8">
          <div className="flex flex-col space-y-1.5">
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Staking Period" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="sevenDays">7 Days</SelectItem>
                  <SelectItem value="tenDays">10 Days</SelectItem>
                  <SelectItem value="thirtyDays">30 Days</SelectItem>
                  <SelectItem value="ninetyDays">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row">
              <Input type="Number" id="stake" placeholder="Amount to Stake" value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}/>
              <div className="ml-2">
              <Button onClick={handleStake}>Stake</Button>
              </div>
              
            </div>
            <div className="flex flex-row">
              
              <Input type="Number" id="withdraw" placeholder="Amount to Withdraw" value={unstakeAmount} onChange={(e)=> setUnstakeAmount(e.target.value)} />
              <div className="ml-2">
              <Button onClick={handleUnstake}>Withdraw</Button>
              </div>
            </div>
            <div className="flex flex-row">
              
              <Input type="Number" id="reward" placeholder="Amount of Reward" value={rewardAmount} onChange={(e)=>{e.target.value}} />
              <div className="ml-2">
              <Button onClick={handleClaimRewards}>Reward</Button>
              </div>
            </div>
           
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        
      </CardFooter>
    </Card>
    <div className="ml-28">
        <div className="mt-10 w-80">
          <div className=" bg-indigo-600 text-white rounded-xl p-8 mb-7 w-full text-center">
            <h3 className="text-2xl font-medium">{totalValueLocked?.toString()}</h3>
            <p className="mt-2">Total Value Locked</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 mb-7 w-full text-center">
            <h3 className="text-2xl font-medium">{userDetails.stakeAmount?.toString()}</h3>
            <p className="mt-2">Your Locked Token</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 mb-7 w-full text-center">
            <h3 className="text-2xl font-medium">{apy?.toString()}</h3>
            <p className="mt-2">APY</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 mb-7 w-full text-center">
            <h3 className="text-2xl font-medium">{numberOfStakers?.toString()}</h3>
            <p className="mt-2">Number of Stakers</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 w-full text-center">
            <h3 className="text-2xl font-medium">{timeLeft?.toString()}</h3>
            <p className="mt-2">Time Left, Hurry Up!</p>
          </div>
        </div>
      </div>
    </div>
  
  )
}


export default Page;