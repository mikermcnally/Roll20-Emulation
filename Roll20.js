var generateUUID = (function() {
    "use strict";

    var a = 0,
      b = [];
    return function() {
      var c = (new Date()).getTime() + 0,
        d = c === a;
      a = c;
      for (var e = new Array(8), f = 7; 0 <= f; f--) {
        e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
        c = Math.floor(c / 64);
      }
      c = e.join("");
      if (d) {
        for (f = 11; 0 <= f && 63 === b[f]; f--) {
          b[f] = 0;
        }
        b[f]++;
      } else {
        for (f = 0; 12 > f; f++) {
          b[f] = Math.floor(64 * Math.random());
        }
      }
      for (f = 0; 12 > f; f++) {
        c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
      }
      return c;
    };
  }()),

  generateRowID = function() {
    "use strict";
    return generateUUID().replace(/_/g, "Z");
  };

var Roll20 = Roll20 || (function(context) {
  context.state = {};

  function out(opts) {
    console.log('[R20:' + opts.caller + ']:');
    console.log(opts.msg);
  }

  context.log = function(msg) {
    out({
      msg: msg,
      caller: 'log'
    });
  }

  context.sendChat = function(who, msg) {
    out({
      msg: [who, msg].join(': '),
      caller: 'sendChat'
    });
  }

  context.createObj = function(type, attributes) {
    return (new Roll20.Object(type, attributes));
  }

  context.getObj = function(type, id) {
    return (Roll20.objstore[id]);
  }

  context.findObjs = function(opts) {
    return _.filter(Roll20.objstore, function(obj) {
      return _.isMatch(obj, opts);
    });
  }

  context.filterObjs = function(predicate) {
    return _.filter(Roll20.objstore, predicate);
  }

  context.getAttrByName = function(characterid, name, type) {
    var attribute = context.findObjs({
      _type: "attribute",
      _characterid: characterid,
      name: name
    }, {
      caseInsensitive: false
    })[0];

    return _.isUndefined(attribute) ? undefined : attribute.get(type);
  }

  context.randomInteger = function(max) {
    return Math.floor(Math.random() * max) + 1
  }

  context.Campaign = function() {
    return Roll20.objstore.campaign;
  }

  context.state = {};

  return ({});
})(this);
var R20 = Roll20;

Roll20.objstore = {};

Roll20.Object = function(type, attributes) {
  var id = generateRowID();
  this._type = type;
  this.id = id;
  this._id = id;
  _.extend(this, attributes);
  if (_.has(attributes, "characterid")) {
    this._characterid = attributes.characterid;
  }

  Roll20.objstore[id] = this;
  this.remove = function () {
    delete Roll20.objstore[this.id];
  }
}
Roll20.Object.prototype.get = function(attr) {
  return this[attr];
}
Roll20.Object.prototype.set = function(attr, value) {
  this[attr] = value;
}

Roll20.objstore.campaign = new Roll20.Object;
