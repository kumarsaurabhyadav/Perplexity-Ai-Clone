import SourceList from '@/app/_components/SourceList';
import Image from 'next/image';
import React from 'react'
import DisplaySummery from './DisplaySummery';

function AnswerDisplay({chat,loadingSearch}) {
    
  return ( 
    <div>
        <div >
            <SourceList webResult={chat?.searchResult} loadingSearch={loadingSearch}/>
            <DisplaySummery aiResp={chat?.aiResp}/>
        </div>
    </div> 
  )
}

export default AnswerDisplay

