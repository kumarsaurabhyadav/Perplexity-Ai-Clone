"use client"
import { supabase } from '@/services/supabase'
import { useUser } from '@clerk/nextjs'
import { SquareArrowOutUpRight } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Library() {

    const {user}=useUser();
    const [libraryHistory,setLibraryHistory]=useState([]);
    const [loading, setLoading] = useState(false);
    const router=useRouter();

    useEffect(()=>{
       if(user?.primaryEmailAddress?.emailAddress){
         GetLibraryHistory();
       }
    },[user])

    const GetLibraryHistory = async() => {
        setLoading(true);
        try {
            let { data: Library, error } = await supabase
                .from('Library')
                .select('*')
                .eq('userEmail',user?.primaryEmailAddress?.emailAddress)
                .order('id', {ascending:false})
            if(error) {
                console.error('Error fetching library history:', error);
            } else {
                setLibraryHistory(Library || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mt-20 px-10 md:px-20 lg:px-36 xl:px-56 '>
            <h2 className='font-bold text-2xl'>Library</h2>
            <div className='mt-7'>
                {loading ? (
                    <p>Loading...</p>
                ) : libraryHistory.length === 0 ? (
                    <p>No library history found.</p>
                ) : (
                    libraryHistory.map((item, index) => (
                        <div key={item.lidId ? `${item.lidId}-${index}` : index} className='cursor-pointer' onClick={()=>router.push('/search/'+item.lidId)}>
                            <div className='flex justify-between'>
                            <div>
                            <h2 className='font-bold'>{item.searchInput}</h2>
                            <p className='text-xs text text-gray-500 '>{moment(item.created_at).fromNow()}</p>
                            </div>
                            <SquareArrowOutUpRight className='h-4 w-4'/>
                            </div>
                            <hr className='my-4'/>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Library