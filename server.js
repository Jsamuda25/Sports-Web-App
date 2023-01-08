const express = require('express');
const app = express();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
const { MongoClient } = require("mongodb");
const uri =
"mongodb+srv://adminUser:123@cluster0.tililof.mongodb.net/test";

// Routes
const triviaRoutes = require('./routes/trivia');
const higherOrLowerRoutes = require('./routes/higher-lower');
const teammateRoutes = require('./routes/teammates');
const playerStatsRoute = require('./routes/player-stats')
const teamStatsRoute = require('./routes/team-stats')

app.get('/', (req, res) => {
   res.render('home');
});

app.use('/trivia', triviaRoutes);
app.use('/higher-lower', higherOrLowerRoutes);
app.use('/teammates', teammateRoutes);
app.use('/player-stats', playerStatsRoute);
app.use('/team-stats', teamStatsRoute);


// Initialize database connection
MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    if(err) throw err;

    app.locals.db = client.db('nba_info');

    // Start server once Mongo is initialized
    app.listen(3000);
    console.log("Listening on port 3000, Link: http://localhost:3000");
});

// async function run() {
//   try {
//     const database = client.db('hawks');
//     const movies = database.collection('test');

//     // Query for a movie that has the title 'Back to the Future'
//     const query = { firstname: 'Lou' };
//     const movie = await movies.findOne(query);

//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);