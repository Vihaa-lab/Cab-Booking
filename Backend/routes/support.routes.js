const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supportController = require('../controllers/support.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-ticket',
    authMiddleware.authUser,
    body('subject').isString().notEmpty().withMessage('Subject is required'),
    body('description').isString().notEmpty().withMessage('Description is required'),
    supportController.createTicket
);

router.get('/all-tickets',
    authMiddleware.authAdmin,
    supportController.getAllTickets
);

module.exports = router;
