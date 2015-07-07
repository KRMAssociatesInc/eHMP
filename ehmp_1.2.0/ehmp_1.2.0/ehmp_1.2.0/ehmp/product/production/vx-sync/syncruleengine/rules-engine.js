'use strict';

//requires
var _ = require('underscore');
var async = require('async');

function SyncRulesEngine(log, config, environment) {
    this.log = log;
    this.config = config;
    this.environment = environment;
    this.rules = this._getRulesFromConfig();
}

SyncRulesEngine.prototype.getSyncPatientIdentifiers = function(patientIdentifiers, exceptions, mainCallback) {
    var self = this;
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