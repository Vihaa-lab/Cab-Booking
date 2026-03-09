const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    paymentId: {
        type: String, // Mock transaction ID
    }
}, { timestamps: true });

module.exports = mongoose.model('payment', paymentSchema);
