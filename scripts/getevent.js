var cnt = 0
var EventItemArray = [];

var VenueArray = [];
function getEvent() {
    $.ajax({
        type: "GET",
        url: "newcinequest.xml",
        dataType: "xml",
        success: function(xml) {
            $(xml).find('Show').each(function(){
				var pi = new Object();
				var fi = new Object();
				fi.schedules = [];
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
					if(key == 'Events') fi.events += value + ', '; 
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
				
				if (fi.events.length > 0){
					pi.films.push(fi);
					EventItemArray.push(pi);
				}
				
            });
			
			//at this point, the XML file has finished reading, begin manipulation here
		
		EventItemArray.sort(compareByName);
		populateEventList(EventItemArray);
        }   
    }); 
}



function populateEventList(EventItemArray){
	$('#events').empty()
	$.each(EventItemArray,function(){
		var item = $('<li/>');
		var link = $('<a/>').html(this.name);
		link.click(createLinkHandler(moveToEventDetails,this));
		item.append(link)
		$('#events').append(item);
	})
	$('#events').listview('refresh');
}

function createLinkHandler(f,i){
	return function(){f(i);};
}

function moveToEventDetails(ProgramItem){
	$.mobile.changePage('#eventdetailspage');
	$('#event-details').empty();
	var item = '<h4>'+ProgramItem.name+'</h4>'
	item += '<p>' + getEventInfo(ProgramItem.films[0]) + '</p>'
	$('#event-details').append(item);
}



function getEventInfo(fi){
	var info = '<img src="'+ fi.imgLink +'"/> <br>';
	info += '<a href="' + fi.infoLink + '">Link</a><br>'
	info += "<b>Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
	info += '<b>Event Type</b>: '+ fi.events.substring(0,fi.events.length-2) + '<br>'
	info += getSchedule(fi)
	return info;
}

function compareByName(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function getSchedule(fi){
	var info = ''
	$.each(fi.schedules,function(){
		info += this.id + '<br>'
	})
	return info;
}

function goBack() {
    history.go(-1);
}

$(getEvent);
