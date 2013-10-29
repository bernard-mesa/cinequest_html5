/********
Sync
Author: Animesh Dutta
*********/



/*function for synchronizing the schedule
* it is called by the login dialog/page
* we get the username and password from the login dialog
* and set it into local storage
*/
function sync(){

var name = document.getElementById('name').value;
var password = document.getElementById('password').value;
//alert(password);
if (name!=null && name!="")
  {
  localStorage.setItem("user",name);
  }
if (password!=null && password!="")
  {
  localStorage.setItem("pass",password);
  }


$('#schedule').children().remove();
var local = new localstore();
 var user = localStorage.getItem("user");
 var pass = localStorage.getItem("pass");
 make_url = proxy+"type=SLGET&username="+user+"&password="+pass;
var str="";
 $.ajax({
    type: "POST",
    url: make_url,
    dataType: "xml",
    success: function(xml) { 
        $confirmed = $(xml).find('confirmed');
        $confirmed.find('schedule').each(function(){
            id = $(this).attr('id');
                        localStorage.setItem(id,"");
                        });
        $moved = $(xml).find('moved');
        $moved.find('schedule').each(function(){
            id = $(this).attr('id');
                        localStorage.setItem(id,"");
                        });
        $removed = $(xml).find('removed');
        $removed.find('schedule').each(function(){
            id = $(this).attr('id');
                        localStorage.removeItem(id,"");
                        });
        }
        });
        var timeStamp = get_timeStamp();
        var items = get_idString();
		
		// add the sync timestamp logic here
        // make this a separate function
		// ask user to merge, overwrite server or just keep server schedule
		put_url = proxy+"type=SLPUT&username="+user+"&password="+pass+"&lastChanged="+timeStamp+"&items="+items;
        $.ajax({
          type: "POST",
          url: put_url,
          dataType: "xml",
          success: function(xml) {

          $confirmed = $(xml).find('confirmed');
          $confirmed.find('schedule').each(function(){
                id = $(this).attr('id');
                        localStorage.setItem(id,"");
                        });
          $moved = $(xml).find('moved');
          $moved.find('schedule').each(function(){
            id = $(this).attr('id');
                        localStorage.setItem(id,"");
                        }); 
          $removed = $(xml).find('removed');
          $removed.find('schedule').each(function(){
            id = $(this).attr('id');
                        localStorage.removeItem(id,"");
                        });
          }
          });
loadcontents();
}

function logOut(){
  localStorage.setItem("pass","");
    localStorage.setItem("user","");
	alert("Logged Out");
}

/**************

get all the confirmed schedule ids
and push them to the server
with a timestamp from the current machine.
 
*****************/
function get_idString(){
 var local = new localstore();
 var localids = local.get_allkeys();
         var id_str = "";
         for (var i = 0; i < localids.length; i++) {
           var test = $.inArray(localids[i], ids_arr);
               if(test != -1){
                 id_str = id_str+localids[i]+",";
                }
          }
        var fin_str = id_str.slice(0, -1);
        return fin_str;
}

function get_timeStamp() {
        var d = new Date();
        var curr_hour = padding(d.getHours());
        var curr_min = padding(d.getMinutes());
        var curr_sec = padding(d.getSeconds());
        var curr_day = padding(d.getDate());
        var curr_yr = padding(d.getFullYear());
        var curr_mth = padding(d.getMonth() + 1);
        var timeStamp = curr_yr+"-"+curr_mth+"-"+curr_day+" "+curr_hour+":"+curr_min+":"+curr_sec ;
		return timeStamp ;
}

function padding(num){

	if(num <10){
	num = "0"+num;
	}
	return num;
}