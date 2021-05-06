module.exports = function (req, res, next) {
    if (process.env.isRegistration == 1) {
        next();
    } else {
        res.send({ success: false, msg: "You are not registered" });
    }
};
