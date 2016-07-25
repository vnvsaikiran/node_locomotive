var express = require('express');
var router = express.Router();
var _ = require('lodash');
var request = require('request');
var moment = require('moment');
var async = require('async');
var apiUrl = 'http://node.locomote.com/code-task/';

// define the airports route
router.route('/airports')
	.get(function(req, res) {
	  var queryParam = req.query.q;
	  request(apiUrl+'/airports?q='+queryParam, function(err, result){  
         if(err){
		   next(err);
         } else {		 
		   res.render('airports',{ aports : JSON.parse(result.body) });
         }		   
	});
});


// define the airlines route
router.route('/airlines')
.get(function(req, res) {
  request(apiUrl+'/airlines', function(err, result){ 
    var acodes = JSON.parse(result.body);
	var alresult=[];
	for (var i = 0, len = acodes.length; i < len; ++i) {
      alresult[i] = acodes[i].code;
    }	
	res.json(alresult);
  });  
});


// define the airlines route
router.route('/search')
.get(function(req, res) {
   //Getting url parameters
	var fm = req.query.fromLocation;
	var toVal = req.query.toLocation;
	var dt = moment(req.query.dateofTravel).format('YYYY-MM-DD');
	var alresult=[];
	
	//Url static values and variables
    var staticUrl1 = apiUrl+'flight_search/';
	var staticUrl2 = '?from='+fm+'&to='+toVal+'&date=';	
	var urls = [];	
	
	// Request to airlines api to get airline codes	
	request(apiUrl+'/airlines', function(err, result){ 
         if(err) { 		 
		    next(err);
		  } 
		  else { 
			var acodes = JSON.parse(result.body);		
			//form urls for all valid dates and airline codes		
				for (var i = 0, len = acodes.length; i < len; ++i) {
				  alresult[i] = acodes[i].code;		 
				  urls.push(staticUrl1+alresult[i]+staticUrl2+dt);
				}          
						
			// pass all urls data to call back function(getApiInfo) to get data
			async.map(urls, getApiInfo, function (err, result) {	
			  if(!err) { 		
                 //var finalResult = _.groupBy(result, function(b) { return Object.keys(b)});			  
				res.send(result)
			  } 
			  else { next(err)};	  			  
			});
	   };	
	}); // end of airlines api request
	
	//call back function to api
	function getApiInfo(url, callback) {	            
	  request(url, function(err, result){     
		  if(result.body.search('invalid') != -1){
			 next(err);
		  } else {			
              var r = '{"'+dt+'":'+result.body+'}';		  
				callback(null,  JSON.parse(r));
		  }
	  });			 
	}	
	
});
module.exports = router;