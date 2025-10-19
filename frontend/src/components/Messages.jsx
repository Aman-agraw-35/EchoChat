import React from 'react'
import Message from './Message'
 import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
 import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
     useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);
    console.log(messages) ;

    return (
        <div className='relative flex-1 overflow-auto'>
            <div className='px-4 text-sm md:text-base'>
                {messages && messages.length > 0 && messages.map((message) => (
                    <Message key={message._id} message={message} />
                ))}
            </div>

            {(!messages || messages.length === 0) && (
                <div className='absolute inset-0 pointer-events-none flex items-center justify-center'>
                    <div className='bg-white/10 text-white py-3 px-5 rounded-lg opacity-95'>Start chatting</div>
                </div>
            )}
        </div>
    )
}

export default Messages