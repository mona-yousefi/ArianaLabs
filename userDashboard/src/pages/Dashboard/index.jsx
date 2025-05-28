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
      } catch (error) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm justify-self-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 text-center">
                  {userData.first_name} <br /> {userData.last_name}
                </p>
                <p className="text-xs text-gray-500">@{userData.username}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 justify-self-end bottom-0">
              <button
                onClick={handleLogout}
                className=" items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                Logout
              </button>
      </main>
    </div>
  );
};

export default Dashboard;