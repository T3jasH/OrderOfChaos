const User = require("../models/User");
module.exports = async function (req, res, next) {
    let userid = req.user.id;
    let user = await User.findOne({
        _id: userid,
    });

    if (user.isAdmin) {
        next();
    } else {
        res.send({ success: false, msg: "Not an admin" });
    }
};
