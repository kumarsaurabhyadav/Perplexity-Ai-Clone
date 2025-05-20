import React, { useEffect, useState } from 'react'
import { Loader2Icon, LucideImage, LucideList, LucideSparkles, LucideVideo, Send } from 'lucide-react';
import AnswerDisplay from './AnswerDisplay';
import axios from 'axios';
import { SEARCH_RESULT } from '@/services/Shared';
import { supabase } from '@/services/supabase';
import { useParams } from 'next/navigation';
import ImageListTab from './ImageListTab';
import SourceList from '@/app/_components/SourceList';
import SourceListTab from './SourceListTab';
import { Button } from '@/components/ui/button';

const tabs = [
    { label: 'Answer', icon: LucideSparkles },
    { label: 'Images', icon: LucideImage },
    { label: 'Videos', icon: LucideVideo },
    // TODO: Replace static badge count with dynamic source count
    { label: 'Sources', icon: LucideList }

];
function DisplayResult({ searchInputRecord }) {

    // if (!searchInputRecord) return <div>Loading...</div>;

    const [activeTab, setActiveTab] = useState('Answer')
    const [searchResult, setSearchResult] = useState(searchInputRecord);
    const { libId } = useParams();
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (Array.isArray(searchInputRecord?.Chats) && searchInputRecord.Chats.length === 0) {
            GetSearchApiResult();
        } else {
            GetSearchRecords();
        }
        console.log(searchInputRecord);

    }, [searchInputRecord])
    const GetSearchApiResult = async () => {
        setLoadingSearch(true);
        setErrorMessage('');
        setSearchResult(null); // Clear previous result
        try {
            const currentInput = userInput ?? searchInputRecord?.searchInput;
            if (!currentInput) {
                const msg = "No search input provided.";
                console.error(msg);
                setErrorMessage(msg);
                setLoadingSearch(false);
                return;
            }
            console.log("Current input:", currentInput);
            const result = await axios.post('/api/brave-search-api', {
                searchInput: currentInput,
                searchType: searchInputRecord?.type ?? 'Search'
            });
            console.log(result.data);

            const searchResp = result.data;

            const formattedSearchResp = searchResp?.web?.results?.map((item, index) => (
                {
                    title: item?.title,
                    description: item?.description,
                    long_name: item?.profile?.long_name,
                    img: item?.profile?.img,
                    url: item?.url,
                    thumbnail: item?.thumbnail?.src,
                }
            ));
            setSearchResult(formattedSearchResp);
            console.log(formattedSearchResp);

            const { data, error } = await supabase
                .from('Chats')
                .insert([
                    {
                        libId: libId,
                        searchResult: formattedSearchResp,
                        userSearchInput: currentInput // Updated to use current input
                    },
                ])
                .select();
            await GetSearchRecords();

            if (error) {
                const msg = "Insert error: " + error.message;
                console.error(msg);
                setErrorMessage(msg);
                return;
            }

            if (!data || data.length === 0) {
                const msg = "No data returned from insert.";
                console.error(msg);
                setErrorMessage(msg);
                return;
            }

            console.log(data[0]?.id);
            await GenerateAIResp(formattedSearchResp, data[0]?.id);

        } catch (error) {
            const msg = "Error in GetSearchApiResult: " + (error.response?.data?.message || error.message || error);
            console.error(msg, error.response);
            setErrorMessage(msg);
        } finally {
            setLoadingSearch(false);
        }
    };
    const GenerateAIResp = async (formattedSearchResp, recordId) => {
        setErrorMessage('');
        try {
            const result = await axios.post('/api/llm-model', {
                searchInput: searchInputRecord?.searchInput,
                searchResult: formattedSearchResp,
                recordId: recordId
            });
            console.log(result.data);
            const runId = result.data;

            const interval = setInterval(async () => {
                try {
                    const runResp = await axios.post('/api/get-inngest-status', {
                        runId: runId
                    });

                    if (runResp?.data?.data[0]?.status == 'Completed') {
                        console.log('Completed!!!')
                        await GetSearchRecords();
                        clearInterval(interval);
                        //get updated data from db
                    }
                } catch (err) {
                    const msg = "Error during status check: " + (err.message || err);
                    console.error(msg);
                    setErrorMessage(msg);
                    clearInterval(interval);
                }
            }, 1000)


        } catch (err) {
            const msg = "Error during GenerateAIResp: " + (err.message || err);
            console.error(msg);
            setErrorMessage(msg);
        }
    };
    const GetSearchRecords = async () => {
        setErrorMessage('');
        try {
            let { data: Library, error } = await supabase
                .from('Library')
                .select('*, Chats (*)')
                .eq('libId', libId)
                .order('id',{foreignTable:'Chats', ascending: true});
            if (error) {
                const msg = "Error fetching records: " + error.message;
                console.error(msg);
                setErrorMessage(msg);
                return;
            }
            setSearchResult(Library[0]);
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        } catch (err) {
            const msg = "Error in GetSearchRecords: " + (err.message || err);
            console.error(msg);
            setErrorMessage(msg);
        }
    }
    return (
        <div className='mt-7'>
                {!searchInputRecord&&
                <div>
                <div  className='w-full h-5 bg-accent animate-pulse rounded-md'></div>
                <div  className='w-1/2 mt-2  h-5 bg-accent animate-pulse rounded-md'></div>
                <div  className='w-[70%] mt-2 h-5 bg-accent animate-pulse rounded-md'></div>
            </div>}
            {errorMessage && (
                <div className="text-red-600 text-center my-4">{errorMessage}</div>
            )}
            {Array.isArray(searchResult?.Chats) && searchResult.Chats.map((chat, index) => (
                <div key={chat.id || index} className='mt-7'>
                    <div className="mb-2 mt-7">
                        <h2 className="font-bold text-4xl text-gray-600">{chat.userSearchInput}</h2>
                    
                    <hr className="my-2 border-gray-200" />
                    <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
                        {tabs.map(({ label, icon: Icon, badge }) => (
                            <button
                                key={label}
                                onClick={() => setActiveTab(label)}
                                className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${activeTab === label ? 'font-bold' : ''}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                                {badge && (
                                    <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                        {badge}
                                    </span>
                                )}
                                {activeTab === label && (
                                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                                )}
                            </button>
                        ))}
                        <div className="ml-auto text-sm text-gray-500">
                            1 task <span className="ml-1">↗︎</span>
                        </div>
                    </div>
                    <div>
                        {activeTab == 'Answer' ?
                            <AnswerDisplay chat={chat} loadingSearch={loadingSearch}/> :
                            activeTab == 'Images' ? <ImageListTab chat={chat} />
                                : activeTab == 'Videos' ? <div className="text-gray-500">Video results coming soon...</div>
                                : activeTab == 'Sources' ?
                                    <SourceListTab chat={chat} /> : null
                        }
                    </div>
                    <hr className='my-5' />
                </div>
                </div>
            ))}
            {(!searchResult?.Chats || searchResult.Chats.length === 0) && (
              <div className='text-gray-500 text-center mt-10'></div>
            )}
  
             <div className='bg-white w-full border rounded-lg shadow-md p-3 px-5 flex justify-between fixed bottom-6  max-w-md lg:max-w-xl xl:max-w-3xl'>
                <input 
                  placeholder='Type Anything...'
                  className='outline-none '
                  onChange={(e) => setUserInput(e.target.value)}
                  value={userInput}
                />
                {userInput?.length > 0 && (
                  <Button onClick={GetSearchApiResult} disabled={loadingSearch}>{loadingSearch?<Loader2Icon className='animate-spin'/>:<Send/>}</Button>
                )}
            </div>  

        </div>
    )
}

export default DisplayResult
