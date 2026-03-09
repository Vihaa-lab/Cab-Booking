const mongoose = require('mongoose');

function connectToDb() {
    const options = {
        serverSelectionTimeoutMS: 8000,  // How long to try selecting a server
        heartbeatFrequencyMS: 10000,
        socketTimeoutMS: 30000,
        family: 4,                        // Force IPv4 — critical on Windows + Atlas TLS
        bufferCommands: false,            // Fail immediately when disconnected (no buffering)
    };

    const connect = () => {
        mongoose.connect(process.env.DB_CONNECT, options)
            .then(() => {
                console.log('✅ MongoDB connected successfully');
            })
            .catch(err => {
                console.error('❌ MongoDB connection failed:', err.message);
                console.log('🔄 Retrying in 5 seconds...');
                setTimeout(connect, 5000); // Auto-retry on failure
            });
    };

    connect();

    mongoose.connection.on('connected', () => {
        console.log('🟢 Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
        console.error('🔴 Mongoose error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('🟡 Mongoose disconnected — attempting reconnect...');
        setTimeout(connect, 3000);
    });
}

module.exports = connectToDb;