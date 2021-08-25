module.exports = function (req, res, next) {
    if (process.env.isRegistration == 1) {
        next()
    } else {
        return res
            .status(400)
            .json({ success: false, msg: "Registration has not yet started." })
    }
}
