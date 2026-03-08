const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)


router.get('/history', async (req, res, next) => {
    // Custom logic to try decoding whichever token is present (User or Captain)
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        
        // Try user first
        const userModel = require('../models/user.model');
        const user = await userModel.findById(decoded._id);
        if (user) {
             req.user = user;
             return rideController.getBookingHistory(req, res);
        }

        // Try captain
        const captainModel = require('../models/captain.model');
        const captain = await captainModel.findById(decoded._id);
        if (captain) {
             req.captain = captain;
             return rideController.getBookingHistory(req, res);
        }

        return res.status(401).json({ message: 'Unauthorized' });
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;