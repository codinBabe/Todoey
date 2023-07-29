import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const date = new Date();
const year = date.getFullYear();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {

    const todayDate = date.getDate();
    const todayDay = date.getDay();
    const month = date.getMonth();
    const today = days[todayDay] + ", " + months[month] + " " + todayDate;
    res.render('index.ejs', { Today: today, Year: year });
})
app.get('/work', (req, res) => {
    res.render('work.ejs');
})

app.post('/', (req, res) => {

});




app.listen(port, () => {
    console.log(`listening on port ${port}`)
})


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]