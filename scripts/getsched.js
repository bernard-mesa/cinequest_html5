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
	console.log(AllSchedules)
	if(AllSchedules.checked==0){
		var message = "You do not have any schedule";
        $('<li></li>').html('<h3>'+message+'</h3>').appendTo('#schedule');
	}
	else{
	//	AllSchedules.sort(compareByDate)
		$.each(AllSchedules.keys,function(){
			if(AllSchedules.get(this).isChosen)
				chosenSched.push(AllSchedules.get(this))
			
		})
		chosenSched.sort(compareByDate)
		$.each(chosenSched,function(){
			$('<li></li>').html('<h3>'+this.info+'</h3>').appendTo('#schedule');
		})
	}
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
//console.log(AllSchedules)
loadcontents()