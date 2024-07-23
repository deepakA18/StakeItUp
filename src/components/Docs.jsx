"use client"

import React from 'react'

import { Button } from './ui/button'
import {OpenInNewWindowIcon} from "@radix-ui/react-icons"

const Docs = () => {
  return (
    <div className=''>
      <section className="mt-12 px-4">
        <div className='text-white w-full'>
          <div className='flex flex-col items-center mt-16'>
            <p className='text-4xl font-bold text-center'>Discover Our Documentation</p>
            <p className='text-xl font-semibold mt-4 text-center'>Your gateway to stake it up resources</p>
          </div>
          <div className='flex flex-col md:flex-row mt-20 justify-evenly space-y-8 md:space-y-0 md:space-x-10'>
            <div className="bg-indigo-600 text-white rounded-3xl p-8 w-full md:w-96 h-auto flex flex-col">
              <h3 className="text-lg font-bold">Developer Docs</h3>
              <p className="mt-2 text-md">Are you a fellow builder in the making? Check out our docs and start building today.</p>
              <div className='mt-4'>
                <Button><OpenInNewWindowIcon className="mr-2 h-4 w-4"/>Explore Docs</Button>
              </div>
            </div>
            <div className="bg-indigo-600 text-white rounded-3xl p-8 w-full md:w-96 h-auto flex flex-col">
              <h3 className="text-lg font-bold">Join the Community</h3>
              <p className="mt-2 text-md">Eager to connect and learn with fellow crypto enthusiasts? Explore and join the vibrant community.</p>
              <div className='mt-4'>
                <Button>Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Docs
