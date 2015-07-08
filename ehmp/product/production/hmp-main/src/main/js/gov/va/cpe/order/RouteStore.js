Ext.define('gov.va.cpe.order.RouteStore', {
            storeId:'orderRouteStore',
            requires:[
                'gov.va.cpe.order.Route'
            ],
            model: 'gov.va.cpe.order.Route',
            proxy:{
                type:'ajax',
                url: '/order/routes',
                reader: {
                    type: 'json',
                    root: 'data.items',
                    totalProperty: 'data.totalItems'
                }
            }
        });