const User = require("../models/User");
 
module.exports = async function (req, res, next) {
    const user = await User.findById(req.user.id).select("isAdmin");
    if(process.env.isRunning==1 || user.isAdmin)
    {
        next()
    }
    else
    {
        res.status(400).json({success:false,msg:"Contest is not up and running", isStarted : false});
    }    
};
  