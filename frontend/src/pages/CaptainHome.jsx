import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (!captain) return;

        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [ captain ])

    socket.on('new-ride', (data) => {

        setRide(data)
        setRidePopupPanel(true)

    })

    async function confirmRide() {

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

            rideId: ride._id,
            captainId: captain._id,


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)

    }


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePopupPanel ])

    if (!captain) {
        return (
            <div className='h-screen w-full flex items-center justify-center bg-slate-900'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-16 h-16 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin'></div>
                    <p className='text-sm font-bold text-slate-500 uppercase tracking-[0.3em]'>Initializing System...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='h-screen w-full relative overflow-hidden bg-slate-900'>
            {/* Top Navigation Bar - Dispatch Style */}
            <div className='absolute top-0 left-0 w-full z-30 px-6 py-4 flex justify-between items-center bg-slate-900/40 backdrop-blur-md border-b border-white/10'>
                <div className='flex items-center gap-8'>
                    <Link to='/captain-home' className='text-3xl font-bold tracking-tighter flex items-center gap-2'>
                        <span className='bg-[#FFB800] text-black px-2 py-0.5 rounded-lg text-2xl'>U</span>
                        <span className='text-white'>Cab</span>
                        <span className='text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider ml-1'>Captain</span>
                    </Link>
                    
                    <div className='hidden md:flex items-center gap-4 ml-4'>
                        <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20'>
                            <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                            <span className='text-xs font-bold text-green-500 uppercase tracking-widest'>Online</span>
                        </div>
                    </div>
                </div>

                <div className='flex items-center gap-6'>
                    <Link to='/history' className='text-slate-400 hover:text-white transition-colors flex items-center gap-2'>
                        <i className="ri-history-line"></i>
                        <span className='hidden sm:inline text-sm font-medium'>Activity Logs</span>
                    </Link>
                    <div className='h-6 w-px bg-white/10 hidden sm:block'></div>
                    <Link to='/logout' className='text-slate-400 hover:text-red-400 transition-colors'>
                        <i className="ri-logout-box-r-line text-xl"></i>
                    </Link>
                </div>
            </div>

            {/* Background Map Placeholder (Dispatch Theme) */}
            <div className='absolute inset-0 z-0 bg-slate-950'>
                <div className='absolute inset-0 opacity-20 pointer-events-none'>
                    <div className='absolute top-1/4 left-1/4 w-px h-1/2 bg-blue-500/20'></div>
                    <div className='absolute top-1/2 left-0 w-full h-px bg-blue-500/20'></div>
                    <div className='absolute inset-0' style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                </div>
                {/* Integration point for real map if needed */}
                <div className='h-full w-full flex items-center justify-center'>
                    <div className='text-slate-800 flex flex-col items-center gap-4'>
                        <i className="ri-radar-line text-6xl animate-pulse text-blue-500/20"></i>
                        <span className='text-xs font-bold uppercase tracking-[0.2em]'>Scanning for nearby requests</span>
                    </div>
                </div>
            </div>

            {/* Main Dispatch Container */}
            <div className='relative z-20 h-full w-full pointer-events-none'>
                {/* Floating Captain Stats Panel */}
                <div className='absolute left-4 md:left-8 top-24 bottom-8 w-full max-w-[400px] pointer-events-auto'>
                    <div className='glass-dark border-white/10 h-full flex flex-col overflow-hidden shadow-2xl'>
                        <div className='p-6 flex-1 flex flex-col overflow-y-auto'>
                            <CaptainDetails />
                        </div>
                        
                        {/* Status Footer */}
                        <div className='p-4 bg-slate-800/50 border-t border-white/10'>
                            <button className='w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500/20 transition-all'>
                                Go Offline
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rights Panels / Popups */}
                <div className='pointer-events-auto'>
                    <div ref={ridePopupPanelRef} className='fixed w-full z-40 bottom-0 translate-y-full bg-slate-900 border-t border-white/10 px-4 py-10 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]'>
                        <RidePopUp
                            ride={ride}
                            setRidePopupPanel={setRidePopupPanel}
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                            confirmRide={confirmRide}
                        />
                    </div>
                    
                    <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-50 bottom-0 translate-y-full bg-slate-900 px-4 py-8 overflow-y-auto'>
                        <div className='max-w-xl mx-auto'>
                            <ConfirmRidePopUp
                                ride={ride}
                                setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                                setRidePopupPanel={setRidePopupPanel} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaptainHome