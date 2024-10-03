const jwt = require("jsonwebtoken");
const USER_JWT = require("../config");

function usermiddleware(req,res,next){
    const token = req.headers.token;
    const decodeddata = jwt.verify(token,USER_JWT);

    if(!decodeddata)
    {
        res.json({
            message : "Incorrect Credentials"
        })
        return;
    }
    else
    {
        req.userId = decodedata.userId;
        next();
    }

}

module.exports = {
    usermiddleware: usermiddleware
}
