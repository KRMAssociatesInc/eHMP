var _ = require('lodash');

function removeDuplicateImmunizations(vistaSites, input) {

    var temporaryItemsCol = [];
    var clonedItems = _.cloneDeep(input);
    var cnt = 0;

    //We need to add administered Date without time
    _.each(input, function(item){
        clonedItems[cnt].administeredDate = item.administeredDateTime.substr(0, 8);
        cnt++;
    });

    //Second, we need to create new array and push all local site ones at the top.
    _.each(vistaSites, function (site) {
        var items = _.where(clonedItems, {'facilityCode': site.division});
        _.each(items, function (item) {
            temporaryItemsCol.push(item);
        });
    });

    //Third, we need to push all non-local site ones below in the stack
    var finalItems = [];
    _.each(vistaSites, function (site) {
        var items = _.filter(clonedItems, function (item) {
            return item.facilityCode != site.division;
        });
        _.each(items, function (item) {
            temporaryItemsCol.push(item);
            finalItems.push(item);
        });

    });

    //Now, we just pull out unique immunizations based on name and administered date
    var dupeItems = _.uniq(temporaryItemsCol, function (elem) {
        return [elem.name, elem.administeredDate].join();
    });

    //We need to add the unique ones to final items
    _.each(dupeItems, function (item) {
        finalItems.push(item);
    });

    //Then sort by facility Name first and then administeredDate
    var sortedList = _.sortBy(finalItems, ['facilityName', 'administeredDate']);

    var returnList = _.uniq(sortedList, function( elem ) {
      return [elem.name, elem.administeredDate].join();
    });

    return returnList;

}


module.exports.removeDuplicateImmunizations =  removeDuplicateImmunizations;
