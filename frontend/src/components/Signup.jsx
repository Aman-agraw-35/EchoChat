import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '..';
import ImageUpload from './ImageUpload';


const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",  // Set a default gender
    profilePhotoType: "avatar",
  });
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!user.fullName || !user.username || !user.password || !user.confirmPassword || !user.gender) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate password match
      if (user.password !== user.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Create form data
      const formData = new FormData();
      Object.keys(user).forEach(key => formData.append(key, user[key]));
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      // Make API request
      try {
        const res = await axios.post(`${BASE_URL}/api/v1/user/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });

        if (res && res.data && res.data.success) {
          toast.success(res.data.message || 'Registration successful!');
          navigate("/login");
        } else {
          throw new Error(res.data?.message || 'Registration failed');
        }
      } catch (apiError) {
        const errorMessage = apiError.response?.data?.message || apiError.message || 'Registration failed';
        toast.error(errorMessage);
        console.error('Registration error:', apiError);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Form submission error:', error);
    }
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "male",
      profilePhotoType: "avatar"
    })
    setProfileImage(null)
  }
  return (
    <div className="sm:min-w-96 mx-auto max-h-full text-white">
      <div className='w-full p-3 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl text-white  font-bold text-center'>Signup</h1>
        <form onSubmit={onSubmitHandler} action="">
          <div>
            <label className='label px-2'>
              <span className='text-base text-white label-text'>Full Name</span>
            </label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='w-full input text-white input-bordered h-10'
              type="text"
              placeholder='Full Name' />
          </div>
          <div>
            <label className='label px-2'>
              <span className='text-base text-white label-text'>Username</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Username' />
          </div>
          <div>
            <label className='label px-2'>
              <span className='text-base text-white label-text'>Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Password' />
          </div>
          <div>
            <label className='label px-2'>
              <span className='text-base text-white  label-text'>Confirm Password</span>
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Confirm Password' />
          </div>
          <div className="">
            <label className='label px-2'>
              <span className='text-base text-white label-text'>Profile Picture</span>
            </label>
            <ImageUpload
              onImageSelect={setProfileImage}
              onTypeChange={(type) => setUser({ ...user, profilePhotoType: type })}
            />
          </div>
          <div className='flex items-center my-2'>
            <div className='flex items-center'>
              <p>Male</p>
              <input
                type="radio"
                name="gender"
                checked={user.gender === "male"}
                onChange={() => handleCheckbox("male")}
                className="radio border-white mx-2" />
            </div>
            <div className='flex items-center'>
              <p>Female</p>
              <input
                type="radio"
                name="gender"
                checked={user.gender === "female"}
                onChange={() => handleCheckbox("female")}
                className="checkbox border-white mx-2" />
            </div>
          </div>
          <p className='text-center'>Already have an account? <Link to="/login"> login </Link></p>
          <div>
            <button type='submit' className='btn btn-block btn-sm mt-1 border border-slate-700'>Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup