const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], adminController.registerAdmin);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], adminController.loginAdmin);

router.get('/profile', authMiddleware.authAdmin, adminController.getAdminProfile);
router.get('/logout', authMiddleware.authAdmin, adminController.logoutAdmin);

// Admin-only data endpoints
router.get('/stats', authMiddleware.authAdmin, adminController.getDashboardStats);
router.get('/all-users', authMiddleware.authAdmin, adminController.getAllUsers);
router.get('/all-captains', authMiddleware.authAdmin, adminController.getAllCaptains);

module.exports = router;
