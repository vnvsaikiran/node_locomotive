var d = {a: {b: 12, c: [1,2,3]}, b: 123, c: {d: 10, e: {f: { g: 10, h: 11, i: {j: 11} }}}};

function copyObject(a){
	if (null == a || "object" != typeof a) return a;
	var c = {};
	for(var i in a){
		if(a[i] != undefined && (a[i] instanceof Object || a[i] instanceof Array)){
			c[i] = copyObject(a[i]);
		}else if(a[i] != undefined && a[i] instanceof Date){
			var copy = new Date();
			c[i] = copy.setTime(a[i].getTime());
		}else{
			c[i] = a[i];
		}		
	}
	return c;
}
var a = copyObject(d);