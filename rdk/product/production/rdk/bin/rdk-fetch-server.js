#!/usr/bin/env node

'use strict';

var rdk = require('../src/core/rdk');

var app = rdk.appfactory().defaultConfigFilename('../../config/rdk-fetch-server-config.json').argv(process.argv).build();
// app.register
// app.start

app.register('authentication', '/authentication', require('../src/resources/authentication/auth-resource').getResourceConfig(app));
app.register('user-service', '/user', require('../src/resources/user/user-resource').getResourceConfig(app));

app.register('synchronization', '/sync', require('../src/resources/patient-record/patient-sync-resource').getResourceConfig(app)); // todo: missing apiDocs

app.register('asu', '/asu', require('../src/resources/asu-resource').getResourceConfig(app));

app.register('patient-search', '/patient-search', require('../src/resources/patient-search/patient-search-resource').getResourceConfig(app));
app.register('search', '/patient-search', require('../src/resources/patient-search/search-resource.js').getResourceConfig(app));

app.register('uid', '/patient/record/uid', require('../src/resources/patient-record/patient-uid-resource').getResourceConfig(app));
app.register('patient-record-search', '/patient/record/search', require('../src/resources/patient-record/search/patient-record-search-resource').getResourceConfig(app));
app.register('patient-record', '/patient/record', require('../src/resources/patient-record/patient-record-resource').getResourceConfig(app));
app.register('clinical-reminder', '/patient/record/clinical-reminders', require('../src/resources/clinical-reminders/clinical-reminders-resource').getResourceConfig(app));
app.register('patient-record-complexnote', '/patient/record/complex-note', require('../src/resources/patient-record/patient-complex-note-resource').getResourceConfig(app));
app.register('patient-record-cwad', '/patient/record/cwad', require('../src/resources/patient-record/patient-cwad-resource').getResourceConfig(app));
app.register('patient-record-labsbyorder', '/patient/record/labs/by-order', require('../src/resources/lab-search-by-order-resource').getResourceConfig(app));
app.register('patient-record-labsbypanel', '/patient/record/labs/by-panel', require('../src/resources/lab-panels/lab-panels-resource').getResourceConfig(app));
app.register('patient-record-labsbytype', '/patient/record/labs/by-type', require('../src/resources/lab-search-by-type-resource').getResourceConfig(app));
app.register('patient-record-searchbytype', '/patient/record/labs/by-type', require('../src/resources/search-by-type/search-by-type-resource').getResourceConfig(app));
app.register('patient-record-timeline', '/patient/record/timeline', require('../src/resources/patient-record/patient-timeline-resource').getResourceConfig(app));
app.register('patient-entered-goals', '/patient/record/patient-entered-goals', require('../src/resources/patient-record/patient-generated-data/patient-goals-resource').getResourceConfig(app));
app.register('patient-self-assessment', '/patient/record/patient-self-assessment', require('../src/resources/patient-record/patient-generated-data/patient-assessment-resource').getResourceConfig(app));
app.register('patient-service-connected', '/patient/record/service-connected', require('../src/resources/service-connected/service-connected-resource').getResourceConfig(app));

app.register('healthsummaries', '/patient/health-summaries', require('../src/resources/health-summaries-resource').getResourceConfig(app));
app.register('global-timeline', '/patient/global-timeline', require('../src/resources/global-timeline-resource').getResourceConfig(app));
app.register('patientphoto', '/patient/photo', require('../src/resources/patient-photo/patient-photo-resource').getResourceConfig(app));

// CDS
app.register('cds-advice', '/cds/advice', require('../src/resources/cdsadvice/cds-advice-resource').getResourceConfig(app));
app.register('cdsworkproduct', '/cds/work-product', require('../src/resources/cds-work-product/cds-work-product-resource').getResourceConfig(app)); // todo: missing apiDocs
//cds patient criteria, definitions, list
app.register('patient-list', '/cds/patient', require('../src/resources/patient-list/patient-list-resource').getResourceConfig(app));
//cds job scheduler
app.register('cdsschedule', '/cds/schedule', require('../src/resources/cds-schedule/cds-schedule-resource').getResourceConfig(app));
app.register('cdsexecute', '/cds/execute', require('../src/resources/cds-schedule/cds-execute-resource').getResourceConfig(app));
app.register('cdsengine', '/cds/engine', require('../src/resources/cds-engine/cds-engine-resource').getResourceConfig(app));
app.register('cdsintent', '/cds/intent', require('../src/resources/cds-intent/cds-intent-resource').getResourceConfig(app));

app.register('immunization-crud', '/immunizations', require('../src/resources/immunizations/immunization-resource').getResourceConfig(app)); // todo: missing apiDocs
app.register('locations', '/locations', require('../src/resources/locations-resource').getResourceConfig(app));
// Order Details resource using RPC call
app.register('order', '/order', require('../src/resources/order-detail-resource').getResourceConfig(app));
app.register('problems', '/problems', require('../src/resources/problems-resource').getResourceConfig(app)); // todo: missing apiDocs
app.register('visits', '/visits', require('../src/resources/visits/visits-resource').getResourceConfig(app));
app.register('visit-service-category', '/visit', require('../src/resources/visits/visit-service-category-resource').getResourceConfig(app));
app.register('vitals', '/vitals', require('../src/resources/vitals/vitals-resource').getResourceConfig(app));
app.register('tasks', '/tasks', require('../src/resources/tasks/tasks-resource').getResourceConfig(app));
app.register('notes', '/notes', require('../src/resources/notes-resource').getResourceConfig(app));
app.register('notes-titles', '/notes/recent-titles', require('../src/resources/notes-title-resource').getResourceConfig(app));


app.register('user-defined-screens', '/user/screens', require('../src/resources/user-defined-screens/user-defined-screens-resource').getResourceConfig(app)); // todo: missing apiDocs
app.register('write-user-defined-screens', '/user/screens', require('../src/resources/user-defined-screens/write-user-defined-screens-resource').getResourceConfig(app)); // todo: missing apiDocs
app.register('user-defined-filter', '/user/filter', require('../src/resources/user-defined-screens/user-defined-filter-resource').getResourceConfig(app)); // todo: missing apiDocs
app.register('user-defined-sort', '/user/sort', require('../src/resources/user-defined-screens/user-defined-sort-resource').getResourceConfig(app)); // todo: missing apiDocs
app.register('user-defined-stack', '/user/stack', require('../src/resources/user-defined-screens/user-defined-stack-resource').getResourceConfig(app));

//vler
app.register('toc', '/vler/:pid/toc', require('../src/resources/vler/toc/toc-resource').getResourceConfig(app)); // todo: missing apiDocs, update path for standardization

app.register('allergy-op-data', '/writeback/allergy', require('../src/resources/writebackallergy/operationaldataResource').getResourceConfig(app));
app.register('med-op-data', '/writeback/med', require('../src/resources/writebackmed/operationaldataResource').getResourceConfig(app));
// save outpatient medication using RPC call
app.register('write-back-outpatient-med', '/writeback/opmed', require('../src/resources/writebackmed/writebackopmedorderResource').getResourceConfig(app)); // todo: missing apiDocs
//TODO: The write-back resources below are pre-production and will be moved to a separate resource server prior to delivery.
app.register('write-back-save-allergy', '/writeback/allergy/save', require('../src/resources/writebackallergy/writebackallergysaveResource').getResourceConfig(app));
app.register('write-back-allergy-error', '/writeback/allergy/error', require('../src/resources/writebackallergy/enteredinerrorResource').getResourceConfig(app));
app.register('write-back-save-vitals', '/writeback/vitals/save', require('../src/resources/vitals/writebackvitalssaveResource').getResourceConfig(app));
app.register('write-back-vitals-error', '/writeback/vitals/error', require('../src/resources/vitals/entered-in-error-resource').getResourceConfig(app));
app.register('write-back-save-nonVA-med', '/writeback/medication/save', require('../src/resources/writebackmed/writebackmedicationsaveResource').getResourceConfig(app));

//fhir
app.register('patient-demographics', '/fhir/patient/:id', require('../src/fhir/patient-demographics/patient-demographics-resource').getResourceConfig(app));
app.register('adversereaction', '/fhir/adverseReaction', require('../src/fhir/adverse-reaction/adverse-reaction-resource').getResourceConfig(app));
app.register('allergyIntolerance', '/fhir/allergyintolerance', require('../src/fhir/allergy-intolerance/allergy-intolerance-resource').getResourceConfig(app));
app.register('vitals', '/fhir/patient/:id/observation', require('../src/fhir/observation/observation-resource').getResourceConfig(app)); // TODO: missing docs  //TODO: need to refactor to separate vitals resource
app.register('healthFactors', '/fhir/healthFactors', require('../src/fhir/health-factors/health-factors-resource').getResourceConfig(app));
app.register('educations', '/fhir/educations', require('../src/fhir/educations/educations-resource').getResourceConfig(app));
app.register('diagnosticreport', '/fhir/diagnosticreport', require('../src/fhir/diagnostic-report/diagnostic-report-resource').getResourceConfig(app));
app.register('order', '/fhir/order', require('../src/fhir/order/order-resource').getResourceConfig(app));
app.register('condition', '/fhir/condition', require('../src/fhir/condition/condition-list-resource').getResourceConfig(app));
app.register('immunization', '/fhir/immunization', require('../src/fhir/immunization/immunization-resource').getResourceConfig(app));
app.register('composition', '/fhir/composition', require('../src/fhir/composition/composition-resource').getResourceConfig(app));
app.register('referralrequest', '/fhir/referralrequest', require('../src/fhir/referral-request/referral-request-resource').getResourceConfig(app));
app.register('medicationdispense', '/fhir/medicationdispense', require('../src/fhir/medication-dispense/medication-dispense-resource').getResourceConfig(app));
app.register('medicationadministration', '/fhir/medicationadministration', require('../src/fhir/medication-administration/medication-administration-resource').getResourceConfig(app));
app.register('medicationdstatement', '/fhir/medicationstatement', require('../src/fhir/medication-statement/medication-statement-resource').getResourceConfig(app));
app.register('medicationprescription', '/fhir/medicationprescription', require('../src/fhir/medication-prescription/medication-prescription-resource').getResourceConfig(app));

//Authentication
//TODO this will be moved to its own resource server prior to delivery
app.register('authorize', '/authorize', require('../src/resources/authorization-check-resource').getResourceConfig(app)); // todo: missing apiDocs

app.register('operational-data', '/operational-data/type/', require('../src/resources/jds-operational-data/op-data-resource').getResourceConfig(app));

//vler
app.register('toc', '/vler/:pid/toc', require('../src/resources/vler/toc/toc-resource').getResourceConfig(app));

//ccow
app.register('vergencevaultproxy', '/vergencevaultproxy', require('../src/resources/vergence-vault-proxy-resource').getResourceConfig(app)); // todo: missing apiDocs

// Metrics Resource
app.register('metrics', '/metrics', require('../src/resources/metrics/metrics-resource').getResourceConfig(app)); // todo: missing apiDocs

// Vista Roles Resource
app.register('roles', '/roles', require('../src/resources/roles/roles-resource').getResourceConfig(app));

// Vista Encounter Resource
app.register('encounter', '/encounter', require('../src/resources/encounter/encounter-resource').getResourceConfig(app));

// SAMPLE RESOURCE. note, adding this will break the acceptance build.
//app.register('sample-service', '/sample-service', require('../src/resources/sample/sampleResource').getResourceConfig(app));

// TEST RESOURCE for Generic RPC Calls
app.register('vista-js', '/test', require('../src/resources/vista-resource').getResourceConfig(app));

app.logger.info('app created with ' + app.resourceRegistry.getResources().length + ' mounted endpoints');

// todo: move listen to start
var port = app.config.appServer.port;
app.listen(port, function() {
    app.logger.info('application now listening on %s', port);
});
