import Image from 'next/image'
import React from 'react'

function ImageListTab({ chat }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {chat.searchResult.map((item, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden shadow border bg-white"
        >
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.title || "News Image"}
              width={200}
              height={200}
              className="object-cover w-full h-[200px]"
            />
          ) : (
            <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageListTab