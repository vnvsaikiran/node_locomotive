String.prototype.format = function(obj) {
	return this.replace(/%{(\w+)}/g, function(_,m) {
		return obj[m];
	});
};
$.extend({
	templates: {
		resultRow: '<li data-id="%{id}"><span>%{team1Name} %{team1Score}</span> - <span>%{team2Score} %{team2Name}</span></li>\n',
		noResults: '<li>No Results<li>'
	},
	getGameResults: function(games){
		var GAMES = [];
		for(var g=0; g<games.length; g++){
			$.ajax({
				url: games[g].url,
				data: "",
				dataType: "JSON",
				method: "GET",
				success: function(data){
					GAMES.push(data);
				},
				error: function(){
					console.log("ERROR: GETTING GAME-" +g+ " RESULTS");
				},
				complete: function(jqXHR, data){
					if(GAMES.length == games.length){
						$.parseResults(GAMES);
					}
				}
			});
		}
	},
	parseResults: function(data){
		var results = [];
		if(data && data.length>0){
			for(var i=0; i<data.length; i++){
				results.push($.templates.resultRow.format({id: data[i].id, team1Name: data[i].teams[0].name, team1Score: data[i].teams[0].score, team2Name: data[i].teams[1].name, team2Score: data[i].teams[1].score}));
			}
		}else{
			results.push($.templates.noResults);
		}		
		$("#games-results").html(results.join(""));
	}
});
$(document).ready(function(){
	$.ajax({
		url: "json/games.json",
		data: "",
		dataType: "JSON",
		method: "GET",
		success: function(data){
			$.getGameResults(data.games);
		},
		error: function(){
			console.log("ERROR: GETTING GAMES DATA");
		}
	});
});