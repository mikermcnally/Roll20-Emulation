const _ = require('underscore');

var generateUUID = (function () {
  "use strict";

  var a = 0,
    b = [];
  return function () {
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
}());

var generateRowID = function () {
  "use strict";
  return generateUUID().replace(/_/g, "Z");
};

class R20Object {
  constructor(type, attributes) {
    var id = generateRowID();
    this._type = type;
    this.id = id;
    this._id = id;
    _.extend(this, attributes);
    if (_.has(attributes, "characterid")) {
      this._characterid = attributes.characterid;
    }

    objstore[id] = this;
  }

  remove() {
    delete objstore[this._id];
  }
  get(attr) {
    return this[attr];
  }

  set(attr, value) {
    this[attr] = value;
  }
}

module.exports = class R20 {
  constructor() {
    global.objstore = {};

    global.state = {};

    global.log = function (msg) {
      out({
        msg: msg,
        caller: 'log'
      });
    }

    global.sendChat = function (who, msg) {
      out({
        msg: [who, msg].join(': '),
        caller: 'sendChat'
      });
    }

    global.createObj = function (type, attributes) {
      return new R20Object(type, attributes);
    }

    global.getObj = function (type, id) {
      return objstore[id];
    }

    global.findObjs = function (opts) {
      return _.filter(objstore, function (obj) {
        return _.isMatch(obj, opts);
      });
    }

    global.filterObjs = function (predicate) {
      return _.filter(objstore, predicate);
    }

    global.getAttrByName = function (characterid, name, type) {
      var attribute = findObjs({
        _type: "attribute",
        _characterid: characterid,
        name: name
      }, {
        caseInsensitive: false
      })[0];

      return _.isUndefined(attribute) ? undefined : attribute.get(type);
    }

    global.randomInteger = function (max) {
      return Math.floor(Math.random() * max) + 1
    }

    global.Campaign = new R20Object();
  }

  reset() {
    objstore = {};
    state = {};
    Campaign = new R20Object();
  }
}

function out(opts) {
  console.log('[R20:' + opts.caller + ']:');
  console.log(opts.msg);
}