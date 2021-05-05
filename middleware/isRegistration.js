module.exports = function (req, res, next) {
    if (process.env.isRegistered == 1) {
        next();
    } else {
        res.send({ success: false, msg: "You are not registered" });
    }
};
