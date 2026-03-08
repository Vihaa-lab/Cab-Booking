import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' }
})

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPass, setShowPass] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, { email, password })
      if (response.status === 200) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden'>
      {/* Background glows */}
      <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#FFB800]/8 rounded-full blur-3xl pointer-events-none'></div>
      <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none'></div>

      <div className='w-full max-w-md relative z-10'>

        {/* Logo */}
        <motion.div {...fadeUp(0)} className='text-center mb-8'>
          <Link to='/' className='inline-flex items-center gap-2'>
            <span className='bg-[#FFB800] text-black px-2.5 py-1 rounded-xl font-black text-2xl'>U</span>
            <span className='text-white font-black text-2xl tracking-tight'>Cab</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div {...fadeUp(1)}
          className='bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl'>

          <h2 className='text-2xl font-black text-white mb-1'>Welcome back</h2>
          <p className='text-slate-500 text-sm mb-7'>Sign in to continue your journey</p>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className='mb-5 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl'>
              <i className="ri-error-warning-line text-red-400"></i>
              <p className='text-xs font-bold text-red-400'>{error}</p>
            </motion.div>
          )}

          <form onSubmit={submitHandler} className='space-y-5'>
            <div>
              <label className='block text-xs font-black text-slate-400 uppercase tracking-widest mb-2'>Email</label>
              <input
                required value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder='name@example.com'
                className='w-full px-4 py-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-[#FFB800]/60 focus:ring-2 focus:ring-[#FFB800]/10 outline-none transition-all text-sm font-medium'
              />
            </div>

            <div>
              <label className='block text-xs font-black text-slate-400 uppercase tracking-widest mb-2'>Password</label>
              <div className='relative'>
                <input
                  required value={password} onChange={e => setPassword(e.target.value)}
                  type={showPass ? 'text' : 'password'} placeholder='••••••••'
                  className='w-full px-4 py-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-[#FFB800]/60 focus:ring-2 focus:ring-[#FFB800]/10 outline-none transition-all text-sm font-medium pr-12'
                />
                <button type='button' onClick={() => setShowPass(p => !p)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'>
                  <i className={showPass ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>
            </div>

            <motion.button
              type='submit' disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className='w-full py-4 bg-[#FFB800] hover:bg-[#e6a600] disabled:bg-[#FFB800]/40 text-black font-black text-sm uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 mt-2'>
              {loading ? (
                <><div className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin'></div>Signing in...</>
              ) : 'Sign In →'}
            </motion.button>
          </form>

          <div className='mt-6 pt-6 border-t border-white/10 text-center space-y-3'>
            <p className='text-sm text-slate-500'>
              No account yet?{' '}
              <Link to='/signup' className='text-[#FFB800] font-bold hover:underline'>Create one</Link>
            </p>
            <Link to='/captain-login' className='block text-xs text-slate-600 hover:text-slate-400 transition-colors font-medium'>
              Are you a captain? Sign in here →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserLogin