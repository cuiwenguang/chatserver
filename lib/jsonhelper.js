
//获取map长度
exports.getJSONLength =function(map) {
    var l = 0;
    for(var attr in map){
        l++;
    }
    return l;
}