define([
    "backbone",
    "marionette",
    "underscore",
    'async',
    'moment',
    'main/Utils',
    "hbs!main/components/footer/views/syncModalTemplate",
    "api/SessionStorage",
    "api/ResourceService"
], function(Backbone, Marionette, _, Async, Moment, Utils, modalTemplate, SessionStorage, ResourceService) {
    'use strict';
    var jdsDomainToUiDomain = function(domain) {
        if (_.isUndefined(domain)) return domain;
        var JdsUiDomainMapping = {
            med: "Active Medications",
            problem: "Active Problems",
            vital: "Vitals",
            visit: "Visit",
            pov: "Purpose of Visit",
            appointment: "Appointments",
            consult: "Consult",
            procedure: "Procedure",
            cpt: "CPT",
            order: "Orders",
            surgery: "Surgery",
            immunization: "Immunizations",
            lab: "Lab Results",
            document: "Document",
            vlerdocument: "Vler Document",
            image: "Image",
            factor: "Health Factor",
            allergy: "Allergies",
            patient: 'Patient',
            skin: 'Skin',
            progressNote: 'Progress Note',
            exam: 'Exam',
            education: 'Education',
            mh: 'Mental Health'
        };
        return JdsUiDomainMapping[domain] || domain;
    };

    var MAX_NUM_SYNC_STATUS_REQUESTS = 60;

    var siteMapping = {
        'DOD':'dod',
        'HDR':'allVa',
        'VLER':'communities'
    };

    var siteDisplayNameMapping = {};
    var pollingRequests = [];

    var isSecondarySite = function(siteName){
        return siteName === 'DOD' || siteName === 'HDR' || siteName === 'VLER' ? 'secondary' : 'primary';
    };

    var createSyncSourceObject = function(source, value){
        return {
            sourceName: value,
            status: source
        };
    };

    var getSiteDisplayName = function(siteCode){
        var siteDisplayName;

        if(siteDisplayNameMapping[siteCode]){
            siteDisplayName = siteDisplayNameMapping[siteCode];
        } else {
            var patientDomainModel = SessionStorage.get.sessionModel('patient-domain');

            if(patientDomainModel && patientDomainModel.get('sites')){
                var match = _.findWhere(patientDomainModel.get('sites'), {siteCode: siteCode});
                siteDisplayName = match ? match.name : siteCode;
                siteDisplayNameMapping[siteCode] = siteDisplayName;
            }
        }

        return siteDisplayName;
    };

    var createDomainObject = function(domain, site, diffDetail){
        var status = domain.syncCompleted ? 'completed' : 'inProgress';
        var timeSince = Utils.getTimeSince(domain.stampTime, false);
        var newDataSince = diffDetail && diffDetail[site.sourceName] && diffDetail[site.sourceName].domain[domain.domain] ? diffDetail[site.sourceName].domain[domain.domain].toString() : '';

        return {
            domainName: domain.domain,
            domainDisplayName: jdsDomainToUiDomain(domain.domain),
            status: status,
            stampTime: domain.stampTime.toString(),
            newDataSince: newDataSince,
            displayNewDataSince: newDataSince ? Utils.getTimeSince(newDataSince, false).timeSince : '',
            displayTime: timeSince.timeSince ? timeSince.timeSince : '',
            siteDisplayName: getSiteDisplayName(site.sourceName),
            siteType: isSecondarySite(site.sourceName)
        };
    };

    var createJobStatusObject = function(jobStatus, markPendingJobsAsErrored){
        var site;

        if(jobStatus.patientIdentifier && jobStatus.patientIdentifier.type === 'pid' && jobStatus.patientIdentifier.value){
            site = jobStatus.patientIdentifier.value.split(';')[0];
        }

        var status;
        if(jobStatus.status === 'error' || markPendingJobsAsErrored){
            status = 'error';
        }else if(jobStatus.status === 'created'){
            status = 'inProgress';
        }

        return {
            domainName: jobStatus.dataDomain,
            domainDisplayName: jdsDomainToUiDomain(jobStatus.dataDomain),
            site: site,
            siteDisplayName: getSiteDisplayName(site),
            status: status,
            type: 'jobStatus',
            siteType: isSecondarySite(site)
        };
    };

    var getSourceProperties = function(sourceName){
        var sourceProperties = {};
        var sourceDisplayName = '';
            var sourceType = '';
            switch(sourceName){
                case 'mySite':
                    sourceProperties.sourceDisplayName = 'My Site';
                    sourceProperties.sourceType = 'primary';
                    break;
                case 'allVa':
                    sourceProperties.sourceDisplayName = 'All VA';
                    sourceProperties.sourceType = 'primary';
                    break;
                case 'dod':
                    sourceProperties.sourceDisplayName = 'DoD';
                    sourceProperties.sourceType = 'secondary';
                    break;
                case 'communities':
                    sourceProperties.sourceDisplayName = 'Communities';
                    sourceProperties.sourceType = 'secondary';
                    break;
            }

            return sourceProperties;
    };

    var buildSyncMap = function(collection, markPendingJobsAsErrored, diffDetail){
        var jobStatuses = [];
        var syncMap = {};

        if(collection.models && collection.models[0]){
            if(collection.models[0].get('syncStatus')){
                var syncStatus = collection.models[0].get('syncStatus');

                if(syncStatus.completedStamp){
                    processSourcesForMap(syncMap, syncStatus.completedStamp.sourceMetaStamp);
                }

                if(syncStatus.inProgress){
                    processSourcesForMap(syncMap, syncStatus.inProgress.sourceMetaStamp);
                }
            }

            if(collection.models[0].get('jobStatus')){
                _.each(collection.models[0].get('jobStatus'), function(jobStatus){
                    if(jobStatus.type !== 'enterprise-sync-request'){
                        jobStatuses.push(createJobStatusObject(jobStatus, markPendingJobsAsErrored));
                    }
                });

                jobStatuses = _.uniq(jobStatuses, true, function(item){
                    return item.site + item.domainName;
                });
            }
        }


        makeMapReadyForUI(syncMap, jobStatuses, diffDetail);

        return new Backbone.Model(syncMap);
    };

    var processSourcesForMap = function(syncMap, sourceMetastamp){
        _.each(sourceMetastamp, function(source, value){
            var mappedValue = siteMapping[value];
            if(mappedValue){
                if(!syncMap[mappedValue]){
                    syncMap[mappedValue] = { sites : [] };
                }

                var syncObj = createSyncSourceObject(source, value);

                syncMap[mappedValue].sites.push(syncObj);

                if(mappedValue === 'mySite'){
                    if(!syncMap.allVa){
                        syncMap.allVa = { sites: [] };
                    }

                    syncMap.allVa.sites.push(syncObj);
                }

            } else {
                if(!syncMap.allVa){
                    syncMap.allVa = { sites: [] };
                }

                syncMap.allVa.sites.push(createSyncSourceObject(source, value));
            }
        });
    };

    var makeMapReadyForUI = function(syncMap, jobStatuses, diffDetail){
        _.each(syncMap, function(source, sourceName){
            var status = 'completed';
            var mostRecentTime;
            var leastRecentTime;
            var newDataSince;
            var allDomains = [];

            _.each(source.sites, function(site){
                if(!site.status.syncCompleted){
                    status = 'inProgress';
                }

                if(isSecondarySite(site.sourceName) === 'secondary'){
                    if(source.sites.length === 1){
                        mostRecentTime = site.status.stampTime.toString();
                    } else {
                        if(!mostRecentTime || mostRecentTime < site.status.stampTime.toString()){
                            mostRecentTime = site.status.stampTime.toString();
                        }

                        if(!leastRecentTime || leastRecentTime > site.status.stampTime.toString()){
                            leastRecentTime = site.status.stampTime.toString();
                        }
                    }
                }

                if(diffDetail && diffDetail[site.sourceName]){
                    if(!newDataSince || newDataSince < diffDetail[site.sourceName].newDataSince.toString()){
                        newDataSince = diffDetail[site.sourceName].newDataSince.toString();
                    }
                }

                _.each(site.status.domainMetaStamp, function(domain){
                    allDomains.push(createDomainObject(domain, site, diffDetail));
                });
            });

            source.status = status;
            source.mostRecentTime = mostRecentTime ? Utils.getTimeSince(mostRecentTime, false).timeSince : '';
            source.newDataSince = newDataSince ? Utils.getTimeSince(newDataSince, false).timeSince : '';

            if(leastRecentTime){
                var leastRecentTimeSince = Utils.getTimeSince(leastRecentTime, false);

                if(source.mostRecentTime && (leastRecentTimeSince.timeSince !== source.mostRecentTime)){
                    source.leastRecentTime = leastRecentTimeSince.timeSince;
                }
            }

            var sourceProperties = getSourceProperties(sourceName);

            source.sourceName = sourceName;
            source.sourceDisplayName = sourceProperties.sourceDisplayName;
            source.sourceType = sourceProperties.sourceType;
            source.allDomains = allDomains;
        });

        _.each(jobStatuses, function(jobStatus){

            if(jobStatus.site){
                var source = siteMapping[jobStatus.site];
                if(source && !syncMap[source]){
                    var sourceProperties = getSourceProperties(source);
                    syncMap[source] = { sourceName: source, sites: [], sourceDisplayName: sourceProperties.sourceDisplayName, sourceType: sourceProperties.sourceType, allDomains: [] };
                }

                var siteAlreadyExists = _.findWhere(syncMap[source].sites, {sourceName: jobStatus.site});

                if(!siteAlreadyExists || siteAlreadyExists.length > 0){
                    syncMap[source].sites.push({sourceName: jobStatus.site});
                }

            }
            _.each(syncMap, function(source, sourceName){
                _.each(source.sites, function(site){
                    if(jobStatus.site === site.sourceName){
                        source.allDomains.push(jobStatus);

                        if(jobStatus.status === 'inProgress'){
                            source.status = 'inProgress';
                        }else if(jobStatus.status === 'error'){
                            source.status = 'error';
                        }
                    }
                });
            });
        });
    };

    var isSyncComplete = function(collection){
        if(collection.models && collection.models[0]){
            var model = collection.models[0];

            if(model.get('syncStatus') && !model.get('syncStatus').inProgress && model.get('syncStatus').completedStamp && model.get('jobStatus') && _.isEmpty(model.get('jobStatus'))){
                return true;
            }
        }
        return false;
    };

    var ModalView = Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        events: {
            'click #sync-source-sites li': 'changeDetailView',
            'click #force-source-sync': 'forceSourceSync',
            'click #msg-successful-sync': 'closeSuccessfulSync',
            'click #msg-failed-sync': 'closeFailedSync',
            'click #sync-detail-header-site': 'sortBySite',
            'click #sync-detail-header-domain': 'sortByDomain',
            'click #sync-detail-header-last-synced': 'sortByLastSynced',
            'click #sync-detail-header-new-data-since': 'sortByNewDataSince',
            'keydown #sync-source-sites li': 'handleKeyPress',
            'keydown #force-source-sync': 'handleKeyPress',
            'keydown #msg-successful-sync': 'handleKeyPress',
            'keydown #msg-failed-sync': 'handleKeyPress',
            'keydown #sync-detail-header-site': 'handleKeyPress',
            'keydown #sync-detail-header-domain': 'handleKeyPress',
            'keydown #sync-detail-header-last-synced': 'handleKeyPress',
            'keydown #sync-detail-header-new-data-since': 'handleKeyPress',
        },
        initialize: function(options){
            var view = this;
            view.parentView = options.parentView;
            var currentSiteCode = SessionStorage.get.sessionModel('user').get('site');
            siteMapping[currentSiteCode] = 'mySite';
            var fetchOptions = {
                resourceTitle:'synchronization-status',
                cache: false,
                onSuccess: function(collection, response){
                    view.setModelFromResponse(view, collection, false, view.parentView.diffDetail);
                    if(!isSyncComplete(collection)){
                        view.pollUntilSyncComplete(view);
                    }
                }
            };

            ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        onBeforeDestroy: function(){
            _.each(pollingRequests, function(request){
                request.forceCanceled = true;
            });
        },
        setModelFromResponse: function(view, collection, markPendingJobsAsErrored, diffDetail, selectedSourceName){
            var newModel = buildSyncMap(collection, markPendingJobsAsErrored, diffDetail);

            var currentDateTime = new Moment().format('MM/DD/YYYY hh:mma');
            newModel.set('currentDateTime', currentDateTime);

            if(!selectedSourceName){
                if(newModel.get('mySite')){
                    selectedSourceName = 'mySite';
                }else if(newModel.get('allVa')) {
                    selectedSourceName = 'allVa';
                }else if(newModel.get('dod')){
                    selectedSourceName = 'dod';
                }else if(newModel.get('communities')){
                    selectedSourceName = 'communities';
                }
            }

            newModel.set('selectedSource', newModel.get(selectedSourceName));

            if(view.model && view.model.get('selectedSource').sourceName === selectedSourceName){
                this.sortByColumn(newModel, view.model.get('sortColumn'), false, view.model.get('sortOrder'));
            }

            if(!view.model || !view.model.get('forceSyncStatus')){
                newModel.set('forceSyncStatus', 'completed');
            }else {
                newModel.set('forceSyncStatus', view.model.get('forceSyncStatus'));
            }

            if(view.model && view.model.get('msgSuccessfulSync')){
                newModel.set('msgSuccessfulSync', 'y');
            }

            if(view.model && view.model.get('msgFailedSync')){
                newModel.set('msgFailedSync', 'y');
            }

            view.model = newModel;
            view.model.bind('change', view.render);

            if(!view.isDestroyed){
                view.render();
            }
        },
        handleKeyPress: function(e){
            if(e.keyCode === 13 || e.keyCode === 32){
                $(e.currentTarget).click();
            }
        },
        sortBySite: function(){
            this.sortByColumn(this.model, 'siteDisplayName', true);
        },
        sortByDomain: function(){
            this.sortByColumn(this.model, 'domainDisplayName', true);
        },
        sortByLastSynced: function(){
            this.sortByColumn(this.model, 'stampTime', true);
        },
        sortByNewDataSince: function(){
            this.sortByColumn(this.model, 'newDataSince', true);
        },
        sortByColumn: function(newModel, field, rerender, sortOrder){
            if(newModel.get('selectedSource').sourceName === this.model.get('selectedSource').sourceName){
                var sortedArray = _.sortBy(newModel.get('selectedSource').allDomains, field);

                if(sortOrder){
                    if(sortOrder === 'desc'){
                        sortedArray.reverse();
                    }
                    newModel.set('sortOrder', sortOrder);
                }else {
                    if(this.model.get('sortColumn') === field && this.model.get('sortOrder') === 'asc'){
                        sortedArray.reverse();
                        newModel.set('sortOrder', 'desc');
                    }else {
                        newModel.set('sortOrder', 'asc');
                    }
                }

                newModel.set('sortColumn', field);
                newModel.get('selectedSource').allDomains = sortedArray;
            }

            if(rerender){
                this.render();
            }
        },
        closeSuccessfulSync: function(){
            this.model.unset('msgSuccessfulSync');
        },
        closeFailedSync: function(){
            this.model.unset('msgFailedSync');
        },
        changeDetailView: function(e){
            var newSource = $(e.currentTarget).attr('data-source');
            this.model.set('selectedSource', this.model.get(newSource));
            this.model.unset('sortColumn');
            this.model.unset('sortOrder');
        },
        forceSourceSync: function(){
            var self = this;
            var siteList = [];
            _.each(self.model.get('selectedSource').sites, function(site){
                siteList.push(site.sourceName);
            });

            self.forceSync(siteList);
        },
        forceSync: function(siteList){
            var self = this;

            // Cancel any current polling before submitting this request
            _.each(pollingRequests, function(request){
                request.forceCanceled = true;
            });

            self.model.set('forceSyncStatus', 'inProgress');
            var fetchOptions = {
                resourceTitle: 'synchronization-loadForced',
                criteria: {
                    forcedSite: siteList.join(',')
                },
                cache: false,
                onSuccess: function(collection, response){
                    self.pollUntilSyncComplete(
                        self,
                        function(){
                            self.model.set('msgSuccessfulSync', 'y');
                            self.model.set('forceSyncStatus', 'completed');
                            $(self.el).find('#force-site-sync-status-success').focus();
                        },
                        function(){
                            self.model.set('msgFailedSync', 'y');
                            self.model.set('forceSyncStatus', 'completed');
                            $(self.el).find('#force-site-sync-status-error').focus();
                        }
                    );
                },
                onError: function(collection, response){
                    self.model.set('forceSyncStatus', 'completed');
                }
            };

            ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        forceSyncAll: function(){
            var self = this;
            var siteList = [];
            _.each(self.model.attributes, function(source, sourceName){
                if(source && source.sites && (sourceName !== 'selectedSource')){
                    _.each(source.sites, function(site){
                        siteList.push(site.sourceName);
                    });
                }
            });

            self.forceSync(_.uniq(siteList));
        },
        pollUntilSyncComplete: function(view, successCallback, errorCallback){
            pollingRequests.push({statusComplete: false, numAttempts: 0});
            var pollingRequestIndex = pollingRequests.length - 1;

            Async.doUntil(
                function(next){
                    var statusFetchOptions = {
                        resourceTitle:'synchronization-status',
                        cache: false,
                        onSuccess: function(collection, response){
                            if(isSyncComplete(collection)){
                                pollingRequests[pollingRequestIndex].statusComplete = true;
                            } else {
                                pollingRequests[pollingRequestIndex].numAttempts++;
                            }

                            var previousSelectedSource = view.model.get('selectedSource').sourceName;

                            var markPendingJobsAsErrored = pollingRequests[pollingRequestIndex].numAttempts > MAX_NUM_SYNC_STATUS_REQUESTS ? true : false;
                            view.setModelFromResponse(view, collection, markPendingJobsAsErrored, view.parentView.diffDetail, previousSelectedSource);
                        },
                        onError: function(collection, response){
                            pollingRequests[pollingRequestIndex].statusComplete = true;
                        }
                    };

                    ADK.PatientRecordService.fetchCollection(statusFetchOptions);
                    // Delay between each loop
                    setTimeout(next, 5000);
                },
                function(){
                    return pollingRequests[pollingRequestIndex].statusComplete === true || pollingRequests[pollingRequestIndex].numAttempts > MAX_NUM_SYNC_STATUS_REQUESTS || pollingRequests[pollingRequestIndex].forceCanceled;
                },
                function(err){
                    if(!pollingRequests[pollingRequestIndex].forceCanceled){
                        if(err || pollingRequests[pollingRequestIndex].numAttempts > MAX_NUM_SYNC_STATUS_REQUESTS){
                            if(errorCallback){
                                errorCallback();
                            }
                        }else{
                            if(successCallback){
                                successCallback();
                            }
                        }
                    }
                }
            );
        }
    });

    return ModalView;
});
