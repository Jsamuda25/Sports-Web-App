const express = require('express');
const app = express();

app.set("view engine", "pug");
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
   res.render('home');
});

//test123
app.listen(3000);
console.log("Listening on port 3000, Link: http://localhost:3000");

