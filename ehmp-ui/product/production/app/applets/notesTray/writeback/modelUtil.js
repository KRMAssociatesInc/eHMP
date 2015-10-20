define([
    'backbone',
    'marionette',
    'underscore',
], function(Backbone, Marionette, _) {
    'use strict';
    var DEBUG = false;
    var cachedTitles;
    var LINE_LENGTH = 80;

    var util = {
        retrieveTitleModel: function() {
             // cachedTitles = new Backbone.Collection();
             // cachedTitles.reset([{
             //         name: "ASI-ADDICTION SEVERITY INDEX",
             //         ien: '40',
             //         documentClass: "PROGRESS NOTES",
             //         documentDefUid: "urn:va:doc-def:9E7A:40",
             //         documentTypeName: "Progress Note",
             //         kind: "Progress Note",
             //         localTitle: "ASI-ADDICTION SEVERITY INDEX"
             //     }, {
             //         name: "ADVANCE DIRECTIVE",
             //         ien: '8',
             //         documentClass: "PROGRESS NOTES",
             //         documentDefUid: "urn:va:doc-def:9E7A:8",
             //         documentTypeCode: "D",
             //         documentTypeName: "Advance Directive",
             //         kind: "Advance Directive",
             //         localTitle: "ADVANCE DIRECTIVE"
             //     }, {
             //         name: "C&P ACROMEGALY",
             //         ien: '1295',
             //         documentClass: "PROGRESS NOTES",
             //         documentDefUid: "urn:va:doc-def:9E7A:1295",
             //         documentTypeName: "Progress Note",
             //         kind: "Progress Note",
             //         localTitle: "C&P ACROMEGALY"
             //     },{
             //         name: "CLINICAL WARNING",
             //         ien: '15',
             //         documentClass: "PROGRESS NOTES",
             //         documentDefUid: "urn:va:doc-def:9E7A:15",
             //         documentTypeCode: "W",
             //         documentTypeName: "Clinical Warning",
             //         kind: "Clinical Warning",
             //         localTitle: "CLINICAL WARNING"
             //     }, {
             //         name: "CRISIS NOTE",
             //         ien: '20',
             //         documentClass: "PROGRESS NOTES",
             //         documentDefUid: "urn:va:doc-def:9E7A:20",
             //         documentTypeCode: "C",
             //         documentTypeName: "Crisis Note",
             //         kind: "Crisis Note",
             //         localTitle: "CRISIS NOTE"
             //     }, {
             //         name: "EMERGENCY DEPARTMENT NOTE",
             //         ien: '142',
             //         documentClass: "PROGRESS NOTES",
             //         documentDefUid: "urn:va:doc-def:9E7A:142",
             //         documentTypeCode: "PN",
             //         documentTypeName: "Progress Note",
             //         kind: "Progress Note",
             //         localTitle: "EMERGENCY DEPARTMENT NOTE"
             //     }, {
             //         name: "NURSING ADMISSION ASSESSMENT ",
             //         ien: '1653',
             //         documentClass: "PROGRESS NOTES",
             //         documentDefUid: "urn:va:doc-def:9E7A:1653",
             //         documentTypeName: "Progress Note",
             //         kind: "Progress Note",
             //         localTitle: "NURSING ADMISSION ASSESSMENT "
             //     }
             // ]);
            var deferred = $.Deferred();
            if (!cachedTitles) {
                var noteTitles = new Backbone.Collection();
                var site = ADK.UserService.getUserSession().get('site');
                noteTitles.url = '/resource/write-pick-list?type=progress-notes-titles&class=3&site=' + site;
                noteTitles.fetch({
                    success: function(collection, response) {
                        cachedTitles = collection;
                        deferred.resolve(collection);
                    },
                    error: function(collection, response) {
                        deferred.reject(response);
                    }
                });
            } else {
                setTimeout(function() {
                    deferred.resolve(cachedTitles);
                }, 0);
            }
            return deferred.promise();
        },

        retrieveLastTitle: function() {
            var deferred = $.Deferred();
            var fetchOptions = {
                resourceTitle: 'notes-title-getUserLastTitle',
                criteria: { },
                onSuccess: function(collection) {
                    if (collection.models.length > 0) {
                        deferred.resolve(collection.models[0]);
                    } else {
                        deferred.reject('Last title was not found');
                    }
                },
                onError: function(model, response) {
                    if (DEBUG) console.log("error: " + response.responseText);
                    deferred.reject(response);
                }
            };
            ADK.ResourceService.fetchCollection(fetchOptions);
            return deferred.promise();
        },

        fetchTitles: function(form, updateCallback, completeCallback) {
            var self = this;
            var lastTitle = null;
            var titles = null;
            var lastTitleDeferred = this.retrieveLastTitle();
            var allTitlesDeferred = this.retrieveTitleModel();
            var lastTitleDone = false;
            var allTitlesDone = false;
            lastTitleDeferred.done(function(lastTitleVal) {
                lastTitle = lastTitleVal;
                updateCallback(form, self.getOptions(lastTitle, titles));
                if (allTitlesDone && completeCallback) {
                    completeCallback();
                }
            });
            lastTitleDeferred.always(function() {
                lastTitleDone = true;
            });
            allTitlesDeferred.done(function(titlesVal) {
                titles = titlesVal;
                updateCallback(form, self.getOptions(lastTitle, titles));
                if (lastTitleDone && completeCallback) {
                    completeCallback();
                }
            });
            allTitlesDeferred.always(function() {
                allTitlesDone = true;
            });
        },

        getOptions: function(lastTitle, titles) {
            var optionGroups = [];
            var lastTitleValue = lastTitle ? lastTitle.get('documentDefUid') + '_' + lastTitle.get('localTitle') + '_last' : '';
            var lastTitleLabel = lastTitle ? lastTitle.get('localTitle') : '';
            optionGroups.push({
                group: 'Last Selected Note Title',
                pickList: [{
                    value: lastTitleValue,
                    label: lastTitleLabel
                }]
            });
            if (titles) {
                var options = [];
                _.each(titles.models, function(item) {
                    var titleSelect = {
                        value: 'urn:va:doc-def:' + ADK.UserService.getUserSession().get('site') + ':' + item.get('ien') + '_' + item.get('name') + '_all',
                        label: item.get('name')
                    };
                    options.push(titleSelect);
                });
                optionGroups.push({
                    group: 'All Note Titles',
                    pickList: options
                });
            }
            return optionGroups;
        },

        validateTime: function(model) {
            var inputDate = model.get('derivReferenceDate');
            var inputTime = model.get('derivReferenceTime');

            if (inputTime === null || inputTime === undefined || inputTime === '') {
                return true;
            }

            inputTime = inputTime.split(':');

            if (moment(inputDate).startOf('day').isSame(moment().startOf('day'))) {
                var currentHours = moment().hours();
                var currentMinutes = moment().minutes();
                var inputHours = inputTime[0] * 1;
                var inputMinutes = inputTime[1] * 1;
                if (inputHours > currentHours || (inputHours === currentHours && inputMinutes > currentMinutes)) {
                    model.errorModel.set({
                        derivReferenceTime: 'Time must not be in the future'
                    });
                    return false;
                }
            }
            return true;
        },
        validateRequiredTime: function(model) {
            var inputDate = model.get('derivReferenceDate');
            var inputTime = model.get('derivReferenceTime');

            if (inputTime === null || inputTime === undefined || inputTime === '' || !this.isTime(inputTime)) {
                model.errorModel.set({
                    derivReferenceTime: 'Please enter a valid time.'
                });
                return false;
            }

            inputTime = inputTime.split(':');

            if (moment(inputDate).startOf('day').isSame(moment().startOf('day'))) {
                var currentHours = moment().hours();
                var currentMinutes = moment().minutes();
                var inputHours = inputTime[0] * 1;
                var inputMinutes = inputTime[1] * 1;
                if (inputHours > currentHours || (inputHours === currentHours && inputMinutes > currentMinutes)) {
                    model.errorModel.set({
                        derivReferenceTime: 'Time must not be in the future'
                    });
                    return false;
                }
            }
            return true;
        },
        validateRequiredDate: function(model) {
            var inputDate = model.get('derivReferenceDate');
            if (!inputDate || !this.isDate(inputDate)) {
                model.errorModel.set({
                    derivReferenceDate: 'Please enter a valid date'
                });
                return false;
            }
            if (inputDate && moment(inputDate).startOf('day').isAfter(moment().startOf('day'))) {
                model.errorModel.set({
                    derivReferenceDate: 'Reference Date must not be in the future'
                });
                return false;
            }
            return true;
        },
        isDate: function(text) {
            var ret = moment(text, "MM/DD/YYYY", true).isValid();
            return ret;
        },
        isTime: function(text) {
            var ret = moment(text, 'HH:mm',true).isValid();
            return ret;
        },

        validateDate: function(model) {
            var inputDate = model.get('derivReferenceDate');
            if (inputDate && this.isDate(inputDate) && moment(inputDate).startOf('day').isAfter(moment().startOf('day'))) {
                model.errorModel.set({
                    derivReferenceDate: 'Reference Date must not be in the future'
                });
                return false;
            }
            return true;
        },
        validateTitle: function(model) {
            if (_.isEmpty(model.get('documentDefUid'))) {
                model.errorModel.set({
                    documentDefUidUnique: 'Select a title here'
                });
                return false;
            }
            return true;
        },
        validateText: function(model) {
            if (model.get('text') && model.get('text')[0].content) {
                return true;
            }
            model.errorModel.set({
                text: 'Please enter note details.'
            });
            return false;
        },

        formatTextContent: function(model) {
            if (model.get('text')) {
                var text = model.get('text');
                for (var i = 0; i < text.length; i++) {
                    var content = text[i].content;
                    var lines = content.split('\n');
                    var formattedLines = [];
                    for (var k = 0; k < lines.length; k++) {
                        var line = lines[k].trim();
                        while (line.length > LINE_LENGTH) {
                            var match = line.match(new RegExp('.{0,' + LINE_LENGTH + '}\\s+'));  //  regex = /.{0,80}\s+/
                            var formattedLine = match ? match[0].trim() : line.substring(0, LINE_LENGTH);
                            formattedLines.push(formattedLine.trim());
                            line = line.substring(formattedLine.length).trim();
                        }
                        formattedLines.push(line);
                    }
                    content = formattedLines.join('\n');
                    text[i].content = content;
                }
            }
            return model;
        }

    };
    return util;
});