const jwt = require("jsonwebtoken");
const ADMIN_JWT = require("../config");

function adminmiddleware(req,res,next){
    const token = req.headers.token;
    const decodeddata = jwt.verify(token,ADMIN_JWT);

    if(!decodeddata)
    {
        res.json({
            message : "Incorrect Credentials"
        })
        return;
    }
    else
    {
        req.adminId = decodedata.adminId;
        next();
    }

}

module.exports = {
    adminmiddleware: adminmiddleware
}
