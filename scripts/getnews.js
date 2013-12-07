
var cnt = 0
var NewsItemArray = [];
var NewsItemContainer = {
    hash: [],
    keys: [],
    length: 0,
    get: function(key){
    	return this.hash[key];
    },
    put: function(key, value){
    	this.hash[key] = value;
    	this.keys.push(key);
    	this.length++;
    }
}
var ProgramItemContainer = {
    hash: [],
    keys: [],
    length: 0,
    get: function(key){
    	return this.hash[key];
    },
    put: function(key, value){
    	this.hash[key] = value;
    	this.keys.push(key);
    	this.length++;
    }
}


function getNews(){
	$.ajax({
		type: "GET",
		url: "http://www.cinequest.org/news.php",
	//	url: "news.php",
		dataType: "xml",
		success: function(xml){
			$(xml).find('News').each(function(){
				var newsitem = new Object();
				newsitem.name = $(this).find('Name')[0].textContent;
				newsitem.shortdesc = $(this).find('ShortDescription')[0].textContent;
				newsitem.image = $(this).find('EventImage')[0].textContent;
			//	newsitem.thumb = $(this).find('ThumbImage')[0].textContent;
				newsitem.infolink = $(this).find('InfoLink')[0].textContent;
				NewsItemArray.push(newsitem);
			})
			populateNewstList(NewsItemArray);
		}
	});
}

function getItem() {
	$.ajaxSetup ({
    	cache: true
	});

    $.ajax({
        type: "GET",
        url: "http://payments.cinequest.org/websales/feed.ashx?guid=70d8e056-fa45-4221-9cc7-b6dc88f62c98&showslist=true&",   
    //    url: "newcinequest.xml",
        dataType: "xml",
        success: function(xml) {
        	
            $(xml).find('Show').each(function(){
				var pi = new Object();
				pi.properties = [];
				pi.schedules = [];
				pi.shortID = [];
				pi.children = [];
				pi.cast = '';
				pi.director = '';
				pi.genre = '';
				pi.producer = '';
				pi.writer = '';
				pi.editor = '';
				pi.cinematographer = '';
				pi.country = '';
				pi.languages = '';
				pi.eventtype = 'Film';
				pi.films = [];
                pi.id = $(this).find('ID')[0].textContent;
				pi.name = $(this).find('Name')[0].textContent;
				pi.dura = $(this).find('Duration')[0].textContent;
				pi.descript = $(this).find('ShortDescription')[0].textContent;
				pi.imgLink = $(this).find('EventImage').text();
				pi.infoLink = $(this).find('InfoLink').text();
				$customProperties = $(this).find('CustomProperties').find('CustomProperty');
				$customProperties.each(function(){
					var key = $(this).find('Name').text();
					var value = $(this).find('Value').text();
					if(key == 'Cast') pi.cast += value + ', ';
					if(key == 'Director') pi.director += value + ', ';
					if(key == 'Editor') pi.editor += value + ', ';
					if(key == 'Cinematographer') pi.cinematographer += value + ', ';
					if(key == 'Screenwriter') pi.writer += value + ', ';
					if(key == 'Genre') pi.genre += value + ', ';
					if(key == 'Producer') pi.producer += value + ', ';
					if(key == 'Country') pi.country += value + ', ';
					if(key == 'Language') pi.languages += value + ', '; 
					if(key == 'EventType') pi.eventtype = value;
					if(key == 'ShortID') pi.shortID.push(value); 
				});
				$currentShowings = $(this).find('CurrentShowings').find('Showing');
				$currentShowings.each(function(){
					var show = new Object();
					show.id = $(this).find('ID').text();
					show.startD = $(this).find('StartDate').text();
					show.endD = $(this).find('EndDate').text();
					show.duration = $(this).find('Duration').text();
					$venue = $(this).find('Venue');
					show.venue = new Object();
					show.venue.id = $venue.find('VenueID').text();
					show.venue.name = $venue.find('VenueName').text().replace(/[^A-Z0-9]/g, '');
					show.venue.address = $venue.find('VenueAddress1').text();
					pi.schedules.push(show);
				});
				ProgramItemContainer.put(pi.id,pi);
				
            });
			
			//at this point, the XML file has finished reading, begin manipulation here
		
			
        }   
    }); 
}




function populateNewstList(NewsItemArray){
	$('#news').empty()
	$.each(NewsItemArray,function(){
		var item = $('<li/>');
		if(IsNumeric(this.infolink)){
			var link = $('<a/>').append('<img src="'+this.image+'"/><h2>'+this.name+'</h2><p>'+this.shortdesc+'</p>');
			link.click(createLinkHandler(moveToNewsDetails,this.infolink));
		}
		else	
			var link = $('<a href="'+this.infolink+'"/>').append('<img src="'+this.image+'"/><h2>'+this.name+'</h2><p>'+this.shortdesc+'</p>');
	//	link.click(createLinkHandler(moveToEventDetails,this));
		item.append(link)
		$('#news').append(item);
	})
	$('#news').listview('refresh');
}

function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
}

function createLinkHandler(f,i){
	return function(){f(i);};
}

function moveToNewsDetails(ItemID){
	var item = ProgramItemContainer.get(ItemID)
	$.mobile.changePage('#newsdetailspage');
	$('#news-sched').empty();
	$('#news-details').append($('<p>' + getInfo(item) + '</p>'));	
}

function getInfo(fi){
	var info = '<img src="'+ fi.imgLink +'"/> <br>';
	info += "<b>Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
	info += '<a href="' + fi.infoLink + '">more info...</a><br>'
	return info;
}

function goBack() {
    history.go(-1);
}
$(getNews);
$(getItem);
