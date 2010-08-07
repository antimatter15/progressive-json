var test = '[1,22,[43,4],56,"cheesecake",234,462]';

var pos = 0;
var last = '';
var cur = '';
function read(callback){
	last = cur;
	cur = test[pos++];
	console.log('reading '+cur)
	if(!cur){
		//console.log('fatal error')
		//return 
	}
	callback(cur)
}

function readwhile(callback){
	read(function(){
		if(callback() === false){
			//diediedie
		}else{
			readwhile(callback)
		}
	})
}


function number(_return){
	var strnum = cur;
	console.log('starting number with ',cur)
	readwhile(function(){
		if(cur >= '0' && cur <= '9'){
			strnum += cur;
		}else{
			console.log('done number',parseInt(strnum,10))
			_return(parseInt(strnum,10));
			return false
		}
	})
}

function array(_return){
	var arr = [];
	var add = function(){
		value(function(obj){
			console.log('recieved obj ',obj)
			arr.push(obj);
			if(cur == ','){
				console.log('continuing array')
				add();
			}else if(cur == ']'){
				console.log('ending array ',arr)
				read(function(){
					_return(arr)
				})
			}
		})
	}
	add();
}

function object(_return){
	var obj = {};
	var add = function(){
		read(function(){
			if(cur != '"') throw "unexpected non poopy char";
			string(function(key){
				obj[key]
				
			})
		})
	};
	add();
}

function string(_return){
	var str = '';
	readwhile(function(){
		if(cur == '"' && last != '\\'){
			console.log('completed string', str)
			read(function(){
				_return(str);				
			})
			return false;
		}else{
			str += cur;
		}
	})
}

function value(_return){
	read(function(){
		if(cur == '{'){
			object(_return)
		}else if(cur == '['){
			array(_return)
		}else if(cur == '"'){
			string(_return)
		}else if(cur >= '0' && cur <= '9'){
			number(_return)
		}
	})
}

value(function(done){
	console.log('completed all parsing',done)
})