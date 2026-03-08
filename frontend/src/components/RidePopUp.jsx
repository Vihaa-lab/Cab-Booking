import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const TIMEOUT_SECONDS = 30

const RidePopUp = (props) => {
    const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS)

    useEffect(() => {
        if (timeLeft <= 0) {
            props.setRidePopupPanel(false)
            return
        }
        const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
        return () => clearTimeout(t)
    }, [timeLeft])

    return (
        <div className='flex flex-col gap-5'>
            {/* Close handle */}
            <button
                onClick={() => props.setRidePopupPanel(false)}
                className='absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-colors'
            />

            {/* Header + Countdown */}
            <div className='flex items-center justify-between'>
                <h3 className='text-xl font-black text-white tracking-tight'>New Ride Request</h3>
                <div className='flex items-center gap-2'>
                    {/* Countdown ring */}
                    <div className='relative w-10 h-10 flex items-center justify-center'>
                        <svg className='absolute inset-0 -rotate-90' viewBox='0 0 40 40'>
                            <circle cx='20' cy='20' r='17' fill='none' stroke='rgba(255,255,255,0.1)' strokeWidth='3' />
                            <motion.circle
                                cx='20' cy='20' r='17' fill='none'
                                stroke={timeLeft <= 10 ? '#EF4444' : '#FFB800'}
                                strokeWidth='3'
                                strokeLinecap='round'
                                strokeDasharray={`${(timeLeft / TIMEOUT_SECONDS) * 107} 107`}
                                transition={{ duration: 0.9, ease: 'linear' }}
                            />
                        </svg>
                        <span className={`text-xs font-black z-10 ${timeLeft <= 10 ? 'text-red-400' : 'text-[#FFB800]'}`}>
                            {timeLeft}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20'>
                        <span className='animate-ping w-1.5 h-1.5 rounded-full bg-[#FFB800] absolute'></span>
                        <span className='w-1.5 h-1.5 rounded-full bg-[#FFB800] relative'></span>
                        <span className='text-[10px] font-black text-[#FFB800] uppercase tracking-widest'>New</span>
                    </div>
                </div>
            </div>

            {/* Passenger Card */}
            <div className='flex items-center justify-between p-4 bg-[#FFB800] rounded-2xl'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center text-black font-black text-xl'>
                        {props.ride?.user?.fullname?.firstname?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div>
                        <h2 className='text-base font-black text-black leading-tight capitalize'>
                            {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}
                        </h2>
                        <p className='text-[10px] font-black text-black/60 uppercase tracking-widest'>Verified Passenger</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-[10px] font-black text-black/40 uppercase tracking-widest mb-0.5'>Fare</p>
                    <h4 className='text-2xl font-black text-black tracking-tighter'>₹{props.ride?.fare}</h4>
                </div>
            </div>

            {/* Trip Details */}
            <div className='space-y-1'>
                <div className='flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors'>
                    <div className='w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mt-0.5'>
                        <i className="ri-map-pin-user-fill text-blue-400 text-sm"></i>
                    </div>
                    <div className='flex-1 border-b border-white/10 pb-3'>
                        <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Pickup</p>
                        <h4 className='text-sm font-semibold text-slate-200 mt-0.5 line-clamp-1'>{props.ride?.pickup}</h4>
                    </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors'>
                    <div className='w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center mt-0.5'>
                        <i className="ri-map-pin-2-fill text-red-400 text-sm"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Drop</p>
                        <h4 className='text-sm font-semibold text-slate-200 mt-0.5 line-clamp-1'>{props.ride?.destination}</h4>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide()
                    }}
                    className='flex-1 py-4 bg-green-500 hover:bg-green-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-green-500/20 transition-colors flex items-center justify-center gap-2'>
                    <i className="ri-check-line text-base"></i>
                    Accept
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={() => props.setRidePopupPanel(false)}
                    className='w-28 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all'>
                    Ignore
                </motion.button>
            </div>
        </div>
    )
}

export default RidePopUp