'use strict';

var R = require('node-rules');
var RulesEngine = new R();
var config = require('../config/config.js');

var rules = require(config.pdpConfig.ruleFile).rules;
RulesEngine.register(rules);
module.exports = RulesEngine;
