"use client"
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Compass, GalleryHorizontalEnd, LogIn, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
const MenuOptions = [
    {
        title: 'Home',
        icons: Search,
        path: '/'
    },
    {
        title: 'Discover',
        icons: Compass,
        path: '/discover'
    },
    {
        title: 'Library',
        icons: GalleryHorizontalEnd,
        path: '/library'
    },
    {
        title: 'Sign In',
        icons: LogIn,
        path: '/sign-in'
    }
]
function AppSidebar() {
    const path = usePathname();
    const{user} = useUser(); 
    const filteredMenu = user
      ? MenuOptions.filter(m => m.title !== 'Sign In')
      : MenuOptions;
    return (
        <Sidebar>
            <SidebarHeader className='bg-accent flex items-center py-5'>
                <Image src={'/logo.png'} alt='logo' width={180} height={140} />
            </SidebarHeader>
            <SidebarContent className='bg-accent'>
                <SidebarGroup >
                    <SidebarContent>
                        <SidebarMenu>
                            {filteredMenu.map((menu, index) => {
                              const Icon = menu.icons;
                              const isActive = menu.path === '/' ? path === '/' : path?.startsWith(menu.path);
                              return (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild className={`p-5 py-6 hover:bg-transparent hover:font-bold ${isActive && 'font-bold'}`}>
                                        <a href={menu.path} className=''>
                                            <Icon className='h-8 w-8' />
                                            <span className='text-lg'>{menu.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                              )
                            })}
                        </SidebarMenu>
                       {!user?  <SignUpButton mode='modal'>
                        <Button className='rounded-full mx-4 mt-4'>Sign Up </Button>
                        </SignUpButton>:
                        <SignOutButton>
                            <Button className='rounded-full mx-4 mt-4'>Logout </Button>
                        </SignOutButton>}
                    </SidebarContent>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter className='bg-accent'>
                <div className='p-3 flex flex-col'>
                    <h2 className='text-gray-500'>Try Now</h2>
                    <p className='text-gray-400'>Update for image upload, smarter AI & more copilot</p>
                    <Button variant={'secondary'} className='text-gray-500 mb-3'>Learn More</Button>
                    <UserButton/>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar