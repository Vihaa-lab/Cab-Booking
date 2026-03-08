import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FinishRide = (props) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function endRide() {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
                rideId: props.ride._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.status === 200) {
                navigate('/captain-home')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to end ride. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='space-y-6'>
            {/* Handle */}
            <div className='absolute top-3 left-0 right-0 flex justify-center'>
                <button
                    onClick={() => props.setFinishRidePanel(false)}
                    className='w-12 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors'
                />
            </div>

            <div>
                <h2 className='text-2xl font-black text-white'>Complete Ride</h2>
                <p className='text-xs font-bold text-slate-500 uppercase tracking-widest mt-1'>Confirm destination reached before finishing</p>
            </div>

            {/* Passenger Card */}
            <div className='flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/10'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-black text-lg'>
                        {props.ride?.user?.fullname?.firstname?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h4 className='font-black text-white capitalize'>{props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}</h4>
                        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Passenger</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Fare</p>
                    <h4 className='text-2xl font-black text-[#FFB800]'>₹{props.ride?.fare}</h4>
                </div>
            </div>

            {/* Trip Summary */}
            <div className='space-y-1 bg-slate-800/30 p-2 rounded-2xl border border-white/5'>
                <div className='flex items-start gap-3 p-3 rounded-xl'>
                    <div className='w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center'>
                        <i className="ri-map-pin-user-fill text-blue-400 text-sm"></i>
                    </div>
                    <div className='flex-1 border-b border-white/10 pb-3'>
                        <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Pickup</p>
                        <h4 className='text-sm font-semibold text-white mt-0.5 line-clamp-2'>{props.ride?.pickup}</h4>
                    </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-xl'>
                    <div className='w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center'>
                        <i className="ri-map-pin-2-fill text-red-400 text-sm"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Destination</p>
                        <h4 className='text-sm font-semibold text-white mt-0.5 line-clamp-2'>{props.ride?.destination}</h4>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className='p-3 bg-red-500/10 border border-red-500/20 rounded-xl'>
                    <p className='text-xs font-bold text-red-400'><i className="ri-error-warning-line mr-2"></i>{error}</p>
                </div>
            )}

            {/* Confirm Button */}
            <button
                onClick={endRide}
                disabled={loading}
                className='w-full py-4 bg-[#FFB800] hover:bg-[#e6a600] disabled:bg-[#FFB800]/50 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2'
            >
                {loading ? (
                    <>
                        <div className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin'></div>
                        Finishing...
                    </>
                ) : (
                    <>
                        <i className="ri-flag-fill"></i>
                        Finish & Collect ₹{props.ride?.fare}
                    </>
                )}
            </button>
        </div>
    )
}

export default FinishRide