import React from 'react'
import Image from 'next/image';

function SourceList({webResult,loadingSearch}) {
    return (
        <div className="flex flex-wrap gap-3">
            {webResult?.map((item, index)=> (
                <div
                  key={index}
                  className='p-3 bg-accent rounded-lg w-[200px] cursor-pointer hover:bg-[#e1e3da]'
                  onClick={() => window.open(item.url, '_blank')}
                  aria-label={`Open source: ${item?.long_name || 'link'}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && window.open(item.url, '_blank')}
                >
                    <div className='flex gap-2 items-center'>
                        {item?.img ? (
                          <Image
                            src={item.img}
                            alt={item?.name || 'source logo'}
                            width={20}
                            height={20}
                          />
                        ) : (
                          <div className="w-5 h-5 bg-gray-300 rounded-full" />
                        )}
                        <h2 className='text-xs'>{item?.long_name}</h2>
                    </div>
                    <h2 className='line-clamp-2 text-black text-xs'>{item?.description}</h2>
                </div>
            ))}
            {loadingSearch&&<div className='flex flex-wrap gap-2'>
                {[1,2,3,4].map((item,index)=>(
                    <div className='w-[200px] h-[100px] rounded-2xl bg-accent animate-pulse' key={index}>

                    </div>
                ))}
            </div>

            }
        </div>
    )
}

export default SourceList