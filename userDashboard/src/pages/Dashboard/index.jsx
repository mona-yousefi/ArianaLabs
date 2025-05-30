/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgPng from '../../assets/image.png';
import imgPng2 from '../../assets/image2.png';
import icon from '../../assets/icon.png';
import warningIcon from '../../assets/warning.png';
import close from '../../assets/close.png';
import { getCurrentUser } from '../../apiClient';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    avatar:''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showLogoutModal,setShowLogoutModal]=useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/');
          return;
        }

        // Fetch user data - adjust this endpoint based on your API
        const response = await getCurrentUser()
        setUserData(response.data);

        if (response.data.avatar) {
          setAvatarUrl(response.data.avatar);
        }
        // If avatar is returned as binary/image data
        else if (response.data.avatar_data) {
          const blob = new Blob([response.data.avatar_data], { type: 'image/jpeg' });
          setAvatarUrl(URL.createObjectURL(blob));
        }
    }
       catch (error) {
        localStorage.removeItem('authToken');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutModal(true)
  };
  const confirmLogout = () => {
    localStorage.removeItem('authToken');
    setShowLogoutModal(false);
    navigate('/');
  };
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={`flex w-screen ${showLogoutModal ? 'flex justify-center items-center -z-100' : ''}`}>
      {showLogoutModal && (
        <div className="bg-gray-700 fixed w-screen h-screen opacity-90 flex items-center justify-center z-100 ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full opacity-100 flex flex-col items-center">
            <button className='self-end w-[60px] h-[60px]' onClick={cancelLogout}><img src={close} alt="" /></button>
            <img src={warningIcon} className='w-[40px] h-[40px]' alt="" />
            <h4 className="text-lg text-center font-medium text-gray-900 mb-4">Logout</h4>
            <p className="text-primaryGray mb-6">Are you sure you want to signout from your account?</p>
            <div className="flex justify-center w-full gap-4">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 w-[40%] text-primary border-[1px] shadow-lg border-borderColor rounded-md"
              >
                Logout
              </button>
              <button
                onClick={cancelLogout}
                className="px-4 py-2 border w-[40%] bg-primary rounded-md text-white hover:bg-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`min-h-screen bg-gray-50 flex flex-col justify-between`}>
      {/* Navigation Bar */}
      <nav className="flex flex-col h-screen justify-between px-2 pt-10 pb-2 w-[240px]">
        {/* User Data */}
        <div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center justify-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl}
              alt="User avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-Geist text-gray-600">
                {userData.first_name?.[0]}{userData.last_name?.[0]}
              </span>
            </div>
          )}
        </div>
                <p className="text-[15px] font-Geist font-bold mt-2 text-gray-900 text-center">
                  {userData.first_name} {userData.last_name}
                </p>
                <p className="text-[15px] text-userColor text-center">@{userData.username}</p>
              </div>
            </div>
          </div>
        </div>
        {/* logout button */}
        <main className="max-w-7xl mx-auto py-6 flex w-full bottom-0 justify-self-end">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-logoutButton hover:bg-red-700 focus:outline-none w-full"
              >
                <span>
                  <img src={icon} className='w-[12px] h-[12px]' alt="" />
                </span>
                Logout
              </button>
        </main>
      </nav>
      </div>
      <div className={`w-full flex flex-col ${showLogoutModal ? 'w-full' : 'w-[calc(100%-240px)]'} h-screen`}>
          <nav className='bg-navColor'>
            <img src={imgPng} className='w-[118px] h-[40px]' alt="" />
          </nav>
          <div className='flex justify-center items-center h-full'>
            <img src={imgPng2} className='w-[480px] h-[480px]' alt="" />
          </div>
      </div>
    </div>
  );
};

export default Dashboard;