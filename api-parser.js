const fs = require("fs")
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;

// Sample player
// {
//     "player": {
//       "id": 1868,
//       "firstname": "De'Andre",
//       "lastname": "Hunter"
//     },
//     "team": {
//       "id": 1,
//       "name": "Atlanta Hawks",
//       "nickname": "Hawks",
//       "code": "ATL",
//       "logo": "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png"
//     },
//     "game": {
//       "id": 8133
//     },
//     "points": 18,
//     "pos": "SF",
//     "min": "26:07",
//     "fgm": 5,
//     "fga": 10,
//     "fgp": "50.0",
//     "ftm": 6,
//     "fta": 8,
//     "ftp": "75.0",
//     "tpm": 2,
//     "tpa": 5,
//     "tpp": "40.0",
//     "offReb": 1,
//     "defReb": 2,
//     "totReb": 3,
//     "assists": 0,
//     "pFouls": 3,
//     "steals": 0,
//     "turnovers": 1,
//     "blocks": 1,
//     "plusMinus": "-9",
//     "comment": null
//   }

// player = {id: {
//     id: 1068,
//     firstname: John,
//     lastname: Wall,
//     gamesplayed: 100,
//     team: {
//         name: was...,
//         .
//         .
//         .
//     }
//     stats = {}
// };

let player_api_data = JSON.parse(fs.readFileSync("player_api_data.json"));
let game_api_data = JSON.parse(fs.readFileSync("game_api_data.json"));


// let player_api_data = JSON.parse(fs.readFileSync("hawks2019.json"));
// let game_api_data = JSON.parse(fs.readFileSync("gamesHawks2019.json"));

let players = {};

// add year property to player json instead of in a separate array

for (game of player_api_data.response) {
  if(game.min == null || game.min == "0:00") continue; // if player DNP'd, skip 


  let game_api = game_api_data.response.find((x) => (x.id == game.game.id))    // find the specific game in question within the API response
  if(game_api == undefined) continue;
  let season = "" + game_api.season; // store season in a variable (season is the year)

  if(!(players.hasOwnProperty(game.player.id) && players[game.player.id].year == season )) { // if player with same id and season played does not exist....
    players[game.player.id] = {
      id: game.player.id,
      firstname: game.player.firstname,
      lastname: game.player.lastname,
      year: season,
      gamesplayed: 0,
      team: game.team,
      pos: game.pos
    };
    players[game.player.id].stats = {
      points: game.points,
      fgm: game.fgm,
      fga: game.fga,
      fgp: Number(game.fgp),
      ftm: game.ftm,
      fta: game.fta,
      ftp: Number(game.ftp),
      tpm: game.tpm,
      tpa: game.tpa,
      tpp: Number(game.tpp),
      offReb: game.offReb,
      defReb: game.defReb,
      totReb: game.totReb,
      assists: game.assists,
      pFouls: game.pFouls,
      steals: game.steals,
      turnovers: game.turnovers,
      blocks: game.blocks,
      plusMinus: Number(game.plusMinus)
    };
    ++players[game.player.id].gamesplayed;
  } else {
    ++players[game.player.id].gamesplayed;
    
    // Update averages with formula (prevPoints * (gameplayed -1) + newPoints) / gamesplayed
    let player = players[game.player.id];
    let stats = {
      points: (player.stats.points * (player.gamesplayed-1) + game.points) / player.gamesplayed,
      fgm: (player.stats.fgm * (player.gamesplayed-1) + game.fgm) / player.gamesplayed,
      fga: (player.stats.fga * (player.gamesplayed-1) + game.fga) / player.gamesplayed,
      fgp: (player.stats.fgp * (player.gamesplayed-1) + Number(game.fgp)) / player.gamesplayed,
      ftm: (player.stats.ftm * (player.gamesplayed-1) + game.ftm) / player.gamesplayed,
      fta: (player.stats.fta * (player.gamesplayed-1) + game.fta) / player.gamesplayed,
      ftp: (player.stats.ftp * (player.gamesplayed-1) + Number(game.ftp)) / player.gamesplayed,
      tpm: (player.stats.tpm * (player.gamesplayed-1) + game.tpm) / player.gamesplayed,
      tpa: (player.stats.tpa * (player.gamesplayed-1) + game.tpa) / player.gamesplayed,
      tpp: (player.stats.tpp * (player.gamesplayed-1) + Number(game.tpp)) / player.gamesplayed,
      offReb: (player.stats.offReb * (player.gamesplayed-1) + game.offReb) / player.gamesplayed,
      defReb: (player.stats.defReb * (player.gamesplayed-1) + game.defReb) / player.gamesplayed,
      totReb: (player.stats.totReb * (player.gamesplayed-1) + game.totReb) / player.gamesplayed,
      assists: (player.stats.assists * (player.gamesplayed-1) + game.assists) / player.gamesplayed,
      pFouls: (player.stats.pFouls * (player.gamesplayed-1) + game.pFouls) / player.gamesplayed,
      steals: (player.stats.steals * (player.gamesplayed-1) + game.steals) / player.gamesplayed,
      turnovers: (player.stats.turnovers * (player.gamesplayed-1) + game.turnovers) / player.gamesplayed,
      blocks: (player.stats.blocks * (player.gamesplayed-1) + game.blocks) / player.gamesplayed,
      plusMinus: (player.stats.plusMinus * (player.gamesplayed-1) + Number(game.plusMinus)) / player.gamesplayed
    };
    players[game.player.id].stats = stats;  
  }
}

console.log(players);

// parsing team stats
let team_input = JSON.parse(fs.readFileSync("celtics2019.json"));
console.log(team_input);
console.log(team_input.parameters.id);

let team = {};

//identify team name based on team id in the Rapid API database
// for example, an end point with team id 2 is the Boston Celtics
if(team_input.parameters.id == 1){
  team[team_input.parameters.id].teamId = 1;
  team[team_input.parameters.id].teamName = "Atlanta Hawks"; 
}

else if(team_input.parameters.id == 2){
  team[team_input.parameters.id].teamId = 2;
  team[team_input.parameters.id].teamName = "Boston Celtics"; 
}

else if(team_input.parameters.id == 4){
  team[team_input.parameters.id].teamId = 4;
  team[team_input.parameters.id].teamName = "Brooklyn Nets";
}

else if(team_input.parameters.id == 5){
  team[team_input.parameters.id].teamId = 5;
  team[team_input.parameters.id].teamName = "Charlotte Hornets";
}

else if(team_input.parameters.id == 6){
  team[team_input.parameters.id].teamId = 6;
  team[team_input.parameters.id].teamName = "Chicago Bulls";
}

else if(team_input.parameters.id == 7){
  team_input[team_input.parameters.id].teamId = 7;
  team_input[team_input.parameters.id].teamName = "Cleveland Cavaliers";
}

MongoClient.connect("mongodb+srv://adminUser:123@cluster0.tililof.mongodb.net/test", { useNewUrlParser: true }, function(err, client) {
  if (err) throw err;
  let db = client.db("nba_info");
  // Clear player_data collection
  // db.dropDatabase("player_data", function(err, delOK) {
  //   // if (err) throw err;
  //   if (delOK) console.log("Collection deleted");

    // Insert player_data
    db.collection("player_data").insertMany(Object.values(players), function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      process.exit();
    });
  // });

});
