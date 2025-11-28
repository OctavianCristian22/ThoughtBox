const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Received token:', token); // DEBUG
        
        if (!token) {
            console.log('No token provided'); // DEBUG
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'thoughtbox-secret-key');
        console.log('Decoded token:', decoded); // DEBUG
        
        const user = await User.findById(decoded.userId).select('-password');
        console.log('Found user:', user); // DEBUG
        
        if (!user) {
            console.log('User not found'); // DEBUG
            return res.status(401).json({ error: 'Token is not valid.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Auth error:', error); // DEBUG
        res.status(401).json({ error: 'Token is not valid.' });
    }
};

module.exports = auth;
