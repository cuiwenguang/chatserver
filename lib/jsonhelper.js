
//获取map长度
exports.getJSONLength =function(map) {
    var l = 0;
    for(var attr in map){
        l++;
    }
    return l;
}

exports.sortByValue = function(obj, limit) {
    var result = obj.sort(function(a,b) {
       return obj[b] - obj[a]; 
    });
    return result.slice(0,limit);
}
