import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

//Connect to mongoose
mongoose.connect("mongodb://127.0.0.1:27017/todoeyDB");

const date = new Date();

//Setup mongoose schema
const tasksSchema = new mongoose.Schema({
    name: String
});
const Tasks = mongoose.model("task", tasksSchema);
const chores = new Tasks({
    name: "Do chores"

});
const buy = new Tasks({
    name: "Buy Milk"
});
const defaultArray = [chores, buy];

//Schema for randomRoute
const itemSchema = new mongoose.Schema({
    name: String,
    items: [tasksSchema]
});
const Items = mongoose.model("item", itemSchema);

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
        //Insert defaultArray if there is none before
        const task = await Tasks.find({});
        if (task.length === 0) {
            Tasks.insertMany(defaultArray);
            res.redirect('/');
        } else {
            res.render('index.ejs', { Today: "Today", task: task });
        }
    }
    catch (err) {
        console.log(err);
    }
});
//Get random route
app.get('/:randomRoute', async (req, res) => {
    try {
        const randomRouteName = req.params.randomRoute;
        const search = await Items.findOne({ name: randomRouteName });
        if (!search) {
            const randomRouteList = new Items({
                name: randomRouteName,
                items: defaultArray
            });
            randomRouteList.save();
            res.redirect('/' + randomRouteName);
        } else {
            res.render('post.ejs', { Title: randomRouteName, newItems: search.items })
        }
    }
    catch (err) {
        console.log(err);
    }

})

//Receive request from frontend and push to mongoose
app.post('/', async (req, res) => {
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
