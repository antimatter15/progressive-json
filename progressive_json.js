(function(){
  var _read, blah, pos;
  this.json_parse = function(read) {
    var array, at, ch, error, escapee, next, number, object, result, string, value, white, word;
    at = 0;
    ch = '';
    escapee = {
      '"': '"',
      '\\': '\\',
      '/': '/',
      b: '\b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t'
    };
    error = function(m) {
      console.log(m);
      throw {
        name: 'SyntaxError',
        message: m,
        at: at,
        text: ''
      };
    };
    next = function(c) {
      if (c && c !== ch) {
        error("Expected " + c + " instead of  " + ch);
      }
      ch = read();
      at++;
      return ch;
    };
    number = function() {
      var number, string;
      string = '';
      if (ch === '-') {
        string = '';
        return next('-');
      } else {
        while (ch >= '0' && ch <= '9') {
          string += ch;
          next();
        }
        if (ch === 'e' || ch === 'E') {
          string += ch;
          next();
          if (ch === '-' || ch === '+') {
            string += ch;
            next();
          }
          while (ch > '0' && ch <= '9') {
            string += ch;
            next();
          }
        }
        number = +string;
        if (isNaN(number)) {
          return error("Bad number");
        } else {
          return number;
        }
      }
    };
    string = function() {
      var hex, i, string, uffff;
      string = '';
      if (ch === '"') {
        while (next()) {
          if (ch === '"') {
            next();
            return string;
          } else if (ch === '\\') {
            next();
            if (ch === 'u') {
              uffff = 0;
              for (i = 0; i < 4; i += 1) {
                hex = parseInt(next(), 16);
                if (!isFinite(hex)) {
                  break;
                }
                uffff = uffff * 16 + hex;
              }
            } else if (typeof escapee[ch] === 'string') {
              string += escapee[ch];
            } else {
              break;
            }
          } else {
            string += ch;
          }
        }
      }
      return error("Bad string");
    };
    white = function() {
      var _a;
      _a = [];
      while (ch && ch <= ' ') {
        _a.push(next());
      }
      return _a;
    };
    word = function() {
      if (ch === 't') {
        next('t');
        next('r');
        next('u');
        next('e');
        return true;
      } else if (ch === 'f') {
        next('f');
        next('a');
        next('l');
        next('s');
        next('e');
        return false;
      } else if (ch === 'n') {
        next('n');
        next('u');
        next('l');
        next('l');
        return null;
      }
      return error('Unexpected ' + ch);
    };
    array = function() {
      var array;
      array = [];
      if (ch === '[') {
        next('[');
        white();
        if (ch === ']') {
          next(']');
          return array;
        } else {
          while (ch) {
            array.push(value());
            white();
            if (ch === ']') {
              next(']');
              return array;
            }
            next(',');
            white();
          }
        }
      }
      return error('bad array');
    };
    object = function() {
      var key, object;
      object = {};
      key = '';
      if (ch === '{') {
        next('{');
        white();
        if (ch === '}') {
          next('}');
          return object;
        }
        while (ch) {
          key = string();
          white();
          next(':');
          Object.hasOwnProperty.call(object, key) ? error('Duplicate key ' + key) : null;
          object[key] = value();
          white();
          if (ch === '}') {
            next('}');
            return object;
          }
        }
      }
      return error("bad object");
    };
    value = function() {
      white();
      if (ch === '{') {
        return object();
      } else if (ch === '[') {
        return array();
      } else if (ch === '"') {
        return string();
      } else if (ch === '-') {
        return number();
      } else {
        if (ch >= '0' && ch <= '9') {
          return number();
        } else {
          return word();
        }
      }
    };
    ch = ' ';
    at = 0;
    console.log('starting');
    result = value();
    white();
    return result;
  };
  blah = '[1,2,3,4,5]';
  pos = 0;
  _read = function(cb) {
    return blah[pos++];
  };
  console.log(json_parse(_read));
})();
