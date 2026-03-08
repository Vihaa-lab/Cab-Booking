import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SocketContext } from '../context/SocketContext'

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const userMarkerIcon = L.divIcon({
    html: `<div style="background:#3B82F6;border:3px solid white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(59,130,246,0.5);"><i class="ri-user-fill" style="color:white;font-size:14px;"></i></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
})

const AutoFly = ({ position }) => {
    const map = useMap()
    useEffect(() => {
        if (position) map.flyTo(position, 15, { duration: 1.2 })
    }, [position, map])
    return null
}

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext)

    const [userPos, setUserPos] = useState(null)
    const [elapsed, setElapsed] = useState(0)
    const defaultCenter = [20.5937, 78.9629]

    // Timer for ride duration
    useEffect(() => {
        const interval = setInterval(() => setElapsed(prev => prev + 1), 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    useGSAP(() => {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, { transform: 'translateY(0)', duration: 0.4, ease: 'power2.out' })
        } else {
            gsap.to(finishRidePanelRef.current, { transform: 'translateY(100%)', duration: 0.3 })
        }
    }, [finishRidePanel])

    return (
        <div className='h-screen w-full relative overflow-hidden bg-slate-950'>

            {/* Top Nav */}
            <div className='absolute top-0 left-0 w-full z-30 px-6 py-4 flex justify-between items-center bg-slate-950/60 backdrop-blur-md border-b border-white/10'>
                <div className='flex items-center gap-2'>
                    <span className='bg-[#FFB800] text-black px-2 py-0.5 rounded-lg text-2xl font-black'>U</span>
                    <span className='text-white text-2xl font-black'>Cab</span>
                    <span className='ml-2 text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider'>Captain Mode</span>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20'>
                        <i className="ri-timer-2-line text-[#FFB800] text-sm"></i>
                        <span className='text-xs font-black text-[#FFB800]'>{formatTime(elapsed)}</span>
                    </div>
                    <Link to='/captain-home' className='text-slate-400 hover:text-white transition-colors'>
                        <i className="ri-logout-box-r-line text-xl"></i>
                    </Link>
                </div>
            </div>

            {/* Map */}
            <div className='absolute inset-0 z-0'>
                <MapContainer
                    center={userPos || defaultCenter}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {userPos && (
                        <>
                            <Marker position={userPos} icon={userMarkerIcon} />
                            <AutoFly position={userPos} />
                        </>
                    )}
                </MapContainer>
            </div>

            {/* Bottom Ride HUD */}
            <div className='absolute bottom-0 left-0 right-0 z-20'>
                <div className='mx-4 mb-4 bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl'>

                    {/* Passenger Row */}
                    <div className='flex items-center justify-between p-5 border-b border-white/10'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 font-black text-lg'>
                                {rideData?.user?.fullname?.firstname?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className='font-black text-white capitalize leading-tight'>
                                    {rideData?.user?.fullname?.firstname || 'Passenger'}
                                </h3>
                                <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Passenger</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Fare</p>
                            <h4 className='text-2xl font-black text-[#FFB800]'>₹{rideData?.fare}</h4>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='px-5 py-4 flex items-start gap-3 border-b border-white/10'>
                        <div className='w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center mt-0.5'>
                            <i className="ri-map-pin-2-fill text-red-400 text-sm"></i>
                        </div>
                        <div>
                            <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Drop Location</p>
                            <h4 className='text-sm font-semibold text-white mt-0.5 line-clamp-1'>{rideData?.destination}</h4>
                        </div>
                    </div>

                    {/* Finish Button */}
                    <div className='p-5'>
                        <button
                            onClick={() => setFinishRidePanel(true)}
                            className='w-full py-4 bg-[#FFB800] hover:bg-[#e6a600] text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2'
                        >
                            <i className="ri-flag-fill"></i>
                            Complete Ride
                        </button>
                    </div>
                </div>
            </div>

            {/* Finish Ride Slide-up Panel */}
            <div ref={finishRidePanelRef} className='fixed w-full z-50 bottom-0 translate-y-full bg-slate-900 border-t border-white/10 px-4 py-10 rounded-t-3xl shadow-2xl'>
                <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    )
}

export default CaptainRiding