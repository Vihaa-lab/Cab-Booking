import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' } }) }
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } }

const Start = () => {
  return (
    <div className='h-screen w-full flex flex-col md:flex-row bg-slate-950 overflow-hidden'>

      {/* Left Hero Section */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}
        className='relative h-[58vh] md:h-full md:w-1/2 overflow-hidden'>
        <img
          src="https://images.unsplash.com/photo-1449965072335-65728344c66c?q=80&w=2670&auto=format&fit=crop"
          alt="UCab hero"
          className='w-full h-full object-cover opacity-50'
        />
        {/* Gradient overlays */}
        <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-transparent to-slate-950 hidden md:block'></div>

        {/* Logo */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className='absolute top-8 left-8 z-10'>
          <Link to='/' className='flex items-center gap-2'>
            <span className='bg-[#FFB800] text-black px-2.5 py-1 rounded-xl font-black text-2xl'>U</span>
            <span className='text-white font-black text-2xl tracking-tight'>Cab</span>
          </Link>
        </motion.div>

        {/* Hero Text */}
        <div className='absolute bottom-10 md:bottom-16 left-8 md:left-12 z-10 max-w-sm'>
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className='inline-flex items-center gap-2 bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-full px-3 py-1.5 mb-4'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-ping absolute'></div>
            <div className='w-2 h-2 bg-green-500 rounded-full relative'></div>
            <span className='text-[10px] font-black text-[#FFB800] uppercase tracking-[0.15em] ml-1'>24/7 Available</span>
          </motion.div>
          <motion.h1 custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className='text-4xl md:text-5xl font-black text-white leading-tight mb-3'>
            The smarter<br />way to <span className='text-[#FFB800]'>move.</span>
          </motion.h1>
          <motion.p custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className='text-slate-400 text-base font-medium'>
            Premium rides, professional captains, seamless journeys across the city.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Auth Section */}
      <div className='flex-1 flex flex-col justify-center px-8 md:px-14 py-10 md:py-0 bg-slate-950 relative overflow-hidden'>
        {/* Background glow */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none'></div>

        <div className='max-w-sm w-full mx-auto relative z-10'>
          {/* Stats row */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className='flex gap-6 mb-10'>
            {[['50K+', 'Rides Done'], ['4.9★', 'App Rating'], ['2min', 'Avg Pickup']].map(([val, label]) => (
              <div key={label}>
                <p className='text-[#FFB800] font-black text-xl leading-none'>{val}</p>
                <p className='text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5'>{label}</p>
              </div>
            ))}
          </motion.div>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className='text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2'>
            Get started
          </motion.p>
          <motion.h2 custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className='text-3xl md:text-4xl font-black text-white mb-8 leading-tight'>
            Ready for your<br />next ride?
          </motion.h2>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className='space-y-3'>
            <Link to='/login'
              className='w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#FFB800] hover:bg-[#e6a600] text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-[#FFB800]/20'>
              <i className="ri-user-fill"></i>
              Book a Ride
            </Link>

            <Link to='/captain-login'
              className='w-full flex items-center justify-center gap-3 py-4 px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95'>
              <i className="ri-steering-2-fill"></i>
              Drive with UCab
            </Link>
          </motion.div>

          <motion.p custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className='mt-8 text-xs text-slate-600 text-center'>
            By continuing, you agree to UCab's{' '}
            <span className='text-slate-400 underline cursor-pointer'>Terms</span> &{' '}
            <span className='text-slate-400 underline cursor-pointer'>Privacy Policy</span>
          </motion.p>
        </div>
      </div>
    </div>
  )
}

export default Start