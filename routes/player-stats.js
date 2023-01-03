const express = require('express');
let ObjectId = require('mongodb').ObjectId;

let router = express.Router()
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.render('player-lookup');
});
router.get("/player/:id", getPlayer);

router.get("/players", getPlayers);

// Get player from database based on id
function getPlayer(req, res) {
    let id = req.params.id;
	req.app.locals.db.collection("player_data").findOne({_id: new ObjectId(id)}, function(err, player){
		if(err){
			console.log("Server Error");
			res.sendStatus(500);
			return;
		}

		if(!player){
			console.log("No Match!")
			res.status(404)
			res.send("No match!");
			return;
		}
		else{
			res.status(200).render("player", {player: player});
		}
	});
}



// Get player from database based on query with firstname, lastname, team, and year 
async function getPlayers(req, res) {
    let query = {};

	if(req.query.year){
		query.year = req.query.year;
	}

	if(req.query.firstname){
		query.firstname = {"$regex":req.query.firstname,"$options":"xi"}
	}

	if(req.query.lastname){
		query.lastname = {"$regex":req.query.lastname,"$options":"xi"};
	}

    console.log(query);

	req.app.locals.db.collection("player_data").find(query).project({_id: 1, firstname: 1, lastname: 1, year: 1, team: 1}).toArray(function(err, searchResult){
		if(err){
			console.log("Server Error");
            res.sendStatus(500);
            return;
		}

		if(!searchResult.length){
			console.log("No Match!")
			console.log(searchResult);
			res.status(404)
			res.send("No match!");
			return;
		}
		else{
			res.status(200).render("player-results", {players: searchResult});
		}
	});
}

module.exports = router;