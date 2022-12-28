const express = require('express');
const app = express();

app.set("view engine", "pug");

app.get('/', (req, res) => {
  res.render('home');
});

// Hello
app.listen(3000);
console.log("Listening on port 3000, Link: http://localhost:3000");

