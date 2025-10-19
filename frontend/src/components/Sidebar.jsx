import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
 
const Sidebar = () => {
    const [search, setSearch] = useState("");
    const {otherUsers} = useSelector(store=>store.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }
    const fetchUsers = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${BASE_URL}/api/v1/user`);
            dispatch(setOtherUsers(res.data));
        } catch (error) {
            console.log(error);
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const q = (search || "").trim().toLowerCase();
        if (!q) {
            fetchUsers();
            return;
        }
        const matched = otherUsers?.filter((user) => user.fullName.toLowerCase().includes(q));
        if (matched && matched.length > 0) {
            dispatch(setOtherUsers(matched));
        } else {
            toast.error("User not found!");
        }
    }
    return (
        <div className='border-r md:h-auto h-[40vh] border-slate-500 md:p-4 flex flex-col  md:w-auto w-[100%] '>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center md:gap-2   justify-center  '>
                <input
                    value={search}
                    onChange={(e)=>{
                        const v = e.target.value;
                        setSearch(v);
                        if (v.trim() === '') fetchUsers();
                    }}
                    className='input input-bordered  rounded-none md:rounded-md w-full' type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn md:rounded-md bg-zinc-700 text-white rounded-none   '>
                    <BiSearchAlt2 className='w-6 h-6 outline-none'/>
                </button>
            </form>
            <div className="md:divider px-3"></div> 
            <OtherUsers/> 
            <div className='mt-2 flex justify-center w-full '>
                <button onClick={logoutHandler} className='btn btn-sm w-full md:rounded-2xl rounded-none md:mb-0 mb-1  '>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar