const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    email : {type:string,unique:true},
    password : string,
    firstname : string,
    lastname : string,
    courses : [{
        type: ObjectId,
        ref : CourseSchema
    }]
})

const AdminSchema = new Schema({
    email : {type:string,unique:true},
    password : string,
    firstname : string,
    lastname : string
})

const CourseSchema = new Schema({
    name : string,
    title : string,
    description : string,
    price : number,
    creatorId : {
        type: ObjectId,
        ref : AdminSchema
    }
})

const usermodel = mongoose.model("User",UserSchema);
const adminmodel = mongoose.model("Admin",AdminSchema);
const coursemodel = mongoose.model("Courses",CourseSchema);

module.exports = {
    usermodel,
    adminmodel,
    coursemodel
}
