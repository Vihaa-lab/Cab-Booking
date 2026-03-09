const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 4000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log(`🚀 UCab Server running on port ${port}`);
});

// ─── Graceful Crash Guards ──────────────────────────────────────────────────
// Prevent ECONNRESET and other transient errors from killing the process
process.on('uncaughtException', (err) => {
    if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
        console.error(`⚠️  [Network Error - Non-Fatal] ${err.code}: ${err.message}`);
        // Don't exit — these are transient network errors (Atlas, Redis, etc.)
        return;
    }
    // For truly unexpected errors, log and exit cleanly
    console.error('💥 [Uncaught Exception]', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    if (reason?.code === 'ECONNRESET' || reason?.code === 'ECONNREFUSED') {
        console.error(`⚠️  [Unhandled Rejection - Non-Fatal] ${reason.code}`);
        return;
    }
    console.error('💥 [Unhandled Rejection]', reason);
});