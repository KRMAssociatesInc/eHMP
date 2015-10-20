'use strict';

//requires
var _ = require('underscore');
var async = require('async');
var uuid = require('node-uuid');

function SyncRulesEngine(log, config, environment) {
    this.log = log;
    this.metrics = environment.metrics;
    this.config = config;
    this.environment = environment;
    this.rules = this._getRulesFromConfig();
}

SyncRulesEngine.prototype.getSyncPatientIdentifiers = function(patientIdentifiers, exceptions, mainCallback) {
    var self = this;
    var metricObj = {'subsystem':'RulesEngine','pid':patientIdentifiers[0].value, 'process':uuid.v4(), 'timer':'start'};
    self.metrics.trace('Sync Rules', metricObj);
    metricObj.timer = 'stop';
    async.eachSeries(self.rules, function(rule, ruleCallback){
        if (patientIdentifiers.length === 0 || _.isEmpty(patientIdentifiers[0].value)) {
            return ruleCallback();
        } else {
            rule(self.log, self.config, self.environment, patientIdentifiers, exceptions, function(err, result){
                patientIdentifiers = result;
                return ruleCallback();
             });
        }
    }, function(err) {
        self.metrics.trace('Sync Rules', metricObj);
        if(patientIdentifiers.length === 0) {
            self.metrics.warn('Patient Sync Aborted', metricObj);
        }
        mainCallback(err, patientIdentifiers);
    });
};

SyncRulesEngine.prototype._getRulesFromConfig = function(){
    var enabledRules = this.config.rules;

    return _.map(enabledRules, function(ruleConfig, rule){
        return require('./'+rule+'-rule')(ruleConfig);
    });
};

module.exports = SyncRulesEngine;