const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
    // Get the token fron header
    const token = req.header("x-auth-token");

    // Check if not token
    if (!token) {
        return res
            .status(401)
            .json({
                success: false,
                msg: "No token found. Please log in again.",
            });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        const user = await User.findById(req.user.id).select("ipaddress");
        // console.log(user.ipaddress);
        if(user.ipaddress && user.ipaddress!==req.ipInfo.ip)
        {
            console.log("iperror");
            return res.status(400).json({
                success: false,
                msg: "You can log in from one computer only.",
                iperror: true
            });
        }else
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            msg: "Token is not valid. Please log in again.",
        });
    }
};
