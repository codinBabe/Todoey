import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const date = new Date();
const year = date.getFullYear();

const Tasks = ["Do chores", "Buy milk"];
const Works = ["Stand up meeting", "Documentation"];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.post('/submit', (req, res) => {
    let newTask = req.body.newtask;
    Tasks.push(newTask);
    res.redirect('/');
});
app.post('/submit/work', (req, res) => {
    let newWork = req.body.newwork;
    Works.push(newWork);
    res.redirect('/work');
});
app.post('/strike', (req, res) => {
    const checked = req.body.check;
    console.log(req.body)
})
app.get('/', (req, res) => {

    const todayDate = date.getDate();
    const todayDay = date.getDay();
    const month = date.getMonth();
    const today = days[todayDay] + ", " + months[month] + " " + todayDate;

    res.render('index.ejs', { Today: today, Year: year, task: Tasks });
});
app.get('/work', (req, res) => {
    res.render('work.ejs', { Year: year, worked: Works });
});





app.listen(port, () => {
    console.log(`listening on port ${port}`)
})


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
