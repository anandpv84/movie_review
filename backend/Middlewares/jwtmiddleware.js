const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json("No token, authorization denied.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("User authenticated:", req.user);
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json("Token is not valid.");
    }
};

exports.protectAdmin = (req, res, next) => {
    console.log(req.user)
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json("Access denied.");
    }
};