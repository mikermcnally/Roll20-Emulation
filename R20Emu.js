(function(context) { 
  var r20Objs = {};

    function out(caller, message){
        console.log("[R20Emu:" + caller + "] " + message);
    }
    context.log = function(message) {
        out('log', message);   
	}
    
    context.getObj = function(type, id) {
        console.log(type, id);
        if(r20Objs[id] && r20Objs[id].type == type) return r20Objs[id];
    }

})(this);	