import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const {searchInput, searchType, count = 10} = await req.json();

        if (!searchInput) {
            return NextResponse.json({error:'Please pass user search query'}, {status: 400});
        }

        const result = await axios.get(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchInput)}&count=${count}`, {
            headers:{
                'Accept':'application/json',
                'Accept-Encoding':'gzip',
                'X-Subscription-Token':process.env.BRAVE_API_KEY 
            }
        });

        console.log(result.data);

        return NextResponse.json(result.data);

    } catch (error) {
        console.error('Error in brave-search-api:', error.message || error);
        return NextResponse.json({error: 'Failed to fetch from Brave Search API'}, {status: 500});
    }
}