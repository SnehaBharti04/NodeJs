// array methods in Javascript

var mult = function(a, b){
    return a*b
}

console.log(mult(4,8))

var arr = [23, 56, 78]
console.log("before", arr)
arr.push(43)
console.log(arr)

var p = arr.pop()
console.log(arr, p)