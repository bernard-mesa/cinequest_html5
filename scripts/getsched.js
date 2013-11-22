var store = new localstore();
var chosenSched = [];

/*function loadcontents(){
	console.log(localStorage)
	if(localStorage.length==0){
		var message = "You do not have any schedule";
        $('<li></li>').html('<h3>'+message+'</h3>').appendTo('#schedule');
    }else{
    	var arr = store.get_allvalues()
    	console.log(arr)
    	arr.sort(compareByDate)
    	$.each(arr,function(){
    		var sched = this.value
        	$('<li></li>').html('<h3>'+sched+'</h3>').appendTo('#schedule');
    		console.log(localStorage)
    		console.log(this)
    	})
    }
}*/
function loadcontents(){
	console.log(localStorage)
	if(localStorage.length==0){
		var message = "You do not have any schedule";
        $('<li></li>').html('<h3>'+message+'</h3>').appendTo('#schedule');
	}
	else{
		$.each(getAllKeys(),function(){
			var chosen = new Object();
			chosen.id = this;
		//	chosen.info = localStorage.getItem(this);
			chosen.info = jQuery.parseJSON(localStorage.getItem(this)).info;
			chosenSched.push(chosen)
		})
		console.log(chosenSched)
		$.each(chosenSched,function(){
			$('<li><a>'+this.info+'</a><a class="clearitem" storekey="'+this.id+'" data-rel="popup" data-position-to="window" data-transition="pop">Remove!!</a></li>').appendTo('#schedule');
		})
		$('#schedule a.clearitem').click(function(){
			$(this).parent().remove();
		});
		$('#schedule a.clearitem').click(function(){
			var st_key = $(this).attr('storekey');
			localStorage.removeItem(st_key);
			$(this).parent().remove();
		});

	}
}

function getAllKeys(){
	var ids = new Array();
    for(var key in localStorage){
        ids.push(key);
    }
    return ids;
}

function getAllVals(){
	var arr= new Array();
    for(var key in localStorage){
        val=localStorage.getItem(key);
        arr.push(val);
    }
    return arr;
}


/*function loadcontents(){
	console.log(localStorage)
	if(AllSchedules.checked==0){
		var message = "You do not have any schedule";
        $('<li></li>').html('<h3>'+message+'</h3>').appendTo('#schedule');
	}
	else{
	//	AllSchedules.sort(compareByDate)
		$.each(AllSchedules.keys,function(){
			if(AllSchedules.get(this).isChosen){
				chosenSched.push(AllSchedules.get(this))
			}
			
		})
		chosenSched.sort(compareByDate)
		$.each(chosenSched,function(){
			$('<li><a>'+this.info+'</a><a class="clearitem" storekey="'+this.id+'" data-rel="popup" data-position-to="window" data-transition="pop">Remove!!</a></li>').appendTo('#schedule');
		})
		$('#schedule a.clearitem').click(function(){
			$(this).parent().remove();
		});
		$('#schedule a.clearitem').click(function(){
			var st_key = $(this).attr('storekey');
			AllSchedules.get(st_key).isChosen = false;
			console.log(AllSchedules);
			$(this).parent().remove();
		});

	}
}
*/
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
	return parseInt(dateitem.substring(0,4),10)*10000 + parseInt(dateitem.substring(5,7),10)*100 +parseInt(dateitem.substring(8,10),10)
}

function getTimeVal(dateitem){
	return parseInt(dateitem.substring(11,13),10)*10000 + parseInt(dateitem.substring(14,16),10)*100 +parseInt(dateitem.substring(17,19),10)
}
loadcontents()