define([
    'app/screens/AccessControlCoordinator',
    'app/screens/ProviderCentricView'
], function(AccessControlCoordinator, ProviderCentricView) {
    'use strict';
    var predefinedScreens = {};

    var screens = [{
        title: 'Coversheet',
        id: 'cover-sheet',
        screenId: 1,
        routeName: 'cover-sheet',
        predefined: true,
        description: ''
    }, {
        title: 'Timeline',
        id: 'news-feed',
        screenId: 2,
        routeName: 'news-feed',
        description: '',
        predefined: true
    }, {
        title: 'Overview',
        id: 'overview',
        screenId: 3,
        routeName: 'overview',
        description: '',
        predefined: true,
        defaultScreen: true
    }, {
        title: 'Meds Review',
        id: 'medication-review',
        screenId: 4,
        routeName: 'medication-review',
        description: '',
        predefined: true
    }, {
        title: 'Documents',
        id: 'documents-list',
        screenId: 5,
        routeName: 'documents-list',
        description: '',
        predefined: true
    }, {
        title: 'Depression CBW',
        id: 'depression-cbw',
        screenId: 6,
        routeName: 'depression-cbw',
        description: '',
        predefined: true
    }, {
        title: 'Diabetes Mellitus CBW',
        id: 'diabetes-mellitus-cbw',
        screenId: 7,
        routeName: 'diabetes-mellitus-cbw',
        description: '',
        predefined: true
    }, {
        title: 'Hypertension CBW',
        id: 'hypertension-cbw',
        screenId: 8,
        routeName: 'hypertension-cbw',
        description: '',
        predefined: true
    }, {
        title: 'Pre-Procedure CBW',
        id: 'pre-procedure-cbw',
        screenId: 9,
        routeName: 'pre-procedure-cbw',
        description: '',
        predefined: true
    }, {
        title: 'Access Control Coordinator',
        id: 'access-control-coordinator',
        screenId: 10,
        routeName: 'access-control-coordinator',
        description: '',
        predefined: true,
        hasPermission: function() {
            return AccessControlCoordinator.hasPermission();
        },
        addNavigationTab: true
    }, {
        title: 'My Workspace',
        id: 'provider-centric-view',
        screenId: 11,
        routeName: 'provider-centric-view',
        description: '',
        predefined: true,
        hasPermission: function() {
            return ProviderCentricView.hasPermission();
        },
        addNavigationTab: true
    }];

    predefinedScreens.screens = screens;

    return predefinedScreens;
});