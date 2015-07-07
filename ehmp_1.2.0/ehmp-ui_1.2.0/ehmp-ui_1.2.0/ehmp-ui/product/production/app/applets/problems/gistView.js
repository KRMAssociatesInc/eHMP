define([
    'backbone',
    'app/applets/problems/modalView/modalView',
    'app/applets/problems/modalView/modalHeaderView',
    'app/applets/problems/modalView/modalFooterView',
    'app/applets/problems/util',
    'hbs!app/applets/problems/list/tooltip',
    'moment'
], function(Backbone, ModalView, modalHeader, modalFooter, Util, tooltip, moment) {
    'use strict';

    var problemChannel = ADK.Messaging.getChannel('problem-add-edit');
    var allEncounterDateArray = [];
    var viewParseModel = {
        parse: function(response) {
            response = Util.getStandardizedDescription(response);
            response = Util.getStatusName(response);
            response = Util.getServiceConnected(response);
            response = Util.getProblemText(response);
            response = Util.getICDCode(response);
            response = Util.getAcuityName(response);
            response = Util.getFacilityColor(response);
            response = Util.getOnsetFormatted(response);
            response = Util.getEnteredFormatted(response);
            response = Util.getUpdatedFormatted(response);
            response = Util.getCommentBubble(response);
            response = Util.getICDName(response);
            response = Util.getTimeSince(response);
            return response;
        }
    };
    var gistConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-problem',
            pageable: false,
            criteria: {
                filter: 'ne(removed, true)'
            },
            cache: false,
            viewModel: viewParseModel
        },
        transformCollection: function(collection) {
            var ProblemGroupModel = Backbone.Model.extend({});
            var problemGroupsCollection = new Backbone.Collection();
            problemGroupsCollection.comparator = function(problem) {
                return -problem.get("timeSinceDate");
            };
            // DE923
            //var globalDateModel = ADK.SessionStorage.getModel('globalDate');
            var encounterDateArray, problemGroup_EncounterCount;
            //group collection of models by standardizedDescription
            var groups = collection.groupBy(function(problem) {
                //problem = Util.getTimeSince(problem);
                return Util.getProblemGroupByData(problem).groupbyValue;
            });
            //map grouped problems and return the models
            var screenId = ADK.Messaging.request('get:current:screen').config.id;
            var isWorkspaceScreen =  screenId.indexOf('workspace') > -1;
            var problemGroups = _.map(groups, function(problems, groupName) {
                return new ProblemGroupModel({
                    groupName: groupName,
                    probs: problems,
                    allGroupedComments: [],
                    acuityName: problems[0].get('acuityName'),
                    timeSince: problems[0].get('timeSince'),
                    age: problems[0].get('age'),
                    timeSinceDateString: problems[0].get('timeSinceDateString'),
                    timeSinceText: problems[0].get('timeSinceText'),
                    uid: problems[0].get('uid'),
                    id: problems[0].get('uid').replace(/[:|.]/g, "_"),
                    entered: problems[0].get('entered'),
                    documents: problems[0].get('documents'),
                    encounters: problems[0].get('encounters'),
                    problemText: problems[0].get('problemText'),
                    locationName: problems[0].get('locationName'),
                    facilityMoniker: problems[0].get('facilityMoniker'),
                    pid: problems[0].get('pid'),
                    summary: problems[0].get('summary'),
                    icdCode: problems[0].get('icdCode'),
                    snomedCode: problems[0].get('snomedCode'),
                    onsetFormatted: problems[0].get('onsetFormatted'),
                    providerDisplayName: problems[0].get('providerDisplayName'),
                    facilityName: problems[0].get('facilityName'),
                    locationDisplayName: problems[0].get('locationDisplayName'),
                    updated: problems[0].get('updated'),
                    comments: problems[0].get('comments'),
                    timeSinceDate: problems[0].get('timeSinceDate'),
                    applet_id: "problems",
                    allGroupedEncounters: [],
                    userWorkspace: isWorkspaceScreen
                });
            });
            problemGroupsCollection.reset(problemGroups);

            //function to group the encounters by date and map them
            function groupEncounters(encounterDateArray) {
                var encounterDateGroup = _.groupBy(encounterDateArray, function(date) {
                    return date;
                });
                encounterDateGroup = _.map(encounterDateGroup, function(dateArray, dateString) {
                    return {
                        date: dateString,
                        count: dateArray.length
                    };
                });
                return encounterDateGroup;
            }

            //Going through each Problem Group in the collection
            for (var q = 0; q < problemGroupsCollection.length; q++) {
                problemGroup_EncounterCount = 0;
                var problemGroup = problemGroupsCollection.at(q);
                //Going through each Problem of the Group
                for (var r = 0; r < problemGroup.get('probs').length; r++) {
                    var problem = problemGroup.get('probs')[r];
                    encounterDateArray = [];
                    //Push all comments within a group to allGroupedComments array
                    if (problem.get('comments') && problem.get('comments') !== undefined) {
                        for (var d = 0; d < problem.get('comments').length; d++) {
                            var comments = problem.get('comments')[d];
                            problemGroup.get('allGroupedComments').push(comments.comment);
                        }
                    }
                    //Push all encounter within a group to allGroupedEncounters array
                    if (problem.get('encounters')) {
                        for (var s = 0; s < problem.get('encounters').length; s++) {
                            var encounter = problem.get('encounters')[s];
                            encounterDateArray.push(moment(encounter.dateTime, "YYYYMMDD").format("YYYYMMDD"));
                            allEncounterDateArray.push(moment(encounter.dateTime, "YYYYMMDD").format("YYYYMMDD"));
                            problemGroup.get('allGroupedEncounters').push({
                                dateTime: moment(encounter.dateTime, "YYYYMMDD").format("MM/DD/YYYY"),
                                stopCodeName: encounter.facilityName,
                                problemText: problemGroup.get('problemText'),
                                acuity: problemGroup.get('acuityName')
                            });
                        }
                        problem.set('encouterDates', encounterDateArray);
                    } else {
                        encounterDateArray.push(moment(problemGroup.get('timeSinceDate'), "YYYYMMDD").format("YYYYMMDD"));
                        allEncounterDateArray.push(moment(problemGroup.get('timeSinceDate'), "YYYYMMDD").format("YYYYMMDD"));
                        problemGroup.get('allGroupedEncounters').push({
                            dateTime: moment(problemGroup.get('timeSinceDate'), "YYYYMMDD").format("MM/DD/YYYY"),
                            stopCodeName: problemGroup.get('facilityMoniker'),
                            problemText: problemGroup.get('problemText'),
                            acuity: problemGroup.get('acuityName')
                        });
                        problem.set('encouterDates', encounterDateArray);
                    }
                    //Sort the encounters in allGroupedEncounters array
                    Util.sortData({
                        problemGroup: problemGroup
                    });
                    //Reset allGroupedEncounters with most five recent encounters 
                    problemGroup.set('allGroupedEncounters', problemGroup.get('allGroupedEncounters').slice(0, 5));
                    problemGroup_EncounterCount += encounterDateArray.length;
                    var allEncountersGroupedByDate = groupEncounters(encounterDateArray);
                    var date, count;
                    var max = 0;
                    var series = [];
                    allEncounterDateArray.sort(Util.compare);
                    //Going through grouped encounters and add dates and number of encounters to graph property
                    for (var k = 0; k < allEncountersGroupedByDate.length; k++) {
                        date = allEncountersGroupedByDate[k].date;
                        count = allEncountersGroupedByDate[k].count;

                        if (max < count) {
                            max = count;
                        }
                        series.push([moment(date, "YYYYMMDD").valueOf(), count]);
                    }

                    problemGroup.set('graphData', {
                        series: series
                    });
                }

                problemGroup.set('encounterCount', problemGroup_EncounterCount);
            }
            var oDate, nDate;
            var now = moment.utc().startOf('day').valueOf();
            var newDuration = moment.duration({
                'months': 6
            });
             // DE923
            /*if (globalDateModel.get('selectedId') === "all-range-global") {
              if (globalDateModel.get('selectedId') === "all-range-global") { */
                oDate = moment.utc(_.first(allEncounterDateArray), "YYYY").valueOf();
                nDate = moment(now).add(newDuration).valueOf();
            // DE923
            /* } else {
                oDate = moment.utc(globalDateModel.get('fromDate'), "MM/DD/YYYY").valueOf();
                nDate = moment.utc(globalDateModel.get('toDate'), "MM/DD/YYYY").valueOf();
            }*/
            problemGroupsCollection.each(function(model) {
                model.get('graphData').oldestDate = oDate;
                model.get('graphData').newestDate = nDate;
                // Create QuickView html string(tooltip) 
                model.set('tooltip',tooltip(model));
            });
            return problemGroupsCollection;
        },
        gistHeaders: {
            name: {
                title: 'Problem',
                sortable: true,
                sortType: 'alphabetical',
                key: 'groupName',
                hoverTip: 'conditions_problem'
            },
            acuityName: {
                title: 'Acuity',
                sortable: true,
                sortType: 'alphabetical',
                key: 'acuityName',
                hoverTip: 'conditions_acuity'
            },
            graph: {
                title: '',
                sortable: false,
            },
            itemsInGraphCount: {
                title: 'Hx Occurrence',
                sortable: true,
                sortType: 'numeric',
                key: 'encounterCount',
                hoverTip: 'conditions_hxoccurance'
            },
            age: {
                title: 'Last',
                sortable: true,
                sortType: 'date',
                key: 'timeSinceDateString',
                hoverTip: 'conditions_last'
            }
        },
        binningOptions: {
            barPadding: 5,
            debug: false
        },
        gistModel: [{
            id: 'groupName',
            field: 'groupName'
        }, {
            id: 'allGroupedComments',
            field: 'allGroupedComments'
        }, {
            id: 'encounterCount',
            field: 'encounterCount'
        }, {
            id: 'graph',
            field: 'graph'
        }, {
            id: 'age',
            field: 'age'
        }, {
            id: 'acuityName',
            field: 'acuityName'
        }, {
            id: 'problemText',
            field: 'problemText'
        }],
        filterFields: ['groupName', 'problemText', 'acuityName']
    };

    var GistView = ADK.AppletViews.EventsGistView.extend({
        initialize: function(options) {
            var self = this;
            this._super = ADK.AppletViews.EventsGistView.prototype;
            gistConfiguration.fetchOptions.onSuccess = function() {
                self.appletOptions.collection.reset(self.appletOptions.collection.models);
            };
            this.appletOptions = {
                filterFields: gistConfiguration.filterFields,
                collectionParser: gistConfiguration.transformCollection,
                gistModel: gistConfiguration.gistModel,
                gistHeaders: gistConfiguration.gistHeaders,
                binningOptions: gistConfiguration.binningOptions,
                collection: ADK.PatientRecordService.fetchCollection(gistConfiguration.fetchOptions),
                onClickRow: this.onClickRow,
                showLinksButton: true
            };

            ADK.Messaging.getChannel('problems').on('detailView', function(params) {
                var model = params.model;
                var siteCode = ADK.UserService.getUserSession().get('site'),
                    pidSiteCode = model.get('pid') ? model.get('pid').split(';')[0] : '';
                var view = new ModalView({
                    model: model,
                    collection: self.appletOptions.collection
                });
                var fetchOptions = {
                    criteria: {
                        "uid": params.uid
                    },
                    patient: ADK.PatientRecordService.getCurrentPatient(),
                    resourceTitle: 'patient-record-problem',
                    viewModel: view
                };
                var response = $.Deferred();
                var modalOptions = {
                    'title': Util.getModalTitle(model),
                    'size': 'normal',
                    'headerView': modalHeader.extend({
                        model: model,
                        theView: view
                    }),
                    'footerView': modalFooter.extend({
                        model: model,
                        onRender: function() {
                            this.$el.find('.problemsTooltip').tooltip();
                        },
                        templateHelpers: function() {
                            if ((ADK.UserService.hasPermission('edit-patient-problem') || ADK.UserService.hasPermission('remove-patient-problem')) && pidSiteCode === siteCode) {
                                return {
                                    data: true
                                };
                            } else {
                                return {
                                    data: false
                                };
                            }
                        }
                    })
                };
                ADK.showModal(view, modalOptions);
            });
            // DE923
            /*gistConfiguration.fetchOptions.criteria = {
                filter: this.buildJdsDateFilter('entered')
            };

            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.dateRangeRefresh('entered');
            });
             */
            if (ADK.UserService.hasPermission('add-patient-problem') && ADK.PatientRecordService.isPatientInPrimaryVista()) {
                self.appletOptions.onClickAdd = function() {
                    problemChannel.command('openProblemSearch', 'problem_search');
                };
            }
            this.appletOptions.collection = ADK.PatientRecordService.fetchCollection(gistConfiguration.fetchOptions);
            this._super.initialize.apply(this, arguments);
        },

        onBeforeDestroy: function(){
            ADK.Messaging.getChannel('problems').off('detailView');
        }
    });

    return GistView;
});
