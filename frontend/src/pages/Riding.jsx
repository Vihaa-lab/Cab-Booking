import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const cabIcon = L.divIcon({
    html: `<div style="background:#FFB800;border:3px solid white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.4);"><svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M19 17H5v1.5A1.5 1.5 0 0 1 3.5 20H3a1 1 0 0 1-1-1v-5l2-6h16l2 6v5a1 1 0 0 1-1 1h-.5A1.5 1.5 0 0 1 19 18.5V17zm-14-3h2v2H5v-2zm12 0h2v2h-2v-2z"/></svg></div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
});

const AutoFly = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 14, { duration: 1.2 });
    }, [position, map]);
    return null;
};

const Riding = () => {
    const location = useLocation();
    const { ride } = location.state || {};
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();

    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [showReceipt, setShowReceipt] = useState(false);
    const [captainPos, setCaptainPos] = useState(null);

    const defaultCenter = [20.5937, 78.9629];

    useEffect(() => {
        // Seed captain position from ride data if available
        if (ride?.captain?.location?.ltd && ride?.captain?.location?.lng) {
            setCaptainPos([ride.captain.location.ltd, ride.captain.location.lng]);
        }
    }, [ride]);

    useEffect(() => {
        socket.on('ride-ended', () => {
            setPaymentStatus('processing');
            setTimeout(() => {
                setPaymentStatus('paid');
                setShowReceipt(true);
            }, 2500);
        });

        // Live captain location updates during ride
        socket.on('captain-location-update', (location) => {
            if (location?.ltd && location?.lng) {
                setCaptainPos([location.ltd, location.lng]);
            }
        });

        return () => {
            socket.off('ride-ended');
            socket.off('captain-location-update');
        };
    }, [socket]);

    if (showReceipt) {
        return (
            <div className='h-screen w-full flex items-center justify-center bg-slate-950 p-4'>
                <div className='w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10'>
                    {/* Receipt Header */}
                    <div className='bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden'>
                        <div className='absolute inset-0 opacity-10' style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
                        <div className='relative z-10'>
                            <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <i className="ri-checkbox-circle-fill text-4xl text-white"></i>
                            </div>
                            <h2 className='text-white font-black text-2xl'>Payment Complete</h2>
                            <p className='text-green-100 text-sm font-medium mt-1'>Thank you for riding with UCab!</p>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className='p-6 border-b border-white/10 text-center'>
                        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest mb-2'>Total Fare</p>
                        <h1 className='text-5xl font-black text-[#FFB800]'>₹{ride?.fare || '0'}</h1>
                    </div>

                    {/* Details */}
                    <div className='p-6 space-y-4'>
                        {[
                            { label: 'Date', value: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                            { label: 'Captain', value: `${ride?.captain?.fullname?.firstname ?? '—'} ${ride?.captain?.fullname?.lastname ?? ''}` },
                            { label: 'Vehicle', value: ride?.captain?.vehicle?.plate ?? '—' },
                            { label: 'From', value: ride?.pickup ?? '—' },
                            { label: 'To', value: ride?.destination ?? '—' },
                            { label: 'Payment', value: 'Cash' },
                        ].map(({ label, value }) => (
                            <div key={label} className='flex items-center justify-between'>
                                <span className='text-xs font-bold text-slate-500 uppercase tracking-widest'>{label}</span>
                                <span className='text-sm font-semibold text-white capitalize text-right max-w-[200px] truncate'>{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className='px-6 pb-6'>
                        <button
                            onClick={() => navigate('/home')}
                            className='w-full py-4 bg-[#FFB800] hover:bg-[#e6a600] text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95'
                        >
                            Back to UCab Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen w-full relative overflow-hidden bg-slate-950'>
            {/* Nav */}
            <div className='absolute top-0 left-0 w-full z-30 px-6 py-4 flex justify-between items-center bg-slate-950/60 backdrop-blur-md border-b border-white/10'>
                <div className='flex items-center gap-2'>
                    <span className='bg-[#FFB800] text-black px-2 py-0.5 rounded-lg text-2xl font-black'>U</span>
                    <span className='text-white text-2xl font-black'>Cab</span>
                    <span className='ml-2 text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider'>En Route</span>
                </div>
                <Link to='/home' className='flex items-center gap-2 text-slate-400 hover:text-white transition-colors'>
                    <i className="ri-home-5-line"></i>
                    <span className='text-sm font-medium hidden sm:inline'>Home</span>
                </Link>
            </div>

            {/* Live Map */}
            <div className='absolute inset-0 z-0'>
                <MapContainer
                    center={captainPos || defaultCenter}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {captainPos && (
                        <>
                            <Marker position={captainPos} icon={cabIcon} />
                            <AutoFly position={captainPos} />
                        </>
                    )}
                </MapContainer>
            </div>

            {/* Bottom Info Panel */}
            <div className='absolute bottom-0 left-0 right-0 z-20'>
                <div className='mx-4 mb-4 bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl'>
                    {/* Captain Row */}
                    <div className='flex items-center justify-between p-5 border-b border-white/10'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-[#FFB800] rounded-2xl flex items-center justify-center text-black font-black text-lg'>
                                {ride?.captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                            </div>
                            <div>
                                <h3 className='font-black text-white capitalize leading-tight'>
                                    {ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}
                                </h3>
                                <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
                                    {ride?.captain?.vehicle?.plate || '—'}
                                </p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Fare</p>
                            <h4 className='text-2xl font-black text-[#FFB800]'>₹{ride?.fare}</h4>
                        </div>
                    </div>

                    {/* Trip Info */}
                    <div className='p-5 space-y-3'>
                        <div className='flex items-start gap-3'>
                            <div className='w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center mt-0.5'>
                                <i className="ri-map-pin-2-fill text-red-400 text-sm"></i>
                            </div>
                            <div className='flex-1'>
                                <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Destination</p>
                                <h4 className='text-sm font-semibold text-white mt-0.5 line-clamp-1'>{ride?.destination}</h4>
                            </div>
                        </div>

                        {/* Status Bar */}
                        {paymentStatus === 'pending' && (
                            <div className='flex items-center justify-center gap-3 py-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                                <span className='text-xs font-black text-blue-400 uppercase tracking-[0.15em]'>Ride in Progress</span>
                            </div>
                        )}
                        {paymentStatus === 'processing' && (
                            <div className='flex items-center justify-center gap-3 py-4 bg-[#FFB800]/5 border border-[#FFB800]/20 rounded-2xl'>
                                <div className='w-4 h-4 border-2 border-[#FFB800]/30 border-t-[#FFB800] rounded-full animate-spin'></div>
                                <span className='text-xs font-black text-[#FFB800] uppercase tracking-[0.15em]'>Processing Payment...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Riding;