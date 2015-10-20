define([
    "backbone",
    "marionette",
    "underscore",
    'moment',
    "hbs!main/components/footer/patientSyncStatusTemplate",
    "main/components/footer/views/syncModalView",
    "hbs!main/components/footer/views/syncModalTemplate",
    'main/components/footer/views/syncModalFooterView',
    "api/ResourceService",
    "api/Messaging",
    "api/SessionStorage",
    "_assets/js/tooltipMappings"
], function(Backbone, Marionette, _, moment, PatientSyncStatusTemplate, SyncModalView, SyncModalTemplate, SyncModalFooterView, ResourceService, Messaging, SessionStorage, tooltipMappings) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: PatientSyncStatusTemplate,
        ui: {
            'refreshButton': '#refresh-patient-data',
            'syncDetailsButton': '#open-sync-modal',
            'syncIcons': '.patient-status-icon'
        },
        initialize: function() {
            this.model = new Backbone.Model();
            this.initInterval = 5000; // 5 seconds
            this.syncCompInterval = 1000 * 60 * 10; // every 10 minutes after sync is completed
            this.syncCompleted = false;
            this.syncStatusDetail = undefined;
            this.diffDetail = undefined;
        },
        onDomRefresh: function() {
            this.ui.syncIcons.tooltip({
                'delay': 500
            });
        },
        onShow: function() {
            // console.log("patientSyncView onShow is called!");
            this.startAutoPolling();
        },
        onDestroy: function() {
            // console.log("patientSyncView onDestroy is called!");
            this.stopAutoPolling();
        },
        startAutoPolling: function() {
            this.resetTimeInterval();
        },
        resetTimeInterval: function(timeInterval) {
            /** do not restart the interval if the same **/
            if (timeInterval && this.timeInterval && timeInterval === this.timeInterval && this.handle) {
                return;
            }
            if (!timeInterval || timeInterval <= this.initInterval) {
                this.timeInterval = this.initInterval;
            } else {
                this.timeInterval = timeInterval;
            }
            this.stopAutoPolling();
            this.handle = setInterval(_.bind(this.updatePatientSyncStatus, this), this.timeInterval);
        },
        stopAutoPolling: function() {
            if (this.handle) {
                clearInterval(this.handle);
                this.handle = undefined;
            }
        },
        modelEvents: {
            'change:syncStatus': 'render',
        },
        events: {
            'click @ui.refreshButton': 'refreshStatus',
            'keypress @ui.refreshButton': 'refreshStatus',
            'click @ui.syncDetailsButton': 'showSyncModal'
        },
        // New Modal Event that opens on the click of the calendar icon in the bottom right of the footer.
        // Calls a new JSON that determines the new model of all the items.
        // this model is CURRENTLY NOT DONE.
        // IT IS MOCKED ONLY.
        showSyncModal: function(event) {
            event.preventDefault(); //prevent the page from jumping back to the top
            var self = this;
            var view = new SyncModalView({
                parentView: self
            });
            var modalOptions = {
                'title': 'eHMP Data Sources',
                'size': 'large',
                'footerView': SyncModalFooterView.getFooterView(view, self)
            };
            var modal = new ADK.UI.Modal({
                view: view,
                options: modalOptions
            });
            modal.show();
        },
        syncAllData: function(refresh) {
            // console.log('syncAllData is called!');
            var self = this;
            var fetchOptions = {
                resourceTitle: 'synchronization-loadForced',
                criteria: {
                    forcedSite: true
                },
                cache: false,
                onSuccess: function(collection, resp) {
                    self.updatePatientSyncStatus(refresh);
                    return;
                },
                onError: function(collection, resp) {
                    self.updatePatientSyncStatus(refresh);
                    return;
                }
            };
            ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        updatePatientSyncStatus: function(refresh) {
            if (SessionStorage.get.sessionModel('patient') && ADK.ADKApp.currentScreen.patientRequired === true) {
                var curPatient = SessionStorage.get.sessionModel('patient').get('icn');
                if (curPatient != this.curPatient) {
                    this.curPatient = curPatient;
                    this.clearCache();
                }
                this.fetchDataStatus(refresh);
            } else {
                this.model.unset('syncStatus');
            }
        },
        refreshStatus: function() {
            this.refreshPage();
            this.syncAllData(true);
        },
        refreshPage: function() {
            ResourceService.clearAllCache();
            ADK.ADKApp.execute('screen:display', Messaging.request('get:current:screen').id);
        },
        clearCache: function() {
            this.syncStatusDetail = undefined;
            this.diffDetail = {};
        },
        fetchDataStatus: function(refresh) {
            if (!refresh) {
                refresh = false;
            }
            else {
                this.clearCache();
            }
            var oldStats = this.model.get('syncStatus');
            this.model.set('syncStatus', [{
                'title': 'My Site',
                'hoverTip': tooltipMappings.patientSync_mySite
            }, {
                'title': 'All VA',
                'hoverTip': tooltipMappings.patientSync_allVA
            }, {
                'title': 'DoD',
                'hoverTip': tooltipMappings.patientSync_DoD
            }, {
                'title': 'Communities',
                'hoverTip': tooltipMappings.patientSync_community
            }]);
            var fetchOptions = {
                resourceTitle: 'synchronization-datastatus',
                cache: false
            };
            var self = this;
            fetchOptions.onError = function(collection, resp) {
                var stats = [{
                    'title': 'My Site',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_mySite
                }, {
                    'title': 'All VA',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_allVA
                }, {
                    'title': 'DoD',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_DoD
                }, {
                    'title': 'Communities',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_community
                }];
                $('.tooltip').tooltip('hide');
                self.model.set('syncStatus', stats);
            };
            fetchOptions.onSuccess = function(collection, resp) {
                // console.log('fetchOptions::onSucess is called!');
                var currentSiteCode = SessionStorage.get.sessionModel('user').get('site');
                var statusObject = resp.data;
                var stats = [];
                if (statusObject.VISTA) {
                    if (statusObject.VISTA[currentSiteCode]) {
                        var curSite = statusObject.VISTA[currentSiteCode];
                        var completedStatus = curSite.hasError ? 'error' : curSite.isSyncCompleted;
                        var statInfo = {
                            title: 'My Site'
                        };
                        statInfo.completed = completedStatus;
                        // if (statInfo.completed === true && curSite.completedStamp) {
                        //     statInfo.timeStamp = ADK.utils.getTimeSince(curSite.completedStamp.toString(), false).timeSince;
                        // }
                        statInfo.hoverTip = tooltipMappings.patientSync_mySite;
                        stats.push(statInfo);
                    }
                }
                if (statusObject.VISTA || statusObject.CDS || statusObject.HDR) {
                    var allVASite = {};
                    if (statusObject.VISTA) {
                        allVASite = _.clone(statusObject.VISTA);
                    }
                    if (statusObject.HDR) {
                        allVASite.HDR = statusObject.HDR;
                    }
                    // push All VA
                    var allVA = {
                        title: 'All VA'
                    };
                    var hasError = _.find(allVASite, function(elem) {
                        return elem.hasError && elem.hasError === true;
                    });
                    if (hasError) {
                        allVA.completed = 'error';
                        allVA.timeStamp = moment().format('MM/DD/YYYY HH:mm');
                    } else {
                        allVA.completed = _.every(_.pluck(allVASite, 'isSyncCompleted'));
                        if (allVA.completed && statusObject.HDR) {
                            allVA.timeStamp = ADK.utils.getTimeSince(statusObject.HDR.completedStamp.toString()).timeSince;
                        }
                    }
                    allVA.hoverTip = tooltipMappings.patientSync_allVA;
                    stats.push(allVA);
                }
                if (statusObject.DOD) {
                    var dodStat = statusObject.DOD;
                    var isComplete = dodStat.hasError ? 'error' : dodStat.isSyncCompleted;
                    var timeStamp = dodStat.completedStamp ? ADK.utils.getTimeSince(dodStat.completedStamp.toString()).timeSince :
                        moment().format('MM/DD/YYYY HH:mm');
                    stats.push({
                        title: 'DoD',
                        completed: isComplete,
                        timeStamp: timeStamp,
                        hoverTip: tooltipMappings.patientSync_DoD
                    });
                }
                if (statusObject.VLER) {
                    var vlerStat = statusObject.VLER;
                    var isVlerComplete = vlerStat.hasError ? 'error' : vlerStat.isSyncCompleted;
                    var vlerTimeStamp = vlerStat.completedStamp ? ADK.utils.getTimeSince(vlerStat.completedStamp.toString()).timeSince :
                        moment().format('MM/DD/YYYY HH:mm');
                    stats.push({
                        title: 'Communities',
                        completed: isVlerComplete,
                        timeStamp: vlerTimeStamp,
                        hoverTip: tooltipMappings.patientSync_community
                    });
                }

                if (statusObject.allSites != self.syncCompleted) {
                    var newInterval = statusObject.allSites ? self.syncCompInterval : self.initInterval;
                    console.log('new interval: ' + newInterval);
                    self.resetTimeInterval(newInterval);
                }
                self.syncCompleted = statusObject.allSites;
                if (statusObject.allSites) {
                    self.fetchSyncStatusDetail(refresh, stats);
                } else {
                    self.updateSyncStats(stats);
                }
            };
            ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        updateSyncStats: function(stats) {
            var self = this;
            setTimeout(function() {
                if (!_.isEmpty(self.diffDetail)) {
                    self.addNewDataSince(stats);
                }
                self.model.set('syncStatus', stats);
                if (!self.isDestroyed) {
                    self.render();
                }
            }, 500);
        },
        fetchSyncStatusDetail: function(refresh, stats) {
            // console.log('fetchSyncStatusDetail called');
            var fetchOptions = {
                resourceTitle: 'synchronization-syncStatusDetail',
                cache: false
            };
            var self = this;
            fetchOptions.onError = function(collection, resp) {
                var stats = [{
                    'title': 'My Site',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_mySite
                }, {
                    'title': 'All VA',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_allVA
                }, {
                    'title': 'DoD',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_DoD
                }, {
                    'title': 'Communities',
                    'completed': 'error',
                    'hoverTip': tooltipMappings.patientSync_community
                }];
                self.model.set('syncStatus', stats);
            };
            fetchOptions.onSuccess = function(collection, resp) {
                // console.log('fetchSyncStatusDetail: Success!');
                var newSyncStatus = resp.data;
                if (_.isUndefined(self.syncStatusDetail)) {
                    self.syncStatusDetail = newSyncStatus;
                } else {
                    // found out the difference for VistA site only
                    self.generateSyncDetailDiff(newSyncStatus);
                }
                self.updateSyncStats(stats);
            };
            ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        generateSyncDetailDiff: function(newSyncStatus) {
            // assumption, all status is sync completed
            var self = this;
            self.diffDetail = {};
            var oldSources = self.syncStatusDetail.completedStamp.sourceMetaStamp;
            var newSources = newSyncStatus.completedStamp.sourceMetaStamp;
            _.each(newSources, function(value, site) {
                // ignore all secondary sites
                if (site.toUpperCase() === 'DOD' ||
                    site.toUpperCase() === 'VLER' ||
                    site.toUpperCase() === 'HDR') {
                    return;
                }
                // check domains
                if (_.isUndefined(oldSources[site])) {
                    self.diffDetail[site] = self.diffDetail[site] || {};
                    self.diffDetail[site].newDataSince = value.domainMetaStamp.stampTime;
                    return;
                }
                var newDomains = value.domainMetaStamp;
                var oldDomains = oldSources[site].domainMetaStamp;
                _.each(newDomains, function(val, domain) {
                    if (_.isUndefined(oldDomains[domain])) {
                        self.diffDetail[site] = self.diffDetail[site] || {};
                        self.diffDetail[site].domain = self.diffDetail[site].domain || {};
                        self.diffDetail[site].domain[domain] = val.eventMetaStamp.stampTime;
                        return;
                    }
                    self.compareIndividualDomain(oldDomains[domain].eventMetaStamp, val.eventMetaStamp, site, domain);
                });
            });
            self.updateDiffDetails();
        },
        compareIndividualDomain: function(oldDomainData, newDomainData, site, domain) {
            //console.log(unionKeys);
            var self = this;
            _.each(newDomainData, function(value, key) {
                if (_.isUndefined(oldDomainData[key])) {
                    // console.log('key ' + key + ' added!');
                    self.diffDetail[site] = self.diffDetail[site] || {};
                    self.diffDetail[site].domain = self.diffDetail[site].domain || {};
                    self.diffDetail[site].domain[domain] = value.stampTime;
                } else if (newDomainData[key].stampTime != oldDomainData[key].stampTime) {
                    // console.log('key ' + key + " changed");
                    self.diffDetail[site] = self.diffDetail[site] || {};
                    self.diffDetail[site].domain = self.diffDetail[site].domain || {};
                    if (_.isUndefined(self.diffDetail[site].domain[domain])) {
                        self.diffDetail[site].domain[domain] = value.stampTime;
                    } else if (self.diffDetail[site].domain[domain] > value.stampTime) {
                        self.diffDetail[site].domain[domain] = value.stampTime;
                    }
                }
            });
        },
        updateDiffDetails: function() { // update the diffDetail information.
            // console.log(this.diffDetail);
            if (this.diffDetail) {
                var self = this;
                _.each(self.diffDetail, function(siteVal, site) {
                    if (siteVal.domain) {
                        var newDataSince = _.min(_.values(siteVal.domain));
                        if (siteVal.newDataSince) {
                            siteVal.newDataSince = _.min([newDataSince, siteVal.newDataSince]);
                        } else {
                            siteVal.newDataSince = newDataSince;
                        }
                    }
                });
            }
        },
        addNewDataSince: function(stats) {
            if (_.isArray(stats) && stats.length === 0) {
                return;
            }
            if (stats[0].title != 'My Site' && stats[0].title != 'All VA') { //return if no VistA sites
                return;
            }
            // console.log(stats);
            var vistASitesDiff = _.omit(this.diffDetail, ['DOD', 'VLER', 'HDR']);
            var currentSiteCode = SessionStorage.get.sessionModel('user').get('site');
            var allVATimeSince = _.min(_.map(vistASitesDiff, function(val, key) {
                return val.newDataSince;
            }));
            if (vistASitesDiff[currentSiteCode]) {
                stats[0].newDataSince = ADK.utils.getTimeSince(vistASitesDiff[currentSiteCode].newDataSince).timeSince;
                stats[1].newDataSince = ADK.utils.getTimeSince(allVATimeSince).timeSince;
            } else {
                stats[0].newDataSince = ADK.utils.getTimeSince(allVATimeSince).timeSince;
            }
            // console.log(stats);
        }
    });
});