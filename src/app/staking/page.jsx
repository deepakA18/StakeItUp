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



const Page = () => {

  const {handleContractChange} = useContract();

  const handleSelectChange = (e) => {
    handleContractChange(e.target.value);
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
            <span>{}</span>
          </li>
          <li>
            <strong>Extended Lock on Registration:</strong>
            <span>{}</span>
          </li>
          <li>
            <strong>Early Unstake Fee:</strong>
            <span>{}</span>
          </li>
          <li>
            <strong>Mini Staking Amount:</strong>
            <span>{}</span>
          </li>
          <li>
            <strong>Maximum Staking Amount:</strong>
            <span>{}</span>
          </li>
          <li>
            <strong>Status</strong>
            <span>{}</span>
          </li>
          <li>
            <strong>Additional Rewards</strong>
            <span>{}</span>
          </li>
        
        </ul>
        </div>
        <div className="text-3xl font-medium flex ml-40">
          <span>{}</span>
          <span>{}</span>
        </div>
        </div>
        <div className="mt-7 text-xl font-semibold">
          <p>Balance: {}</p>
        </div>
        <form className="mt-5">
          <div className="grid w-full items-center gap-y-8">
          <div className="flex flex-col space-y-1.5">
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Staking Period" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="sevendays">7 Days</SelectItem>
                  <SelectItem value="tendays">10 Days</SelectItem>
                  <SelectItem value="thirtydays">30 Days</SelectItem>
                  <SelectItem value="ninetydays">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row">
              <Input type="Number" id="stake" placeholder="Amount to Stake" />
              <div className="ml-2">
              <Button>Stake</Button>
              </div>
              
            </div>
            <div className="flex flex-row">
              
              <Input type="Number" id="withdraw" placeholder="Amount to Withdraw" />
              <div className="ml-2">
              <Button>Withdraw</Button>
              </div>
            </div>
            <div className="flex flex-row">
              
              <Input type="Number" id="reward" placeholder="Amount of Reward" />
              <div className="ml-2">
              <Button>Reward</Button>
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
            <h3 className="text-2xl font-medium">1000 SHN</h3>
            <p className="mt-2">Total Value Locked</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 mb-7 w-full text-center">
            <h3 className="text-2xl font-medium">1000 SHN</h3>
            <p className="mt-2">Your Locked Token</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 mb-7 w-full text-center">
            <h3 className="text-2xl font-medium">20%</h3>
            <p className="mt-2">APY</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 mb-7 w-full text-center">
            <h3 className="text-2xl font-medium">24</h3>
            <p className="mt-2">Number of Stakers</p>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-8 w-full text-center">
            <h3 className="text-2xl font-medium">3:00:00</h3>
            <p className="mt-2">Time Left, Hurry Up!</p>
          </div>
        </div>
      </div>
    </div>
  
  )
}


export default Page;