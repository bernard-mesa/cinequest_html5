var cnt = 0
var ForumItemArray = [];

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
						if(pi.name.indexOf("Forum") >= 0) ForumItemArray.push(pi);
						
					}
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
	var item = '<h4>'+ProgramItem.name+'</h4>'
	item += '<p>' + getForumInfo(ProgramItem.films[0]) + '</p>'
	$('#forum-details').append(item);
}



function getForumInfo(fi){
	var info = '<img src="'+ fi.imgLink +'"/> <br>';
	info += '<a href="' + fi.infoLink + '">Link</a><br>'
	info += "<b>Title</b>: "  + fi.name + '<br>';
	info += "<b>Duration</b>: " + fi.dura + '<br>';
	info += "<b>Description</b>: " + fi.descript + '<br>';
	info += getSchedule(fi)
	return info;
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

$(getForum);
