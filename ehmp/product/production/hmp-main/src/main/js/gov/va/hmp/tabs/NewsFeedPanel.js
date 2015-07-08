Ext.define('gov.va.hmp.tabs.NewsFeedPanel', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    requires: [
        'gov.va.hmp.UserContext',
        'gov.va.hmp.containers.PatientAwarePanel',
        'gov.va.hmp.healthtime.PointInTime'
    ],
    alias: 'widget.newsfeedpanel',
    title: 'News Feed',
    viewID: 'gov.va.cpe.vpr.queryeng.NewsFeedViewDef',
    viewParams: {
        'row.count': 5000
    },
    hideHeaders: true,
    header: false,
    groupHeaderTpl: '<div style="margin-top: 10px" class="text-left">{[values.name != "none" ? (gov.va.hmp.PatientContext.isInPatient ? PointInTime.formatDateFromNow(values.name) : PointInTime.formatMonthYearFromNow(values.name)) : "No Date"]}</div>',
    rowLines: false,
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 640,
        height: 480,
        autoScroll: true,
        overflowY: true
    },
    columns: [
        {
            text: 'Date/Time',
            xtype: 'healthtimecolumn',
            tdCls: 'text-muted',
            dataIndex: 'when',
            width: 88,
            groupable: false,
            format: "H:i",
            align: 'right'
        },
        {
            flex: 1,
            renderer: function(value, meta, record) {
                var data = Ext.apply({}, record.data, record.getAssociatedData());
                var type = data.uid.split(':')[2];
                var tplName = type ? type + 'Tpl' : 'tpl';
                var tpl = meta.column.hasOwnProperty(tplName) ? meta.column[tplName] : meta.column.tpl;
                if (tpl && !tpl.isTemplate) {
                    tpl = meta.column[tplName] = (!Ext.isPrimitive(tpl) && tpl.compile) ? tpl : new Ext.XTemplate(tpl);
                }
                return tpl.apply(data);
            },
            tpl:'<div>{summary}</div>',
            consultTpl: '<tpl if="category == \'P\'">' +
                '<tpl if="statusName == \'PENDING\'"><span class="label label-default">Pending</span> </tpl>{orderName} ordered<tpl if="providerDisplayName"> by {providerDisplayName}</tpl>' +
                '<tpl else>' +
                '<tpl if="statusName == \'PENDING\'"><span class="label label-default">Pending</span> </tpl>Consulted {orderName}' +
                '</tpl>',
            visitTpl: ['<tpl if="stopCodeName == \'EMERGENCY DEPT\'">' +
                    '<span class="label label-danger">{typeDisplayName}</span> in {facilityName}' +
                    '<tpl elseif="categoryCode == \'urn:va:encounter-category:AD\'">' +
                '<tpl if="this.isAdmit(id)">' +
                    '<div><span class="label label-warning">Admitted</span> to {facilityName} {specialty}<tpl if="primaryProvider"> by {primaryProvider.providerDisplayName}</tpl></div>' +
                    '<div><span class="text-muted">Diagnosis </span>{reasonName}</div>' +
                '<tpl elseif="this.isDischarge(id)">' +
                  '<div><span class="label label-warning">Discharged</span> from {facilityName}</div>' +
                '</tpl>' +
                '<tpl elseif="stopCodeName">' +
                'Seen in {stopCodeName} <span class="text-muted">{locationDisplayName}</span><tpl if="primaryProvider"> by {primaryProvider.providerDisplayName}</tpl>' +
                '<tpl else>' +
                '<span class="text-muted">Visit</span> {typeDisplayName}' +
                '</tpl>' +
                '<tpl if="!this.isCurrentUserFacilityCode(facilityCode)"> <i class="fa fa-cloud text-muted" title="Originated at {facilityName}"></i></tpl>',
                {
                    isAdmit:function(id) {
                        return id.indexOf('-1') != -1;
                    },
                    isDischarge:function(id) {
                        return id.indexOf('-2') != -1;
                    },
                    isInPatient: function() {
                        return gov.va.hmp.PatientContext.isInPatient;
                    },
                    isCurrentUserFacilityCode: function (facilityCode) {
                        return gov.va.hmp.UserContext.isCurrentUserFacilityCode(facilityCode);
                    }
                }],
            immunizationTpl:'<span class="text-muted">Immunization </span>{summary}',
            mhTpl:'<span class="text-muted">Mental Health Assessment </span>{displayName}',
            procedureTpl: '{name} <tpl if="statusName ==\'COMPLETE\'">completed<tpl else>{[values.statusName.toLowerCase()]}</tpl>',
            surgeryTpl:'<span class="text-muted">Surgery </span>{typeName} completed<tpl if="providerDisplayName"> by {providerDisplayName}</tpl>'
        }
    ],
    initComponent:function() {
        var me = this;
        this.callParent(arguments);
    },
    patientchange:function(pid) {
        this.callParent(arguments);

        if (this.rendered) {
            var store = this.getStore();
            if (gov.va.hmp.PatientContext.isInPatient) {
                store.group([
                    {
                        property: 'when',
                        direction: 'DESC',
                        sorterFn: function (o1, o2) {
                            var dt1 = o1 != null ? o1.get('when') : null;
                            var dt2 = o2 != null ? o2.get('when') : null;
                            if (!dt1 && !dt2) {
                                return 0;
                            } else if (dt1 && !dt2) {
                                return -1;
                            } else if (!dt1 && dt2) {
                                return 1;
                            }

                            // group by date, then time
                            var date1 = dt1.substr(0, 8);
                            var time1 = parseInt(dt1.substr(8, 4), 10);
                            var date2 = dt2.substr(0, 8);
                            var time2 = parseInt(dt2.substr(8, 4), 10);

                            if (date1 < date2) {
                                return -1;
                            } else if (date1 > date2) {
                                return 1;
                            } else if (date1 === date2) {
                                if (time1 < time2) {
                                    return 1;
                                } else if (time1 > time2) {
                                    return -1;
                                } else if (time1 === time2) {
                                    return 0;
                                }
                            }
                        },
                        getGroupString: function (instance) {
                            var when = instance.get('when');
                            when = when ? when.substr(0, 8) : 'none';
                            return when;
                        }
                    }
                ]);
                this.getView().getHeaderCt().getGridColumns()[0].format = 'H:i';
            } else {
                store.group([
                    {
                        property: 'when',
                        direction: 'DESC',
                        sorterFn: function (o1, o2) {
                            var dt1 = o1 != null ? o1.get('when') : null;
                            var dt2 = o2 != null ? o2.get('when') : null;
                            if (!dt1 && !dt2) {
                                return 0;
                            } else if (dt1 && !dt2) {
                                return -1;
                            } else if (!dt1 && dt2) {
                                return 1;
                            }

                            // group by month, then date
                            var yearmonth1 = dt1.substr(0, 6);
                            var date1 = parseInt(dt1.substr(6, 2), 10);
                            var yearmonth2 = dt2.substr(0, 6);
                            var date2 = parseInt(dt2.substr(6, 2), 10);

                            if (yearmonth1 < yearmonth2) {
                                return -1;
                            } else if (yearmonth1 > yearmonth2) {
                                return 1;
                            } else if (yearmonth1 === yearmonth2) {
                                if (date1 < date2) {
                                    return 1;
                                } else if (date1 > date2) {
                                    return -1;
                                } else if (date1 === date2) {
                                    return 0;
                                }
                            }
                        },
                        getGroupString: function (instance) {
                            var when = instance.get('when');
                            when = when ? when.substr(0, 6) : 'none';
                            return when;
                        }
                    }
                ]);
                this.getView().getHeaderCt().getGridColumns()[0].format = 'M d';

            }
        }
    }
});
