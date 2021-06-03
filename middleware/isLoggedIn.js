const jwt = require("jsonwebtoken")
const User = require("../models/User")

const getIP = (ip) => {
    var ct = 0
    for (i = 0; i < ip.length; i++) {
        if (ip[i] == ":") ct++
        if (ct === 4) return ip.substr(0, i)
    }
    return ip
}

module.exports = async function (req, res, next) {
    // Get the token fron header
    const token = req.header("x-auth-token")

    // Check if not token
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "No token found. Please log in again.",
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user
        const user = await User.findById(req.user.id).select("ipaddress");
        // console.log(user.ipaddress);
        if(user.ipaddress && getIP(user.ipaddress)!==getIP(req.ipInfo.ip))
        {
            console.log(`IpError: ${getIP(user.ipaddress)} != ${getIP(req.ipInfo.ip)}`);
            
            return res.status(400).json({
                success: false,
                msg: "You can log in from one computer only.",
                iperror: true,
            })
        } else next()
    } catch (err) {
        res.status(401).json({
            success: false,
            msg: "Token is not valid. Please log in again.",
        })
    }
}
