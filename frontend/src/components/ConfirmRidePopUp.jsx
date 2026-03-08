import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }


    }
    return (
        <div className='flex flex-col gap-8'>
            {/* Header / Instructions */}
            <div className='text-center space-y-2'>
                <h3 className='text-3xl font-black text-white tracking-tighter'>Ride Verification</h3>
                <p className='text-slate-500 text-sm font-medium'>Enter the 4-digit OTP provided by the passenger</p>
            </div>

            {/* Trip Brief Card */}
            <div className='p-5 bg-slate-800/40 rounded-3xl border border-white/5 flex items-center justify-between shadow-inner'>
                <div className='flex items-center gap-4'>
                    <div className='relative'>
                        <img className='h-14 w-14 rounded-2xl object-cover border-2 border-white/10' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="passenger" />
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900'></div>
                    </div>
                    <div>
                        <h2 className='text-lg font-bold text-white leading-tight capitalize'>{props.ride?.user.fullname.firstname}</h2>
                        <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Passenger Identity Verified</p>
                    </div>
                </div>
                <div className='px-4 py-2 rounded-xl bg-slate-900 border border-white/5'>
                    <h3 className='text-xl font-black text-[#FFB800] tracking-tighter'>₹{props.ride?.fare}</h3>
                </div>
            </div>

            {/* Verification Form */}
            <div className='flex-1'>
                <form onSubmit={submitHander} className='space-y-6'>
                    <div className='space-y-4'>
                        <div className='relative'>
                            <input 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                type="text" 
                                maxLength="4"
                                className='w-full bg-slate-900/50 border border-white/10 text-center font-mono text-4xl py-6 rounded-3xl text-[#FFB800] placeholder:text-slate-800 focus:border-[#FFB800]/50 outline-none transition-all tracking-[0.5em] shadow-inner' 
                                placeholder="0000" 
                            />
                            <div className='absolute -top-3 left-8 px-2 bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>Verification OTP</div>
                        </div>

                        {/* Summary Details */}
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='p-3 rounded-2xl bg-white/5 border border-white/5'>
                                <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Distance</p>
                                <p className='text-sm font-bold text-white'>2.2 KM Total</p>
                            </div>
                            <div className='p-3 rounded-2xl bg-white/5 border border-white/5'>
                                <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Payment</p>
                                <p className='text-sm font-bold text-white'>Cash on Arrival</p>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-3 pt-4'>
                        <button className='w-full bg-green-500 text-black font-black py-5 rounded-2xl text-sm uppercase tracking-[0.3em] shadow-xl shadow-green-500/10 hover:bg-green-400 active:scale-[0.98] transition-all'>
                            Start Ride
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => {
                                props.setConfirmRidePopupPanel(false)
                                props.setRidePopupPanel(false)
                            }} 
                            className='w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all'
                        >
                            Cancel Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp