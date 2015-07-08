/*jslint node: true */
'use strict';

var _ = require('underscore');

function disassemble(string, delimiter, nameList) {
    if(!delimiter) {
        return string;
    }

    var valueList = string.split(delimiter);

    var obj = valueList;
    if(nameList && (_.isArray(nameList) && nameList.length > 0)) {
        obj = {};
        _.each(valueList, function(value, index) {
            if(nameList[index]) {
                obj[nameList[index]] = value;
            }
        });
    }

    return obj;
}


var s1 = '1^2^3^4^5';
console.log(disassemble(s1));
console.log(disassemble(s1, '^'));
console.log(disassemble(s1, '^', ['a', 'b', 'c', 'd', 'e']));
console.log();
console.log(disassemble(s1, '^', ['a', undefined, 'c', null, 'e']));
console.log(disassemble(s1, '^', ['a', 'b', 'c', 'd']));
console.log(disassemble(s1, '^', []));
console.log();
console.log(disassemble(s1, '^', 'test'));
console.log(disassemble(s1, '^', null));
console.log(disassemble(s1, '^', {}));
console.log();
console.log(disassemble(s1, '^', 1));

var map = [];
map[0] = 'a';
map[2] = 'c';
map[4] = 'e';
console.log(disassemble(s1, '^', map));

console.log(_.isNumber('1'));
