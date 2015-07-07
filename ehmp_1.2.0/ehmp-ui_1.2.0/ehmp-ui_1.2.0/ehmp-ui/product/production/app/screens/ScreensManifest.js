define(function() {
    'use strict';
    var screensManifest = {
        predefinedDefaultScreen: 'overview',
        logonScreen: 'logon-screen',
        patientSearchScreen: 'patient-search-screen',
        ssoLogonScreen: 'sso'
    };

    var screens = [];

    screens.push({
        routeName: 'logon-screen',
        fileName: 'LogonScreen'
    });
    screens.push({
        routeName: 'patient-search-screen',
        fileName: 'PatientSearch'
    });
    screens.push({
        routeName: 'medication-review',
        fileName: 'MedicationReview'
    });
    screens.push({
        routeName: 'vital-list',
        fileName: 'VitalList'
    });
    screens.push({
        routeName: 'appointments-full',
        fileName: 'AppointmentsFull'
    });
    screens.push({
        routeName: 'immunizations-full',
        fileName: 'ImmunizationsFull'
    });
    screens.push({
        routeName: 'reports-full',
        fileName: 'ReportsFull'
    });
    screens.push({
        routeName: 'lab-results-grid-full',
        fileName: 'LabResultsGridFull'
    });
    screens.push({
        routeName: 'cover-sheet',
        fileName: 'CoverSheet'
    });
    screens.push({
        routeName: 'cover-sheet-gridster',
        fileName: 'CoverSheetGridster'
    });
    screens.push({
        routeName: 'allergy-grid-full',
        fileName: 'AllergyGridFull'
    });
    screens.push({
        routeName: 'documents-list',
        fileName: 'Documents'
    });
    screens.push({
        routeName: 'record-search',
        fileName: 'RecordSearch'
    });
    screens.push({
        routeName: 'problems-full',
        fileName: 'ProblemsGridFull'
    });
    screens.push({
        routeName: 'orders-full',
        fileName: 'OrdersFull'
    });
    screens.push({
        routeName: 'news-feed',
        fileName: 'NewsFeed'
    });
    screens.push({
        routeName: 'vitals-full',
        fileName: 'VitalsFull'
    });
    screens.push({
        routeName: 'visit-select',
        fileName: 'VisitSelection'
    });
    screens.push({
        routeName: 'ccd-list-full',
        fileName: 'CCDListFull'
    });
    screens.push({
        routeName: 'overview',
        fileName: 'Overview'
    });
    screens.push({
        routeName: 'cds-advice-full',
        fileName: 'CDSAdviceFull'
    });
    screens.push({
        routeName: 'sso',
        fileName: 'ssoLogonScreen'
    });
    screens.push({
        routeName: 'depression-cbw',
        fileName: 'DepressionCBW'
    });
    screens.push({
        routeName: 'diabetes-mellitus-cbw',
        fileName: 'DiabetesMellitusCBW'
    });
    screens.push({
        routeName: 'hypertension-cbw',
        fileName: 'HypertensionCBW'
    });
    screens.push({
        routeName: 'pre-procedure-cbw',
        fileName: 'PreProcedureCBW'
    });

    screensManifest.screens = screens;

    return screensManifest;
});
