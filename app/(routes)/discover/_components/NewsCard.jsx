import React from 'react'
import Image from 'next/image';

function NewsCard({news}) {
  return (
    <div
      className='border rounded-2xl mt-6 cursor-pointer'
      onClick={() => window.open(news?.url, '_blank')}
      role="button"
      tabIndex={0}
      aria-label={`Open article: ${news?.title}`}
      onKeyDown={(e) => e.key === 'Enter' && window.open(news?.url, '_blank')}
    >
        {news?.thumbnail?.original && (
          <Image
            src={news.thumbnail.original}
            alt={news?.title || 'News image'}
            width={700}
            height={300}
            className='rounded-2xl w-full'
            unoptimized
          />
        )}
        <div className='p-4 '>
        <h2 className='font-bold text-xl text-gray-600 '>{news?.title || 'Untitled'}</h2>
        <p className='text-md mt-2 line-clamp-2 text-gray-500'>
          {news?.description ? news.description.replace(/<\/?strong>/g, '') : 'No description available.'}
        </p>
        </div>
    </div>
  )
}

export default NewsCard 