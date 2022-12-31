const data = null;
var XMLHttpRequest = require('xhr2');
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open("GET", "https://api-nba-v1.p.rapidapi.com/players/statistics?id=236&season=2020");
xhr.setRequestHeader("X-RapidAPI-Key", "b356bda966msh2b90a52aa160c7bp1d273bjsnbc426c602ac7");
xhr.setRequestHeader("X-RapidAPI-Host", "api-nba-v1.p.rapidapi.com");

xhr.send(data);