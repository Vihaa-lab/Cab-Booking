import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const steps = ['Finding captains', 'Matching best captain', 'Confirming route']

const LookingForDriver = (props) => {
    const [step, setStep] = useState(0)

    useEffect(() => {
        const t1 = setTimeout(() => setStep(1), 2500)
        const t2 = setTimeout(() => setStep(2), 5000)
        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, [])

    return (
        <div className='flex flex-col gap-6'>

            {/* Animated Radar */}
            <div className='flex flex-col items-center gap-4 text-center pt-2'>
                <div className='relative w-24 h-24 flex items-center justify-center'>
                    {[1, 2, 3].map(i => (
                        <motion.div key={i}
                            animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                            transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }}
                            className='absolute inset-0 rounded-full border-2 border-[#FFB800]'
                        />
                    ))}
                    <div className='w-16 h-16 bg-[#FFB800] rounded-full flex items-center justify-center shadow-lg shadow-[#FFB800]/30 z-10'>
                        <i className="ri-radar-line text-2xl text-black"></i>
                    </div>
                </div>

                <div>
                    <h3 className='text-xl font-black text-slate-900 tracking-tight'>Finding your Captain</h3>
                    <motion.p key={step}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className='text-xs font-bold text-slate-400 uppercase tracking-widest mt-1'>
                        {steps[step]}...
                    </motion.p>
                </div>

                {/* Step progress dots */}
                <div className='flex items-center gap-2'>
                    {steps.map((_, i) => (
                        <motion.div key={i}
                            animate={{ width: i === step ? 20 : 8, background: i <= step ? '#FFB800' : '#E2E8F0' }}
                            transition={{ duration: 0.3 }}
                            className='h-2 rounded-full'
                        />
                    ))}
                </div>
            </div>

            {/* Trip Summary */}
            <div className='bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden'>
                <div className='flex items-start gap-3 p-4 border-b border-slate-100'>
                    <div className='w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mt-0.5'>
                        <i className="ri-map-pin-user-fill text-blue-500 text-sm"></i>
                    </div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Pickup</p>
                        <h4 className='text-sm font-semibold text-slate-800 mt-0.5 line-clamp-1'>{props.pickup}</h4>
                    </div>
                </div>
                <div className='flex items-start gap-3 p-4'>
                    <div className='w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center mt-0.5'>
                        <i className="ri-map-pin-2-fill text-red-500 text-sm"></i>
                    </div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Destination</p>
                        <h4 className='text-sm font-semibold text-slate-800 mt-0.5 line-clamp-1'>{props.destination}</h4>
                    </div>
                </div>
            </div>

            {/* Fare */}
            <div className='flex items-center justify-between px-5 py-4 bg-slate-900 rounded-2xl'>
                <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-xl bg-[#FFB800]/20 flex items-center justify-center'>
                        <i className="ri-wallet-3-fill text-[#FFB800]"></i>
                    </div>
                    <div>
                        <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Estimated Fare</p>
                        <p className='text-[10px] text-slate-600 font-bold'>Cash Payment</p>
                    </div>
                </div>
                <h3 className='text-2xl font-black text-[#FFB800] tracking-tighter'>
                    ₹{props.fare?.[props.vehicleType] ?? '—'}
                </h3>
            </div>

            {/* Cancel */}
            <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                onClick={() => props.setVehicleFound(false)}
                className='w-full py-4 border-2 border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all'>
                Cancel Request
            </motion.button>
        </div>
    )
}

export default LookingForDriver