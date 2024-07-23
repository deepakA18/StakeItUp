"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import hero from "../../public/hero.png"

const HeroSection = () => {
  return (
    <section className="mt-4 px-4 md:px-10 text-white">
      <div className=' p-4 w-full flex flex-col md:flex-row items-center md:justify-between'>
        <div className='mt-10 md:mt-14 md:ml-10 w-full md:w-1/2'>
          <h1 className="text-3xl md:text-6xl font-extrabold">
            Stake Your Tokens
            <br />
            Where the Yield <br /> Belongs!
          </h1>
          <p className='text-xl md:text-3xl font-bold mt-4 md:mt-6'>
            Stake tokens, add liquidity,<br/> hold, and earn rewards
          </p>
          <div className='mt-6 md:mt-10 space-x-4 md:space-x-8 '>
            <Button className="px-4 md:px-6 py-3 md:py-7 text-base md:text-lg bg-indigo-600 hover:bg-indigo-900">Stake Tokens</Button>
            <Button className="px-4 md:px-6 py-3 md:py-7 text-base md:text-lg bg-indigo-600 hover:bg-indigo-900">View Pools</Button>
          </div>
        </div>
        <div className='w-full md:w-1/2 flex justify-center md:justify-end items-center mt-10 md:mt-0'>
          <Image src={hero} alt="image" className="rounded-md object-cover w-96 md:w-72 lg:w-80" width={600} height={600}/>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
