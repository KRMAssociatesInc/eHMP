Ext.define('gov.va.cpe.patient.TransitoryPatientBar', {
    extend:'Ext.container.Container',
    requires: [
        'gov.va.hmp.ptselect.PatientSelect',
        'gov.va.hmp.healthtime.PointInTime'
    ],
    alias: 'widget.transitorypatientbar',
    cls: 'hmp-pt-bar-ct',
    width: '100%',
    height: 44,
    layout: {
        type: 'hbox'
    },
    defaults: {
        cls: 'hmp-pt-bar-item'
    },
    items: [
        {
            xtype: 'component',
            itemId: 'patientNameCmp',
            border: '1',
            style :  {
               borderStyle: 'solid',
               borderColor: 'rgba(0,0,0,0)'
            },
            width: 240,
            height: 44,
            tpl:['<h3>{displayName}</h3>',
                '<table style="width:100%;margin-top:3px">' +
                    '<tr>' +
                    '<td>{[gov.va.hmp.ptselect.PatientSelect.formatSSN(values.ssn)]}</td>' +
                    '<td>{[PointInTime.format(values.birthDate)]},&nbsp;<span>{age}y</span>&nbsp;<span>{genderName}</span></td>' +
                    '</tr>' +
                    '</table>'
            ]
        }
    ],
    update: function (htmlOrData, loadScripts, callback) {
        this.down('#patientNameCmp').update(htmlOrData, loadScripts, callback);
    }
});