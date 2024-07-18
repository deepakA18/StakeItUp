"use client"

import * as React from 'react'
import Link from 'next/link'



import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
  } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button"
import { RocketIcon } from '@radix-ui/react-icons';


const Header = () => {
  return (
    <header className='flex text-white'>
        <h1 className='flex-1 font-bold text-2xl'>StakeItUp</h1>
    <NavigationMenu>
        
        <NavigationMenuList>
            <NavigationMenuItem>
               <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                    </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        About
                    </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <Link href="/staking" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Staking
                    </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Docs
                    </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            
        </NavigationMenuList>
       
    </NavigationMenu>
    <Button variant="outline" className="ml-5"><RocketIcon className="mr-2 h-4 w-4"/>Connect Wallet</Button>
    </header>
  )
}

export default Header
