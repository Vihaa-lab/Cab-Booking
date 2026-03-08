import React from 'react'
import { motion } from 'framer-motion'

const vehicles = [
    {
        type: 'car',
        name: 'UCab Go',
        desc: 'Affordable sedan for daily commute',
        capacity: 4,
        eta: '2 min',
        img: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
        badge: 'Most Popular',
        badgeColor: 'bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20',
    },
    {
        type: 'moto',
        name: 'UCab Moto',
        desc: 'Swift bike rides through traffic',
        capacity: 1,
        eta: '3 min',
        img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
        badge: 'Cheapest',
        badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    {
        type: 'auto',
        name: 'UCab Auto',
        desc: 'Classic auto for short-distance trips',
        capacity: 3,
        eta: '4 min',
        img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
        badge: null,
        badgeColor: '',
    },
]

const VehiclePanel = (props) => {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between mb-5 px-1'>
                <div>
                    <h3 className='text-xl font-black text-slate-900 tracking-tight'>Choose Ride</h3>
                    <p className='text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5'>
                        {props.fare ? 'Fares based on distance' : 'Calculating fares...'}
                    </p>
                </div>
                <div className='flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest'>
                    <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    Captains Live
                </div>
            </div>

            <div className='space-y-2 flex-1'>
                {vehicles.map((v, i) => (
                    <motion.div
                        key={v.type}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            props.setConfirmRidePanel(true)
                            props.selectVehicle(v.type)
                        }}
                        className='group flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-[#FFB800] bg-white hover:bg-amber-50/30 cursor-pointer transition-all'
                    >
                        <div className='flex items-center gap-4'>
                            <div className='w-16 h-12 flex items-center justify-center'>
                                <img src={v.img} alt={v.name}
                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' />
                            </div>
                            <div>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    <h4 className='font-black text-slate-900 text-sm'>{v.name}</h4>
                                    {v.badge && (
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${v.badgeColor}`}>
                                            {v.badge}
                                        </span>
                                    )}
                                </div>
                                <p className='text-xs text-slate-500 font-medium mt-0.5'>{v.desc}</p>
                                <div className='flex items-center gap-3 mt-1'>
                                    <span className='flex items-center gap-1 text-[10px] font-black text-slate-500'>
                                        <i className="ri-user-fill"></i>{v.capacity}
                                    </span>
                                    <span className='flex items-center gap-1 text-[10px] font-black text-green-600'>
                                        <i className="ri-time-line"></i>{v.eta}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='text-right'>
                            <h2 className='text-xl font-black text-slate-900 tracking-tighter'>
                                ₹{props.fare?.[v.type] ?? '—'}
                            </h2>
                            <p className='text-[9px] font-bold text-slate-400 uppercase tracking-wider'>cash</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default VehiclePanel