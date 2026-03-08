import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const Captainlogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

        if (response.status === 200) {
            const data = response.data
            setCaptain(data.captain)
            localStorage.setItem('token', data.token)
            navigate('/captain-home')
        }
    } catch (error) {
        console.error("Login error", error);
        alert(error.response?.data?.message || "Invalid credentials or server error");
    } finally {
        setEmail('')
        setPassword('')
    }
  }
  return (
    <div className='h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full'></div>
      <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full'></div>

      <div className='max-w-md w-full mx-4 z-10'>
        <div className='text-center mb-8'>
          <Link to='/' className='text-3xl font-bold tracking-tighter inline-flex items-center gap-2'>
            <span className='bg-[#FFB800] text-black px-2 py-0.5 rounded-lg text-2xl'>U</span>
            <span className='text-white'>Cab</span>
          </Link>
        </div>

        <div className='glass-dark p-8 rounded-2xl shadow-2xl border-slate-700/50'>
          <h2 className='text-2xl font-bold text-white mb-2'>Captain Login</h2>
          <p className='text-slate-400 mb-8'>Access your driver dashboard and manage rides</p>

          <form onSubmit={submitHandler} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-1'>Email Address</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600'
                type="email"
                placeholder='name@ucab.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-300 mb-1'>Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600'
                type="password"
                placeholder='••••••••'
              />
            </div>

            <button className='btn-primary-ucab w-full text-lg mt-2'>
              Sign In to Dashboard
            </button>
          </form>

          <div className='mt-8 pt-6 border-t border-slate-700/50 text-center'>
            <p className='text-slate-400'>
              New captain? <Link to='/captain-signup' className='text-[#FFB800] font-semibold hover:underline'>Register here</Link>
            </p>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <Link to='/login' className='text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors'>
            Sign in as a Passenger instead →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin