const express = require("express");
const adminrouter = express.Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ADMIN_JWT = require("../config");
const {adminmodel, coursemodel} = require("../db");
const {adminmiddleware} = require("../Middleware/admin");



adminrouter.post("/signup",async function(req,res){
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
    const hashedpassword = await bcrypt.hash(password,5);
  const admin = await adminmodel.create({
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
    return;
  }
  if(!errorthrow)
  {
    res.json({
        message : "the admin has signed up"
    })
  }
})

adminrouter.post("/signin",async function(req,res){
    const {email,password} = req.body;
    const admin = adminmodel.findOne({
        email : email
    })
    if(!admin)
    {
        res.json({
            message : "The user does not exist"
        })
        return;
    }
    else
    {
        const compare = await bcrypt.compare(password,admin.password);
        if(!compare)
        {
          res.json({
            message : "your password is incorrect"
          })
          return;
        }
        else{
            const token = jwt.sign({
                adminId : admin._id
            },ADMIN_JWT);
            res.json({
                token : token,
                message : "you have signed in successfully"
            })
        }
    }
})

adminrouter.post("/course",adminmiddleware,async function(req,res){ // Create a new Course
    const adminId = req.adminId;
    const{title,description,price,name} = req.body; //Destructuring the body to get the components
     
    await coursemodel.create({
        name : name,
        title : title,
        description: description,
        price : price,
        creatorId : adminId
    })

    res.json({
        msg : "You have successfully created a course"
    })

})

adminrouter.put("/course",adminmiddleware,async function(req,res){
    const adminId = req.adminId;
    const courseId = req.body.courseId;
    const{title,description,price,name} = req.body; //Destructuring the body to get the components
    const course = await coursemodel.updateOne({
        _id : courseId,
        creatorId : adminId
    },{
        name : name,
        title : title,
        description: description,
        price : price,
    }
)
res.json({
    msg : "the course was updated"
})
})

adminrouter.get("/course/bulk",adminmiddleware,async function(req,res){
    const adminId = req.adminid;
    const courses = await coursemodel.find({
        creatorId : adminId
    })
    res.json({
        msg : "here are the courses",
        courses
    })
})

module.exports = {
    adminrouter : adminrouter
}