import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ─── Custom UCab Yellow Cab Icon ───────────────────────────────────────────────
const createCabIcon = (isLive = true) => L.divIcon({
  html: `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      <div style="
        background: ${isLive ? '#FFB800' : '#64748B'};
        border: 3px solid white;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4), 0 0 0 4px ${isLive ? 'rgba(255,184,0,0.2)' : 'rgba(100,116,139,0.2)'};
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 17H5v1.5A1.5 1.5 0 0 1 3.5 20H3a1 1 0 0 1-1-1v-5l2-6h16l2 6v5a1 1 0 0 1-1 1h-.5A1.5 1.5 0 0 1 19 18.5V17zm-14-3h2v2H5v-2zm12 0h2v2h-2v-2z"/>
        </svg>
      </div>
      ${isLive ? `<div style="width: 8px; height: 8px; background: #22C55E; border-radius: 50%; margin-top: 3px; box-shadow: 0 0 6px #22C55E;"></div>` : ''}
    </div>
  `,
  className: '',
  iconSize: [36, 50],
  iconAnchor: [18, 50],
  popupAnchor: [0, -54],
});

// ─── Custom Pickup Icon ─────────────────────────────────────────────────────────
const pickupIcon = L.divIcon({
  html: `
    <div style="
      width: 32px; height: 32px;
      background: #3B82F6;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(59,130,246,0.5);
    "></div>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// ─── Custom Drop Icon ───────────────────────────────────────────────────────────
const dropIcon = L.divIcon({
  html: `
    <div style="
      width: 32px; height: 32px;
      background: #EF4444;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(239,68,68,0.5);
    "></div>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// ─── Fly To Helper ──────────────────────────────────────────────────────────────
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 1.5 });
  }, [position, map]);
  return null;
};

// ─── Map Click Handler ──────────────────────────────────────────────────────────
const MapClickHandler = ({ pickupLoc, setPickupLoc, dropLoc, setDropLoc }) => {
  useMapEvents({
    click(e) {
      if (!pickupLoc) {
        setPickupLoc([e.latlng.lat, e.latlng.lng]);
      } else if (!dropLoc) {
        setDropLoc([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const InteractiveMap = ({ pickupLoc, setPickupLoc, dropLoc, setDropLoc, setRouteDetails, liveCaptains = [] }) => {
  const [currentLocation, setCurrentLocation] = useState([20.5937, 78.9629]);
  const [routeCoords, setRouteCoords] = useState([]);
  const prevCaptainCount = useRef(0);

  // Get user's current GPS position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Log when new captains come online
  useEffect(() => {
    if (liveCaptains.length > prevCaptainCount.current) {
      console.log(`[UCab] ${liveCaptains.length} captains online`);
    }
    prevCaptainCount.current = liveCaptains.length;
  }, [liveCaptains]);

  // Fetch route from OSRM
  const fetchRoute = useCallback(async () => {
    if (pickupLoc && dropLoc) {
      try {
        const query = `${pickupLoc[1]},${pickupLoc[0]};${dropLoc[1]},${dropLoc[0]}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson`;
        const response = await axios.get(url);
        if (response.data.routes?.length > 0) {
          const route = response.data.routes[0];
          const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteCoords(coords);
          setRouteDetails?.({
            distance: (route.distance / 1000).toFixed(2),
            duration: Math.round(route.duration / 60),
          });
        }
      } catch (error) {
        console.error('OSRM error:', error);
      }
    } else {
      setRouteCoords([]);
      setRouteDetails?.(null);
    }
  }, [pickupLoc, dropLoc, setRouteDetails]);

  useEffect(() => { fetchRoute(); }, [pickupLoc, dropLoc, fetchRoute]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={currentLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Premium Dark Map Tile (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler
          pickupLoc={pickupLoc}
          setPickupLoc={setPickupLoc}
          dropLoc={dropLoc}
          setDropLoc={setDropLoc}
        />

        <FlyToLocation position={currentLocation} />

        {/* Pickup Marker */}
        {pickupLoc && (
          <Marker position={pickupLoc} icon={pickupIcon}>
            <Popup className="ucab-popup">
              <div style={{ padding: '4px 8px', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#3B82F6', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pickup</strong>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748B' }}>
                  {pickupLoc[0].toFixed(4)}, {pickupLoc[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Drop Marker */}
        {dropLoc && (
          <Marker position={dropLoc} icon={dropIcon}>
            <Popup>
              <div style={{ padding: '4px 8px', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#EF4444', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Destination</strong>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748B' }}>
                  {dropLoc[0].toFixed(4)}, {dropLoc[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoords.length > 0 && (
          <>
            {/* Glow effect */}
            <Polyline positions={routeCoords} color="#FFB800" weight={8} opacity={0.15} />
            {/* Main route line */}
            <Polyline positions={routeCoords} color="#FFB800" weight={4} opacity={0.9} dashArray="8, 4" />
          </>
        )}

        {/* Live Captain Markers from Socket */}
        {liveCaptains.map((captain) => {
          const lat = captain.location?.ltd;
          const lng = captain.location?.lng;
          if (!lat || !lng) return null;

          return (
            <Marker
              key={captain._id}
              position={[lat, lng]}
              icon={createCabIcon(true)}
            >
              <Popup>
                <div style={{ padding: '6px 10px', fontFamily: 'Inter, sans-serif', minWidth: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{
                      width: '32px', height: '32px',
                      background: '#FFB800',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 'bold', color: '#000'
                    }}>
                      {captain.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: '#0F172A', textTransform: 'capitalize' }}>
                        {captain.fullname?.firstname} {captain.fullname?.lastname}
                      </p>
                      <p style={{ margin: 0, fontSize: '10px', color: '#22C55E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        ● Online
                      </p>
                    </div>
                  </div>
                  <div style={{ background: '#F8FAFC', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', color: '#64748B' }}>
                    🚗 {captain.vehicle?.vehicleType || 'Sedan'} &nbsp;|&nbsp; {captain.vehicle?.plate || '—'}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Click-to-set hint overlay */}
      {(!pickupLoc || !dropLoc) && (
        <div style={{
          position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 900,
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          padding: '8px 20px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.05em',
          border: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {!pickupLoc ? '📌 Click map to set Pickup' : '📍 Click map to set Destination'}
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
