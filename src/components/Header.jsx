"use client"

import * as React from 'react'
import Link from 'next/link'
import { useState } from 'react'

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
import {TextAlignJustifyIcon, Cross1Icon} from '@radix-ui/react-icons'



const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className='flex flex-col md:flex-row items-center justify-between text-white p-4'>
            <div className='flex items-center justify-between w-full md:w-auto'>
                <h1 className='font-bold text-2xl'>StakeItUp</h1>
                <button className='md:hidden' onClick={toggleMenu}>
                    {isMenuOpen ? <Cross1Icon className='h-6 w-6' /> : <TextAlignJustifyIcon className='h-6 w-6' />}
                </button>
            </div>
            <nav className={`flex-col md:flex-row md:flex ${isMenuOpen ? 'flex' : 'hidden'} w-full md:w-auto md:items-center`}>
                <NavigationMenu>
                    <NavigationMenuList className='flex flex-col md:flex-row'>
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
                <Button variant="outline" className="mt-2 md:mt-0 md:ml-5 w-full md:w-auto">
                    <RocketIcon className="mr-2 h-4 w-4" />Connect Wallet
                </Button>
            </nav>
        </header>
    )
}

export default Header
