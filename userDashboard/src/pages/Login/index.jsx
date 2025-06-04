import React, { useState } from 'react'
import imagePng from '../../assets/image.png'
import {login} from '../../apiClient/index'
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik';
const Login = () => {
      const [error, setError] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();


  const SigninSchema = Yup.object().shape({
   username: Yup.string()
     .min(1, 'Too Short!')
     .required('Username Is Required'),
   password: Yup.string()
     .min(1, 'Too Short!')
     .required('Password is Required')
     
 });

  const handleSubmit = async (values) => {
    setError('');
    setIsLoading(true)

    const result = await login(values.username, values.password);
    
    if (result.success) {
      localStorage.setItem('authToken', result.token);
      navigate('dashboard');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };
  return (
    <div className='w-[100vw] p-3 flex justify-center items-center'>
        <div className='flex flex-col w-[384px] justify-center border-[1px] border-borderColor rounded-lg'>
            <img src={imagePng} alt="" className='mb-5'/>
            <div className='px-8'>
                <h2 className="text-2xl text-sameBlack font-inter font-bold">
                Login
                </h2>
                <p className='mt-3 text-muted text-[14px] font-inter'>Enter your username and password to login to your account.</p>
            </div>
            <Formik
              initialValues={{
                username: '',
                password: '',
              }}
              validationSchema={SigninSchema}
              onSubmit={handleSubmit}
              >
              {({ errors, touched }) => (
                <Form className="max-w-md px-8 mt-10  w-full">
                <div>
                  <label className={`${errors.username && touched.username ? 'text-red-600 font-inter text-sm font-bold mb-4' : 'font-inter text-sameBlack text-sm font-bold mb-4 '} `} htmlFor="username">Username</label>
                  <Field name="username" className=" border border-borderColor rounded w-full py-2 px-3 text-sameBlack text-sm font-Geist leading-tight focus:outline-none focus:shadow-outline"  />
                  {errors.username && touched.username ? (
                    <div className='text-red-600 font-inter text-sm'>{errors.username}</div>
                  ) : null}
                </div>
                <div className='mt-2'>
                  <label className={`${errors.password && touched.password ? 'text-red-600 font-inter text-sm font-bold mb-4' : 'font-inter text-sameBlack text-sm font-bold mb-4 '} `} htmlFor="password">Password</label>
                  <Field type="password" name="password" id="password" className=" border border-borderColor rounded w-full py-2 px-3 text-sameBlack text-sm font-Geist mb-3 leading-tight focus:outline-none focus:shadow-outline" />
                  {errors.password && touched.password ? (
                    <div className='text-red-600 font-inter text-sm mb-3'>{errors.password}</div>
                  ) : null}
                </div>
                {error && (
                      <div className="mb-4 p-3 text-red-600 rounded-md text-sm text-center">
                        {error}
                      </div>
                   )}
           <button type="submit" className={`font-bold py-2 px-4 rounded w-full bg-primary text-primaryForGround ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isLoading ? 'Logging in...' : 'Login'}</button>
           <div className='mt-2 mb-10'>
                    <p className='text-center font-inter text-black'>Don’t have an account? <NavLink to="/sign-up" className="text-black">Sign Up</NavLink></p>
                </div>
         </Form>
       )}
     </Formik>
    </div>
    </div>
  )
}

export default Login