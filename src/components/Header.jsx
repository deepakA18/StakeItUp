"use client"

import * as React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import logo from '../../public/logo.png'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { RocketIcon } from '@radix-ui/react-icons'
import { TextAlignJustifyIcon, Cross1Icon } from '@radix-ui/react-icons'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className='flex flex-col md:flex-row items-center text-white p-4'>
            <div className='flex flex-1 items-center justify-between w-full md:w-auto'>
                <Image src={logo} alt='logo' width={200} height={150} />
                <button className='md:hidden' onClick={toggleMenu}>
                    {isMenuOpen ? <Cross1Icon className='h-6 w-6' /> : <TextAlignJustifyIcon className='h-6 w-6' />}
                </button>
            </div>

            <nav className={`flex-col items-center md:flex-row md:flex ${isMenuOpen ? 'flex' : 'hidden'} w-full md:w-auto md:items-center mt-4 md:mt-0`}>
                <NavigationMenu>
                    <NavigationMenuList className='flex flex-col md:flex-row items-center md:items-center'>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} hover:text-white`}>
                                    Home
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} hover:text-white`}>
                                    About
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/staking" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} hover:text-white`}>
                                    Staking
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} hover:text-white`}>
                                    Docs
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>

            <Button variant="outline" className="mt-4 md:mt-0 md:ml-5 w-full md:w-auto">
                <RocketIcon className="mr-2 h-4 w-4" />Connect Wallet
            </Button>
        </header>
    )
}

export default Header
