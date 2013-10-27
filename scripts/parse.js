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
				pi.descript = $(this).find('ShortDescription').text();
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
		var item = $('<li><a href="film_detail.html"/><input type="checkbox" name="checkbox-'+this.id+'" id="checkbox-'+this.id+'" class="custom"/>' + this.name+ '</li>');
		$('#films').append(item);
	})
	$('#films').listview('refresh');
}

/*function showProgramItemDetail(ProgramItem){
	
	$('#film-detail').html('text');
//	$('<div id="content-title" align="center"></div>').html('<h3>'+curPI.name+'</h3>').appendTo('#film-detail');
	$.each(ProgramItem.films,function(){
		var item = '<li>' + this.name + '</li>';
		console.log(getFilmInfo(this));
		$('#film-detail').html(item);
		$('#film-items').append(item);
	})
	$('#film-items').listview('refresh');
}*/


function compare(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function getFilmInfo(fi){
	var info = "Film Title: " + fi.name + '\n';
	info += "Duration: " + fi.dura + '\n';
	info += "Description: " + fi.descript + '\n';
	info += "Link: " + fi.infoLink + '\n';
	info += "Image: " + fi.imgLink + '\n';
	info += getFilmProperties(fi);
	return info;
}

function getProgramItemInfo(pi){
	var info = "Name: " + pi.name + '\n';
	info += "Description: " + pi.descript;
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
	if(prop.length > 0) return pNmae + prop.substring(0,prop.length-2) + '\n';
	else return '';
}




//if(typeof clicked_source == 'undefined')
//	$(extract_films_by_date);
//else if(clicked_source == 'title') {
//       $(extract_films_by_title);
$(getFilm);
