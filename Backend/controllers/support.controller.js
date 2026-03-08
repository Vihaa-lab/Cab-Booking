const supportModel = require('../models/support.model');
const { validationResult } = require('express-validator');

module.exports.createTicket = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { subject, description } = req.body;

    try {
        const ticket = await supportModel.create({
            user: req.user ? req.user._id : null,
            subject,
            description
        });

        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await supportModel.find().populate('user');
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
