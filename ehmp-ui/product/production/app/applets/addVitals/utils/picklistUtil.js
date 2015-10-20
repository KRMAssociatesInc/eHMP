define([
    'backbone'
], function(Backbone) {

    var PicklistUtil = {
        getQualifier: function(list, type, category){
            var qualifiers = [];
            var qualifier = _.findWhere(list, {name: type});

            if(qualifier && qualifier.categories){
                var categoryItem = _.findWhere(qualifier.categories, {categoryName : category});
             
                if(categoryItem.qualifiers){
                    _.each(categoryItem.qualifiers, function(item){
                        qualifiers.push({label: item.name, value: item.ien });
                    });
                }
            }
            return qualifiers;
        },
        getIENMap: function(list){
            var ienMap = {};
            _.each(list, function(item){
                ienMap[item.name] = item.ien;
            });
            return ienMap;
        }
    };

    return PicklistUtil;
});