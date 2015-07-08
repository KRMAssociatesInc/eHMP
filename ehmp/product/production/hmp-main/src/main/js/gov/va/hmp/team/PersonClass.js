Ext.define('gov.va.hmp.team.PersonClass', {
    extend:'Ext.data.Model',
    fields:[
        "uid",
        "providerType",
        "providerTypeCode",
        "classification",
        "classificationCode",
        "areaOfSpecialization",
        "areaOfSpecializationCode",
        "status",
        "dateInactivated",
        "vaCode",
        "X12Code",
        "specialtyCode"
    ]
});