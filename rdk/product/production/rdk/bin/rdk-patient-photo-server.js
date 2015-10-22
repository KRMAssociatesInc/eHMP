#!/usr/bin/env node

'use strict';

var rdk = require('../src/core/rdk');

var patientPhotoApp = rdk.appfactory().defaultConfigFilename('../../config/patient-photo-config.js').argv(process.argv).build();
var patientPhotoPort = patientPhotoApp.config.patientPhotoServer.port;

patientPhotoApp.register('patientphoto', '/patientphoto', require('../src/resources/patient-photo/patient-photo-resource').getResourceConfig(patientPhotoApp));

patientPhotoApp.listen(patientPhotoPort, function(){
    patientPhotoApp.logger.info('Patient photo now listening on %s', patientPhotoPort);
});
