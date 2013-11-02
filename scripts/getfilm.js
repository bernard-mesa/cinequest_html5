var cnt = 0
var ProgramItemArray = [];
var DateItemArray = [];
var FilmArray = [];
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
}
var SPGroupContainer = {
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
var SPGroup = [];
var VenueArray = [];
function getFilm() {
    $.ajax({
        type: "GET",
        url: "newcinequest.xml",
        dataType: "xml",
        success: function(xml) {
            $(xml).find('Show').each(function(){
				var pi = new Object();
				var fi = new Object();
				fi.properties = [];
				fi.schedules = [];
				fi.cast = '';
				fi.director = '';
				fi.genre = '';
				fi.producer = '';
				fi.writer = '';
				fi.editor = '';
				fi.cinematographer = '';
				fi.country = '';
				fi.languages = '';
				fi.events = '';
				pi.films = [];
                pi.id = $(this).find('ID')[0].textContent;
                fi.id = pi.id;
				pi.name = $(this).find('Name')[0].textContent;
				fi.name = pi.name;
				pi.dura = $(this).find('Duration')[0].textContent;
				fi.dura = pi.dura;
				pi.descript = $(this).find('ShortDescription')[0].textContent;
				fi.descript = pi.descript;
				pi.imgLink = $(this).find('EventImage').text();
				fi.imgLink = pi.imgLink;
				pi.infoLink = $(this).find('InfoLink').text();
				fi.infoLink = pi.infoLink;
				$customProperties = $(this).find('CustomProperties').find('CustomProperty');
				$customProperties.each(function(){
					var key = $(this).find('Name').text();
					var value = $(this).find('Value').text();
					if(key == 'Cast') fi.cast += value + ', ';
					if(key == 'Director') fi.director += value + ', ';
					if(key == 'Editor') fi.editor += value + ', ';
					if(key == 'Cinematographer') fi.cinematographer += value + ', ';
					if(key == 'Screenwriter') fi.writer += value + ', ';
					if(key == 'Genre') fi.genre += value + ', ';
					if(key == 'Producer') fi.producer += value + ', ';
					if(key == 'Country') fi.country += value + ', ';
					if(key == 'Language') fi.languages += value + ', '; 
					if(key == 'Events') fi.events += value + ', '; 
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
					show.venue.name = $venue.find('VenueName').text();
					show.venue.address = $venue.find('VenueAddress1').text();
					fi.schedules.push(show);
				});
				
				if (fi.schedules.length > 0){
					if (pi.descript.indexOf("Shorts Program") < 0){
						pi.films.push(fi);
					}

					$.each(fi.schedules,function(){
						var dt = new Object();
						dt.isChosen = false;
						dt.dates = this.startD;
						dt.ends = this.endD;
						dt.pi = pi;
						dt.venue = this.venue;
						dt.info = $.format.date(this.startD, 'ddd, MMMM d') + ' ('+ $.format.date(this.startD, 'hh:mm a') + ' - '+$.format.date(this.endD, 'hh:mm a')+') at '+this.venue.name;
		
						AllSchedules.put(this.id,dt);
					})

					if(pi.name.indexOf("Forum") < 0 && fi.events.length == 0){
							$.each(fi.schedules,function(){
								var dt = new Object();
								dt.dates = this.startD;
								dt.ends = this.endD;
								dt.pi = pi;
								DateItemArray.push(dt);
							})
						if(pi.name.indexOf("Shorts Program")!=0){
						ProgramItemArray.push(pi);
					}else{
						SPGroupContainer.put(pi.name.substring(0,16),pi)
					}
					}

					
				}else{
					if(pi.descript.indexOf("Part of Shorts Program")==0){
						var key = pi.descript.substring(8,24);
					}else if(pi.descript.indexOf("Plays with")==0){
						var key = pi.descript.split('.')[0].substring(28);
					}else if(pi.descript.indexOf("Plays before")==0){
						var key = pi.descript.split('.')[0].substring(30);
					}
					SPGroup.push([key,fi]);
				}
				FilmArray.push(fi);
				
            });
			
			//at this point, the XML file has finished reading, begin manipulation here
		
			$.each(SPGroup,function(){
				var piKey = this[0];
				if(piKey != null){
					if(SPGroupContainer.get(piKey)!=null){
						SPGroupContainer.get(piKey).films.push(this[1]);
					}else{
						for(var i=0; i<ProgramItemArray.length; i++){
							if(ProgramItemArray[i].name==piKey){
								ProgramItemArray[i].films.push(this[1]);
							}
						}
					}
				}
			});
			
			$.each(SPGroupContainer.keys,function(){
				ProgramItemArray.push(SPGroupContainer.get(this));
				
			})
		
			
			populateFilmListByName(ProgramItemArray);
		
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
	$('#film-sched').empty()
	$('#film-details').html('');
	if(ProgramItem.name.indexOf('Shorts Program')>=0) console.log(ProgramItem.films[0].schedules)
	$.each(ProgramItem.films,function(){
		getSchedule(this)
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
	info += '<a href="' + fi.infoLink + '">Link</a><br>'
	info += "<b>Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
	info += getFilmProperties(fi);
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
		var item = $('<fieldset data-role="controlgroup"><input type="checkbox" name="checkbox-'+this.id+'" title="'+dates+'" id="checkbox-'+this.id+'" class="custom"/>'+dates + ', '+ sTime + ' - ' + eTime +'<br>')
		
		$('#film-sched').append(item)
		var checkedAttribute = false;
            if (AllSchedules.get(this.id).isChosen) {
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
                     }else{
						AllSchedules.checked--;
                     	AllSchedules.get(schedule_id).isChosen = false;
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

function setShowStyle(newstyle){
	showstyle = newstyle
}
var showstyle = 'title'
$('#title-btn').click(createLinkHandler(populateFilmListByName,ProgramItemArray));
$('#date-btn').click(createLinkHandler(populateFilmListByDate,DateItemArray));
$(getFilm);
localStorage.clear()