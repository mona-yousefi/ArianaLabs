

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://mock.arianalabs.io/api/',
  headers: {
    'Content-Type': 'multipart/form-data',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(
      'https://mock.arianalabs.io/api/staff/auth/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    return {
      success: true,
      token: response.data.token,
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Invalid username or password'
    };
  }
};

export const register = async (userData) => {
    const formData = new FormData();
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('confirm_password', userData.confirm_password);
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    return await apiClient.post('/staff/register/', formData,)
};



export const getCurrentUser = async () => {
    return await apiClient.get('/staff/current_user/');
};

export const logoutUser = async () => {
  localStorage.removeItem('authToken');
};


export const getTweets=(params={})=>{
  return apiClient.get('/tweet/',{params})
}

export const postTweet=(text)=>{
  return apiClient.post('/tweet/',{text})
}

export const deleteTweet=(tweetId)=>{
  return apiClient.delete(`/tweet/${tweetId}`)
}
export const searchTweets=(search,page=1, count_per_page=10)=>{
  return apiClient.get(`/tweet/`,{
    params:{
      search,
      page,
      count_per_page
    }
  })
}


export default apiClient;

