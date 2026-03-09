import React from 'react'

const WaitingForDriver = (props) => {
    return (
        <div className='flex flex-col gap-8'>
            {/* Captain & Vehicle Summary */}
            <div className='flex items-center justify-between p-6 bg-slate-900 rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/10 blur-3xl rounded-full'></div>
                <div className='flex items-center gap-4 relative z-10'>
                    <div className='relative'>
                        <img className='h-16 w-16 rounded-2xl object-cover border-2 border-[#FFB800]/20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="vehicle" />
                        <div className='absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center'>
                            <i className="ri-check-line text-[10px] text-white"></i>
                        </div>
                    </div>
                    <div>
                        <h2 className='text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-1'>En Route</h2>
                        <h2 className='text-xl font-black text-[#FFB800] leading-tight capitalize'>{props.ride?.captain.fullname.firstname}</h2>
                        <p className='text-xs font-bold text-slate-400 text-slate-400'>Maruti Suzuki Alto • {props.ride?.captain.vehicle.plate}</p>
                    </div>
                </div>
                <div className='text-right relative z-10'>
                    <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Security OTP</p>
                    <div className='px-4 py-2 rounded-xl bg-[#FFB800] text-black'>
                        <h1 className='text-2xl font-black tracking-[0.2em]'> {props.ride?.otp} </h1>
                    </div>
                </div>
            </div>

            {/* Detailed Trip Info */}
            <div className='space-y-4'>
                <div className='w-full space-y-1 bg-slate-50 p-2 rounded-3xl border border-slate-100'>
                    <div className='flex items-start gap-4 p-4 rounded-2xl'>
                        <div className='mt-1 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20'>
                            <i className="ri-map-pin-user-fill text-blue-500"></i>
                        </div>
                        <div className='flex-1 border-b border-slate-200 pb-3'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Pickup</p>
                            <h3 className='text-sm font-semibold text-slate-700 line-clamp-1 leading-snug'>{props.ride?.pickup}</h3>
                        </div>
                    </div>

                    <div className='flex items-start gap-4 p-4 rounded-2xl'>
                        <div className='mt-1 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20'>
                            <i className="ri-map-pin-2-fill text-red-500"></i>
                        </div>
                        <div className='flex-1'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Destination</p>
                            <h3 className='text-sm font-semibold text-slate-700 line-clamp-1 leading-snug'>{props.ride?.destination}</h3>
                        </div>
                    </div>
                </div>

                {/* Status Indicator Bar */}
                <div className='p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20'>
                            <i className="ri-shield-user-fill text-green-600"></i>
                        </div>
                        <span className='text-xs font-bold text-slate-600 uppercase tracking-wider'>Your Captain is on the way</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></div>
                        <div className='w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse delay-75'></div>
                        <div className='w-1.5 h-1.5 rounded-full bg-green-500/30 animate-pulse delay-150'></div>
                    </div>
                </div>
            </div>
            
            <div className='px-1'>
                <div className='w-full grid grid-cols-2 gap-3'>
                    <button className='py-4 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all'>
                        <i className="ri-chat-3-line mr-2"></i> Message
                    </button>
                    <button className='py-4 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all text-red-500'>
                        <i className="ri-close-circle-line mr-2"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WaitingForDriver