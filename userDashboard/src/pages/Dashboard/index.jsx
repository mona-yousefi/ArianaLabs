import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    avatar:''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
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
        const response = await axios.get(
          'https://mock.arianalabs.io/api/staff/current_user/',
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setUserData(response.data);
        console.log(response.data);
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
        console.error('Failed to fetch user data:', error);
        localStorage.removeItem('authToken');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm justify-self-start pt-2 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center justify-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl}
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {userData.first_name?.[0]}{userData.last_name?.[0]}
              </span>
            </div>
          )}
        </div>
                <p className="text-sm font-medium text-gray-900 text-center">
                  {userData.first_name} {userData.last_name}
                </p>
                <p className="text-xs text-gray-500 text-center">@{userData.username}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex w-full bottom-0">
              <button
                onClick={handleLogout}
                className=" items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none w-full"
              >
                Logout
              </button>
      </main>
    </div>
  );
};

export default Dashboard;