import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }

    return (
        <div className='mt-4 space-y-1'>
            {/* Display fetched suggestions */}
            {
                suggestions.map((elem, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => handleSuggestionClick(elem)} 
                        className='group flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-[#FFB800]/30 hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.98]'
                    >
                        <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-[#FFB800]/10 transition-colors'>
                            <i className="ri-map-pin-2-fill text-slate-400 group-hover:text-[#FFB800]"></i>
                        </div>
                        <div className='flex-1'>
                            <h4 className='text-sm font-bold text-slate-700 leading-tight group-hover:text-black transition-colors'>{elem}</h4>
                            <p className='text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5'>Available Location</p>
                        </div>
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
                            <i className="ri-arrow-right-s-line text-slate-300"></i>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel