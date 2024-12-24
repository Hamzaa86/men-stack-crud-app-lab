const Food = require("./models/food");
require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const app= express();
const port= 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const methodOverride = require('method-override'); 
app.use(methodOverride('_method'));
//Connecting mongoose with the URI in .env
mongoose.connect(process.env.MONGODB_URI);

// Checking if the connection is on
mongoose.connection.on('connected', ()=>
{
    console.log("Connected to MongoDB:" ,mongoose.connection.name);
});

app.get("/foods/new", (req,res)=>
{
    res.render("new");
});

//Curd Add
app.post("/foods", async (req,res)=>
{
    await Food.create(req.body);
    console.log(req.body.name + req.body.description);
    res.redirect("/foods");
});

app.get("/foods", async (req,res) =>
{
    const foods = await Food.find();
    res.render("foods/index.ejs", { foods });
})

app.get('/foods/:id', async (req, res) => 
{
    const food = await Food.findById(req.params.id);
    res.render('foods/show.ejs', { food });
});

app.get("/foods/:Id/edit", async (req, res) =>
{
  const food = await Food.findById(req.params.Id);
  res.render("foods/edit.ejs", { food });
})

app.put('/foods/:id', async (req, res) => 
{
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
    res.redirect(`/foods/${food._id}`);
});

app.delete('/foods/:id', async (req, res) => 
{
    await Food.findByIdAndDelete(req.params.id); 
    res.redirect('/foods'); 
});

app.get("/", (req,res)=>
{
    res.render('index');
});

app.listen(port, (req,res)=>
{
    console.log("App is listening on port:", port);
});