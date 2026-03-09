
import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)

    if (!captain) {
        return (
            <div className='h-full flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin'></div>
                    <p className='text-xs font-bold text-slate-500 uppercase tracking-[0.2em]'>Authenticating...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='space-y-8'>
            {/* Header / Profile Summary */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='relative'>
                        <img className='h-14 w-14 rounded-2xl object-cover border-2 border-white/10 shadow-lg' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="avatar" />
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900'></div>
                    </div>
                    <div>
                        <h4 className='text-xl font-bold text-white capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Level 4 Captain</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Today's Revenue</p>
                    <h4 className='text-2xl font-black text-[#FFB800] tracking-tighter'>₹295.20</h4>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className='grid grid-cols-3 gap-3 p-4 bg-slate-800/40 rounded-2xl border border-white/5'>
                <div className='flex flex-col items-center justify-center p-2 text-center'>
                    <i className="ri-timer-2-line text-2xl text-blue-400 mb-1"></i>
                    <h5 className='text-lg font-bold text-white'>10.2</h5>
                    <p className='text-[10px] text-slate-500 font-bold uppercase'>Hours</p>
                </div>
                <div className='flex flex-col items-center justify-center p-2 text-center border-x border-white/5'>
                    <i className="ri-speed-up-line text-2xl text-green-400 mb-1"></i>
                    <h5 className='text-lg font-bold text-white'>34</h5>
                    <p className='text-[10px] text-slate-500 font-bold uppercase'>Rides</p>
                </div>
                <div className='flex flex-col items-center justify-center p-2 text-center'>
                    <i className="ri-star-fill text-2xl text-yellow-400 mb-1"></i>
                    <h5 className='text-lg font-bold text-white'>4.9</h5>
                    <p className='text-[10px] text-slate-500 font-bold uppercase'>Rating</p>
                </div>
            </div>

            {/* Performance Banner */}
            <div className='p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20'>
                <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center'>
                        <i className="ri-flashlight-line text-white"></i>
                    </div>
                    <div>
                        <p className='text-xs font-bold text-white uppercase tracking-wider'>Peak Hour Active</p>
                        <p className='text-[10px] text-blue-300 font-medium'>Earning 1.5x on every ride</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails