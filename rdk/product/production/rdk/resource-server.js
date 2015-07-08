/*jslint node: true */
'use strict';

var rdk = require('./rdk/rdk');

var app = rdk.appfactory().defaultConfigFilename('../config/config.js').argv(process.argv).build();
// app.register
// app.start

app.register('authentication', '/authentication', require('./resources/authentication/authResource').getResourceConfig(app));
app.register('user-service', '/user', require('./resources/user/userResource').getResourceConfig(app));

app.register('synchronization', '/sync', require('./resources/patientrecord/patientsyncResource').getResourceConfig(app));  // todo: missing apiDocs

app.register('asu', '/asu', require('./resources/asu/asuResource').getResourceConfig(app));

app.register('patient-search', '/patient-search', require('./resources/patientsearch/patientSearch').getResourceConfig(app));
app.register('search', '/patient-search', require('./resources/patientsearch/searchResource.js').getResourceConfig(app));

app.register('uid', '/patient/record/uid', require('./resources/patientrecord/patientUidResource').getResourceConfig(app));
app.register('patient-record-search', '/patient/record/search', require('./resources/patientrecord/search/patientRecordSearch').getResourceConfig(app));
app.register('patient-record', '/patient/record', require('./resources/patientrecord/patientrecordResource').getResourceConfig(app));
app.register('clinical-reminder', '/patient/record/clinical-reminders', require('./resources/clinicalreminders/clinicalremindersResource').getResourceConfig(app));
app.register('patient-record-complexnote', '/patient/record/complex-note', require('./resources/patientrecord/patientcomplexnoteResource').getResourceConfig(app));
app.register('patient-record-cwad', '/patient/record/cwad', require('./resources/patientrecord/patientcwadResource').getResourceConfig(app));
app.register('patient-record-labsbyorder', '/patient/record/labs/by-order', require('./resources/labsearchbyorder/labsearchbyorderResource').getResourceConfig(app));
app.register('patient-record-labsbypanel', '/patient/record/labs/by-panel', require('./resources/labpanels/labpanelsResource').getResourceConfig(app));
app.register('patient-record-labsbytype', '/patient/record/labs/by-type', require('./resources/labsearchbytype/labsearchbytypeResource').getResourceConfig(app));
app.register('patient-record-searchbytype', '/patient/record/labs/by-type', require('./resources/searchbytype/searchbytypeResource').getResourceConfig(app));
app.register('patient-record-timeline', '/patient/record/timeline', require('./resources/patientrecord/patienttimelineResource').getResourceConfig(app));

app.register('healthsummaries', '/patient/health-summaries', require('./resources/healthsummaries/healthSummariesResource').getResourceConfig(app));
app.register('global-timeline', '/patient/global-timeline', require('./resources/globaltimeline/globaltimelineResource').getResourceConfig(app));
app.register('patientphoto', '/patient/photo', require('./resources/patientphoto/patientPhotoResource').getResourceConfig(app));

app.register('cds-advice', '/cds/advice', require('./resources/cdsadvice/cdsAdviceResource').getResourceConfig(app));
app.register('cdsworkproduct', '/cds/work-product', require('./resources/cdsworkproduct/cdsWorkProductResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('patient-list', '/cds/patient', require('./resources/patientlist/patientlistResource').getResourceConfig(app));

app.register('immunization-crud', '/immunizations', require('./resources/immunizations/immunizationResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('locations', '/locations', require('./resources/supportdata/locationsResource').getResourceConfig(app));
// Order Details resource using RPC call
app.register('order', '/order', require('./resources/singleorder/orderDetail').getResourceConfig(app));
app.register('problems', '/problems', require('./resources/problems/problemsResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('visits', '/visits', require('./resources/visits/visitsResource').getResourceConfig(app));
app.register('vitals', '/vitals', require('./resources/vitals/vitalsResource').getResourceConfig(app));

app.register('user-defined-screens', '/user/screens', require('./resources/userdefinedscreens/userdefinedscreensResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('write-user-defined-screens', '/user/screens', require('./resources/userdefinedscreens/writeuserdefinedscreensResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('user-defined-filter', '/user/filter', require('./resources/userdefinedscreens/userdefinedfilterResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('user-defined-sort', '/user/sort', require('./resources/userdefinedscreens/userdefinedsortResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('user-defined-stack', '/user/stack', require('./resources/userdefinedscreens/userdefinedstackResource').getResourceConfig(app));

//vler
app.register('toc', '/vler/:pid/toc', require('./vler/toc/tocResource').getResourceConfig(app));  // todo: missing apiDocs, update path for standardization

app.register('allergy-op-data', '/writeback/allergy', require('./resources/writebackallergy/operationaldataResource').getResourceConfig(app));
app.register('med-op-data', '/writeback/med', require('./resources/writebackmed/operationaldataResource').getResourceConfig(app));
// save outpatient medication using RPC call
app.register('write-back-outpatient-med', '/writeback/opmed', require('./resources/writebackmed/writebackopmedorderResource').getResourceConfig(app));  // todo: missing apiDocs
//TODO: The write-back resources below are pre-production and will be moved to a separate resource server prior to delivery.
app.register('write-back-save-allergy', '/writeback/allergy/save', require('./resources/writebackallergy/writebackallergysaveResource').getResourceConfig(app));
app.register('write-back-allergy-error', '/writeback/allergy/error', require('./resources/writebackallergy/enteredinerrorResource').getResourceConfig(app));
app.register('write-back-save-vitals', '/writeback/vitals/save', require('./resources/vitals/writebackvitalssaveResource').getResourceConfig(app));
app.register('write-back-vitals-error', '/writeback/vitals/error', require('./resources/vitals/enteredinerrorResource').getResourceConfig(app));
app.register('write-back-save-nonVA-med', '/writeback/medication/save', require('./resources/writebackmed/writebackmedicationsaveResource').getResourceConfig(app));

//fhir
app.register('patient-demographics', '/fhir/patient/:id', require('./fhir/patientdemographics/patientdemographicsResource').getResourceConfig(app));
app.register('adversereaction', '/fhir/adverseReaction', require('./fhir/adverseReaction/adversereactionResource').getResourceConfig(app));
app.register('vitals', '/fhir/observation', require('./fhir/observation/observationResource').getResourceConfig(app));  // todo: missing apiDocs
app.register('diagnosticreport', '/fhir/diagnosticreport', require('./fhir/diagnosticReport/diagnosticreportResource').getResourceConfig(app));
app.register('order', '/fhir/order', require('./fhir/order/orderResource').getResourceConfig(app));
app.register('condition', '/fhir/condition', require('./fhir/condition/conditionlistResource').getResourceConfig(app));
app.register('immunization', '/fhir/immunization', require('./fhir/immunization/immunizationResource').getResourceConfig(app));
app.register('composition', '/fhir/composition', require('./fhir/composition/compositionResource').getResourceConfig(app));
app.register('referralrequest', '/fhir/referralrequest', require('./fhir/referralrequest/referralrequestResource').getResourceConfig(app));
app.register('medicationdispense', '/fhir/medicationdispense', require('./fhir/medicationdispense/medicationdispenseResource').getResourceConfig(app));
app.register('medicationadministration', '/fhir/medicationadministration', require('./fhir/medicationAdministration/medicationadministrationResource').getResourceConfig(app));
app.register('medicationdstatement', '/fhir/medicationstatement', require('./fhir/medicationstatement/medicationstatementResource').getResourceConfig(app));

//Authentication
//TODO this will be moved to its own resource server prior to delivery
app.register('authorize', '/authorize', require('./resources/authorization/authorizationCheck').getResourceConfig(app));  // todo: missing apiDocs

//ccow
app.register('vergencevaultproxy', '/vergencevaultproxy', require('./resources/vergencevaultproxy/vergenceVaultProxyResource').getResourceConfig(app));  // todo: missing apiDocs

// Metrics Resource
app.register('metrics', '/metrics', require('./resources/metrics/metricsResource').getResourceConfig(app));  // todo: missing apiDocs

// SAMPLE RESOURCE. note, adding this will break the acceptance build.
//app.register('sample-service', '/sample-service', require('./resources/sample/sampleResource').getResourceConfig(app));

// TEST RESOURCE for Generic RPC Calls
app.register('vista-js', '/test', require('./resources/vistaResource').getResourceConfig(app));

app.register('operational-data', '/operational-data/type/', require('./resources/jdsoperationaldata/opDataResource').getResourceConfig(app));

app.logger.info('app created with ' + app.resourceRegistry.getResources().length + ' mounted endpoints');

// todo: move listen to start
var port = app.config.appServer.port;
app.listen(port, function () {
    app.logger.info('application now listening on %s', port);
});
