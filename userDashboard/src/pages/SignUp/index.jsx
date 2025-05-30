import React, { useEffect, useRef, useState } from 'react'
import imagePng from '../../assets/image.png'
import imagePng1 from '../../assets/image1.png'
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { register } from '../../apiClient/index'
const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: '',
    avatar: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const isValid = (
      formData.first_name.trim() !== '' &&
      formData.last_name.trim() !== '' &&
      formData.username.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirm_password.trim() !== '' &&
      formData.password === formData.confirm_password
    );
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
    const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    if (!isFormValid) return;

      try {
      setIsLoading(true);
      
      await register(formData);
    navigate('/');



    } catch (err) {
      if (err.response?.data?.username){
        setError('Username Already Taken')
      } else{
        setError('Registration Failed,Please Try Again')
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=' h-screen w-screen p-3 flex justify-center items-center'>
            <div className='flex flex-col justify-center border-[1px] border-borderColor rounded-lg'>
              {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
               )}
                <img src={imagePng} className='h-40'  alt=""/>
                <div className='pl-10'>
                    <h2 className="text-3xl font-bold ">
                    Sign Up
                    </h2>
                    <p className='mt-2'>Enter your information to create an account..</p>
                </div>
                <form className="max-w-md px-10 mt-10 w-full" onSubmit={handleSubmit}>
                <div className='max-w-md border-[1px] w-full flex justify-between items-center px-2 '>
                  <div onClick={triggerFileInput} className='flex w-full justify-between items-center py-1'>
                    {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile preview" 
                            className="w-[48px] h-[48px] rounded-full object-cover"
                          />
                        ) : (
                    <img src={imagePng1} alt="" className=' w-[48px] h-[48px] rounded-full bg-secondary p-1'/>
                        )}
                          <>
                            <div className='border-[1px] flex items-center px-2 cursor-pointer'>
                              <span className="text-xs text-black mt-1 text-center mr-1">Upload</span>
                              <span className="text-xl text-black text-center">+</span>
                              <div className='flex flex-col'>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                  className="hidden"
                                />
                                </div>
                            </div>
                          </>
                    </div>
                    </div>
                    <div className="mb-3 w-full ">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="first_name">
                        First Name
                        </label>
                        <div>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                            id="first_name"
                            name='first_name'
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="Please Enter Your First Name"
                        />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="last_name">
                        Last Name
                        </label>
                        <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="last_name"
                        name='last_name'
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Please Enter Your Last Name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="username">
                        Username
                        </label>
                        <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        name='username'
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Please Enter Your Username"
                        />
                        {error && (
                  <div className="p-3 m-0 text-center text-red-600 rounded-md text-sm">
                    {error.message || 'Username already taken'}
                  </div>
               )}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
                        Password
                        </label>
                        <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        name='password'
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Please Enter Your Password"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="confirm_password">
                        Confirm Password
                        </label>
                        <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-4 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirm_password"
                        name='confirm_password'
                        type="password"
                        required
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        placeholder="Please Enter Your password again"
                        />
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <button
                        // disabled={!isFormValid || isLoading}
                        className={`font-bold py-2 px-4 rounded w-full text-white mt-2 bg-sameBlack ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                }`}
                        type="submit"
                        >
                        {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                    <div className='mt-2 mb-10'>
                        <p className='text-center'>Already Have An Account? <NavLink to="/">Sign In</NavLink></p>
                    </div>
            </form>
        </div>
      </div>
  )
}

export default SignUp