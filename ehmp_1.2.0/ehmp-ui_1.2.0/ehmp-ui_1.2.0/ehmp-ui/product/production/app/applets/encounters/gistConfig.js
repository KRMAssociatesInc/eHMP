define([
    "moment",
    "backbone",
    "app/applets/encounters/appConfig"
], function(Moment, Backbone, CONFIG) {
    'use strict';

    var gistConfiguration = {
        gistHeaders: {
            visits: {
                name: {
                    title: 'Visit Type',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Last',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            },
            procedures: {
                name: {
                    title: 'Procedure name',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Last',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            },
            appointments: {
                name: {
                    title: 'Appointment Type',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Last',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            },
            admissions: {
                name: {
                    title: 'Diagnosis',//'Location - CLN/WARD',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Last',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            }
        },
        gistModel: [{
            id: 'groupName',
            field: 'subKind'
        }, {
            id: 'encounterCount',
            field: 'count'
        }, {
            id: 'timeSince', //'age',
            field: 'time'
        }, ],
        filterFields: ['groupName', 'problemText', 'acuityName'],
        defaultView: 'encounters'
    };
    return gistConfiguration;
});
