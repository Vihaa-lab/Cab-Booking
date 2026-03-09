import React from 'react'

const ConfirmRide = (props) => {
    return (
        <div className='flex flex-col gap-6 relative'>
            <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Confirm Trip</h3>
                <div className='px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20'>
                    <span className='text-[10px] font-bold text-blue-600 uppercase tracking-widest'>Review Details</span>
                </div>
            </div>

            <div className='flex flex-col items-center gap-6'>
                <div className='relative group'>
                    <div className='absolute inset-0 bg-[#FFB800]/20 blur-2xl rounded-full group-hover:bg-[#FFB800]/30 transition-all'></div>
                    <img className='h-24 relative z-10 transition-transform group-hover:scale-110' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="vehicle" />
                </div>

                <div className='w-full space-y-1'>
                    <div className='flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group'>
                        <div className='mt-1 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20'>
                            <i className="ri-map-pin-user-fill text-blue-500"></i>
                        </div>
                        <div className='flex-1 border-b border-slate-100 pb-3 group-last:border-0'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Pickup Point</p>
                            <h3 className='text-sm font-semibold text-slate-700 line-clamp-2 leading-snug'>{props.pickup}</h3>
                        </div>
                    </div>

                    <div className='flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group'>
                        <div className='mt-1 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20'>
                            <i className="ri-map-pin-2-fill text-red-500"></i>
                        </div>
                        <div className='flex-1 border-b border-slate-100 pb-3 group-last:border-0'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Destination</p>
                            <h3 className='text-sm font-semibold text-slate-700 line-clamp-2 leading-snug'>{props.destination}</h3>
                        </div>
                    </div>

                    <div className='flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group'>
                        <div className='mt-1 w-8 h-8 rounded-lg bg-[#FFB800]/10 flex items-center justify-center border border-[#FFB800]/20'>
                            <i className="ri-wallet-3-fill text-[#FFB800]"></i>
                        </div>
                        <div className='flex-1'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Trip Fare</p>
                            <div className='flex items-baseline gap-2'>
                                <h3 className='text-2xl font-black text-slate-900 tracking-tighter'>₹{props.fare[props.vehicleType]}</h3>
                                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>• Cash Payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full grid grid-cols-4 gap-2 px-1'>
                    <button 
                        onClick={() => props.setConfirmRidePanel(false)}
                        className='bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center'
                    >
                        <i className="ri-arrow-left-line text-xl"></i>
                    </button>
                    <button 
                        onClick={() => {
                            props.setVehicleFound(true)
                            props.setConfirmRidePanel(false)
                            props.createRide()
                        }} 
                        className='col-span-3 bg-[#FFB800] text-black font-black py-4 rounded-2xl text-sm uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/20 hover:bg-[#e6a600] active:scale-95 transition-all'
                    >
                        Request UCab
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRide