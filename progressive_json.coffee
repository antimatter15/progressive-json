json_parse: (read, callback) ->
  at: 0
  ch: ''
  escapee: {
          '"':  '"'
          '\\': '\\'
          '/':  '/'
          b:    '\b'
          f:    '\f'
          n:    '\n'
          r:    '\r'
          t:    '\t'
      }
  error: (m) ->
  throw {
              name:    'SyntaxError',
              message: m,
              at:      at,
              text:    text
          }
  next: (c, callback) ->
    error "Expected "+c+" instead of  "+ch if c != ch
    read (b) ->
      at++
      ch = b
      callback(ch)
      
  
    
  
