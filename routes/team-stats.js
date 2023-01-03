const express = require('express');

let router = express.Router()
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.render('team-stats');
});

router.get("/player", getPlayer);

// Get player from database based on query with firstname, lastname, team, and year 
async function getPlayer(req, res) {
    // try{
    //     const searchResult = await db.collection("users").findOne({username: req.body.username, password:req.body.password});
    //     if(searchResult == null){ // no such user exists
    //         res.status(200).render("./pages/error",{message: "Account does not exist!"});
    //         //res.send("Account does not exist!");
    //     }
    //     else{
    //         // update session attributes to match the attributes of user found in database

    //         res.redirect('/user/home')
    //         res.status(200).send();
          
    //     }
    // }
    // catch(err){
    //     res.status(500).json({ error: "Error logging in."});
    // }

    let query = {};

	if(req.query.team){
        query.team = {name: req.query.team};
	}

	if(req.query.year){
		query.year = req.query.year;
	}

	if(req.query.firstname){
		query.firstname = {"$regex":req.query.firstname,"$options":"i"}
	}

	if(req.query.lastname){
		query.lastname = {"$regex":req.query.lastname,"$options":"i"};
	}

	req.local.db.collection("player_data").find(query).toArray(function(err, searchResult){
		if(err){
			console.log("Server Error");
            res.sendStatus(503);
		}

		if(!searchResult.length){
			console.log("No Match!")
			console.log(searchResult);
			res.status(404)
			res.send("No match!");
			return;
		}
		else{
			console.log(searchResult);
			res.status(200);
			res.send(searchResult);
		}

	});




}






module.exports = router;