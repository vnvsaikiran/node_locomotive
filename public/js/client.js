var app = app || {}; // Name space

// Module creation. 
app.module  = {
	data:null,
	panels:[],
	airlines:[],
	tabIndex:0,
	formData:{
		fromLocation:'',
		toLoatoin :'',
		date: ''
	},
	init:function(){
		$('#filightSearch').click(function(){
			app.module.formData.date = $('#dateTravel').val();
			app.module.getTabpnels($('#dateTravel').val());	
			if(app.module.panels.length > 3) app.module.addLoader(2);	
			else app.module.addLoader(0);
			app.module.getSearchData(app.module.getSearchDataCallback);
		}); // Binding click event 
		// Adding date picker. 
		$( "#dateTravel" ).datepicker({
			dateFormat: "yy-mm-dd",
			minDate:0
		}).datepicker("setDate", "1");		
	},
	getSearchData :function(callback){		// Preparing Ajax Request. 
		// Collecting from data
		app.module.formData = {
			fromLocation:$('#fromLocation').val().toUpperCase(),
			toLoatoin :$('#toLocation').val().toUpperCase(),
			date: app.module.formData.date
		}		
		// Check from validation
		if(app.module.validateForm(app.module.formData) ) { 
			//Preparing Request. 
			var URL  = '/search?fromLocation='+ app.module.formData.fromLocation.substr(0,3) +'&toLocation='+ app.module.formData.toLoatoin.substr(0, 3) +'&dateofTravel=' + app.module.formData.date;	
			// Triggering Ajax Calll
			$.ajax({ 
			  url: URL,
			  method:'GET'
			}).done(callback)
			.fail(app.module.errorCallBack)				
		}
	},	
	validateForm:function(formData){
		// Checking validations		
		if(formData.fromLocation == '' || formData.toLoatoin == ''  || formData.data  == '' || !isNaN(formData.fromLocation) || !isNaN(formData.toLoatoin) ){
			alert('Please enter valid From / To location');
			return false; 
		}else if(formData.fromLocation.length < 3 || formData.toLoatoin.length < 3) {
			alert('Please eneter atleast 3 charactres frot Form / To locatoins');
			return false; 
		}	
		return true;
	},
	getTabpnels:function(date){
		//5 days array to pass moment js function
		var nums = [-2, -1, 0, 1, 2];	
		var dt = moment(app.module.formData.date);
		var today = moment();	
		var difference = dt.diff(today, 'day');
		nums = nums.map(function(num){	  
			if(difference == 0){
				return    (num >= 0) ? num:undefined;
			} else if(difference == 1){
				return (num != -2) ? num:undefined;
			} else if(difference >= 2){
			  return num;
			}     
		});
		nums = nums.filter(function(n){ return n != undefined });
		app.module.panels = [] // clearing array
		$.each(nums, function(index, value){			
				app.module.panels.push( moment(date).add(value, 'days').format('YYYY-MM-DD')); 
		})
		console.log(app.module.panels);
		app.module.tabView(app.module.panels,  'resultsContainer');	
		app.module.openTab();	
	},
	getSearchDataCallback:function(data){	// Collecting Data form service. 
		app.module.data = data;	
		details  = [];	
		$.each(app.module.data , function(key, values){	
			$.each(values, function(index, value){
				$.each(value, function(i, item){
					details.push(item);					
				})				
			})
		})
		app.module.filrtSearchResultDetails(details, app.module.tabIndex)
	},
	errorCallBack:function(data){ // Error call back
		if(data != null) document.getElementById('resultsContainer').innerHTML  = 'No Results found.  Please try with another date.';
	},
	filrtSearchResultDetails:function(details, index){ 
		// Preparing searzch results markup. 
		var template  = [];			
		if(details.length >  0){
			template.push('<div class="panelHeader"><strong>'+ details[0].start.cityName +' to ' + details[0].finish.cityName+'</strong><br>' + moment(details[0].start.dateTime).format('LL') + '</div>',
			'<ul class="resultsHeader"><li>Flight Information</li>', '<li>Depature Time   </li>', '<li>Arrival Time </li>', '<li>Price </li>', '</ul>');
			$.each(details, function(index, flight){	
				// Checking start > current time
				if( moment(flight.start.dateTime) > new Date().getTime()){
					template.push('<ul class="results"><li> <strong>'+ flight.plane.fullName +'</strong><br><span> Strat From: '+ flight.start.airportName +'('+ flight.start.airportCode+')</span> <br> <strong>Alirlines: </strong>'+ flight.airline.name +'('+ flight.airline.code +') </li>',
					'<li>  '+ moment(flight.start.dateTime).format('hh:mm A') + '</li>',
					'<li> ' +  moment(flight.finish.dateTime).format('hh:mm A') +'</li>',
					'<li> '+ flight.price +'</li>',
					'</ul>');
				}
			})
		}else {
			// displaying error if records are not found.
			template.push('No. Results found for this date.');
		}
		$('#tab_view_' + index).html(template.join(""));
	},
	tabView:function(details, e){ 
		// Creating tab views.
		var container  = document.createElement('div');
		container.className  = 'tab-view-container'
		var tabContainer = document.createElement('ul');
		tabContainer.className  = 'tab'
		var tabViews  = document.createElement('div');		
		$.each(app.module.panels, function(index, value){
			tab = document.createElement('li');
			tab.id="tab_"+ index;					
			a = document.createElement('a');
			a.href = 'JavaScript:void(0)';
			a.className="tablinks";	
			a.innerHTML  = value
			tab.appendChild(a);
			tabContainer.appendChild(tab);
			tabView  = document.createElement('div');
			tabView.id  =  'tab_view_'+ index;
			tabView.className = 'tabcontent';			
			tabViews.appendChild(tabView);			
		})
		container.appendChild(tabContainer);
		container.appendChild(tabViews);
		document.getElementById(e).innerHTML  = '';
		document.getElementById(e).appendChild(container);
	},
	addLoader:function(index){
		$('#tab_view_'+ index).html("<div style='display:block;text-align:center; display:block; padding:20px 0; '>Loading ....</div>");
	},
	openTab: function() { // binding events.
		var i, tabcontent, tablinks;
		
		if(app.module.panels.length > 3){
			$('#tab_2 .tablinks').addClass('active')
			$('#tab_view_2 ').show();
			app.module.tabIndex =2;
		}
		else{
			$('.tablinks:first').addClass('active')
			$('.tabcontent:first').show();
			app.module.tabIndex =0;
		}
	
		$('.tab').find('li a').on('click', function(){
			$('.tablinks').removeClass('active')
			$('.tabcontent').hide();
			$(this).addClass('active');
			$('#tab_view_'+ $(this).parent().index()).show();
			
			app.module.tabIndex = $(this).parent().index();
			app.module.formData.date = app.module.panels[$(this).parent().index()];
			app.module.addLoader($(this).parent().index());
			app.module.getSearchData(app.module.getSearchDataCallback);	
		})
	}
}

$(document).ready(app.module.init)