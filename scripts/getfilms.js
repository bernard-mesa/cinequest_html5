
var cnt = 0
var ProgramItemArray = [];
var DateItemArray = [];
var FilmArray = [];
if(AllSchedules==null){
var AllSchedules = {
    hash: [],
    keys: [],
    length: 0,
    checked: 0,
    get: function(key){
    	return this.hash[key];
    },
    put: function(key, value){
    	this.hash[key] = value;
    	this.keys.push(key);
    	this.length++;
    }
}}
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

if(VenueArray==null){
var VenueArray = {
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
$(getVenue);
}
function getVenue(){
	$.ajax({
		type: "GET",
		url: "http://www.cinequest.org/venuelist.php",
	//	url: "venuelist.php",
		dataType: "xml",
		success: function(xml){
			$(xml).find('Venue').each(function(){
				var venid = $(this).find('ID');
				venid = (venid.length>0) ? venid[0].textContent : '';
				var venlocationlink = $(this).find('location');
				venlocationlink = (venlocationlink.length>0) ? venlocationlink[0].textContent : '';
				if(venid!='')
				VenueArray.put(venid,venlocationlink);
			})
		}
	});
}

function getFilm() {
    $.ajax({
        type: "GET",
        url: "http://payments.cinequest.org/websales/feed.ashx?guid=70d8e056-fa45-4221-9cc7-b6dc88f62c98&showslist=true&",
    //	url: "newcinequest.xml",
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

				$.each(pi.schedules,function(){
						var dt = new Object();
						dt.isChosen = false;
						dt.dates = this.startD;
						dt.ends = this.endD;
						dt.pi = pi;
						dt.ven_id = this.venue.id;
						dt.id = this.id;
						dt.info = $.format.date(this.startD, 'ddd, MMMM d') + ' ('+ $.format.date(this.startD, 'hh:mm a') + ' - '+$.format.date(this.endD, 'hh:mm a')+') --- '+ this.venue.name+': "'+ pi.name+'"';
						
						AllSchedules.put(this.id,dt);
				})
				
				if(pi.eventtype == "Film"){
					$.each(pi.schedules,function(){
								var dt = new Object();
								dt.dates = this.startD;
								dt.ends = this.endD;
								dt.pi = pi;
								DateItemArray.push(dt);
							})
					ProgramItemContainer.put(pi.id,pi);
				}
            });
			
			//at this point, the XML file has finished reading, begin manipulation here
		
			$.each(ProgramItemContainer.keys,function(){
				var curkey = this;
			//	ProgramItemContainer.get(curkey).children.push(ProgramItemContainer.get(this));
				
				$.each(ProgramItemContainer.get(curkey).shortID, function(){
					ProgramItemContainer.get(this).schedules = ProgramItemContainer.get(curkey).schedules
					ProgramItemContainer.get(curkey).children.push(ProgramItemContainer.get(this));
				})
				ProgramItemArray.push(ProgramItemContainer.get(curkey));

			});
			
		//	populateFilmListByName(ProgramItemArray);
			populateFilmListByDate(DateItemArray);
        }   
    }); 
}




function populateFilmListByName(ProgramItemArray){
	ProgramItemArray.sort(compareByName);
	$('#films').empty()
	$.each(ProgramItemArray,function(){
		var item = $('<li title="'+this.name+'"/>');
		var link = $('<a/>').html(this.name);
		link.click(createLinkHandler(moveToFilmDetails,this));
		item.append(link)
		$('#films').append(item);
	})
	$('#films').listview({
            autodividersSelector: function (li) {
                var out = li.attr('title').charAt(0);
                return out;
            }
        }).listview('refresh');
}

function populateFilmListByDate(DateItemArray){
	DateItemArray.sort(compareByDate);
	$('#films').empty()
	$.each(DateItemArray,function(){
		var curDate = $.format.date(this.dates, 'ddd, MMMM d')
		prevDate = curDate; 
		var toDisplay = '('+ $.format.date(this.dates, 'hh:mm a') +'-'+ $.format.date(this.ends, 'hh:mm a') + ')   ' + this.pi.name;
		var item = $('<li title="'+curDate+'"/>');
		var link = $('<a/>').html(toDisplay);
		link.click(createLinkHandler(moveToFilmDetails,this.pi));
		item.append(link)
		$('#films').append(item);
	})
	$('#films').listview({
            autodividersSelector: function (li) {
                var out = li.attr('title');
                return out;
            }
        }).listview('refresh');
}


function createLinkHandler(f,i){
	return function(){f(i);};
}


function moveToFilmDetails(ProgramItem){
	$.mobile.changePage('#detailspage');
	$('#film-items').empty();
	$('#film-sched').empty();
	$('#film-details').html('');

	getSchedule(ProgramItem)
	$('#film-items').append($('<p>' + getFilmInfo(ProgramItem) + '</p>'))

	$('#film-items').append($('<br><p>Include</p>'))
	$.each(ProgramItem.children,function(){
		var item = $('<div data-role="collapsible" data-theme="b" data-content-theme="d"/>')
		item.append($('<h4>'+this.name+'</h4>'))
		item.append($('<p>' + getFilmInfo(this) + '</p>'))
		$('#film-items').append(item);

		$('#film-items').find('div[data-role=collapsible]').collapsible();  
	})
}

function displaySelectedFilmInfo(fi){
	$('#film-details').html(getFilmInfo(fi));
}

function compareByName(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function compareByDate(a,b){
	if(getDateVal(a) < getDateVal(b))
		return -1;
	else if(getDateVal(a) > getDateVal(b))
		return 1;
	else{
		if(getTimeVal(a) < getTimeVal(b))
			return -1;
		else if (getTimeVal(a) > getTimeVal(b))
			return 1;
		else return 0;
	}
}

function getDateVal(dateitem){
	return parseInt(dateitem.dates.substring(0,4),10)*10000 + parseInt(dateitem.dates.substring(5,7),10)*100 +parseInt(dateitem.dates.substring(8,10),10)
}

function getTimeVal(dateitem){
	return parseInt(dateitem.dates.substring(11,13),10)*10000 + parseInt(dateitem.dates.substring(14,16),10)*100 +parseInt(dateitem.dates.substring(17,19),10)
}


function getFilmInfo(fi){
	var info = '<img src="'+ fi.imgLink +'"/> <br>';
	info += "<b>Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
	info += getFilmProperties(fi);
	info += '<a href="' + fi.infoLink + '">more info...</a><br>'
	return info;
}


function getSchedule(fi){
	var info = fi.name
	$.each(fi.schedules,function(){
		var venue = this.venue.name
		var keyDate = this.startD
		var dates = $.format.date(this.startD, 'ddd, MMMM d')
		var sTime = $.format.date(this.startD, 'hh:mm a')
		var eTime = $.format.date(this.endD, 'hh:mm a')
		var item = $('<fieldset data-role="controlgroup"><input type="checkbox" name="checkbox-'+this.id+'" title="'+dates+'" id="checkbox-'+this.id+'" class="custom"/>'+dates + ', '+ sTime + ' - ' + eTime +' at <a href="'+VenueArray.get(this.venue.id)+'">'+venue+'</a><br>')
		
		//console.log(VenueArray.get(curvenid).venlocationlink)
		$('#film-sched').append(item)
		var checkedAttribute = false;
            if (localStorage.getItem(this.id)!=null) {
                checkedAttribute = true;
             }
        $('#checkbox-'+this.id).attr('checked', checkedAttribute);
		$('#checkbox-'+this.id).change(function() {
				//	console.log(localStorage)

					var store = new localstore();
                    var isChecked = $(this).is(':checked');
                    var checkbox_id = ($(this).attr('id')).split('-');
                    var schedule_id = checkbox_id[1];
                    /*if (isChecked) {                   
                       date = $(this).attr('title');

                       if (!store.check_key(schedule_id)) {
                       		 
                             value = localStorage.getItem(schedule_id);
                        //    if (value){
                        		 var sched_item = new Object();
                        		 sched_item.keyDate = keyDate
                        		 sched_item.value = date + '(' + sTime +' - '+eTime+'): '+info + ' ---' +venue
                                 store.add(schedule_id, sched_item);
                         //    }
                         //    else
                         //        localStorage[schedule_id] = date; 
                       }
                     } 
                     else {
                         if (localStorage) {
                        // 	value = store.getvalue(schedule_id);
                        // 	if(value)
                            store.remove(schedule_id);
                         }
                     }*/
                     if (isChecked) { 
                     	AllSchedules.checked++;
                     	AllSchedules.get(schedule_id).isChosen = true;
                     	localStorage.setItem(schedule_id, AllSchedules.get(schedule_id).info)
                     	var schedven = new Object();
                     	schedven.venid = AllSchedules.get(schedule_id).ven_id
                     	schedven.info = AllSchedules.get(schedule_id).info
                     	localStorage.setItem(schedule_id, JSON.stringify(schedven))
                     }else{
						AllSchedules.checked--;
                     	AllSchedules.get(schedule_id).isChosen = false;
                     	localStorage.removeItem(schedule_id)
                     }

                  });
		// checkbox function here
	})
}

// get film properties
function getFilmProperties(fi){
	var info = getSingleInfo(fi.cast,'Cast: ');
	info += getSingleInfo(fi.genre,'Genre: ');
	info += getSingleInfo(fi.producer,'Producer: ');
	info += getSingleInfo(fi.director,'Director: ');
	info += getSingleInfo(fi.country,'Country: ');
	info += getSingleInfo(fi.languages,'Language: ');
	info += getSingleInfo(fi.writer,'Writer: ');
	info += getSingleInfo(fi.cinematographer,'Cinematographer: ');
	info += getSingleInfo(fi.editor,'Editor: ');
	return info;
}


function goBack() {
    history.go(-1);
}


function getSingleInfo(prop,pName){
	if(prop.length > 0) return '<b>' + pName +'</b>'+ prop.substring(0,prop.length-2) + '<br>';
	else return '';
}

//$('#title-btn').click(createLinkHandler(populateFilmListByName,ProgramItemArray));
//$('#date-btn').click(createLinkHandler(populateFilmListByDate,DateItemArray));
$(getFilm);