var cnt = 0
var ForumItemArray = [];
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
var VenueArray = [];
function getForum() {
    $.ajax({
        type: "GET",
        url: "newcinequest.xml",
        dataType: "xml",
        success: function(xml) {
            $(xml).find('Show').each(function(){
				var pi = new Object();
				var fi = new Object();
				fi.schedules = [];
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
					if(pi.name.indexOf("Shorts Program")!=0){
						if(pi.name.indexOf("Forum") >= 0) ForumItemArray.push(pi);
						
					}
					$.each(fi.schedules,function(){
						var dt = new Object();
						dt.isChosen = false;
						dt.dates = this.startD;
						dt.ends = this.endD;
						dt.pi = pi;
						dt.venue = this.venue;
						dt.info = $.format.date(this.startD, 'ddd, MMMM d') + ' ('+ $.format.date(this.startD, 'hh:mm a') + ' - '+$.format.date(this.endD, 'hh:mm a')+') --- '+ this.venue.name+': "'+ fi.name+'"';
		
						AllSchedules.put(this.id,dt);
					})
				}
				
            });
			
			//at this point, the XML file has finished reading, begin manipulation here
		
		ForumItemArray.sort(compareByName);
		populateForumList(ForumItemArray);
        }   
    }); 
}



function populateForumList(ForumItemArray){
	$('#forums').empty()
	$.each(ForumItemArray,function(){
		var item = $('<li/>');
		var link = $('<a/>').html(this.name);
		link.click(createLinkHandler(moveToForumDetails,this));
		item.append(link)
		$('#forums').append(item);
	})
	$('#forums').listview('refresh');
}

function compareByName(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function createLinkHandler(f,i){
	return function(){f(i);};
}

function moveToForumDetails(ProgramItem){
	$.mobile.changePage('#forumdetailspage');
	$('#forum-details').empty();
	$('#event-sched').empty();
	$.each(ProgramItem.films,function(){
		getSchedule(this)
		var item = '<h4>'+ProgramItem.name+'</h4>'
		item += '<p>' + getForumInfo(this) + '</p>'
		$('#forum-details').append(item);
	})
}



function getForumInfo(fi){
	var info = '<img src="'+ fi.imgLink +'"/> <br>';
	info += '<a href="' + fi.infoLink + '">Link</a><br>'
	info += "<b>Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
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
		
		$('#forum-sched').append(item)
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
console.log(AllSchedules);
$(getForum);
