Ext.define('gov.va.hmp.team.MyTreeReader', {
    extend:'Ext.data.reader.Json',
    alias:'reader.jsonctree',
    readRecords: function(data) {
        var me = this;
        var items = data.data;
        var result = me.callParent(items);
        return result;
    },
//    buildExtractors:function () {
//        var me = this;
//        me.callParent(arguments);
//
//        me.getRoot = function (aObj) {
//            console.log("getRoot()");
//            console.log(aObj);
//            // Special cases
////            switch (aObj.name) {
////                case 'Bill':
////                    return aObj[ 'children' ];
////                case 'Norman':
////                    return aObj[ 'sons' ];
////            }
//
//            // Default root is `subclasses`
//            return aObj[ 'subclasses' ];
//        };
//    }
});