Ext.define('gov.va.cpe.order.ScheduleStore', {
            storeId:'orderScheduleStore',
            requires:[
                'gov.va.cpe.order.Schedule'
            ],
            model: 'gov.va.cpe.order.Schedule',
            proxy:{
                type:'ajax',
                url: '/order/schedules',
                reader: {
                    type: 'json',
                    root: 'data.items',
                    totalProperty: 'data.totalItems'
                }
            }
        });