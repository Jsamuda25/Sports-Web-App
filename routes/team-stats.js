const express = require('express');
let ObjectId = require('mongodb').ObjectId;
let router = express.Router()
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.render('team-lookup');
});

router.get("/teams", getTeams);

router.get("/team/:id", getTeam);

// Get player from database based on query with firstname, lastname, team, and year 
async function getTeams(req, res) {

	let query = {};

	if(req.query.teamName){
		query.teamName = {"$regex":req.query.teamName,"$options":"xi"}
	}
		
	if(req.query.season){
		query.season = req.query.season;
	}

	console.log(query);

	req.app.locals.db.collection("team_data").find(query).project({_id: 1, teamName: 1, season: 1}).toArray(function(err, searchResult){
		if(err){
			console.log("Server Error");
            res.sendStatus(500);
            return;
		}

		if(!searchResult){
			console.log("No Match!")
			res.status(404)
			res.send("No match!");
			return;
		}

		else{
			res.status(200).render("team-results", {teams: searchResult});
			console.log(searchResult);
		}
	});
}

function getTeam(req,res){
	let id = req.params.id;
	req.app.locals.db.collection("team_data").findOne({_id: new ObjectId(id)}, function(err, team){
		if(err){
			console.log("Server Error");
			res.sendStatus(500);
			return;
		}

		if(!team){
			console.log("No Match!")
			res.status(404)
			res.send("No match!");
			return;
		}
		else{
			res.status(200).render("team", {team: team});
			console.log(team);
		}
	});
}
module.exports = router;