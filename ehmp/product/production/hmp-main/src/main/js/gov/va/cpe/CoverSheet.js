Ext.define('gov.va.cpe.CoverSheet', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.hmp.healthtime.PointInTime',
        'gov.va.cprs.coversheet.Appointments',
        'gov.va.cprs.coversheet.ActiveMedications',
        'gov.va.cprs.coversheet.Allergies',
        'gov.va.cprs.coversheet.RecentLabs',
        'gov.va.cprs.coversheet.RecentVitals',
        'gov.va.cpe.coversheet.ActiveProblems',
        'gov.va.cpe.coversheet.Tasks'
    ],
    alias: 'widget.coversheet',
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    title: 'Cover Sheet',
    padding: '0 10 10 10',
    overflowY: 'scroll',
    layout: {
        type: 'column',
        reserveScrollbar: true
    },
    items: [
        {
            xtype: 'container',
            itemId: 'col1',
            columnWidth: 0.5,
            margin: '0 20 0 0',
            defaults: {
                margin: '10 0'
            }
//            layout: {
//                type: 'hbox',
//                align: 'stretch'
//            }
        },
        {
            xtype: 'container',
            itemId: 'col2',
            columnWidth: 0.5,
            defaults: {
                margin: '10 0'
            }
//            layout: {
//                type: 'hbox',
//                align: 'stretch'
//            }
        }
    ],
    initComponent: function () {
        // adding components here so that each coversheet component doesn't need its own xtype
        this.items[0].items = [
//            {
//                xtype: 'component',
//                itemId: 'ptInfo',
//                tpl: '<h4 style="background-color: gray; color: white">{givenNames} {familyName}</h4>' +
//                    '<table class="hmp-labeled-values">' +
//                    '<tr><td></td><td>{age}y {genderName}</td></tr>' +
//                    '<tr><td>DOB</td><td>{[PointInTime.format(values.birthDate)]}</td></tr>' +
//                    '<tr><td>Service Connected</td><td><tpl if="serviceConnected">Yes ({scPercent}%)<tpl else>No</tpl></td></tr>' +
//                    '<tr><td>Location</td><td>{location} {roomBed}</td></tr>' +
//                    '<tr><td>Code Status</td><td>TBD</td></tr>' +
//                    '</table>',
//                data: gov.va.hmp.PatientContext.getPatientInfo()
//            },
            Ext.create('gov.va.cpe.coversheet.ActiveProblems'),
            Ext.create('gov.va.cprs.coversheet.ActiveMedications', {
                ui: 'underlined-title-condensed',
                rowLines: false,
                overflowY: 'hidden',
                columns: [
                    { xtype: 'templatecolumn', flex: 1, tpl: '{[values.products[0].ingredientName]} {[values.dosages[0].dose]} {[values.dosages[0].routeName]} {[values.dosages[0].scheduleName]}'}
                ]
            }),
            Ext.create('gov.va.cpe.coversheet.Tasks')
        ];
        this.items[1].items = [
            Ext.create('gov.va.cprs.coversheet.RecentVitals', {
                ui: 'underlined-title-condensed',
                rowLines: false
            }),
            Ext.create('gov.va.cprs.coversheet.RecentLabs', {
                ui: 'underlined-title-condensed',
                rowLines: false
            }),
            Ext.create('gov.va.cprs.coversheet.Appointments', {
                ui: 'underlined-title-condensed',
                rowLines: false
            })
        ];

        this.callParent(arguments);

        this.mon(this, 'patientchange', this.onPatientChange, this);
    },
    initEvents: function () {
        var me = this;

        me.callParent(arguments);

        var components = me.query('gridpanel');
        for (var i = 0; i < components.length; i++) {
            me.mon(components[i], 'selectionchange', me.onSelectionChange, me);
        }
    },
    onPatientChange: function (pid) {
        this.pid = pid;
        if (!this.pid || pid == '') return;
//        this.down('#ptInfo').update(gov.va.hmp.PatientContext.getPatientInfo());
    },
    // coordinates only one selection amongst all cover sheet components
    onSelectionChange: function (selModel, selection) {
        var me = this;
        var components = me.query('gridpanel');
        for (var i = 0; i < components.length; i++) {
            if (components[i].getSelectionModel() !== selModel) {
                components[i].getSelectionModel().deselectAll();
            }
        }
    }
});