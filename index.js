import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

//Connect to mongoose
mongoose.connect("mongodb://127.0.0.1:27017/todoeyDB");

const date = new Date();
const year = date.getFullYear();

//Setup mongoose schema
const tasksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})
const Tasks = mongoose.model("task", tasksSchema);
const chores = new Tasks({
    name: "Do chores"

});
const buy = new Tasks({
    name: "Buy Milk"
});
const defaultArray = [chores, buy];

//Use bodyparser to get post request from frontend and 
//express to render static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Render data to Frontend
app.get('/', async (req, res) => {

    try {
        const todayDate = date.getDate();
        const todayDay = date.getDay();
        const month = date.getMonth();
        const today = days[todayDay] + ", " + months[month] + " " + todayDate;

        const task = await Tasks.find({});
        if (task.length === 0) {
            Tasks.insertMany(defaultArray);
            res.redirect('/');
        } else {
            res.render('index.ejs', { Today: today, Year: year, task: task });
        }
    }
    catch (err) {
        console.log(err);
    }

});

//Receive request from frontend and push to mongoose
app.post('/submit', async (req, res) => {
    try {
        const newTask = req.body.newtask;
        const newTaskName = new Tasks({
            name: newTask
        });
        await newTaskName.save();
        res.redirect('/');
    }
    catch (err) {
        console.log(err);
    }

});
app.post('/delete', async (req, res) => {
    try {
        const checkedItemId = req.body.checkbox;
        await Tasks.findByIdAndRemove(checkedItemId);
        res.redirect('/');
    }
    catch (err) {
        console.log(err);
    }
})
//Listening 
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

//mongoose.connection.close();













































const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
