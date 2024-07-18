"use client"

import React from 'react'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GitHubLogoIcon,TwitterLogoIcon,DiscordLogoIcon,LinkedInLogoIcon} from '@radix-ui/react-icons'



const Footer = () => {
  return (
    
    <footer className="py-10 mt-10">
      {/* <Separator /> */}
      <div className="container mx-auto flex justify-between items-start">
        <div className="flex flex-col space-y-2">
          <Card className="bg-transparent text-white border-0 mt-10">
            <CardHeader>
              <div className="flex flex-col  space-x-2">
                <div className=" w-10 h-10 rounded-full flex items-center justify-center">
                  {/* Replace with your logo */}
                  <img src="/path-to-your-logo.png" alt="Logo" className="w-8 h-8" />
                </div>
                <div>
                  <p className='text-md mt-5'>Berachain is a high-performance EVM-compatible blockchain built on Proof-of-Liquidity consensus. Proof-of-Liquidity is a novel consensus mechanism that aims to align network incentives, creating strong synergy between Berachain validators and the ecosystem of projects.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex space-x-4 mt-4">
              {/* Social media icons */}
              <a href="#"><GitHubLogoIcon width={25} height={25} /></a>
              <a href="#"><TwitterLogoIcon width={25} height={25} /></a>
              <a href="#"><LinkedInLogoIcon  width={25} height={25} /></a>
              <a href="#"><DiscordLogoIcon width={25} height={25} /></a>
            </CardContent>
          </Card>
        </div>
        <div className="flex space-x-10 mb-20">
          <Card className="bg-transparent text-white border-0 mt-10">
            <CardHeader>
              <h3 className="font-semibold mb-4">Ecosystem</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#">DEX</a></li>
                <li><a href="#">Aggregator</a></li>
                <li><a href="#">Swap</a></li>
                <li><a href="#">Pools</a></li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-transparent text-white border-0 mt-10">
            <CardHeader>
              <h3 className="font-semibold mb-4">Resources</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
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
      <Separator />
      <div className="container mx-auto text-center mt-20">
        <Card className="bg-transparent text-white border-0">
          <CardFooter className="flex flex-col items-center">
            <p className="text-xs">© 2024 Stake It Up! | All rights reserved | <a href="#" className="underline">Terms of Service</a> | <a href="#" className="underline">Privacy Policy</a></p>
            <p className="text-xs mt-5">*Annual Percentage Yield (APY) data is provided from third party and publicly available information, is subject to change, may not be accurate or complete and may not reflect your actual earnings but rather the general network yields estimated to be applicable to all relevant network participants based on current conditions of the network, which may change. Presented rates are retrospective in nature and may not be indicative of future rates. APY data is provided for informational purposes only and should not be relied on.</p>
            <p className="mt-20">Made W/❤️ by <a>0xdeepak18</a></p>
          </CardFooter>
        </Card>
      </div>
    </footer>
  )
}

export default Footer
