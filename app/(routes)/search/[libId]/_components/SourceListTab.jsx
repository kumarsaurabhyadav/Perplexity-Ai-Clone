import Image from 'next/image'
import React from 'react'

function SourceListTab({chat}) {
  return (
    <div>
        <div>
            {chat.searchResult.map((Item,index)=>(
                <div key={index}>
                    <div className='flex gap-2 mt-4 items-center'>
                        <h2>{index+1}</h2>
                        <Image src={Item.img} alt={Item.title}
                        width={20}
                        height={20}
                        className='rounded-full w-[20px] h-[20px] border'/>
                        <div>
                            <h2 className='text-xs'>{Item.long_name}</h2>
                        </div>
                    </div>  
                    <h2 className='mt-1 line-clamp-1 font-bold text-lg text-gray-600'>{Item.title}</h2>
                    <h2 className='mt-1 text-xs text-gray-600'>{Item.title}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SourceListTab