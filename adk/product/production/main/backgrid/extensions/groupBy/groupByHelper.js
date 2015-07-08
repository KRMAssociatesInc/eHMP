define([], function() {

    var GroupByHelper = {
        aggregateBy: function (collection, aggregateFunc) {
            var groupedCollection = [];
            _.each(collection, function (item) {
                var groupKey = aggregateFunc(item);
                var groupedBucket = _.find(groupedCollection,  function(item) {
                    return item[0] === groupKey;
                });
                if (groupedBucket !== undefined && groupedBucket[0] === groupKey) {
                    groupedBucket[1].push(item);
                }
                else {
                    groupedCollection.push([groupKey, [item]]);
                }

            });
            return groupedCollection;

        },
        isEmptyCollection: function(collection) {
            return collection.length <= 0;
        }
    };
    return GroupByHelper;
});
