define([
    "backbone",
    "marionette",
    "underscore",
    "api/Messaging",
    "api/ResourceService",
    "api/SessionStorage",
    "main/components/patient/cwad/cwadDeatilsView",
    "hbs!main/components/patient/patientHeaderTemplate",
    "main/components/patient/detail/patientHeaderDetailView",
    'main/components/patient/modal/demographicDiffModalView',
    'main/components/patient/notes/noteProxyView',
    "main/components/patient/util/modelUtil",
    "api/CCOWService",
    "main/components/patient/smokingStatus/smokingStatusView",
    "api/UrlBuilder",
    "hbs!main/components/patient/detail/patientCareOtherSiteTemplate",
    "hbs!main/components/patient/detail/patientCareOtherSiteRow",
    "main/components/sign/models/signModels",

], function(Backbone, Marionette, _, Messaging, ResourceService, SessionStorage, cwadDetailsView, PatientHeaderTemplate, PatientHeaderDetailView, DemoDiffModal, NoteProxyView, modelUtil, CCOWService, smokingStatusView, UrlBuilder, CareOtherSites, CareOtherRow, signModels) {

    var visitChannel = Messaging.getChannel('visit_new');
    var notesChannel = Messaging.getChannel("notesTray");
    var testCount = 0;
    var notesTrayView = null;
    var pid;

    var PatientHeaderView = Backbone.Marionette.LayoutView.extend({
        template: PatientHeaderTemplate,
        regions: {
            cwadDetails: '#cwad-details',
            patientDetailsRegion: '#patient-header-demographic-details',
            notesTrayRegion: '#notes-tray',
            notesOperationsRegion: '#notes-modify-container'
        },
        initialize: function() {
            if (this.model.get('pid')) {
                pid = this.model.get('pid');
            }
            if ("ActiveXObject" in window) {
                this.model.set('useCcow', 'yes');
                this.updateCcowStatus(CCOWService.getCcowStatus());
                Messaging.on('ccow:updatedStatus', this.updateCcowStatus, this);
            }

            if (this.model.get('cwadf')) {
                var cwadf = this.model.get('cwadf');

                if (cwadf.indexOf('C') >= 0) {
                    this.model.set('crisisNotes', true);
                }
                if (cwadf.indexOf('W') >= 0) {
                    this.model.set('flags', true);
                }
                if (cwadf.indexOf('A') >= 0) {
                    this.model.set('allergies', true);
                }
                if (cwadf.indexOf('D') >= 0) {
                    this.model.set('directives', true);
                }
            }

            if (this.model.get('patientRecordFlag')) {
                this.model.set('patientflags', true);
            }

            if (this.model.get('patientStatusClass') == "Inpatient") {
                this.model.set('inPatient', true);
            }

            var smokingStatusChannel = Messaging.getChannel('smokingstatus');
            smokingStatusChannel.comply('smokingstatus:change', smokingStatusView.handleStatusChange);
            smokingStatusChannel.comply('smokingstatus:updated', this.updateSmokingStatus, this);
            var isInVista = ResourceService.patientRecordService.isPatientInPrimaryVista();
            if (isInVista) {
                this.listenTo(notesChannel, 'notestray:show', function(view) {
                    console.log('notestray:show');
                    notesTrayView = view;
                    this.notesTrayRegion.show(notesTrayView);
                });
                this.listenTo(notesChannel, 'notestray:open', function() {
                    console.log('notestray:open');
                    $('#patientDemographic-notes').find('[data-toggle=dropdown]').dropdown('toggle');
                    $('#patientDemographic-notes').focus();
                });
            }
        },
        onRender: function() {
            //render only if there is data
            notesTrayView = null;
            if (this.model.attributes.pid) {
                var currentPatientImage = SessionStorage.get.sessionModel('patient-image').get('image');
                var self = this;

                $.when(currentPatientImage).done(function(data) {
                    self.model.set({
                        patientImage: data
                    });
                    self.$el.find('.cwadfToolTip').tooltip({
                        delay: {
                            "show": 0, //setting delay to 0 to prevent voiceover getting confused in firefox
                            "hide": 0
                        }
                    });
                    var detailView = new PatientHeaderDetailView({
                        model: self.model
                    });
                    self.patientDetailsRegion.show(detailView);
                    self.demoRows = new Backbone.Model();
                    self.patientDetailsRegion.on('show', self.configureDemoRows, self);
                    notesChannel.trigger('notes:init');
                });
            }
        },
        modelEvents: {
            "change": "handleModelChange"
        },
        events: {
            'click .cwadLabel': 'showCwadDetails',
            'keypress .cwadLabel': 'showCwadDetails',
            'keydown [data-toggle="dropdown"]': 'showPatientInfoDropdown',
            'hidden.bs.dropdown .dropdown': function(e) {
                this.$('[data-toggle=popup]').popup('hide');
                $('.fa-caret-down', e.currentTarget).addClass('fa-caret-right').removeClass('fa-caret-down');
            },
            'shown.bs.dropdown .dropdown': function(e) {
                $('.fa-caret-right', e.currentTarget).removeClass('fa-caret-right').addClass('fa-caret-down');
                this.$('[data-toggle=popup]').popup('hide');
                if ($('#notes-tray-dropdown-menu', e.currentTarget).length) {
                    notesChannel.trigger('notestray:opening');
                }
            },
            'click #leaveContext': 'leaveContext',
            'click #joinContext': 'joinContext',
            'click #setVisitContextBtn': 'setVisitContext',
            'click #addAllergy': 'launchAddAllergy',
            'click #addActiveProblem': 'launchAddProblem',
            'click #addVitals': 'launchAddVitals',
            'click #notes-list-btn': 'openNotesClicked',
            'click #addSignature': 'launchAddSignature',
            //'show.bs.dropdown .dropdown': function(e) {
            //    this.$('[data-toggle=popup]').popup('hide');
            //},
            'hide.bs.dropdown #patientDemographic-notes': function(e) {
                $('#notes-list-btn').focus();
            },
        },

        handleModelChange: function(event) {
            // ccow load occurs via model change, and bypasses initialize
            // need to run initialize if the patient has changed
            var newPid = this.model.get('pid');
            if (pid && newPid !== pid) {
                this.initialize();
            }
            this.render();
        },

        openNotesClicked: function(event) {
            if (!notesTrayView) {
                notesChannel.trigger('notes:view');
            }
        },
        configureDemoRows: function() {
            //need data to do this
            var primaryProviderRow = '#patientDemographic-providerInfo .primary-provider',
                primaryAssocProviderRow = '#patientDemographic-providerInfo .primary-assoc-provider',
                mhTreatmentTeamRow = '#patientDemographic-providerInfo .mh-treatment-team',
                mhCoordinatorRow = '#patientDemographic-providerInfo .mh-coordinator',
                inpatientAttendingProviderRow = '#patientDemographic-providerInfo .inpatient-attending-provider',
                inpatientProviderRow = '#patientDemographic-providerInfo .inpatient-provider',
                pid = ResourceService.patientRecordService.getCurrentPatient().get('pid'),
                sites = SessionStorage.get.sessionModel('patient-domain').get('data'),
                currentSiteCode = SessionStorage.get.sessionModel('user').get('site'),
                self = this,
                popopts = {
                    'halign': 'right',
                    'placement': 'bottom',
                    //'trigger': 'focus' //can't use focus until the global problems are fixed with popovers
                },
                RowView = Marionette.ItemView.extend({
                    tagName: 'tr',
                    template: CareOtherRow
                }),
                PopUpView = Marionette.CompositeView.extend({
                    childView: RowView,
                    template: CareOtherSites,
                    childViewContainer: 'tbody'
                });

            //each row is a view with model containing an array of demographic history data
            _.each(sites, function(site) {
                var teamInfo = site.teamInfo,
                    siteCode = site.pid.split(';')[0];

                // Skip if there is no team info or if it's the same site.
                if (!teamInfo || siteCode.toLowerCase() === currentSiteCode.toLowerCase()) {
                    return;
                }

                if (teamInfo.primaryProvider && teamInfo.primaryProvider.name !== 'unassigned') {
                    if (!self.demoRows.get(primaryProviderRow)) {
                        self.demoRows.set(primaryProviderRow, new PopUpView({
                            collection: new Backbone.Collection()
                        }));
                    }
                    self.demoRows.get(primaryProviderRow).collection.add(
                        modelUtil.addFacilityName(site.pid, new Backbone.Model(teamInfo.primaryProvider))
                    );
                }
                if (teamInfo.associateProvider && teamInfo.associateProvider.name !== 'unassigned') {
                    if (!self.demoRows.get(primaryAssocProviderRow)) {
                        self.demoRows.set(primaryAssocProviderRow, new PopUpView({
                            collection: new Backbone.Collection()
                        }));
                    }
                    self.demoRows.get(primaryAssocProviderRow).collection.add(
                        modelUtil.addFacilityName(site.pid, new Backbone.Model(teamInfo.associateProvider))
                    );
                }
                if (teamInfo.attendingProvider && teamInfo.attendingProvider.name !== 'unassigned') {
                    if (!self.demoRows.get(inpatientAttendingProviderRow)) {
                        self.demoRows.set(inpatientAttendingProviderRow, new PopUpView({
                            collection: new Backbone.Collection()
                        }));
                    }
                    self.demoRows.get(inpatientAttendingProviderRow).collection.add(
                        modelUtil.addFacilityName(site.pid, new Backbone.Model(teamInfo.attendingProvider))
                    );
                }
                if (teamInfo.inpatientProvider && teamInfo.inpatientProvider.name !== 'unassigned') {
                    if (!self.demoRows.get(inpatientProviderRow)) {
                        self.demoRows.set(inpatientProviderRow, new PopUpView({
                            collection: new Backbone.Collection()
                        }));
                    }
                    self.demoRows.get(inpatientProviderRow).collection.add(
                        modelUtil.addFacilityName(site.pid, new Backbone.Model(teamInfo.inpatientProvider))
                    );
                }
                if (teamInfo.mhCoordinator && teamInfo.mhCoordinator.mhTeam && teamInfo.mhCoordinator.mhTeam !== 'unassigned') {
                    if (!self.demoRows.get(mhTreatmentTeamRow)) {
                        self.demoRows.set(mhTreatmentTeamRow, new PopUpView({
                            collection: new Backbone.Collection()
                        }));
                    }
                    var newModel = new Backbone.Model(teamInfo.mhCoordinator);
                    newModel.set('name', teamInfo.mhCoordinator.mhTeam);
                    newModel.set('officePhone', teamInfo.mhCoordinator.mhTeamOfficePhone);
                    // MH teams don't have pagers.
                    newModel.set('analogPager', undefined);
                    newModel.set('digitalPager', undefined);
                    self.demoRows.get(mhTreatmentTeamRow).collection.add(
                        modelUtil.addFacilityName(site.pid, newModel)
                    );
                }
                if (teamInfo.mhCoordinator && teamInfo.mhCoordinator.name !== 'unassigned') {
                    if (!self.demoRows.get(mhCoordinatorRow)) {
                        self.demoRows.set(mhCoordinatorRow, new PopUpView({
                            collection: new Backbone.Collection()
                        }));
                    }
                    self.demoRows.get(mhCoordinatorRow).collection.add(
                        modelUtil.addFacilityName(site.pid, new Backbone.Model(teamInfo.mhCoordinator))
                    );
                }
            });

            _.each(this.demoRows.attributes, function(row, key) {
                row.render();
                self.addAttributes(key);
                var me = self.patientDetailsRegion.getEl(key);
                me.popup(_.extend(popopts, {
                    content: row.$el
                }));
                //this is a hack to make up for the fact we can't rely on built in events due to a conflict elsewhere in the app
                //when this gets fixed go back to the template and make them data-toggle="popover"
                me.on('show.bs.popover', function(e) {
                    self.patientDetailsRegion.getEl('[data-toggle="popup"]').not(this).popup('hide');
                });
                me.on('hide.bs.popover', function(e) {
                    me.removeClass('toolbarActive');
                });
                me.on('focusin', function() {
                    me.addClass('toolbarActive');
                });
            });

            this.$('[data-toggle=popup]').on('keydown', function(e) {
                var k = e.which || e.keydode;
                if (!/(13|32)/.test(k)) return;
                $(this).trigger('click');
                e.preventDefault();
                e.stopPropagation();
            });
        },
        addAttributes: function(selector) {
            var el = this.$(selector);
            el.attr('tabindex', '0');
            el.attr('data-toggle', 'popup');
            el.attr('role', 'button');
            el.attr('aria-haspopup', true);
            el.attr('aria-expanded', false);
            el.on('shown.bs.popover', function(e) {
                el.attr('aria-expanded', true);
            });
            el.on('hidden.bs.popover', function(e) {
                el.attr('aria-expanded', false);
            });
            el.addClass('selectable');
        },
        onDestroy: function() {
            _.each(this.demoRows.attributes, function(row) {
                row.destroy();
            });
            this.demoRows.destroy();
        },
        createCwadDetailView: function(cwadIdentifier) {
            return new cwadDetailsView({
                'cwadIdentifier': cwadIdentifier,
                'patientModel': this.model
            });
        },
        showPatientInfoDropdown: function(event) {
            if (event.which === 13 || event.which === 32) {
                $(event.currentTarget).trigger('click');
            }
        },
        hidePatientInfoDropdown: function() {
            if (this.$el.find('.open').length >= 0) {
                this.$el.find('.open .dropdown-menu').dropdown('toggle');
            }
        },
        showCwadDetails: function(event) {
            var cwadLabel = $(event.target);
            var cwadContainer = this.$el.find('#cwad-details');
            if ((event.type === 'click') || ((event.type === 'keypress') && (event.which === 13 || event.which === 27))) {
                if (cwadLabel.attr('data-cwadidentifier') !== 'disabled') {
                    if (cwadContainer.attr('data-current-cwad') === cwadLabel.attr('data-cwadidentifier')) {
                        cwadContainer.toggleClass('hidden');
                        if (cwadContainer.hasClass('hidden')) {
                            $("body").off("mousedown");
                        } else {
                            $('body').on('mousedown', function() {
                                $('#cwad-details').addClass('hidden');
                                $("body").off("mousedown");
                            });
                        }
                        this.hidePatientInfoDropdown();
                    } else {
                        if (cwadContainer.hasClass('hidden')) {
                            cwadContainer.removeClass('hidden');
                        }
                        cwadContainer.attr('data-current-cwad', cwadLabel.attr('data-cwadidentifier'));
                        switch ($(event.target).attr('data-cwadidentifier')) {
                            case 'C':
                                this.cwadDetails.show(this.createCwadDetailView('crisis notes'));
                                break;
                            case 'W':
                                this.cwadDetails.show(this.createCwadDetailView('warnings'));
                                break;
                            case 'A':
                                this.cwadDetails.show(this.createCwadDetailView('allergies'));
                                break;
                            case 'D':
                                this.cwadDetails.show(this.createCwadDetailView('directives'));
                                break;
                            case 'F':
                                this.cwadDetails.show(this.createCwadDetailView('patient flags'));
                                break;
                        }
                        $('body').on('mousedown', function() {
                            if (!($('#cwad-details').hasClass('hidden'))) {
                                $('#cwad-details').addClass('hidden');
                                $("body").off("mousedown");
                            }
                        });
                        this.$el.find(".cwadLabel").on('mousedown', function(evt) {
                            evt.stopPropagation();
                        });
                        cwadContainer.on('mousedown', function(evt) {
                            evt.stopPropagation();
                        });
                        $('body').on('keyup', function(evt) {
                            if (evt.which === 13 || evt.which === 27) {
                                if (!($('#cwad-details').hasClass('hidden'))) {
                                    $('#cwad-details').addClass('hidden');
                                    $("body").off("mousedown");
                                }
                            }
                        });
                        this.$el.find(".cwadLabel").on('keyup', function(evt) {
                            if (evt.which === 13 || evt.which === 27) {
                                evt.stopPropagation();
                            }
                        });
                        cwadContainer.on('keyup', function(evt) {
                            if (evt.which === 13 || evt.which === 27) {
                                evt.stopPropagation();
                            }
                        });
                        this.hidePatientInfoDropdown();
                    }
                }
            }
        },
        updateCcowStatus: function(status) {
            // This will trigger an update of the model
            if (status === 'Connected') {
                this.model.set('ccowConnected', 'yes');
            } else {
                this.model.set('ccowConnected', '');
            }

            this.model.set('ccowStatus', status);
        },
        updateSmokingStatus: function(status) {
            this.model.set('smokingStatus', status);
        },
        leaveContext: function() {
            CCOWService.suspendContext(function() {
                console.log('successfully left context');
            });
        },
        joinContext: function() {
            CCOWService.resumeContext();
        },
        setVisitContext: function() {
            visitChannel.command('openVisitSelector', 'patientheader');
        },
        launchAddAllergy: function(event) {
            event.preventDefault();
            var addAllergyChannel = Messaging.getChannel("addAllergy");
            addAllergyChannel.trigger('addAllergy:clicked', event);
        },
        launchAddProblem: function(event) {
            event.preventDefault();
            var problemChannel = Messaging.getChannel('problems');
            problemChannel.command('addProblem');
        },
        launchAddVitals: function(event) {
            event.preventDefault();
            var addVitalsChannel = Messaging.getChannel("addVitals");
            addVitalsChannel.trigger('addVitals:clicked', event);
        },
        launchAddSignature: function(event) {
            ADK.SignApi.sign(signModels.mixed, function(params) {
                console.log(params);
            });
            event.preventDefault();
            event.stopImmediatePropagation();

        },
        handleKeyPress: function(event) {
            event.preventDefault();
            if (event.keyCode === 13 || event.keyCode === 32) {
                this.launchDemographicDiff(event);
            }
        },
        launchDemographicDiff: function(event) {
            event.preventDefault();
            //Future sprint
        },
        templateHelpers: {
            isInVista: function() {
                return ResourceService.patientRecordService.isPatientInPrimaryVista();
            },
            hasMhInfo: function() {
                var mhInfo = this.teamInfo && this.teamInfo.mhCoordinator;
                return mhInfo && ((mhInfo.mhTeam && mhInfo.mhTeam.toLowerCase() !== 'unassigned') ||
                    (mhInfo.name && mhInfo.name !== 'unassigned'));
            }
        }
    });

    return PatientHeaderView;
});