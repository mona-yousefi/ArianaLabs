import React, { useEffect, useState } from 'react'
import imagePng from '../../assets/image.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [formData, setFormData] = useState({
        first_name:'',
        last_name: '',
        username: '',
        password: '',
      });
      const [error, setError] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();

       useEffect(() => {
    const savedUser = localStorage.getItem('registeredUser');
    if (savedUser) {
      const {  username, password } = JSON.parse(savedUser);
      setFormData({ username, password });
    }
  }, []);
      const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');



      try {
      setIsLoading(true);
      
      // Prepare the form data for the API
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      const response = await axios.post(
        'https://mock.arianalabs.io/api/staff/auth/',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/formdata',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        console.log('Token saved:', response.data.token);
        navigate('dashboard');
      }

      // Redirect to dashboard or home page

      console.log('Login successful:', response.data);
      // Handle successful Login (redirect, show message, etc.)
      alert('Login successful!');

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=' h-screen w-screen p-3 flex justify-center items-center'>
        <div className='flex flex-col justify-center border-[1px] border-borderColor rounded-lg'>
            {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
               )}
            <img src={imagePng} alt=""/>
            <div className='pl-16'>
                <h2 className="text-3xl font-bold">
                Login
                </h2>
                <p className='mt-3'>Enter your username and password to login to your account.</p>
            </div>
            <form className="max-w-md ml-16 mt-10  w-full" onSubmit={handleSubmit}>
                <div className="mb-4 w-full ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                    </label>
                    <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    name='username'
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Please Enter Your Username"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                    </label>
                    <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Please Enter your Password"
                    />
                </div>
                <div className="flex items-center justify-between w-full">
                    <button
                    className={`font-bold py-2 px-4 rounded w-full bg-black text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                    >
                    {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
                <div className='mt-2 mb-10'>
                    <p className='text-center'>Don’t have an account? <a href="sign-up">Sign up</a></p>
                </div>
        </form>
    </div>
    </div>
  )
}

export default Login