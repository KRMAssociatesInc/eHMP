/*jslint node: true */
'use strict';

var rdk = require('./rdk/rdk');

var patientPhotoApp = rdk.appfactory().defaultConfigFilename('../config/patientPhotoConfig.js').argv(process.argv).build();
var patientPhotoPort = patientPhotoApp.config.patientPhotoServer.port;

patientPhotoApp.register('patientphoto', '/patientphoto', require('./resources/patientphoto/patientPhotoResource').getResourceConfig(patientPhotoApp));

patientPhotoApp.listen(patientPhotoPort, function(){
    patientPhotoApp.logger.info('Patient photo now listening on %s', patientPhotoPort);
});
