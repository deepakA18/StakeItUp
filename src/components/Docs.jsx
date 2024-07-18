"use client"

import React from 'react'

import { AspectRatio } from './ui/aspect-ratio'
import { Button } from './ui/button'


const Docs = () => {
  return (
    <div className=''>
    <section className="mt-12">
    <AspectRatio ratio={40/16} className='text-white w-full'>
    <div className='flex flex-col items-center mt-14'>
    <h1 className='text-5xl font-bold'>Discover Our Documentation</h1>
    <p className='text-xl font-semibold mt-4'>Your gateway to stake it up resources</p>
    </div>

    <div className='flex mt-20 justify-center space-x-40 '>
  <div className="bg-indigo-600 text-white rounded-3xl p-8  w-96 h-56 flex flex-col ">
    <h3 className="text-lg font-bold">Developer Docs</h3>
    <p className="mt-2 text-md">Are you a fellow builder in the making? Check out our docs and start building today.</p>
    <div className='mt-4'>
    <Button>Explore Docs</Button>
    </div>
    
  </div>
  <div className="bg-indigo-600 text-white rounded-3xl p-8 w-96 h-56 flex flex-col ">
    <h3 className="text-lg font-bold">Join the Community</h3>
    <p className="mt-2 text-md">Eager to connect and learn with fellow crypto enthusiasts? Explore and join the vibrant community.</p>
    <div className='mt-4'>
    <Button>Learn More</Button>
    </div>
  </div>
</div>

   
    </AspectRatio>
    </section>
    </div>
  )
}

export default Docs
