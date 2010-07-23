(function(){
  var json_parse;
  json_parse = function(read, callback) {
    var at, ch, error, escapee, next;
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
    error = function(m) {    };
    throw {
      name: 'SyntaxError',
      message: m,
      at: at,
      text: text
    };
    next = function(c, callback) {
      if (c !== ch) {
        error("Expected " + c + " instead of  " + ch);
      }
      return read(function(b) {
        at++;
        ch = b;
        return callback(ch);
      });
    };
    return next;
  };
})();
