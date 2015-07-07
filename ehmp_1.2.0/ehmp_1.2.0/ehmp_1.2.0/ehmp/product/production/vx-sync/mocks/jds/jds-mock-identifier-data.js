'use strict';

var _ = require('underscore');

var mockData = {
    '21EC2020-3AEA-4069-A2DD-08002B30309D': [
        'ABCD;0',
        'WXYZ;9'
    ],
    '21EC2020-3AEA-4069-A2DD-AAAAAAAAAAAA': [
        'ABCD;1',
        'WXYZ;8'
    ],
    '21EC2020-3AEA-4069-A2DD-BBBBBBBBBBBB': [
        'ABCD;2',
        'WXYZ;7'
    ],
    '21EC2020-3AEA-4069-A2DD-CCCCCCCCCCCC': [
        'ABCD;3',
        'WXYZ;6',
        '9E7A;42'
    ],
    'identifierToJpidMap': {}
};

_.forEach(mockData, function(identifiers, jpid) {
    _.forEach(identifiers, function(identifierItem) {
        mockData.identifierToJpidMap[identifierItem] = jpid;
    });
});

module.exports = mockData;