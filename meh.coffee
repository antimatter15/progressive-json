@json_parse: (read) ->
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
    print(m)
    throw {name: 'SyntaxError', message: m, at: at, text: ''}

  next: (c) ->
    error "Expected "+c+" instead of  "+ch if c && c != ch
    ch = read()
    at++
    return ch
    
  number: ()->
    string: ''
    if ch == '-'
      string = ''
      next '-'
    else
      while ch >= '0' && ch <= '9'
        string += ch
        next()
      if ch == 'e' || ch == 'E'
        string += ch
        next()
        if ch == '-' || ch == '+'
          string += ch
          next()
        while ch > '0' && ch <= '9'
          string += ch
          next()
      number = +string
      if isNaN number
        error "Bad number"
      else
        return number
      
  string: () -> 
    string = ''
    if ch == '"'
      while next()
        if ch == '"'
          next()
          return string
        else if ch == '\\'
          next()
          if ch == 'u'
            uffff = 0
            for i in [0...4]
              hex = parseInt(next(), 16)
              if !isFinite(hex)
                break
              uffff = uffff * 16 + hex
          else if typeof escapee[ch] == 'string'
            string += escapee[ch]
          else
            break
        else
          string += ch
    error "Bad string"
    
  white: () ->
    while ch && ch <= ' '
      next()

  
  word: () ->
    if ch == 't'
      next 't'
      next 'r'
      next 'u'
      next 'e'
      return true
    else if ch == 'f'
      next 'f'
      next 'a'
      next 'l'
      next 's'
      next 'e'
      return false
    else if ch == 'n'
      next 'n'
      next 'u'
      next 'l'
      next 'l'
      return null
    error 'Unexpected '+ch
    
  array: () ->
    array = []
    if ch == '['
      next '['
      white();
      if ch == ']'
        next ']'
        return array
      else
        while ch
          array.push value()
          white()
          if ch == ']'
            next ']'
            return array
          next ','
          white()
    error 'bad array'
  
  object: () ->
    object: {}
    key: ''
    if ch == '{'
      next '{'
      white()
      if ch == '}'
        next '}'
        return object
      while ch
        key = string()
        white()
        next ':'
        if Object.hasOwnProperty.call(object, key)
          error 'Duplicate key '+key
        object[key] = value()
        white()
        if ch == '}'
          next '}'
          return object
    error "bad object"

  value: (_return) ->
    #white()
    if ch == '{'
      object(_return)
    else if ch == '['
      array(_return)
    else if ch == '"'
      string(_return)
    else if ch == '-'
      number(_return)      
    else if ch >= '0' && ch <= '9'
      number(_return)
    else
      word(_return)
    
  
  ch = ' '
  at = 0
  result = value()
  white()
  return result
  

blah = '[1,2,3,4,5]'
pos = 0
_read: (cb) ->
  return blah[pos++]


print(JSON.stringify(json_parse _read))

