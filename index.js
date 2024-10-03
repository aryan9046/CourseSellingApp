const express = require("express");
const app = express();

app.use(express.json());
const {userrouter} = require("./Routers/user");
const {courserouter} = require("./Routers/course");
const {adminrouter} = require("./Routers/admin");




app.use("/user",userrouter);
app.use("/admin",adminrouter);
app.use("/course",courserouter);




async function main()
{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("listening on port 3000");
}



app.listen(3000);