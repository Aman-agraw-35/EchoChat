import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { setMessages } from "../redux/messageSlice";
import { BASE_URL } from '..';

const PREVIEW_LENGTH = 150;

const Message = ({ message }) => {
    const { authUser, selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();
    const scroll = useRef();
    const messageRef = useRef();
    const [isDeleted, setIsDeleted] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (message?.message?.length > PREVIEW_LENGTH) {
            setShowAll(false);
        }
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const shakeClass = message.shouldShake ? "shake" : "";

    const formatTimestampToIST = (timestamp) => {
        const date = new Date(timestamp);
        const istOffset = 5.5 * 60 * 60 * 1000; 
        const istDate = new Date(date.getTime() + istOffset);
        const formattedDate = istDate.toISOString().substring(0, 10);
        const formattedTime = istDate.toISOString().substring(11, 19);
        return `${formattedDate} ${formattedTime}`;
    };

    const handleDelete = async (messId) => {
        try {
            const confirmDelete = window.confirm("Delete for me?");
            if (!confirmDelete) return;

            await axios.delete(`${BASE_URL}/api/v1/delete/${messId}`);
            // Update the state to reflect the deletion
            dispatch(setMessages(messages.filter(msg => msg._id !== messId)));
            setIsDeleted(true); // Set deleted state to true
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    // Safeguard against undefined `deletedFor`
    if (message.deletedFor && message.deletedFor.includes(authUser?._id)) {
        return null;
    }

    const renderMessageText = () => {
        const text = message?.message || '';
        if (!showAll && text.length > PREVIEW_LENGTH) {
            return text.slice(0, PREVIEW_LENGTH) + '...';
        }
        return text;
    }

    return (
        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="User Avatar" src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div>
            <div className="chat-body">
                <div className="chat-header">
                    {shakeClass && <span className="text-xs opacity-50 text-white">new message</span>}
                    <time className="text-xs opacity-50 text-white">{formatTimestampToIST(message?.updatedAt)}</time>
                </div>

                {isDeleted ? (
                    <div className="chat-bubble bg-gray-300 text-black">
                        This message was deleted for yourself
                    </div>
                ) : (
                    <>
                        <div className={`chat-bubble ${shakeClass} ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''}`}>
                            <div ref={messageRef} className="message-text break-words">{renderMessageText()}</div>
                            {message?.message && message.message.length > PREVIEW_LENGTH && (
                                <button 
                                    onClick={() => setShowAll(prev => !prev)} 
                                    className="text-xs mt-1 underline text-blue-200 block"
                                >
                                    {showAll ? 'Show less' : 'Show more'}
                                </button>
                            )}
                        </div>
                        <div className="delete-icon mt-1">
                            <MdOutlineDelete className="text-white cursor-pointer" onClick={() => handleDelete(message?._id)} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Message;
