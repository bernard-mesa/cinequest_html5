var selected=0;
var ids_arr = new Array();
loadcontents();

$('#delete').attr('disabled','disabled');

/*function to display all the schedule items
for all schedule id's in local storage*/
//function loadcontents(){
//added by Animesh
function loadcontents(){
$('#schedule').children().remove();

        var local = new localstore();
        var ids = local.get_allkeys();
        var res = ids.toString();
        var result = res.match(/\d{4}/g);

if (result !=  null){

$.ajax({
    type: "GET",
    url: "newcinequest.xml",
    dataType: "xml",
    success: function(xml) {
        $schedules = $(xml).find('schedules');
        var previous_date;
        
        //added by Snigdha
        var current_date;
        $schedules.find('schedule').each(function(){
            var id = $(this).attr('id');
                        ids_arr.push(id);
            var test = $.inArray(id, result);
                        if(test != -1){
                        title = $(this).attr('title');
                        time = $(this).attr('start_time');

                        //added by Snigdha
                            var sd = $.format.date(time, 'ddd, MMMM d');
            var split = time.split(" ");
            var rawDate = split[0];
            var rawStart = split[1];
                        rawStart = ampm(rawStart);

                        end = $(this).attr('end_time');
                        var split2 = end.split(" ");
                        var rawEnd = split2[1];
                        end = ampm(rawEnd);

                        venue = $(this).attr('venue');	
            //added by Snigdha
                        previous_date = current_date;
                        current_date = sd;
            if (previous_date != current_date){
                        splitDate = rawDate.split('-');
                        yyyy = splitDate[0];
                        mm = splitDate[1];
                        dd = splitDate[2];
                        amDate = mm + "/" +dd+"/"+yyyy;

            $('<li data-role="list-divider"></li>').html(current_date).appendTo('#schedule');
            }
           // $('<li></li>').html('<h3><input type="checkbox" id='+id+' class="custom" />'+title+'</h3><p class="ui-li-aside"><strong>From: '+rawStart+' - '+end+'<br>Venue: '+venue+'</strong></p>').appendTo('#schedule');
			$('<li data-role="fieldcontain"></li>').html('<fieldset data-role="controlgroup"><input type="checkbox" id='+id+' class="custom"/><a href="#">&nbsp;&nbsp;'+title+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time: '+rawStart+' - '+end+'&nbsp;&nbsp;&nbsp;&nbsp;Venue: '+venue+'</a></fieldset>').appendTo('#schedule');                       
					   checkbind('#'+id+'');
                        previous_date = rawDate;
            $('#schedule').listview('refresh');
               }
           });
    }
});
} else{
        var message = "You do not have any schedule entries added";
        $('<li></li>').html('<h3>'+message+'</h3>').appendTo('#schedule');
      }	
}

/*function to check if a schedule id 
matches any key in local storage*/
function check(sched_id){
        var flag=0;
        for (i=0; i<=localStorage.length-1; i++)
        {
                key = localStorage.key(i);
                if(key===sched_id){
                        flag=1;
                        break;
                }
        }
        if(flag==1){
                return true;
        }
        else
                return false;
}
//function for time
function ampm(time){
        splitTime = time.split(':');
        hh = splitTime[0];
        min = splitTime[1];

        if(hh>12){
                hh = hh - 12;
                time = hh+":"+min+" PM  ";
        } else{
                time = hh+":"+min+" AM  ";
        }
return time;
}


/*function to check if a schedule
entry is selected. If yes, enable
the delete button*/ 
function checkbind(id){
         $(id).bind("click",function(){
                if($(this).is(":checked")){
                        selected+=1;
		}
                else{
                        selected-=1;
                }
                if(selected>0){
                        $('#delete').button('enable');
                }
                else
                        $('#delete').button('disable');
         });
}

/*function to delete an entry from
local storage. It checks if an entry 
is checked and if yes, deletes it.*/
$('#delete').bind("click",function(){
for(var key in localStorage)
        {
                val=localStorage.getItem(key);
                if($('#'+key+'').is(':checked')){
                        localStorage.removeItem(key);
                        selected-=1;
                        if(selected==0){
                             $('#delete').button('disable');
                        }
                }
        }
        $('#schedule').children().remove();
        loadcontents();
});