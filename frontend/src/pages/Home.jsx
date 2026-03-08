import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)
    const [ liveCaptains, setLiveCaptains ] = useState([])
    
    // Map State
    const [ pickupLoc, setPickupLoc ] = useState(null)
    const [ dropLoc, setDropLoc ] = useState(null)
    const [ routeDetails, setRouteDetails ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        if (!user) return;
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    // Sync Map Clicks to String State for backend validation
    useEffect(() => {
        if (pickupLoc) {
            setPickup(`Lat: ${pickupLoc[0].toFixed(4)}, Lng: ${pickupLoc[1].toFixed(4)}`)
        }
    }, [pickupLoc])

    useEffect(() => {
        if (dropLoc) {
            setDestination(`Lat: ${dropLoc[0].toFixed(4)}, Lng: ${dropLoc[1].toFixed(4)}`)
        }
    }, [dropLoc])

    useEffect(() => {
        socket.on('ride-confirmed', ride => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        })

        socket.on('ride-started', ride => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        })

        socket.on('all-captains', (captains) => {
            setLiveCaptains(captains)
        })

        return () => {
            socket.off('ride-confirmed')
            socket.off('ride-started')
            socket.off('all-captains')
        }
    }, [socket, navigate])


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        if (!pickup || !destination) {
            alert("Please enter both pickup and destination locations");
            return;
        }

        try {
            setVehiclePanel(true)
            setPanelOpen(false)

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            setFare(response.data)
        } catch (error) {
            console.error("Error fetching fare:", error);
            alert("Failed to fetch fare. Please try again.");
        }
    }

    async function createRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data;
        } catch (error) {
            console.error("Error creating ride:", error);
            alert(error.response?.data?.message || "Failed to create ride. Please try again.");
        }
    }

    if (!user) {
        return (
            <div className='h-screen w-full flex items-center justify-center bg-white'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-16 h-16 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin'></div>
                    <p className='text-sm font-bold text-slate-500 uppercase tracking-[0.3em]'>Connecting to UCab...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='h-screen w-full relative overflow-hidden bg-slate-950'>
            {/* Top Navigation Bar */}
            <div className='absolute top-0 left-0 w-full z-30 px-6 py-4 flex justify-between items-center bg-slate-950/60 backdrop-blur-md border-b border-white/10'>
                <div className='flex items-center gap-8'>
                    <Link to='/home' className='text-3xl font-bold tracking-tighter flex items-center gap-2'>
                        <span className='bg-[#FFB800] text-black px-2 py-0.5 rounded-lg text-2xl'>U</span>
                        <span className='text-white'>Cab</span>
                    </Link>
                    
                    <nav className='hidden md:flex items-center gap-6'>
                        <Link to='/home' className='text-white font-semibold border-b-2 border-[#FFB800] pb-1 px-1'>Ride</Link>
                        <Link to='/history' className='text-slate-400 hover:text-white font-medium transition-colors'>Activity</Link>
                        <Link to='/support' className='text-slate-400 hover:text-white font-medium transition-colors'>Support</Link>
                    </nav>
                </div>

                <div className='flex items-center gap-4'>
                    <div className='hidden sm:flex flex-col items-end'>
                        <span className='text-sm font-bold text-white'>{user.fullname?.firstname} {user.fullname?.lastname}</span>
                        <span className='text-[10px] text-slate-400 uppercase tracking-widest font-bold'>Premium User</span>
                    </div>
                    <div className='w-10 h-10 rounded-full bg-[#FFB800] border-2 border-black flex items-center justify-center text-black font-black text-sm'>
                        {user.fullname?.firstname?.[0]}{user.fullname?.lastname?.[0]}
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className='absolute inset-0 z-0'>
                <InteractiveMap 
                    pickupLoc={pickupLoc} setPickupLoc={setPickupLoc} 
                    dropLoc={dropLoc} setDropLoc={setDropLoc} 
                    setRouteDetails={setRouteDetails}
                    liveCaptains={liveCaptains}
                />
            </div>

            {/* Live Captain Counter — bottom right of map */}
            <div className='absolute bottom-10 right-8 z-10 pointer-events-none'>
                <div className='flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-xl'>
                    <div className='relative flex items-center justify-center w-4 h-4'>
                        <div className='w-3 h-3 bg-green-500 rounded-full animate-ping absolute'></div>
                        <div className='w-3 h-3 bg-green-500 rounded-full relative'></div>
                    </div>
                    <div>
                        <span className='text-2xl font-black text-[#FFB800]'>{liveCaptains.length}</span>
                        <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2'>Live Captains</span>
                    </div>
                    <i className="ri-taxi-wifi-line text-slate-400 text-lg ml-1"></i>
                </div>
            </div>


            {/* Main Booking Container */}
            <div className='relative z-20 h-full w-full pointer-events-none'>
                {/* Floating Left Panel - Booking Panel */}
                <div className='absolute left-4 md:left-8 top-24 bottom-8 w-full max-w-[400px] pointer-events-auto'>
                    <div className='card-ucab backdrop-blur-xl bg-white/90 border-white/50 h-full flex flex-col overflow-hidden'>
                        {!confirmRidePanel && !vehicleFound && !waitingForDriver && (
                            <div className='flex-1 flex flex-col p-2'>
                                <div className='p-4'>
                                    <h2 className='text-2xl font-bold text-slate-900'>Where to?</h2>
                                    <p className='text-slate-500 text-sm'>Book a ride with UCab in seconds</p>
                                </div>

                                <div className='flex-1 overflow-y-auto px-4'>
                                    <form className='relative space-y-4' onSubmit={submitHandler}>
                                        <div className='relative'>
                                            <div className='absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500'></div>
                                            <input
                                                onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
                                                value={pickup}
                                                onChange={handlePickupChange}
                                                className='w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FFB800] outline-none transition-all'
                                                type="text"
                                                placeholder='Current Location'
                                            />
                                        </div>

                                        <div className='relative'>
                                            <div className='absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm bg-black'></div>
                                            <input
                                                onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
                                                value={destination}
                                                onChange={handleDestinationChange}
                                                className='w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FFB800] outline-none transition-all'
                                                type="text"
                                                placeholder='Enter Destination'
                                            />
                                        </div>
                                    </form>

                                    {routeDetails && (
                                        <div className='mt-6 p-4 rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-200'>
                                            <div className='flex justify-between items-center mb-1'>
                                                <span className='text-xs text-slate-400 font-semibold uppercase'>Distance</span>
                                                <span className='font-bold'>{routeDetails.distance} km</span>
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-xs text-slate-400 font-semibold uppercase'>Duration</span>
                                                <span className='font-bold'>{routeDetails.duration} mins</span>
                                            </div>
                                        </div>
                                    )}

                                    {panelOpen && (
                                        <div className='mt-4 h-full min-h-[300px]'>
                                            <div className='flex items-center justify-between mb-2 px-1'>
                                                <span className='text-sm font-bold text-slate-400 uppercase tracking-widest'>Suggestions</span>
                                                <button onClick={() => setPanelOpen(false)} className='ri-close-line text-lg text-slate-400'></button>
                                            </div>
                                            <LocationSearchPanel
                                                suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                                                setPanelOpen={setPanelOpen}
                                                setVehiclePanel={setVehiclePanel}
                                                setPickup={setPickup}
                                                setDestination={setDestination}
                                                activeField={activeField}
                                            />
                                        </div>
                                    )}
                                </div>

                                {!panelOpen && (
                                    <div className='p-4 border-t border-slate-100'>
                                        <button
                                            onClick={findTrip}
                                            disabled={!pickup || !destination}
                                            className='btn-primary-ucab w-full disabled:bg-slate-200 disabled:shadow-none transition-all'
                                        >
                                            Find Ride
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sub-panels container (Vehicle, Confirm, etc) */}
                        <div className='relative flex-1'>
                            <div ref={vehiclePanelRef} className='absolute inset-0 translate-y-full bg-white z-10'>
                                <VehiclePanel
                                    selectVehicle={setVehicleType}
                                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
                            </div>
                            <div ref={confirmRidePanelRef} className='absolute inset-0 translate-y-full bg-white z-20'>
                                <ConfirmRide
                                    createRide={createRide}
                                    pickup={pickup}
                                    destination={destination}
                                    fare={fare}
                                    vehicleType={vehicleType}
                                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
                            </div>
                            <div ref={vehicleFoundRef} className='absolute inset-0 translate-y-full bg-white z-30'>
                                <LookingForDriver
                                    createRide={createRide}
                                    pickup={pickup}
                                    destination={destination}
                                    fare={fare}
                                    vehicleType={vehicleType}
                                    setVehicleFound={setVehicleFound} />
                            </div>
                            <div ref={waitingForDriverRef} className='absolute inset-0 bg-white z-40 transform translate-y-full'>
                                <WaitingForDriver
                                    ride={ride}
                                    setVehicleFound={setVehicleFound}
                                    setWaitingForDriver={setWaitingForDriver}
                                    waitingForDriver={waitingForDriver} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home