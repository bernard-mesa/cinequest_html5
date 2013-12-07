
var cnt = 0
var EventItemArray = [];
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
var EventItemContainer = {
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

function getEvent() {
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
				pi.eventtype = '';
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
						dt.venue = this.venue;
						dt.id = this.id;
						dt.info = $.format.date(this.startD, 'ddd, MMMM d') + ' ('+ $.format.date(this.startD, 'hh:mm a') + ' - '+$.format.date(this.endD, 'hh:mm a')+') --- '+ this.venue.name+': "'+ pi.name+'"';
		
						AllSchedules.put(this.id,dt);
				})
				
				if(pi.eventtype == "Special"){
					EventItemContainer.put(pi.id,pi);
				}
            });
			
			//at this point, the XML file has finished reading, begin manipulation here
		
		$.each(EventItemContainer.keys,function(){
				var curkey = this;
			//	EventItemContainer.get(curkey).children.push(EventItemContainer.get(this));
				
				$.each(EventItemContainer.get(curkey).shortID, function(){
					EventItemContainer.get(this).schedules = EventItemContainer.get(curkey).schedules
					EventItemContainer.get(curkey).children.push(EventItemContainer.get(this));
				})
				EventItemArray.push(EventItemContainer.get(curkey));

			});
		
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

		/*var item = $('<li>'+this.name+'</li>')
		item.on('click',function(){
			moveToFilmDetails(this);
		})*/
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
	$('#event-sched').empty();
	getSchedule(ProgramItem)
	$('#event-details').append($('<p>' + getEventInfo(ProgramItem) + '</p>'))
	$('#event-details').append($('<br><p>Include</p>'))

	$.each(ProgramItem.children,function(){
		var item = $('<div data-role="collapsible" data-theme="b" data-content-theme="d"/>')
		item.append($('<h4>'+this.name+'</h4>'))
		item.append($('<p>' + getEventInfo(this) + '</p>'))
		$('#event-details').append(item);
		$('#event-details').find('div[data-role=collapsible]').collapsible();
	})
}



function getEventInfo(fi){
	var info = '<img src="'+ fi.imgLink +'"/> <br>';
	info += "<b>Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
	info += '<a href="' + fi.infoLink + '">more info...</a><br>'
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
	var info = fi.name
	$.each(fi.schedules,function(){
		var venue = this.venue.name
		var keyDate = this.startD
		var dates = $.format.date(this.startD, 'ddd, MMMM d')
		var sTime = $.format.date(this.startD, 'hh:mm a')
		var eTime = $.format.date(this.endD, 'hh:mm a')
		var item = $('<fieldset data-role="controlgroup"><input type="checkbox" name="checkbox-'+this.id+'" title="'+dates+'" id="checkbox-'+this.id+'" class="custom"/>'+dates + ', '+ sTime + ' - ' + eTime +'<br>')
		
		$('#event-sched').append(item)
		var checkedAttribute = false;
            if (localStorage.getItem(this.id)!=null) {
                checkedAttribute = true;
             }
        $('#checkbox-'+this.id).attr('checked', checkedAttribute);
		$('#checkbox-'+this.id).change(function() {
				
                    var isChecked = $(this).is(':checked');
                    var checkbox_id = ($(this).attr('id')).split('-');
                    var schedule_id = checkbox_id[1];
                    
                     if (isChecked) { 
                     	AllSchedules.checked++;
                     	AllSchedules.get(schedule_id).isChosen = true;
                     	localStorage.setItem(schedule_id, AllSchedules.get(schedule_id).info)
                     }else{
						AllSchedules.checked--;
                     	AllSchedules.get(schedule_id).isChosen = false;
                     	localStorage.removeItem(schedule_id)
                     }

                  });
		// checkbox function here
	})
}

function goBack() {
    history.go(-1);
}
$(getEvent);
