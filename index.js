import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
const port = 3000;

//Connect to mongoose
mongoose.connect("mongodb+srv://admin-toyin:toy-123@cluster0.yr00x3s.mongodb.net/todoeyDB");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//Display Today in weekdays and date
const date = new Date();
const todayDate = date.getDate();
const todayDay = date.getDay();
const month = date.getMonth();
const today = days[todayDay] + ", " + months[month] + " " + todayDate;

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
        //Insert defaultArray if there is none before
        const task = await Tasks.find({});
        if (task.length === 0) {
            Tasks.insertMany(defaultArray);
            res.redirect('/');
        } else {
            res.render('index.ejs', { Title: today, task: task });
        }
    }
    catch (err) {
        console.log(err);
    }
});
//Get random route
app.get('/:randomRoute', async (req, res) => {
    try {
        const randomRouteName = _.capitalize(req.params.randomRoute);
        const search = await Items.findOne({ name: randomRouteName });
        if (!search) {
            const randomRouteList = new Items({
                name: randomRouteName,
                items: defaultArray
            });
            randomRouteList.save();
            res.redirect('/' + randomRouteName);
        } else {
            res.render('index.ejs', { Title: randomRouteName, task: search.items })
        }
    }
    catch (err) {
        console.log(err);
    }

})

//Create new todos
app.post('/', async (req, res) => {
    try {
        const newTask = req.body.newtask;
        const randomRouteTodo = req.body.randomRoute;

        const newTaskName = new Tasks({
            name: newTask
        });
        //Check if new todo is coming from home or custom route
        if (randomRouteTodo === today) {
            await newTaskName.save();
            res.redirect('/');
        } else {
            const randomRouteList = await Items.findOne({ name: randomRouteTodo });
            if (randomRouteList) {
                randomRouteList.items.push(newTaskName);
                randomRouteList.save();
                res.redirect('/' + randomRouteTodo);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

//Remove completed todos
app.post('/delete', async (req, res) => {
    try {
        const checkedItemId = req.body.checkbox;
        const customRouteRem = req.body.randomRouteTodo;

        if (customRouteRem === today) {
            await Tasks.findByIdAndRemove(checkedItemId);
            res.redirect('/');
        } else {
            await Items.findOneAndUpdate({ name: customRouteRem }, { $pull: { items: { _id: checkedItemId } } });
            res.redirect('/' + customRouteRem);
        }
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

