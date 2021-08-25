module.exports = function (req, res, next) {
    if(process.env.isEnded==0)
    {
        // console.log("Contest is hasn't ended")
        next()
    }
    else
    {
        res.status(400).json({success:false,msg:"Contest has ended.", isEnded: true});
    }    
};
