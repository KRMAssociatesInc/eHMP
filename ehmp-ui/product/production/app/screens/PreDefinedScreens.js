define(function() {
    'use strict';
    var predefinedScreens = {};

    var screens = [{
        title: 'Coversheet',
        id: 'cover-sheet',
        routeName: 'cover-sheet',
        predefined: true,
        description: ''
    }, {
        title: 'Timeline',
        id: 'news-feed',
        routeName: 'news-feed',
        description: '',
        predefined: true
    }, {
        title: 'Overview',
        id: 'overview',
        routeName: 'overview',
        description: '',
        predefined: true,
        defaultScreen: true
    }, {
        title: 'Meds Review',
        id: 'medication-review',
        routeName: 'medication-review',
        description: '',
        predefined: true
    }, {
        title: 'Documents',
        id: 'documents-list',
        routeName: 'documents-list',
        description: '',
        predefined: true
    }, {
        title: 'Depression CBW',
        id: 'depression-cbw',
        routeName: 'depression-cbw',
        description: '',
        predefined: true
    }, {
        title: 'Diabetes Mellitus CBW',
        id: 'diabetes-mellitus-cbw',
        routeName: 'diabetes-mellitus-cbw',
        description: '',
        predefined: true
    }, {
        title: 'Hypertension CBW',
        id: 'hypertension-cbw',
        routeName: 'hypertension-cbw',
        description: '',
        predefined: true
    }, {
        title: 'Pre-Procedure CBW',
        id: 'pre-procedure-cbw',
        routeName: 'pre-procedure-cbw',
        description: '',
        predefined: true
    }];

    predefinedScreens.screens = screens;

    return predefinedScreens;
});
