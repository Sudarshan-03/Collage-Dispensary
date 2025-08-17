const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user');

exports.studentAuth = async (req, res, next) => {
    try {
        // Safe way to read token from cookies or headers
        const token =
            (req.cookies && req.cookies.token) ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Its_My_Secret_Key");
        req.user = await UserModel.findById(decoded.userId).select('-password');

        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: err.message || 'Authentication failed' });
    }
};

exports.adminFacultyAuth = async (req, res, next) => {
    try {
         
        const token =
            (req.cookies && req.cookies.token) ||
            req.header("Authorization")?.replace("Bearer ", "");
            

        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Its_My_Secret_Key");
        req.user = await UserModel.findById(decoded.userId).select('-password');

        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (req.user.role === "student") {
            return res.status(403).json({ error: "You don't have access to this page" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: err.message || 'Authentication failed' });
    }
};
