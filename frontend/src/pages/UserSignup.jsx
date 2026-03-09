import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'



const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ userData, setUserData ] = useState({})

  const navigate = useNavigate()



  const { user, setUser } = useContext(UserDataContext)




  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (error) {
      console.error("Signup error", error);
      alert(error.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')
    }
  }

  return (
    <div className='h-screen w-full flex items-center justify-center bg-slate-100 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-400/20 blur-[120px] rounded-full'></div>
      <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full'></div>

      <div className='max-w-md w-full mx-4 z-10'>
        <div className='text-center mb-8'>
          <Link to='/' className='text-3xl font-bold tracking-tighter inline-flex items-center gap-2'>
            <span className='bg-[#FFB800] text-black px-2 py-0.5 rounded-lg text-2xl'>U</span>Cab
          </Link>
        </div>

        <div className='card-ucab backdrop-blur-xl bg-white/90 border-white/50'>
          <h2 className='text-2xl font-bold text-slate-900 mb-2'>Create Account</h2>
          <p className='text-slate-500 mb-8'>Join UCab to start your journey</p>

          <form onSubmit={submitHandler} className='space-y-4'>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-slate-700 mb-1'>First Name</label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all'
                  type="text"
                  placeholder='John'
                />
              </div>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Last Name</label>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all'
                  type="text"
                  placeholder='Doe'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Email Address</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all'
                type="email"
                placeholder='name@example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all'
                type="password"
                placeholder='••••••••'
              />
            </div>

            <button className='btn-primary-ucab w-full text-lg mt-2'>
              Sign Up
            </button>
          </form>

          <div className='mt-8 pt-6 border-t border-slate-100 text-center'>
            <p className='text-slate-600'>
              Already have an account? <Link to='/login' className='text-blue-600 font-semibold hover:underline'>Log in</Link>
            </p>
          </div>
        </div>

        <p className='mt-6 text-center text-[10px] text-slate-400 leading-tight'>
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.
        </p>
      </div>
    </div>
  )
}

export default UserSignup