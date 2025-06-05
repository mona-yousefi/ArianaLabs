
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgPng from '../../assets/image.png';
import imgPng2 from '../../assets/image2.png';
import icon from '../../assets/icon.png';
import warningIcon from '../../assets/warning.png';
import deleteIcon from '../../assets/deleteIcon.png';
import close2 from '../../assets/close2.png';
import close from '../../assets/close.png';
import searchIcon from '../../assets/searchIcon.png';
import { deleteTweet, getCurrentUser, postTweet, searchTweets } from '../../apiClient';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    avatar:''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [tweets, setTweets] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const observer = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showLogoutModal,setShowLogoutModal]=useState(false)
  const [showDeleteModal,setShowDeleteModal]=useState(false)
  const [scrollDebounce, setScrollDebounce] = useState(null);
  const [newTweet, setNewTweet] = useState('');
  const [tweetToDelete, setTweetToDelete] = useState(null);


  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return "just now";
  };


  const debouncedFetchMore = useCallback(() => {
    if (scrollDebounce) clearTimeout(scrollDebounce);
    
    setScrollDebounce(
      setTimeout(() => {
        if (!isFetchingMore && hasMore) {
          setIsFetchingMore(true);
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            justFetchTweets(searchQuery, nextPage, false);
            return nextPage;
          });
        }
      }, 500) // 500ms debounce for scroll
    );
  }, [scrollDebounce, isFetchingMore, hasMore, searchQuery])


  const lastTweetRef = useCallback(node => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        debouncedFetchMore();
      }
    }, {
      threshold: 0.5,
      rootMargin: '200px'
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore, debouncedFetchMore]);

     const justFetchTweets=async(search='',page=1,isNewSearch=true)=>{
      try {
        const response=await searchTweets(search,page)
        if (isNewSearch){
          setTweets(response.data.results);
          setPage(1)
        } else{
          setTweets(prev => [...prev,...response.data.results])
        }
        setHasMore(response.data.results.length>=10)
      } catch (error) {
        return error
      }
     }
  const handlePostTweet = async () => {
    if (newTweet.trim() === '') {
      return; // Don't post if the tweet is empty
    }
    
    setIsLoading(true); // Optionally, set a loading state while posting
    
    
    try {
          const response=await postTweet(newTweet); 
          setNewTweet(''); // Clear the textarea
          setTweets([newTweet.text, ...tweets]); // Add the new tweet to the beginning of the tweets array
  } catch (error) {
          return error
  } finally {
          setIsLoading(false); // Reset loading state
  }
};

  
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (debounceTimeout) clearTimeout(debounceTimeout);
    
    setDebounceTimeout(
      setTimeout(() => {
        justFetchTweets(query);
      }, 800) // 800ms debounce
    );
  };
  
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
  
  useEffect(()=>{
    justFetchTweets()
  },[])
  
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
  
  const handleClickOption=(tweetId)=>{
    setTweetToDelete(tweetToDelete===tweetId ? null : tweetId);
    setShowDeleteModal(true)
    
  }
  const hideDeleteModal=()=>{
    setTweetToDelete(null)
    setShowDeleteModal(false)
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full text-center h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  const handleDeleteTweet = async () => {
    if (!tweetToDelete) return;
    
    try {
      await deleteTweet(tweetToDelete);
      setTweets(prev=>prev.filter(t=>t.id !== tweetToDelete))
      hideDeleteModal()
    
    } catch (error) {
      return error
    }
  };
  return (
    <div className="flex h-screen w-[100vw] bg-gray-100 overflow-hidden">
      {/* Logout Modal (keep existing) */}
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

      {/* Sidebar - Fixed position */}
      <div className="fixed left-0 top-0 h-full w-60 bg-gray-50 flex flex-col">
        {/* User Data */}
        <div className="p-4 flex flex-col items-center mt-10">
          {avatarUrl ? (
            <img 
              src={avatarUrl}
              alt="User avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-Geist text-gray-600">
                {userData.first_name?.[0]}{userData.last_name?.[0]}
              </span>
            </div>
          )}
          <p className="text-[15px] font-Geist font-bold mt-2 text-gray-900 text-center">
            {userData.first_name} {userData.last_name}
          </p>
          <p className="text-[15px] text-userColor text-center">@{userData.username}</p>
        </div>

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1 w-full px-3 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
          >
            <img src={icon} className='w-[12px] h-[12px]' alt="" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[100%] ml-60 overflow-y-auto">
        {/* Header */}
        <header className="bg-navColor p-4">
          <img src={imgPng} className='w-[118px] h-[40px]' alt="Logo" />
        </header>

        {/* Search and Tweet Composition */}
        <div className="p-4 max-w-3xl mx-auto">
          <div className="relative">
            <img src={searchIcon} alt="" className='absolute left-3 top-3 w-4 h-4'/>
            <input 
              type="search" 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder='Search...' 
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setTweets([]);
                  if (debounceTimeout) clearTimeout(debounceTimeout);
                  justFetchTweets();
                }}
                className='absolute right-3 top-3'
              >
              </button>
            )}
          </div>

          {/* Tweet Composition Box */}
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex gap-3">
              <img 
                src={avatarUrl || imgPng} 
                alt="Profile" 
                className='rounded-full w-10 h-10'
              />
              <div className="flex-1">
                <textarea 
                  placeholder="What's happening?"
                  className="w-full p-2 border-b border-gray-200 focus:outline-none resize-none"
                  rows={2}
                  value={newTweet} // Bind to state
        onChange={(e) => setNewTweet(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-primary text-white px-4 py-1 rounded-full hover:bg-primary-dark" onClick={handlePostTweet}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Tweets Feed */}
        <div className="max-w-3xl mx-auto p-4 relative">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <div 
              key={tweet.id}
              ref={index === tweets.length - 1 ? lastTweetRef : null}
              className="bg-gray-200 relative bg-opacity-[8%] rounded-lg border border-gray-200 p-4 mb-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img 
                      src={tweet.author?.avatar || imgPng} 
                      alt="Profile" 
                      className='rounded-full w-10 h-10'
                      />
                    <div>
                      <p className="font-bold">
                        {tweet.author?.first_name} {tweet.author?.last_name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatTimeAgo(tweet.created_at)}
                      </p>
                    </div>
                  </div>
                {tweet.author.username === userData.username ? (
                  <>
                    <button 
                      onClick={() => handleClickOption(tweet.id)}
                      className="text-gray-500 hover:text-gray-700"
                      >
                      ⋯
                    </button>
                      {tweetToDelete===tweet.id && (
                  <div className='absolute bottom-1 -right-[155px] z-50 bg-white w-[224px] rounded'>
                    <button className='text-sm text-red-400 flex items-center gap-2 px-1 w-full' onClick={handleDeleteTweet}>
                      <span>
                      <img className='w-[14px] h=[14px]' src={deleteIcon} alt="" />
                      </span>
                      Delete Post?
                    </button>
                    </div>
            )}
                  </>
                ) : ''}
                  
                </div>
                <p className="mt-3">{tweet.text}</p>
              </div>
            ))
          ) : searchQuery && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img src={imgPng2} className='w-48 h-48' alt="No tweets found" />
              <p className="mt-4 text-gray-500">No tweets found</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <img src={imgPng2} className='w-48 h-48' alt="Welcome" />
              <p className="mt-4 text-gray-500">Search for tweets or compose your own</p>
            </div>
          )}

          {isFetchingMore && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default Dashboard;