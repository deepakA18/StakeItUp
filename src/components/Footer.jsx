"use client"

import React from 'react'
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GitHubLogoIcon, TwitterLogoIcon, DiscordLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import {RocketIcon} from "@radix-ui/react-icons"


const Footer = () => {
  return (
    <footer className="py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-10 md:space-y-0">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <Card className="bg-transparent text-white border-0">
              <CardHeader>
                <div className="flex flex-col space-y-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <RocketIcon className='w-8 h-8'/>
                  </div>
                  <p className='text-sm md:text-md md:w-full'>StakeitUp is a EVM-compatible token staking platform built on Polygon Amoy, where you stake SHN tokens to gain the highest yield among entire DeFi ecosystem.</p>
                </div>
              </CardHeader>
              <CardContent className="flex space-x-4 mt-4">
                <a href="#"><GitHubLogoIcon width={20} height={20} /></a>
                <a href="#"><TwitterLogoIcon width={20} height={20} /></a>
                <a href="#"><LinkedInLogoIcon width={20} height={20} /></a>
                <a href="#"><DiscordLogoIcon width={20} height={20} /></a>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-row sm:space-x-10 space-y-0 sm:space-y-0">
  <Card className="bg-transparent text-white border-0">
    <CardHeader>
      <h3 className="font-semibold mb-2">Ecosystem</h3>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm">
        <li><a href="#">DEX</a></li>
        <li><a href="#">Aggregator</a></li>
        <li><a href="#">Swap</a></li>
        <li><a href="#">Pools</a></li>
      </ul>
    </CardContent>
  </Card>
  <Card className="bg-transparent text-white border-0">
    <CardHeader>
      <h3 className="font-semibold mb-2">Resources</h3>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm">
        <li><a href="#">Foundation</a></li>
        <li><a href="#">Docs</a></li>
        <li><a href="#">Careers</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Media kit</a></li>
      </ul>
    </CardContent>
  </Card>
</div>

        </div>
      </div>
      <Separator className="my-8" />
      <div className="container mx-auto px-4">
        <Card className="bg-transparent text-white border-0">
          <CardFooter className="flex flex-col items-center text-center">
            <p className="text-xs">© 2024 Stake It Up! | All rights reserved | <a href="#" className="underline">Terms of Service</a> | <a href="#" className="underline">Privacy Policy</a></p>
            <p className="text-xs mt-4">*Annual Percentage Yield (APY) data is provided from third party and publicly available information, is subject to change, may not be accurate or complete and may not reflect your actual earnings but rather the general network yields estimated to be applicable to all relevant network participants based on current conditions of the network, which may change. Presented rates are retrospective in nature and may not be indicative of future rates. APY data is provided for informational purposes only and should not be relied on.</p>
            <p className="mt-8">Made W/❤️ by <a>0xdeepak18</a></p>
          </CardFooter>
        </Card>
      </div>
    </footer>
  )
}

export default Footer
