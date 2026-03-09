const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        // PERSIST PAYMENT RECORD
        const paymentModel = require('../models/payment.model');
        await paymentModel.create({
            ride: ride._id,
            user: ride.user._id,
            captain: ride.captain._id,
            amount: ride.fare,
            status: 'completed',
            paymentId: 'MOCK_TXN_' + Date.now()
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.getBookingHistory = async (req, res) => {
    try {
        let rides = [];
        // If the request comes from a Captain
        if (req.captain) {
            rides = await rideModel.find({ captain: req.captain._id })
                                   .populate('user')
                                   .sort({ createdAt: -1 })
                                   .limit(20);
        } else if (req.user) {
            // If the request comes from a User
            rides = await rideModel.find({ user: req.user._id })
                                   .populate('captain')
                                   .sort({ createdAt: -1 })
                                   .limit(20);
        } else {
            return res.status(401).json({ message: 'Unauthorized access to history' });
        }
        
        return res.status(200).json(rides);
    } catch (err) {
         console.log(err);
         return res.status(500).json({ message: err.message });
    }
}