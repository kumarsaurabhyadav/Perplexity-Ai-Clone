"use client"
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs";

function provider({ children }) {
    const { user } = useUser();
    const [userDetail,setUserDetail]=useState();
    
    useEffect(()=>{
        user && CreateNewUser();
    },[user])

    const CreateNewUser = async () => {
        //if user already exist

        let { data: Users, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', user?.primaryEmailAddress.emailAddress);

            console.log(Users)

        if (Users.length == 0) {

            const { data, error } = await supabase
                .from('Users')
                .insert([
                    { 
                        name:user?.fullName,
                        email:user?.primaryEmailAddress.emailAddress
                     },
                ])
                .select();
                setUserDetail(data[0]);
                return ;
        }
         setUserDetail(Users[0]);
    }
    return (
        <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
        <div className='w-full'>{children}</div>
        </UserDetailContext.Provider>
       
    )
}

export default provider;