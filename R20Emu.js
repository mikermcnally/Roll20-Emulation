R20Emu = (function () {
    var r20Objs = {};

    function out(caller, message) {
        console.log("[R20Emu:" + caller + "] " + message);
    }
    this.log = function (message) {
        out('log', message);
    }
    this.getObj = function (type, id) {
        console.log(type, id);
        if (r20Objs[id] && r20Objs[id].type == type) return r20Objs[id];
    }

})(this);