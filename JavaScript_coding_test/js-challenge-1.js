/*OPTION-1: valid for more params*/
/*Function.prototype.magic = function(){
  var ME = this, ARGS = Array.from(arguments);
  return function(){
    return ME.apply(null, ARGS.concat(Array.from(arguments)));
  }
}*/

/*OPTION-2: specific to this example*/
Function.prototype.magic = function(a){
  var ME = this;
  return function(b){
    return ME.apply(null, [a, b]);
  }
}

var add = function(a, b) { return a + b; }
var addTo = add.magic(2);

var say = function(something) { return something; }
var welcome = say.magic('Hi, how are you?');

console.log(addTo(5));
console.log(addTo(6));
console.log(welcome());