const adminModel = require('../models/admin.model');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');
const supportModel = require('../models/support.model');
const paymentModel = require('../models/payment.model');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registerAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isAdminAlready = await adminModel.findOne({ email });

    if (isAdminAlready) {
        return res.status(400).json({ message: 'Admin already exist' });
    }

    const hashedPassword = await adminModel.hashPassword(password);

    const admin = await adminModel.create({
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password: hashedPassword
    });

    const token = admin.generateAuthToken();
    res.status(201).json({ token, admin });
}

module.exports.loginAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email }).select('+password');
    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = admin.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, admin });
}

module.exports.getAdminProfile = async (req, res, next) => {
    res.status(200).json(req.admin);
}

module.exports.logoutAdmin = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    await blackListTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out' });
}

// Dashboard Statistics endpoints
module.exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalCaptains = await captainModel.countDocuments();
        const totalRides = await rideModel.countDocuments();
        const totalTickets = await supportModel.countDocuments();
        
        // Income approximation using payment records
        const payments = await paymentModel.find({ status: 'completed' });
        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        res.status(200).json({
            users: totalUsers,
            captains: totalCaptains,
            rides: totalRides,
            revenue: totalRevenue,
            tickets: totalTickets
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats", error: err.message });
    }
}

// Optional: Get all users/captains endpoints for table management
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
}

module.exports.getAllCaptains = async (req, res, next) => {
    try {
        const captains = await captainModel.find().select('-password');
        res.status(200).json(captains);
    } catch (err) {
        res.status(500).json({ message: "Error fetching captains" });
    }
}
