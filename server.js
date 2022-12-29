const express = require('express');
const app = express();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Routes
const triviaRoutes = require('./routes/trivia');
const lineupRoutes = require('./routes/lineup');
const teammateRoutes = require('./routes/teammates');

app.get('/', (req, res) => {
   res.render('home');
});


// Start the server
app.listen(3000);
console.log("Listening on port 3000, Link: http://localhost:3000");


const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
  "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);