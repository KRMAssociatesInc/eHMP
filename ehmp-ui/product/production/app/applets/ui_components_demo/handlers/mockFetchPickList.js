define(['jquery',
        'handlebars',
        'moment'],
function($, Handlebars, moment) {
    'use strict';

    var result = [{
        group: 'Alaska/Hawaiian Time Zone',
        pickList: [{
            value: 'AK',
            label: 'Alaska'
        }, {
            value: 'HI',
            label: 'Hawaii'
        }]
    }, {
        group: 'Pacific Time Zone',
        pickList: [{
            value: 'CA',
            label: 'California'
        }, {
            value: 'NV',
            label: 'Nevada'
        }, {
            value: 'OR',
            label: 'Oregon'
        }, {
            value: 'WA',
            label: 'Washington'
        }]
    }, {
        group: 'Mountain Time Zone',
        pickList: [{
            value: 'AZ',
            label: 'Arizona'
        }, {
            value: 'CO',
            label: 'Colorado'
        }, {
            value: 'ID',
            label: 'Idaho'
        }, {
            value: 'MT',
            label: 'Montana'
        }, {
            value: 'NE',
            label: 'Nebraska'
        }, {
            value: 'NM',
            label: 'New Mexico'
        }, {
            value: 'ND',
            label: 'North Dakota'
        }, {
            value: 'UT',
            label: 'Utah'
        }, {
            value: 'WY',
            label: 'Wyoming'
        }]
    }];

    // Simulate asynchronous callbackk
    function doAsync() {
        var deferredObject = $.Deferred();

        setTimeout(function() {
            deferredObject.resolve();
        }, 1000);

        return deferredObject.promise();
    }

    return function (input, setPickList, needMoreInput, onFetchError) {
        var promise = doAsync();

        promise.done(function () {
            if (input.length < 4) {
                needMoreInput(input);
            } else {
                setPickList({pickList: result, input: input});
            }
        });

        promise.fail(function () {
            onFetchError(input);
        });
    };
});
