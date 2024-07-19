"use client"
import qs from 'query-string';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { useSocket } from '@/components/providers/socket-provider';

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }: QueryFunctionContext) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam as string,
        [paramKey]: paramValue
      }
    });
    const response = await fetch(url);
    return response.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey], // Including paramValue to ensure uniqueness
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: null
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  };
};
