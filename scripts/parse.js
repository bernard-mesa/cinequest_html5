var cnt = 0
var ProgramItemArray = [];
var FilmArray = [];
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
				});
				$currentShowings = $(this).find('CurrentShowings').find('Showing');
				$currentShowings.each(function(){
					var show = new Object();
					show.id = $(this).find('ID').text();
					show.start = $(this).find('StartDate').text();
					show.end = $(this).find('EndDate').text();
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
					if(pi.name.indexOf("Shorts Program")!=0){
						ProgramItemArray.push(pi);
					}else{
						SPGroupContainer.put(pi.name.substring(0,16),pi)
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
		ProgramItemArray.sort(compare);
		populateFilmList(ProgramItemArray);
        }   
    }); 
}

// print name of FilmArray or ProgramItemArry
function printFilmItem(col){
	$.each(SPGroupContainer.keys,function(){

	})
}


function populateFilmList(ProgramItemArray){
	$.each(ProgramItemArray,function(){
	//	var item = $('<li>' + this.name+ '</li>');
		//<a href="film_detail.html"/><input type="checkbox" name="checkbox-'+this.id+'" id="checkbox-'+this.id+'" class="custom"/>
		var item = $('<li/>');
		var link = $('<a/>').html(this.name);
		link.click(createLinkHandler(movetopage,this));
		item.append(link)
		$('#films').append(item);
	})
	$('#films').listview('refresh');
}

function createLinkHandler(f,i){
	return function(){f(i);};
}

function movetopage(ProgramItem){
	$.mobile.changePage('#detailspage');
	$('#film-items').empty();
	$('#film-details').html('');
	$.each(ProgramItem.films,function(){
	//	var item ='<div data-role="collapsible" data-theme="b" data-content-theme="d" class="ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content ui-collapsible-collapsed">'
	//	item += '<h4 class="ui-collapsible-heading ui-collapsible-heading-collapsed"><a href="#" class="ui-collapsible-heading-toggle ui-btn ui-fullsize ui-btn-icon-left ui-btn-up-b" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="plus" data-iconpos="left" data-theme="b" data-mini="false"><span class="ui-btn-inner"><span class="ui-btn-text">'+ this.name + '<span class="ui-collapsible-heading-status"> click to expand contents</span></span><span class="ui-icon ui-icon-plus ui-icon-shadow">&nbsp;</span></span></a></h4><div class="ui-collapsible-content ui-body-d ui-collapsible-content-collapsed" aria-hidden="true">'
    //	item += '<p>' + getFilmInfo(this) + '</p>'
	//	item += '</div></div>'
		var item = $('<div data-role="collapsible" data-theme="b" data-content-theme="d"/>')
		item.append($('<h4>'+this.name+'</h4>'))
		item.append($('<p>' + getFilmInfo(this) + '</p>'))
		$('#film-items').append(item);

		$('#film-items').find('div[data-role=collapsible]').collapsible();  
	})
//	$('#film-items').content('refresh');
}

function displaySelectedFilmInfo(fi){
	$('#film-details').html(getFilmInfo(fi));
}

function compare(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function getFilmInfo(fi){
	var info = '<img src="'+ fi.imgLink +'"/> <br>';
	info += '<a href="' + fi.infoLink + '">Link to Movie</a><br>'
	info += "<b>Film Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
	info += getFilmProperties(fi);
	info += getSchedule(fi)
	return info;
}

function getProgramItemInfo(pi){
	var info = "Name: " + pi.name + '<br>';
	info += "Description: " + pi.descript;
	return info;
}

function getSchedule(fi){
	var info = ''
	$.each(fi.schedules,function(){
		info += this.id + '<br>'
	})
	return info;
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


function getSingleInfo(prop,pNmae){
	if(prop.length > 0) return '<b>' + pNmae +'</b>'+ prop.substring(0,prop.length-2) + '<br>';
	else return '';
}


//$('.list-content').click(function(){
//	$.mobile.changePage('#detailspage')
//	$('#film-details').html('yoyo');
//});


//if(typeof clicked_source == 'undefined')
//	$(extract_films_by_date);
//else if(clicked_source == 'title') {
//       $(extract_films_by_title);
$(getFilm);
