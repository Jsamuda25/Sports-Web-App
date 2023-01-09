const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://api-nba-v1.p.rapidapi.com/teams/statistics',
  params: {id: '1', season: '2020'},
  headers: {
    'X-RapidAPI-Key': '05744aca0dmsh91521284061309cp186579jsnb6610dd6bc0b',
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});