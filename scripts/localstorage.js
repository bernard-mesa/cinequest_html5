/*A class for adding and removing items from
local storage*/

function localstore(){

        this.add=function(key,value){
                if(localStorage){
                        localStorage.setItem(key,value);
                }
        }

        this.remove=function(key){
                if(localStorage){
                        localStorage.removeItem(key);
                }
        }

        this.getvalue=function(key){
                if(localStorage){
                      val = localStorage.getItem(key);
                      return val;
                }
        }

        this.check_key=function(k){
                if(localStorage){
                        flag=0;
                        for(var key in localStorage){
                                if(key===k){
                                        flag=1;
                                        break;
                                 }
                }
                        if(flag==1)
                                return true;
                        else
                                return false;
                }
        }
	
        this.get_allvalues=function(){
                var arr= new Array();
                for(var key in localStorage){
                        val=localStorage.getItem(key);
                        arr.push(val);
                }
                return arr;
        }

        this.get_allkeys=function(){
                var ids = new Array();
                for(var key in localStorage){
                      ids.push(key);
                }
                return ids;
        }
}