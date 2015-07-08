Ext.define('gov.va.cpe.patient.PatientBar', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.hmp.ux.PopUpButton',
        'gov.va.hmp.EventBus',
        'gov.va.hmp.ptselect.PatientSelect',
        'gov.va.hmp.healthtime.PointInTime',
        'gov.va.cpe.patient.PatientDemographicsPanel',
        'gov.va.cpe.viewdef.ProfileDocsViewDef',
        'gov.va.cpe.patient.CcowIcon'
    ],
    alias:'widget.ptbar',
    mixins:{
        patientaware:'gov.va.hmp.PatientAware',
        encounteraware:'gov.va.hmp.EncounterAware'
    },
    layout:{
        type:'hbox',
        align:'stretch'
    },
    //height:66,
    cls:'hmp-pt-bar-ct',
    disabled:true,
    defaults:{
        cls:'hmp-pt-bar-item'
    },
    items:[
        {
            xtype: 'ccowiconbutton',
            ui: 'transparent',
            cls: 'hmp-ccow-background'
        },
        {
            xtype:'popupbutton',
            ui: 'transparent',
            width: 210,
            menuOffsets:[0,0],
            tpl:['<h3>{displayName}</h3>',
                '<table style="width:100%;margin-top:3px">' +
                    '<tr>' +
                    '<td>{[gov.va.hmp.ptselect.PatientSelect.formatSSN(values.ssn)]}</td>' +
                    '<td>{[PointInTime.format(values.birthDate)]},&nbsp;<span>{age}y</span>&nbsp;<span>{genderName}</span></td>' +
                    '</tr>' +
                    '</table>'
            ],
            popUp:{
                  xtype:'patientdemographicspanel',
                  width:500,
                  height:400,
                  autoScroll:true
            },
            popUpButtons: [
                 {
                     xtype: 'button',
                     text: 'Edit',
                     itemId: "editCancelBtn",
                     handler: function (btn) {
                         btn.up('menu').down('patientdemographicspanel').handleEditCancelBtn(this);
                     }
                 },
                 {
                     xtype: 'button',
                     text: 'Close',
                     itemId: "closeDoneBtn",
                     handler: function (btn) {
                         btn.up('menu').down('patientdemographicspanel').handleCloseDoneBtn(this);
                     }
                 }
            ]
        },
        {
            xtype: 'component',
            itemId: 'cur-visit',
            ui: 'transparent',
            width: 160,
            tpl:'<table style="margin-top:2px">' +
                //'<tr><td><tpl if="appointment">{appointment}<tpl elseif="roomBed">{roomBed}<tpl else>&nbsp;</tpl></td></tr>' +
                '<tr><td>' +
                '<tpl if="appointment">' +
                '{location}&nbsp;{[PointInTime.format(values.appointment, "DefaultDate")]}&nbsp;{[PointInTime.format(values.appointment, Ext.Date.patterns.Time)]}' +
                '<tpl elseif="roomBed">' +
                '{location} &nbsp; {roomBed}' +
                '<tpl else>Visit Not Selected' +
                '</tpl>' +
                '</td></tr>' +
                '<tr><td>' +
                '<tpl if="encounterProvider">' +
                '<span class="text-muted">Provider</span>&nbsp;{encounterProvider}' +
                '<tpl else><span class="text-muted">Current Provider Not Selected</span>' +
                '</tpl>' +
                '</td></tr>' +
                '</table>'
        },
        {
            xtype: 'popupbutton',
            itemId: 'pcmm',
            ui: 'transparent',
            cls: 'hmp-pt-bar-item',
            flex: 1,
            tpl: new Ext.XTemplate(
                '<div class="hmp-provider-detail" style="">' +
                    '{[this.buildPrimaryCareLine(values)]}' +
                    '{[this.buildInPatientLine(values)]}' +
                    '{[this.buildMhCoordiLine(values)]}' +
                '</div>',
                {
                    isValidName: function(name) {
                        return name !== null && name !== 'unassigned';
                    },
                    buildPrimaryCareLine: function(data) {
                        var str;
                        if ( this.isValidName(data.teamInfo.team.name) || this.isValidName(data.teamInfo.primaryProvider.name) ) {
                            if ( this.isValidName(data.teamInfo.team.name) ) { str = data.teamInfo.team.name + '&nbsp;/&nbsp;'; }
                            if ( this.isValidName(data.teamInfo.primaryProvider.name) ) { str += data.teamInfo.primaryProvider.name; }
                            if ( this.isValidName(data.teamInfo.associateProvider.name) ) { str += ('&nbsp;/&nbsp;' + data.teamInfo.associateProvider.name); }
                        } else {
                            str = 'Primary Care Team Unassigned';
                        }
                        return '<div title="' + str + '">' + str + '</div>';;
                    },
                    buildInPatientLine: function(data) {
                        var ret = '';
                        if (data.roomBed && data.inpatientLocation) {
                            var title = this.buildInPatient(data.teamInfo.attendingProvider, data.teamInfo.inpatientProvider, true),
                                line = this.buildInPatient(data.teamInfo.attendingProvider, data.teamInfo.inpatientProvider);
                            if (title != '') {
                                ret = '<div title="' + title + '">' + line + '</div>';
                            }
                        }
                        return ret;
                    },
                    buildInPatient: function(attending, inpatient, title) {
                        var line;
                        if ( this.isValidName(attending.name) ) {
                            line = (title ? '' : '<span class="text-muted">') + '[Inpatient]&nbsp;Attending&nbsp;' + (title ? '' : '</span>') + attending.name;
                        }
                        if ( this.isValidName(inpatient.name) ) {
                            line += ((title ? '' : '<span class="text-muted">') + '&nbsp;&nbsp;-[Inpatient]&nbsp;Provider&nbsp;' + (title ? '' : '</span>') + inpatient.name);
                        }
                        return line;
                    },
                    buildMhCoordiLine: function(data) {
                        var title = this.buildMhCoordi(data, true), line = this.buildMhCoordi(data);
                        if ( title != '') { return '<div title="' + title + '">' + line + '</div>'; }
                        else return '';
                    },
                    buildMhCoordi: function(data, title) {
                        var str = '';
                        if ( this.isValidName(data.teamInfo.mhCoordinator.name) ) {
                            str = (title ? '' : '<span class="text-muted">') + 'MH Treatment Coordinator&nbsp;' + (title ? '' : '</span>') + data.teamInfo.mhCoordinator.name;
                        } else if ( data.roomBed && data.inpatientLocation && data.specialtyService === 'P' ) {
                            str = (title ? '' : '<span class="text-muted">') + 'MH Treatment Coordinator Unassigned' + (title ? '' : '</span>')
                        }
                        return str;
                    }
                }),

            popUp:{
                xtype: 'component',
                id: 'team-detail',
                width: 420,
                height: 500,
                overflowY: 'scroll',
                loader: {
                    autoLoad: false,
                    ajaxOptions: {
                        method: 'POST'
                    }
                },
                tpl: new Ext.XTemplate(
                    '<table class="hmp-labeled-values">' +
                    '<tpl if="teamInfo.team && this.isValidName(teamInfo.team.name)">' +
                    '   <tr><td>Primary Care Team</td><td>{teamInfo.team.name}</td></tr>' +
                    '   <tr><td>Phone</td><td>{teamInfo.team.phone}</td></tr>' +
                    '<tpl else>' +
                    '   <tr><td>No Primary Care Team Assigned</td></tr>' +
                    '</tpl>' +
                    '<tr><td>&nbsp;</td></tr>' +
                    '<tpl if="teamInfo.primaryProvider && this.isValidName(teamInfo.primaryProvider.name)">' +
                        '{[this.formatProviderDetail(values.teamInfo.primaryProvider, \'Primary Provider\')]}' +
                    '<tpl else>' +
                    '   <tr><td>No Primary Care Provider Assigned</td></tr>' +
                    '</tpl>' +
                    '<tr><td>&nbsp;</td></tr>' +
                    '<tpl if="teamInfo.associateProvider && this.isValidName(teamInfo.associateProvider.name)"">' +
                        '{[this.formatProviderDetail(values.teamInfo.associateProvider, \'Associate Provider\')]}' +
                    '<tpl else>' +
                    '   <tr><td>No Associate Provider Assigned</td></tr>' +
                    '</tpl>' +
                    '<tr><td>&nbsp;</td></tr>' +
                    '<tpl if="roomBed && inpatientLocation">' +
                    '   <tpl if="teamInfo.attendingProvider && this.isValidName(teamInfo.attendingProvider.name)">' +
                            '{[this.formatProviderDetail(values.teamInfo.attendingProvider, \'Attending Provider\')]}' +
                    '   <tpl else>' +
                    '    <tr><td>No Attending Provider Assigned</td></tr>' +
                    '   </tpl>' +
                    '   <tr><td>&nbsp;</td></tr>' +
                    '   <tpl if="teamInfo.inpatientProvider && this.isValidName(teamInfo.inpatientProvider.name)">' +
                            '{[this.formatProviderDetail(values.teamInfo.inpatientProvider, \'Inpatient Provider\')]}' +
                    '   <tpl else>' +
                    '    <tr><td>No Inpatient Provider Assigned</td></tr>' +
                    '   </tpl>' +
                    '</tpl>' +
                    '<tr><td>&nbsp;</td></tr>' +
                    '<tpl if="teamInfo.mhCoordinator && this.isValidName(teamInfo.mhCoordinator.name)">' +
                    '    <tr><td>MH Treatment Team</td><td>{teamInfo.mhCoordinator.mhTeam}</td></tr>' +
                    '    {[this.formatProviderDetail(values.teamInfo.mhCoordinator, \'MH Treatment Coordinator\')]}' +
                    '<tpl elseif="roomBed && inpatientLocation && specialtyService === \'P\'">' +
                    '    <tr><td>No MH Treatment Coordinator Assigned</td></tr>' +
                    '</tpl>' +
                    '</table>',
                    {
                        isValidName: function(name) {
                            return name !== null && name !== 'unassigned';
                        },
                        formatProviderDetail: function(provider, header) {
                             var str = '<tr><td>' + header + '</td><td>' + provider.name + '</td></tr>' +
                                       '<tr><td>Analog Pager</td><td>' + provider.analogPager + '</td></tr>' +
                                       '<tr><td>Digital Pager</td><td>' + provider.digitalPager + '</td></tr>' +
                                       '<tr><td>Office Phone</td><td>' + provider.officePhone + '</td></tr>';
                            return str;
                        }
                    })
            }
        },
        {
            xtype: 'popupbutton',
            itemId: 'cwadf',
            ui: 'transparent',
            maxWidth: 240,
            cls: 'hmp-pt-bar-item cpe-cwadf',
            tpl: new Ext.XTemplate(
                '<tpl if="cwadf">' +
                '<div class="cwadf-row">' ,
                    '<tpl if="this.hasCrisisNotes(cwadf)"><span class="label label-danger">Crisis&nbsp;Notes</span></tpl>' ,
                    '<tpl if="this.hasWarnings(cwadf)"><span class="label label-danger">Warning&nbsp;Notes</span></tpl>' ,
                '</div>',
                '<div class="cwadf-row">' ,
                    '<tpl if="this.hasAllergies(cwadf)"><span class="label label-danger">Allergies</span></tpl>' ,
                    '<tpl if="this.hasFlags(cwadf)"><span class="label label-danger">Flags</span></tpl>' ,
                    '<tpl if="this.hasDirectives(cwadf)"><span class="label label-danger">Directives</span></tpl>' ,
                '</div>' +
                '</tpl>',
                '<tpl if="!cwadf">' +
                    '<div class="text-muted" style="text-align: center">Postings</div>' ,
                    '<h3 style="text-align: center">None</h3>' ,
                '</tpl>',
                {
                    disableFormats: true,
                    hasCrisisNotes: function(cwadf) {
                        return cwadf.indexOf('C') != -1;
                    },
                    hasWarnings: function(cwadf) {
                       return cwadf.indexOf('W') != -1;
                    },
                    hasAllergies: function(cwadf) {
                        return cwadf.indexOf('A') != -1;
                    },
                    hasDirectives: function(cwadf) {
                        return cwadf.indexOf('D') != -1;
                    },
                    hasFlags: function(cwadf) {
                        return cwadf.indexOf('F') != -1;
                    }
                }),
            menuAlign:'tr-br?',
            menuOffsets:[0,0],
            popUp:{
                xtype: 'component',
                id: 'cwadf-detail',
                autoEl: {
                    tag: 'div',
                    'data-spy': 'scroll',
                    'data-target': '#cwadf-nav'
                },
                width: 834,
                height: 600,
                overflowY: 'scroll',
                loader: {
                    autoLoad: false
                }
            }
        }
    ],

    initComponent: function() {
        if(!gov.va.hmp.CcowContext.initialized) {gov.va.hmp.CcowContext.init();}
        if (!gov.va.hmp.CcowContext.ccowEnabled) {
            this.items.splice(0,1);
        }
        this.callParent(arguments);
    },
    listeners:{
        beforepatientchange:function (pid) {
            var patientInfoWindow = Ext.getCmp('patientInfoWindow');
            if (patientInfoWindow) patientInfoWindow.hide();
        },
        patientchange:function (pid) {
            this.setPatient(pid);
        },
        encounterchange:function (pid) {
            this.updatePtInfo(pid);
        }
    },
    initEvents:function() {
        var me = this;
        me.callParent(arguments);

        var cwadfButton = me.down('#cwadf');
        me.mon(cwadfButton, 'menuhide', me.onCWADFDetailHide, me);

        var loader = cwadfButton.menu.down('component').getLoader();
        me.mon(loader, 'beforeload', me.onCWADFDetailBeforeLoad, me);
        me.mon(loader, 'load', me.onCWADFDetailLoad, me);

        var teamInfoLoader = me.down('#pcmm').menu.down('component').getLoader();
        me.mon(teamInfoLoader, 'load', me.onTeamDetailLoad, me);

        // gov.va.hmp.EventBus.on('domainChange', this.onDomainChange, this);         - disable freshness for now until we decide how we want to do it ...
    },
    onBoxReady:function () {
        this.callParent(arguments);
        this.initPatientContext();
    },
    // private
    onCWADFDetailBeforeLoad: function (loader) {
        // unhook the all the event handlers to prevent leaks
        jQuery('#cwadf-nav .nav').off();
    },
    // private
    onCWADFDetailLoad: function (loader) {
        // set first item active
        jQuery('#cwadf-nav .nav li').not('.dropdown-header').first().addClass('active');

        // attach click handler for setting 'active' item
        jQuery('#cwadf-nav .nav').on('click', 'li', function(event){
            jQuery('#cwadf-nav .active').removeClass('active');
            jQuery(event.currentTarget).addClass('active');
        });
        // refresh scrollspy
        jQuery('#cwadf-detail').scrollspy('refresh');

        // truncate text in the nav based on how much room is left
        jQuery('#cwadf-nav .nav li').each(function() {
            var truncate = jQuery(this).find('.overflow-truncate');
            var keep = jQuery(this).find('.overflow-keep');

            if (truncate && keep) {
                truncate.css('text-overflow', 'ellipsis');
                truncate.css('overflow', 'hidden');
                truncate.attr('title', 'Signs/symptoms: ' + truncate.text());

                var keepWidth = keep.outerWidth();
                var containerWidth = jQuery(this).outerWidth();

                truncate.css('max-width', (containerWidth - keepWidth - 25) + 'px');
            }
        });
    },
    // private
    onCWADFDetailHide: function () {
        // remove fragment as much as it can go without adding an entry in browser history:
        window.location.replace("#");

        // slice off the remaining '#' in HTML5:
        if (typeof window.history.replaceState == 'function') {
            history.replaceState({}, '', window.location.href.slice(0, -1));
        }
    },
    /**
     * @private
     */
    setPatient:function (pid) {
        var me = this;
        me.pid = pid;
        if (pid !== null) {
            var cwadfDetailLoader = me.down('#cwadf').menu.down('component').getLoader();
            var url = '/vpr/' + me.pid + '/detail/cwadf';
            cwadfDetailLoader.url = url;

            var teamInfoLoader = me.down('#pcmm').menu.down('component').getLoader();
            var tiUrl = '/context/patient?pid=' + me.pid;
            teamInfoLoader.url = tiUrl;
        }
    },

    updatePtInfo:function (pid) {
        var me = this;
        me.disable();
        me.pid = pid;
        if (pid !== null) {
            var ptBarInfo = gov.va.hmp.PatientContext.getPatientInfo();
            var encounter = gov.va.hmp.EncounterContext.getEncounterInfo();
            ptBarInfo = Ext.apply(ptBarInfo, { roomBed: encounter.roomBed,
                                               appointment: encounter.appointment,
                                               location: encounter.location });

            var encounter = null;
            if (gov.va.hmp.UserContext.currentUserHasAuthority('VISTA_KEY_PROVIDER')) {
                encounter = gov.va.hmp.UserContext.getUserInfo().displayName;
            }
            ptBarInfo = Ext.apply(ptBarInfo, { encounterProvider: encounter });

            me.update(ptBarInfo);
            me.enable();
        }

        //gov.va.hmp.EncounterContext.postEncounterUid();
    },

    update:function (htmlOrData, loadScripts, cb) {
        var me = this;
        if (Ext.isString(htmlOrData)) {
            me.callParent(arguments);
        } else {
            me.suspendLayout = true;
            for (var i = 0; i < me.items.getCount(); i++) {
                var pnl = me.getComponent(i);
                if (pnl.tpl) {
                    pnl.update(htmlOrData);
                }
            }
            me.suspendLayout = false;
            me.doLayout();
        }
    },

    onTeamDetailLoad: function(loader, response) {
        loader.getTarget().update(Ext.JSON.decode(response.responseText).data.additionalDemographics);
    },

    onDomainChange: function(event) {
        var me = this;
        if ( me.pid == event.pid && (event.domain == 'Encounter' || event.domain == 'PatientDemographics') ) {
            me.patientInfo = {};
            Ext.Ajax.request({
                url: '/context/patient?pid=' + me.pid,
                method: 'POST',
                failure: function (resp) {
                    var err = Ext.decode(resp.responseText, true);
                    if (err && err.error && err.error.code == "404") {
                        console.log(err.error.message);
                    } else {
                        me.reportError('Error updating patient location');
                    }
                },
                success: function (resp) {
                    var json = Ext.JSON.decode(resp.responseText);
                    var data = json.data;
                    me.patientInfo = Ext.apply(me.patientInfo, data.patient);
                    me.patientInfo = Ext.applyIf(me.patientInfo, data.additionalDemographics);

                    me.disable();
                    me.update(me.patientInfo);
                    me.enable();
                }
            });
        }
    }

});
