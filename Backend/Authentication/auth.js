const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user');

exports.studentAuth = async (req, res, next) => {
    try {
        console.log("🔍 Incoming request - Checking auth...");
        console.log("Cookies:", req.cookies);
        console.log("Authorization Header:", req.header("Authorization"));
        console.log("Request Body:", req.body);

        const token =
            (req.cookies && req.cookies.token) ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.body?.token;   // ✅ check body as fallback

        console.log("🛡️ Extracted Token:", token);

        if (!token) {
            console.log("❌ No token found in cookies, header, or body");
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Its_My_Secret_Key");
        console.log("✅ Token Decoded:", decoded);

        req.user = await UserModel.findById(decoded.userId).select('-password');

        if (!req.user) {
            console.log("❌ User not found for decoded token");
            return res.status(401).json({ error: 'User not found' });
        }

        console.log("✅ User Authenticated:", req.user.email || req.user._id);
        next();
    } catch (err) {
        console.log("⚠️ Auth Error:", err.message);
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
