module.exports = function (req, res, next) {
    if (process.env.isRunning == 1) {
        console.log("Contest is ongoing");
        next();
    } else {
        res.send({ success: false, msg: "Contest is not up and running" });
    }
};
