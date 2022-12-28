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


const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://adminUser:123@cluster0.tililof.mongodb.net/?retryWrites=true&w=majority";

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
run().catch(console.dir);