const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved'],
        default: 'open',
    }
}, { timestamps: true });

module.exports = mongoose.model('support', supportSchema);
