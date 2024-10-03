const express = require("express");
const app =express();
const courserouter = express.Router();
const {coursemodel,usermodel} = require("../db");

const {usermiddleware} = require("../config");

courserouter.get("/preview",async function(req,res){
  const courses = await coursemodel.find({});
  res.json({
    msg : "courses",
    courses
  })
})

courserouter.post("/purchase",usermiddleware,async function(req,res){
    const userId = req.userId;
    const courseId = req.body.courseId;
    await usermodel.updateOne(
        { _id: userId },  // Query to match the user by their ID
        { $push: { courses: courseId } }  // Append courseId to the courses array
    );
})

module.exports = {
  courserouter
}

