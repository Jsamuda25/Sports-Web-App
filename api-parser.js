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

let player_stats_api_data = JSON.parse(fs.readFileSync("player_stats_api_data.json"));
let game_api_data = JSON.parse(fs.readFileSync("game_api_data.json"));

let players = {};

// add year property to player json instead of in a separate array

for (game of player_stats_api_data.response) {
  if(game.min == null || game.min == "0:00") continue; // if player DNP'd, skip 


  let game_api = game_api_data.response.find((x) => (x.id == game.game.id))    // find the specific game in question within the API response
  if(game_api == undefined) continue;
  let season = "" + game_api.season; // store season in a variable (season is the year)

  if(!(players.hasOwnProperty(game.player.id) && players[game.player.id].year == season )) {
    // if player with same id and season played does not exist....
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

// parsing team stats
let team_input = JSON.parse(fs.readFileSync("bucks2019.json"));

let team={};


//identify team name based on team id in the Rapid API database
// for example, an end point with team id 2 is the Boston Celtics
if(team_input.parameters.id == 1){
  team.teamId = 1;
  team.teamName = "Atlanta Hawks"; 
}

else if(team_input.parameters.id == 2){
  team.teamId = 2;
  team.teamName = "Boston Celtics"; 
}

else if(team_input.parameters.id == 4){
  team.teamId = 4;
  team.teamName = "Brooklyn Nets";
}

else if(team_input.parameters.id == 5){
  team.teamId = 5;
  teamteamName = "Charlotte Hornets";
}

else if(team_input.parameters.id == 6){
  team.teamId = 6;
  team.teamName = "Chicago Bulls";
}

else if(team_input.parameters.id == 7){
  team_input.teamId = 7;
  team_input.teamName = "Cleveland Cavaliers";
}

else if(team_input.parameters.id == 10){
  team.teamId = 10;
  team.teamName = "Detroit Pistons";
}

else if(team_input.parameters.id == 15){
  team.teamId = 15;
  team.teamName = "Indiana Pacers";
}

else if(team_input.parameters.id == 20){
  team.teamId = 20;
  team.teamName = "Miami Heat";
}

else if(team_input.parameters.id == 21){
  team.teamId = 21;
  team.teamName = "Milwaukee Bucks";
}

else if(team_input.parameters.id == 24){
  team.teamId = 24;
  team.teamName = "New York Knicks";
}

else if(team_input.parameters.id == 26){
  team.teamId = 26;
  team.teamName = "Orlando Magic";
}

else if(team_input.parameters.id == 27){
  team.teamId = 27;
  team.teamName = "Philadelphia 76ers";
}

else if(team_input.parameters.id == 38){
  team.teamId = 38;
  team.teamName = "Toronto Raptors";
}

else if(team_input.parameters.id == 41){
  team.teamId = 41;
  team.teamName = "Washington Wizards";
}

else if(team_input.parameters.id == 8){
  team.teamId = 8;
  team.teamName = "Dallas Mavericks";
}

else if(team_input.parameters.id == 9){
  team.teamId = 9;
  team.teamName = "Denver Nuggets";
}

else if(team_input.parameters.id == 11){
  team.teamId = 11;
  team.teamName = "Golden State Warriors";
}

else if(team_input.parameters.id == 14){
  team.teamId = 14;
  team.teamName = "Houston Rockets";
}

else if(team_input.parameters.id == 16){
  team.teamId = 16;
  team.teamName = "LA Clippers";
}

else if(team_input.parameters.id == 17){
  team.teamId = 17;
  team.teamName = "LA Lakers";
}

else if(team_input.parameters.id == 19){
  team.teamId = 19;
  team.teamName = "Memphis Grizzlies";
}

else if(team_input.parameters.id == 22){
  team.teamId = 22;
  team.teamName = "Minnesota Timberwolves";
}

else if(team_input.parameters.id == 23){
  team.teamId = 23;
  team.teamName = "New Orleans Pelicans";
}

else if(team_input.parameters.id == 25){
  team.teamId = 25;
  team.teamName = "Oklahoma City Thunder";
}
else if(team_input.parameters.id == 28){
  team.teamId = 28;
  team.teamName = "Phoenix Suns";
}

else if(team_input.parameters.id == 29){
  team.teamId = 29;
  team.teamName = "Portland Trail Blazers";
}

else if(team_input.parameters.id == 30){
  team.teamId = 30;
  team.teamName = "Sacramento Kings";
}

else if(team_input.parameters.id == 31){
  team.teamId = 31;
  teamteamName = "San Antonio Spurs";
}

else if(team_input.parameters.id == 102){
  team.teamId = 102;
  team.teamName = "Utah Jazz";
}

else{
  
}




// parsing team stats

//team.totals = team_input.games;
console.log(team_input.parameters.id);
// console.log(team_input.response.games);
team.season = team_input.parameters.season;
let teamTotals = {
  totalGames: team_input.response.games,
  fastBreakPoints:team_input.response.fastBreakPoints,
  pointsInPaint: team_input.response.pointsInPaint,
  secondChancePoints: team_input.response.secondChancePoints,
  pointsOffTurnovers: team_input.response.pointsOffTurnovers,
  biggestLead: team_input.response.biggestLead,
  points: team_input.response.points,
  fgm: team_input.response.fgm,
  fga: team_input.response.fga,
  fgp: team_input.response.fgp,
  fta: team_input.response.fta,
  ftp: team_input.response.ftp,
  ftm: team_input.response.ftm,
  tpm: team_input.response.tpm,
  tpa: team_input.response.tpa,
  tpp: team_input.response.tpp,
  offReb: team_input.response.offReb,
  defReb: team_input.response.defReb,
  totReb: team_input.response.totReb,
  assists: team_input.response.assists,
  pFouls: team_input.response.pFouls,
  steals: team_input.response.steals,
  turnovers: team_input.response.turnovers,
  blocks: team_input.response.blocks,
  plusMinus: team_input.response.plusMinus,
}

let teamAverages = {
  avgGames: (team_input.response.games)/ (team_input.response.games).toFixed(2),
  avgFastBreakPoints: (team_input.response.fastBreakPoints)/ (team_input.response.games),
  avgPointsInPaint: (team_input.response.pointsInPaint)/ (team_input.response.games),
  avgSecondChancePoints: (team_input.response.secondChancePoints)/ (team_input.response.games),
  avgPointsOffTurnovers: (team_input.response.pointsOffTurnovers)/ (team_input.response.games),
  avgPoints: (team_input.response.points)/ (team_input.response.games),
  avgFgm: (team_input.response.fgm)/ (team_input.response.games),
  avgFga: (team_input.response.fga)/ (team_input.response.games),
  avgFgp: (team_input.response.fgp)/ (team_input.response.games),
  avgFta: (team_input.response.fta)/ (team_input.response.games),
  avgFtm: (team_input.response.ftm)/ (team_input.response.games),
  avgFtp: (team_input.response.ftp)/ (team_input.response.games),
  avgTpm: (team_input.response.tpm)/ (team_input.response.games),
  avgTpa: (team_input.response.tpa)/ (team_input.response.games),
  avgTpp: (team_input.response.tpp)/ (team_input.response.games),
  avgOffReb: (team_input.response.offReb)/ (team_input.response.games),
  avgDefReb: (team_input.response.defReb)/ (team_input.response.games),
  avgTotReb: (team_input.response.totReb)/ (team_input.response.games),
  avgAssists: (team_input.response.assists)/ (team_input.response.games),
  avgPFouls: (team_input.response.pFouls)/ (team_input.response.games),
  avgSteals: (team_input.response.steals)/ (team_input.response.games),
  avgTurnovers: (team_input.response.turnovers)/ (team_input.response.games),
  avgBlocks: (team_input.response.blocks)/ (team_input.response.games),
  avgPlusMinus: (team_input.response.plusMinus)/ (team_input.response.games),
}

team.statTotals= teamTotals;
team.perGameAverages = teamAverages;


MongoClient.connect("mongodb+srv://adminUser:123@cluster0.tililof.mongodb.net/test", { useNewUrlParser: true }, function(err, client) {
  if (err) throw err;
  let db = client.db("nba_info");
  // Clear player_data collection
  db.dropDatabase("player_data", function(err, delOK) {
    // if (err) throw err;
    if (delOK) console.log("Collection deleted");
    
    db.collection("player_data").insertMany(Object.values(players), function(err, res) {
      
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
  
      // Insert team_data
      db.collection("team_data").insertOne(team, function(err, res) {
        if (err) throw err;
      });
  
      process.exit();
    });
  });
  // Insert player_data
});
