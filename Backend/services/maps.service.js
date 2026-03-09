const axios = require('axios');
const captainModel = require('../models/captain.model');

// ─── FREE OpenStreetMap Services (no API key required) ──────────────────────

/**
 * Geocode an address to coordinates using Nominatim (OpenStreetMap).
 */
module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UCab/1.0' }, // Required by Nominatim
        });
        if (response.data && response.data.length > 0) {
            return {
                ltd: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon),
            };
        } else {
            throw new Error('Unable to fetch coordinates for: ' + address);
        }
    } catch (error) {
        console.error('[Maps] Geocode error:', error.message);
        throw error;
    }
};

/**
 * Get distance and estimated duration using OSRM (free, no key).
 * Returns { distance: { value (meters) }, duration: { value (seconds) } }
 */
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // First geocode both addresses
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destCoords = await module.exports.getAddressCoordinate(destination);

        // OSRM format: lng,lat;lng,lat
        const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=false`;

        const response = await axios.get(url);
        if (response.data && response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: { value: route.distance, text: `${(route.distance / 1000).toFixed(1)} km` },
                duration: { value: route.duration, text: `${Math.round(route.duration / 60)} mins` },
            };
        } else {
            throw new Error('No routes found between the locations');
        }
    } catch (err) {
        console.error('[Maps] Distance/time error:', err.message);
        throw err;
    }
};

/**
 * Get autocomplete suggestions using Nominatim search.
 */
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&addressdetails=1`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UCab/1.0' },
        });
        if (response.data && response.data.length > 0) {
            return response.data.map(place => place.display_name);
        }
        return [];
    } catch (err) {
        console.error('[Maps] Autocomplete error:', err.message);
        return []; // Return empty instead of crashing
    }
};

/**
 * Find captains within a radius using MongoDB geospatial queries.
 */
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371],
            },
        },
    });
    return captains;
};