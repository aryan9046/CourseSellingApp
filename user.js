const express = require("express");
const userrouter = express.Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const USER_JWT = require("../config");
const {usermodel, coursemodel} = require("../db");
const {usermiddleware} = require("../Middleware/admin");

userrouter.post("/signup",async function(req,res){
    const requiredbody = z.object({
      email : z.string().min(5).max(100).email(),
      password : z.string().min(5).max(100),
      firstname : z.string().min(5).max(100),
      lastname : z.string().min(5).max(100)
    })
    const parseddata = requiredbody.safeParse(req.body);
    if(!parseddata.success)
    {
      res.json({
          msg : "Invalid format, please enter the details again"
      })
      return;
    }
    const {email,password,firstname,lastname} = req.body; //Destructuring req.body to get our components
    let errorthrow = false;
    try{
      const hashedpassword =await bcrypt.hash(password,5);
    const user = await adminmodel.create({
      email : email,
      password : hashedpassword,
      firstname : firstname,
      lastname : lastname
    })
    //Throw an error if you want
    }catch(e){
      res.json({
          message : "There was a problem while signing up"
      })
      errorthrow = true;
    }
    if(!errorthrow)
    {
      res.json({
          message : "the user has signed up"
      })
    }
  })

  userrouter.post("/signin",async function(req,res){
    const {email,password} = req.body;
    const user = usermodel.findOne({
        email : email
    })
    if(!user)
    {
        res.json({
            message : "The user does not exist"
        })
        return;
    }
    else
    {
        const compare = await bcrypt.compare(password,user.password);
        if(!compare)
        {
          res.json({
            message : "your password is incorrect"
          })
          return;
        }
        else{
            const token = jwt.sign({
                userId : user._id
            },USER_JWT);
            res.json({
                token : token,
                message : "you have signed in successfully"
            })
        }
    }
})

userrouter.get("/purchases",usermiddleware,async function(req,res){
   const userId = req.userId;
   const user = await usermodel.findOne({
    _id : userId
   })
   const purchases = user.courses;

   const courses = await coursemodel.find({
    _id : { $in: purcahses}
})

res.json({
    courses
})

})

module.exports = {
    userrouter
}
