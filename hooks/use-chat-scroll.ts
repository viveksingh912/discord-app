import { useEffect, useState } from "react";

type ChatScrollProps={
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: ()=>void;
    count: number;
}

export const useChatScroll=({chatRef, bottomRef, shouldLoadMore
    , loadMore,count
}: ChatScrollProps)=>{
    const [hasInitialised, setHasInitialized]=useState(false);
    
    useEffect(()=>{
        const topDiv= chatRef?.current;

        const handleScroll =()=>{
            const scrollTop=topDiv?.scrollTop;
            if(scrollTop===0 && shouldLoadMore){
                loadMore();
            }
        };
        topDiv?.addEventListener("scroll", handleScroll);
        return ()=>{
            topDiv?.removeEventListener("scroll",handleScroll);
        }
    },[shouldLoadMore, loadMore, chatRef]);

    useEffect(()=>{
        const bottomDiv= bottomRef?.current;
        const topDiv = chatRef?.current;
        const shouldAutoScroll=()=>{
            if(!hasInitialised && bottomDiv){
                setHasInitialized(true);
                return true;
            }
            if(!topDiv)return false;

            const distancddFromBottom=topDiv.scrollHeight-topDiv.scrollTop- topDiv.clientHeight;

            return distancddFromBottom<=100;
        }
        if(shouldAutoScroll()){
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior:"smooth",
                })
            }, 100);
        }
    },[bottomRef, chatRef, count,, hasInitialised]);
}