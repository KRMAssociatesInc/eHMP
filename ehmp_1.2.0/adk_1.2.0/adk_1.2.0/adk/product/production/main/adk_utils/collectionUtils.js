define(["backbone", "main/Session"], function(Backbone, Session) {

    var CollectionUtils = {};
    /*
        sortCollectionByColumn(collection, column name, sortType);
            Takes in a Backbone collection and a valid column name within that collection, and
            sorts the collection on that column.  sortType is an optional parameter that specifies
            the type of sort, if not alphabetical or ascending/descending by number.

            example usage:
            EventHandlers.sortCollectionByColumn(med_review_data, "dose");
        */
    CollectionUtils.sortCollection = function(collection, key, sortType, ascending) {
        if (sortType) {
            // Checking collection models to see if they have the specified key
            var hasKey = false;
            if (collection.at(0).attributes[key]) {
                hasKey = true;
            } else if (collection.at(collection.length - 1).attributes[key]) {
                hasKey = true;
            } else {
                for (var i = 1, collectionLength = collection.length; i < collectionLength - 1; i++) {
                    if (collection.at(i).attributes[key]) {
                        hasKey = true;
                        break;
                    }
                }
            }
            if (hasKey) {
                collection.comparator = function(item1, item2) {
                    var ascendingToggle;
                    if (ascending) {
                        ascendingToggle = 1;
                    } else {
                        ascendingToggle = -1;
                    }
                    var value1 = item1.get(key);
                    var value2 = item2.get(key);

                    if (sortType === "alphanumerical" || sortType === "numeric" || sortType === "date" || sortType === "alphabetical") {
                        if (value1 === value2) {
                            return 0;
                        } else if ((value1 < value2) || (value2 === undefined)) {
                            return -1 * ascendingToggle;
                        } else {
                            return 1 * ascendingToggle;
                        }
                    }
                };
                collection.reset(collection.originalModels);
                collection.sort();
            }
        }
    };

    /*
        resetCollection(collection);
            Takes in an ADK Backbone collection that may have been filtered and resets to originalModels.

            example usage:
            ADK.utils.resetColection(allergyCollection);
    */
    CollectionUtils.resetCollection = function(collection) {
        if (collection instanceof Backbone.PageableCollection) {
            collection.fullCollection.reset(collection.originalModels);
        } else {
            collection.reset(collection.originalModels);
        }
    };

    CollectionUtils.setCollection = function(collection, filterFunction) {
        if (collection instanceof Backbone.PageableCollection) {
            collection.fullCollection.reset(collection.fullCollection.filter(filterFunction));
        } else {
            collection.reset(collection.filter(filterFunction));
        }
    };
    /*
        filterCollectionByDays(collection, numberOfDays, dateKey);
            Takes in a Backbone collection, number of days, and date key and filters collection by past number of days.

            example usage:
            ADK.utils.filterCollectionByDays(collection, numberOfDays, dateKey);
    */
    CollectionUtils.filterByDays = function(collection, numberOfDays, dateKey) {

        CollectionUtils.resetCollection(collection);

        filterFunction = function(model) {
            var dateFilter = new Date();
            dateFilter.setDate(dateFilter.getDate() - numberOfDays);

            if (typeof model.get(dateKey) !== 'undefined') {
                var filterYear = model.get(dateKey).substring(0, 4),
                    filterMonth = model.get(dateKey).substring(4, 6),
                    filterDay = model.get(dateKey).substring(6, 8);

                var filterDate = new Date(filterYear, filterMonth - 1, filterDay);
                if (filterDate != 'Invalid Date') {
                    return filterDate > dateFilter;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        CollectionUtils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionByDateRange(collection, startDate, endDate, dateKey);
            Takes in a Backbone collection, start date, end date, and date key and filters collection by date range.

            example usage:
            ADK.utils.filterCollectionByDateRange(collection, startDate, endDate, dateKey);
    */
    CollectionUtils.filterByDateRange = function(collection, startDate, endDate, dateKey) {
        CollectionUtils.resetCollection(collection);

        filterFunction = function(model) {

            if (typeof model.get(dateKey) !== 'undefined') {
                var filterYear = model.get(dateKey).substring(0, 4),
                    filterMonth = model.get(dateKey).substring(4, 6),
                    filterDay = model.get(dateKey).substring(6, 8);
                var filterDate = new Date(filterYear, filterMonth - 1, filterDay);
                if (filterDate != 'Invalid Date') {
                    return ((filterDate >= startDate) && (filterDate <= endDate));
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        CollectionUtils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionBeginsWith(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by begins with.

            example usage:
            ADK.utils.filterCollectionBeginsWith(collection, key, filterValue);
    */
    CollectionUtils.filterBeginsWith = function(collection, key, filterValue) {
        CollectionUtils.resetCollection(collection);

        filterFunction = function(model) {

            if (typeof model.get(key) !== 'undefined') {
                var field = model.get(key);
                return field.indexOf(filterValue) === 0;
            } else {
                return false;
            }
        };

        CollectionUtils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionSubstring(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by contains substring.

            example usage:
            ADK.utils.filterCollectionBeginsWith(collection, key, filterValue);
    */
    CollectionUtils.filterSubstring = function(collection, key, substring) {
        CollectionUtils.resetCollection(collection);

        filterFunction = function(model) {

            if (typeof model.get(key) !== 'undefined') {
                var field = model.get(key);
                return field.indexOf(substring) > -1;
            } else {
                return false;
            }
        };

        CollectionUtils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionSubstring(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by contains substring.

            example usage:
            ADK.utils.filterCollectionBeginsWith(collection, key, filterValue);
    */
    CollectionUtils.filterNoSubstring = function(collection, key, substring) {
        CollectionUtils.resetCollection(collection);

        filterFunction = function(model) {

            if (typeof model.get(key) !== 'undefined') {
                var field = model.get(key);
                return field.indexOf(substring) <= -1;
            } else {
                return false;
            }
        };

        CollectionUtils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionByValue(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by key value.

            example usage:
            ADK.utils.filterCollectionByValue(collection, key, filterValue);
    */
    CollectionUtils.filterByValue = function(collection, key, filterValue) {
        CollectionUtils.resetCollection(collection);

        filterFunction = function(model) {

            if (typeof model.get(key) !== 'undefined') {
                var field = model.get(key);
                return field == filterValue;
            } else {
                return false;
            }
        };

        CollectionUtils.setCollection(collection, filterFunction);
    };

    return CollectionUtils;
});
