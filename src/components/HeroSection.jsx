"use client"
import React from 'react'
import Image from 'next/image'

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from './ui/button'

const HeroSection = () => {
  return (
    
      <section className="mt-14">
  <AspectRatio ratio={40/17} className='bg-white w-full'>
  <div className=' ml-10 mt-14'>
    <h1 className="text-5xl font-extrabold flex items-center mt-1-">Stake Your Tokens
      <br />
      Where the Yield <br /> Belongs!
    </h1>
    <p className='text-3xl font-bold mt-6'>Stake tokens, add liquidity,<br/> hold ,and earn rewards</p>
    <div className='mt-10 space-x-8'>
    <Button className="px-6 py-7 text-lg">Stake Tokens</Button>
    <Button className="px-6 py-7 text-lg">View Pools</Button>
    </div>
   
  </div>
  <div className='flex justify-end items-center'>
  <Image src="/next.svg" alt="Image" className="rounded-md object-cover " width={300} height={300}/>
  </div>
   
  </AspectRatio>
    </section>

   
  )
}

export default HeroSection
