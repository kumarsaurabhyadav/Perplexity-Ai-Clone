"use client"
import axios from 'axios';
import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import NewsCard from './_components/NewsCard';

const options = [
    {
        title: 'Top',
        icon: Star
    },
    {
        title: 'Tech & Science',
        icon: Cpu
    },
    {
        title:'Finance',
        icon: DollarSign
    },
    {
        title: 'Art & Culture',
        icon: Palette
    },
    {
        title:'Sports',
        icon:Volleyball
    },
]

function Discover() {
    const[selectedOption,setSelectedOption]=useState('Top');
    const[latestNews,setLatestNews]=useState();

useEffect(() => {
    if (selectedOption) {
        setLatestNews([]);
        getSearchResult();
    }
}, [selectedOption]);
const getSearchResult = async () => {
    const result = await axios.post('/api/brave-search-api', {
        searchInput: selectedOption + ' Latest News & Updates',
        searchType: 'search',
        count: 20
    });
    console.log(result.data);
    
    const webSearchResult=result?.data?.web?.results
    setLatestNews(webSearchResult)
}
  return (
    <div className='px-10 md:px-20 lg:px-36 xl:px-56'>
      <div className="flex flex-col justify-center items-center mt-20">
        <h2 className='font-bold text-3xl flex gap-2 items-center '><Globe/> <span>Discover</span></h2>
        <div className='flex mt-5 space-x-2 overflow-x-auto'>
            {options.map((option, index) => (
                <div
                    key={index}
                    onClick={() => setSelectedOption(option.title)}
                    className={`flex items-center gap-1 p-1 px-3 hover:text-primary rounded-full whitespace-nowrap cursor-pointer ${
                        selectedOption === option.title ? 'bg-accent text-primary' : ''
                    }`}
                >
                    <option.icon className='h-4 w-4' />
                    <h2 className='text-sm'>{option.title}</h2>
                </div>
            ))}
        </div>
      </div>
      <div className="w-full grid gap-4 mt-6">
          {Array.isArray(latestNews) && latestNews.length > 0 && (
            <>
              {(() => {
                const rows = [];
                for (let i = 0; i < latestNews.length; i += 4) {
                  rows.push(
                    <div className="col-span-full" key={`full-${i}`}>
                      <NewsCard news={latestNews[i]} />
                    </div>
                  );
                  const group = latestNews.slice(i + 1, i + 4);
                  if (group.length > 0) {
                    rows.push(
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" key={`group-${i}`}>
                        {group.map((item, idx) => (
                          <NewsCard news={item} key={`item-${i + idx + 1}`} />
                        ))}
                      </div>
                    );
                  }
                }
                return rows;
              })()}
            </>
          )}
        </div>
    </div>
  )
}


export default Discover 