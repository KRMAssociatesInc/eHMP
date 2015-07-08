define(function() {
    'use strict';
    var appletsManifest = {};

    var applets = [{
        id: 'vitals',
        title: 'Vitals',
        maximizeScreen: 'vitals-full',
        showInUDWSelection: true //true to show up in User Defined Workspace Carousel
    }, {
        id: 'stackedGraph',
        title: 'Stacked Graphs',
        showInUDWSelection: true
    }, {
        id: 'activeMeds',
        title: 'Medications',
        showInUDWSelection: true
    }, {
        id: 'problems',
        title: 'Conditions',
        maximizeScreen: 'problems-full',
        showInUDWSelection: true
    }, {
        id: 'lab_results_grid',
        title: 'Lab Results',
        maximizeScreen: 'lab-results-grid-full',
        showInUDWSelection: true
    }, {
        id: 'encounters',
        title: 'Encounters',
        maximizeScreen: 'news-feed',
        showInUDWSelection: true
    }, {
        id: 'appointments',
        title: 'Appointments & Visits',
        maximizeScreen: 'appointments-full',
        showInUDWSelection: true
    }, {
        id: 'immunizations',
        title: 'Immunizations',
        maximizeScreen: 'immunizations-full',
        showInUDWSelection: true
    }, {
        id: 'allergy_grid',
        title: 'Allergies',
        maximizeScreen: 'allergy-grid-full',
        showInUDWSelection: true
    }, {
        id: 'orders',
        title: 'Orders',
        maximizeScreen: 'orders-full',
        showInUDWSelection: true
    }, {
        id: 'ccd_grid',
        title: 'Community Health Summaries',
        maximizeScreen: 'ccd-list-full',
        showInUDWSelection: true
    }, {
        id: 'cds_advice',
        title: 'Clinical Reminders',
        maximizeScreen: 'cds-advice-full',
        showInUDWSelection: true
    }, {
        id: 'documents',
        title: 'Documents',
        showInUDWSelection: true
    }, {
        id: 'medication_review_v2',
        title: 'Medications Review',
        showInUDWSelection: true
    }, {
        id: 'newsfeed',
        title: 'Timeline',
        showInUDWSelection: true
    }, {
        id: 'vista_health_summaries',
        title: 'VistA Health Summaries',
        showInUDWSelection: true
    }, {
        id: 'reports',
        title: 'Reports',
        showInUDWSelection: true
    }, {
        id: 'addApplets',
        title: 'Add Applets'
    }, {
        id: 'workspaceManager',
        title: 'Workspace Manager'
    }, {
        id: 'logon', // this and those below added from applets coming from screens
        title: 'Logon'
    }, {
        id: 'patient_search',
        title: 'Patient Search'
    }, {
        id: 'add_nonVA_med',
        title: 'Add Non-VA Med'
    }, {
        id: 'discontinueNonVaMed',
        title: 'Discontinued Non-VA Med'
    }, {
        id: 'reports',
        title: 'Reports'
    }, {
        id: 'discharge_summary',
        title: 'Discharge Summary'
    }, {
        id: 'consults',
        title: 'Consults'
    }, {
        id: 'surgery',
        title: 'Surgery Report'
    }, {
        id: 'addAllergy',
        title: 'Add New Allergy'
    }, {
        id: 'allergyEiE',
        title: 'Allergy - Entered In Error'
    }, {
        id: 'addOrder',
        title: 'Add New Order'
    }, {
        id: 'addVitals',
        title: 'Add New Vitals'
    }, {
        id: 'vitalsEiE',
        title: 'Vitals in Error'
    }, {
        id: 'vitalsObservationList',
        title: 'Patient Vitals Observed List'
    }, {
        id: 'visit',
        title: 'Visit'
    }, {
        id: 'visit_selection',
        title: 'Visit Selection'
    }, {
        id: "modalTest",
        title: "Modal Tests"
    }, {
        id: "addLabOrder",
        title: "add-lab-order"
    }, {
        id: 'search',
        title: 'Search'
    }, {
        id: "problems_add_edit",
        title: "Add/Edit Problem"
    }, {
        id: "ssoLogon",
        title: "Auto Signing In"
    }];

    appletsManifest.applets = applets;

    return appletsManifest;
});
