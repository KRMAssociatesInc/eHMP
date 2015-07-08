define([
    "backbone",
    "marionette",
    "moment",
    "api/SessionStorage",
    "app/applets/search/searchUtil",
    "hbs!app/applets/search/templates/searchTemplate",
    "hbs!app/applets/search/templates/searchSuggestTemplate",
    "hbs!app/applets/search/templates/searchResultTemplate",
    "hbs!app/applets/search/templates/searchResultGroupTemplate",
    "jquery.inputmask",
    "bootstrap-datepicker",
    "underscore"
], function(Backbone, Marionette, Moment, SessionStorage, searchUtil, searchTemplate, searchSuggestTemplate, searchResultTemplate, searchResultGroupTemplate, inputmask, datepicker, underscore) {

    var SuggestResultsModel = Backbone.Model.extend({
            defaults: {}
        }),
        itemDisplay = null,
        groupDisplay = null,
        preSearchTime = null,
        DATE_FORMAT = 'MM/DD/YYYY';

    var SearchView = Backbone.Marionette.ItemView.extend({
        util: searchUtil,
        template: searchTemplate,
        searchSuggestTemplate: searchSuggestTemplate,
        searchResultTemplate: searchResultTemplate,
        searchResultGroupTemplate: searchResultGroupTemplate,
        isSearching: null, // wait (500ms) for user to stop typing before search
        suggestResults: {},
        suggestionsLocked: false, // never display the suggestion list while this is true (should be true while there is an outstanding search until the search text changes)
        lastQuery: '',
        drillDownCount: 0,
        totalResults: 0,
        fromDate: null,
        toDate: null,
        searchTerm: null,
        //
        initialize: function() {
            var self = this;
            var storageText = SessionStorage.getAppletStorageModel('search', 'searchText');

            this.clearDateFilters();
            // this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {});
            this.listenTo(ADK.Messaging.getChannel('search'), 'newSearch', function() {
                storageText = SessionStorage.getAppletStorageModel('search', 'searchText');
                if (storageText) {
                    self.searchTerm = storageText.searchTerm;

                    self.filterType = SessionStorage.getAppletStorageModel('search', 'filterType');
                    if (self.filterType === "all") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#all-range-text-search').addClass('active-range');
                    } else if (self.filterType === "2y") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#2yr-range-text-search').addClass('active-range');
                    } else if (self.filterType === "1y") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#1yr-range-text-search').addClass('active-range');
                    } else if (self.filterType === "3m") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#3mo-range-text-search').addClass('active-range');
                    } else if (self.filterType === "1m") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#1mo-range-text-search').addClass('active-range');
                    } else if (self.filterType === "7d") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#7d-range-text-search').addClass('active-range');
                    } else if (self.filterType === "72hr") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#72hr-range-text-search').addClass('active-range');
                    } else if (self.filterType === "24hr") {
                        self.$('.active-range').removeClass('active-range');
                        self.$('#24hr-range-text-search').addClass('active-range');
                    } else if (self.filterType === "custom") {
                        self.$('.active-range').removeClass('active-range');
                        var customDates = SessionStorage.getAppletStorageModel('search', 'customDates');
                        //console.log(customDates);
                        this.toDate = moment(customDates.toDate).format('MM/DD/YYYY');
                        this.fromDate = moment(customDates.fromDate).format('MM/DD/YYYY');

                        $('#fromDateText').datepicker('update', self.fromDate);
                        $('#toDateText').datepicker('update', self.toDate);

                    }
                    self.doSubmitSearch();

                }
            });

            //self.globalDateRefresh('observed');


        },
        onRender: function(event) {
            this.formatDates();
        },

        events: {
            'keydown #searchtext': 'onSearchTextKey',
            'keydown #suggestList a': 'onSuggestionKey',
            'click #submit': 'doSubmitSearch',
            'keydown .text-search-accessible': 'onAccessibilityKeydown',
            'click .searchResultItem': 'onSelectSearchResult',
            'click #search-results-header .badge': 'onSelectFilter',
            'show.bs.collapse .collapse': 'onExpandGroup',
            'hide.bs.collapse .collapse': 'onCollapseGroup',

            //Data Range filters (not final. may move to another applet)
            'click #all-range-text-search': 'doAllDateFilter',
            'click #24hr-range-text-search': 'do24HrDateFilter',
            'click #72hr-range-text-search': 'do72HrDateFilter',
            'click #7d-range-text-search': 'do7DDateFilter',
            'click #1mo-range-text-search': 'do1MDateFilter',
            'click #3mo-range-text-search': 'do3MDateFilter',
            'click #1yr-range-text-search': 'do1YDateFilter',
            'click #2yr-range-text-search': 'do2YDateFilter',
            'click #custom-range-apply': 'doCustomDateFilter',
            'focus #fromDateText': 'hideFromCalendar',
            'focus #toDateText': 'hideToCalendar',
            'click #fromCalendar': 'showFromCalendar',
            'click #toCalendar': 'showToCalendar',

            'keyup input': 'monitorCustomDateRange',
            'blur input': 'monitorCustomDateRange',
            'change input': 'monitorCustomDateRange'
        },


        doSubmitSearch: function() {

            //console.log(this.searchTerm);
            var fetchOptions = {
                criteria: {
                    "query": this.searchTerm
                }
            };
            fetchOptions.patient = ADK.PatientRecordService.getCurrentPatient();
            fetchOptions.resourceTitle = 'patient-record-search-text';
            this.searchResults = ADK.PatientRecordService.fetchCollection(fetchOptions);
            this.preSearchTime = new Date().getTime();
            this.searchResults.on("sync", this.fillSearchResultsTemplate, this);
            this.suggestionsLocked = true;

            $("#searchSpinner").show();
        },


        fillSearchResultsTemplate: function() {
            var mainGroupList = [];
            var afterSearchTime = new Date().getTime();
            var timeToComplete = (afterSearchTime - this.preSearchTime) / 1000;
            //console.log(this.searchResults);
            var me = this,
                $searchResultList = $('#searchResults'),
                totalResults = 0,
                formattedResults = [],
                groupedResults = {};


            //console.log('SearchResults returned ' + this.searchResults.length + ' results.');
            $searchResultList.empty();
            this.searchResults.forEach(function(item) {

                var groupName = item.attributes.kind,
                    type = item.attributes.type,
                    where = item.attributes.where,
                    summary = (item.attributes.summary || '').replace("\n", ""),
                    uid = item.attributes.uid;

                if (typeof(item.attributes.count) !== 'undefined') {
                    totalResults += parseInt(item.attributes.count, 10);
                } else {
                    totalResults++;
                }

                // group results by category
                if (groupName) {
                    if (groupedResults[groupName]) {
                        groupedResults[groupName].push(item);
                    } else {
                        groupedResults[groupName] = [item];
                    }
                }
            });
            this.totalResults = totalResults;

            var subgroupIdCounts = {};

            // generate grouped results for display
            var IDNumCount = 0; //numberto append to dateID (for future filtering)

            for (var groupName in groupedResults) { //iterate over the groups

                var items = groupedResults[groupName],
                    cleanGroupName = groupName.replace(/[^a-zA-Z0-9]/g, ""),
                    groupId = 'result-group-' + cleanGroupName,
                    highlightedGroupName = this.addSearchResultElementHighlighting(groupName),
                    $group = $(me.searchResultGroupTemplate({
                        groupName: highlightedGroupName,
                        titleElemId: 'result-group-title-' + cleanGroupName,
                        groupId: groupId,
                        subGroupClass: 'mainGroup dataFetched',
                        mainGroup: 'mainGroupIndent'
                    })),
                    $groupList = $group.find('#' + groupId + ' .groupContent');

                formattedResults = [];

                for (var i = 0; i < items.length; i++) { //iterate over each item in the result group
                    IDNumCount++;

                    var item = items[i],
                        where = item.attributes.where,
                        summary = (item.attributes.summary || '').replace("\n", ""),
                        uid = item.attributes.uid,
                        datetime = me.util.doDatetimeConversion(item.attributes.datetime),
                        count = '1', // default result count
                        highlights = '';
                    //console.log(item.uid);


                    if (typeof(item.attributes.count) !== 'undefined') {
                        count = (item.attributes.count).toString();
                    }
                    if (typeof(item.attributes.highlights) !== 'undefined') {
                        var AllHighlights = item.attributes.highlights;
                        for (var h = 0; h < AllHighlights.length; h++) {
                            var currentHighlight = AllHighlights[h].toString().replace(/\uFFFD/g, "");
                            highlights = highlights + "... " + currentHighlight + " ...<br>";
                        }
                    }

                    var kind = item.get('kind').toLowerCase();
                    var type = item.get('type');
                    var isLabDoc = (kind === 'pathology' || kind === 'surgical pathology' || kind === 'microbiology');

                    if ((isLabDoc || type=== 'document' || type === 'problem') && count > 1) {

                        var subGroupList = '';


                        var groupOnText = summary;
                        if (type === 'problem') {
                            groupOnText = item.attributes.icd_code;
                            //console.log(groupOnText);
                        }
                        var subGroupType = type;
                        if(kind === 'surgical pathology'){
                            subGroupType = kind;
                            groupOnText = item.attributes.group_name;

                        }
                        var cleanGroupName2 = summary.replace(/[^a-zA-Z0-9]/g, ""),
                            subgroupIdCount = subgroupIdCounts[cleanGroupName2] = (subgroupIdCounts[cleanGroupName2] || 0) + 1,
                            subGroupId = 'result-subGroup-' + cleanGroupName2 + '-' + subgroupIdCount,
                            highlightedSubGroupName = this.addSearchResultElementHighlighting(summary),
                            subGroup = me.searchResultGroupTemplate({
                                groupName: highlightedSubGroupName,
                                titleElemId: 'result-subGroup-title-' + cleanGroupName2 + '-' + subgroupIdCount,
                                groupId: subGroupId,
                                count: count.toString(),
                                subGroup: true,
                                subGroupType: subGroupType,
                                groupOnText: groupOnText,
                                subGroupItems: subGroupList,
                                subGroupClass: 'topLevelItem documentSubgroup dataUnfetched',
                                datetime: datetime
                            });



                        formattedResults.push({
                            item: subGroup,
                            sortText: summary.toString()
                        });
                    } else {
                        var summaryPlus = summary;

                        if (item.attributes.problem_status !== undefined) {
                            summaryPlus = item.attributes.problem_status + ':' + summary;
                            if (item.attributes.acuity_name !== undefined) {
                                summaryPlus = item.attributes.problem_status + '(' + item.attributes.acuity_name + '): ' + summary;
                            }

                        }
                        var highlightedSummary = this.addSearchResultElementHighlighting(summaryPlus);
                        var highlightedDomain = this.addSearchResultElementHighlighting(item.attributes.kind);
                        var entry = me.searchResultTemplate({
                            Class: "topLevelItem searchResultItem text-search-accessible searchResultItemFilterable",
                            resultId: IDNumCount,
                            uid: uid.toString(),
                            count: count.toString(),
                            summary: highlightedSummary,
                            highlights: highlights,
                            datetime: datetime,
                            domain: highlightedDomain,
                            facility: where,
                            basicResult: true,
                            singleResult: true
                        });

                        formattedResults.push({
                            item: entry,
                            sortText: summary.toString()
                        });
                    }
                }


                var sortedResults = underscore.sortBy(formattedResults, 'sortText');
                for (var k = 0; k < sortedResults.length; k++) {
                    $groupList.append(sortedResults[k].item);
                }
                var sortText = groupName.toString();
                mainGroupList.push({
                    group: $group,
                    sortText: sortText
                });
                //$searchResultList.append($group);


            }


            var sortedGroups = underscore.sortBy(mainGroupList, 'sortText');

            for (var g = 0; g < mainGroupList.length; g++) {
                $searchResultList.append(sortedGroups[g].group);
            }
            //hide "loading" image
            var filterType = ADK.SessionStorage.getAppletStorageModel('search', 'filterType');
            if (filterType === "all") {
                this.doAllDateFilter();
            } else if (filterType === "2y") {
                this.do2YDateFilter();
            } else if (filterType === "1y") {
                this.do1YDateFilter();
            } else if (filterType === "3m") {
                this.do3MDateFilter();
            } else if (filterType === "1m") {
                this.do1MDateFilter();
            } else if (filterType === "7d") {
                this.do7DDateFilter();
            } else if (filterType === "72hr") {
                this.do72HrDateFilter();
            } else if (filterType === "24hr") {
                this.do24HrDateFilter();
            } else if (filterType === "custom") {
                var customDates = ADK.SessionStorage.getAppletStorageModel('search', 'customDates');
                //console.log(customDates);
                this.toDate = moment(customDates.toDate).format('MM/DD/YYYY');
                this.fromDate = moment(customDates.fromDate).format('MM/DD/YYYY');

                $('#fromDateText').datepicker('update', this.fromDate);
                $('#toDateText').datepicker('update', this.toDate);

                this.doCustomDateFilter();

            } else {
                this.doAllDateFilter();
            }

            $("#searchSpinner").hide();

        },
        getDocumentDrilldownData: function(group_value, subGroupList, drilldown_type) {

            var query = this.searchTerm;
            var group_field = 'local_title';
            if (drilldown_type === "problem") {
                group_field = "icd_code";
            }
            if (drilldown_type === "result" || drilldown_type === "lab") {
                group_field = "qualified_name_units";
            }
            if(drilldown_type === 'surgical pathology'){
                group_field = "group_name";
            }
            var fetchOptions = {
                criteria: {
                    "query": query,
                    "group-field": group_field,
                    "group-value": group_value
                },
                cache: true,
            };
            var self = this;
            fetchOptions.onSuccess = function(collection, resp) {
                //console.log(resp);
                self.drillDownCount++;
                var returnedSubGroupData = resp.data.items.results;
                var snippets = '';
                if (resp.data.items.highlights !== 'undefined') {
                    snippets = resp.data.items.highlights;
                }

                for (var subgroupData = 0; subgroupData < returnedSubGroupData.length; subgroupData++) {
                    //console.log(returnedSubGroupData[subgroupData]);
                    var drillDownItem = returnedSubGroupData[subgroupData];
                    var where = drillDownItem.facility_name;
                    var name = drillDownItem.author_display_name;
                    var problemStatus = drillDownItem.problem_status;
                    var uid = drillDownItem.uid;
                    var signer = drillDownItem.signer_display_name;
                    var highlights = '';
                    datetime = self.util.doDatetimeConversion(drillDownItem.datetime);

                    if((datetime === null || datetime === "" || datetime === "Unknown") && drillDownItem.observed !== undefined){
                       datetime = self.util.doDatetimeConversion(drillDownItem.observed); 
                    }

                    if (drillDownItem.problem_status !== undefined) {
                        problemStatus = self.addSearchResultElementHighlighting(drillDownItem.problem_status);
                    }
                    if (snippets[uid].body !== 'undefined' && !underscore.isEmpty(snippets[uid])) {
                        //console.log(snippets[uid]);
                        highlights = '<p>...' + snippets[uid].body.join(" ... </p><p>...") + '...</p>';
                    }


                    var subGroupEntryItem = self.searchResultTemplate({
                        Class: "subgroupItem searchResultItem text-search-accessible searchResultItemFilterable",
                        resultId: 'subgroupItem' + subgroupData.toString(),
                        uid: uid.toString(),
                        datetime: datetime,
                        count: 1,
                        name: name,
                        problemStatus: problemStatus,
                        signer: signer || name,
                        facility: where,
                        highlights: highlights,
                        basicResult: true
                    });

                    subGroupList = subGroupList.append(subGroupEntryItem);

                }
                subGroupList.find($('.subgroupDataFetchSpinner')).hide();
                self.refreshDateFilter();
            };

            fetchOptions.patient = ADK.PatientRecordService.getCurrentPatient();
            fetchOptions.resourceTitle = 'patient-record-search-detail-document';
            //console.log(ADK.PatientRecordService.fetchCollection(fetchOptions));
            //var drilldownCollection = ResourceService.createEmptyCollection(fetchOptions);
            ADK.PatientRecordService.fetchCollection(fetchOptions);

        },
        checkforSubGroups: function(subGroup) {

            var group_value = subGroup.attr('groupOnText');
            var drilldown_type = subGroup.attr('subGroupType');
            var $subGroupList = subGroup.find($('.groupContent'));

            this.getDocumentDrilldownData(group_value.toString(), $subGroupList, drilldown_type);
            subGroup.removeClass('dataUnfetched');
            subGroup.removeClass('searchResultItemFilterable');
            subGroup.addClass('dataFetched');



        },
        addSearchResultElementHighlighting: function(textToHighlight) {
            var textToFindAndHighlight = ADK.SessionStorage.getAppletStorageModel('search', 'searchText').searchTerm.toString().toLowerCase();
            var searchString = textToHighlight.toString().toLowerCase();

            if (searchString.indexOf('<' + textToFindAndHighlight + '>') <= -1 && searchString.indexOf(textToFindAndHighlight) > -1) {
                var startIndex = searchString.indexOf(textToFindAndHighlight);
                var endIndex = startIndex + textToFindAndHighlight.length;
                var stringToHighlight = textToHighlight.substring(startIndex, endIndex);
                var highlightedText = textToHighlight;


                highlightedText = highlightedText.replace(stringToHighlight, '<mark class=\"cpe-search-term-match\">' + stringToHighlight + '</mark>');


                return highlightedText;


            }
            return textToHighlight;
        },

        handleResultEvent: function() {
            //console.log('handeled event!'); // individual result handeler for future work
        },
        hideToCalendar: function() {
            this.$('#toDateText').datepicker('remove');
        },
        hideFromCalendar: function() {
            this.$('#fromDateText').datepicker('remove');

        },
        showFromCalendar: function() {

            this.$('#fromDateText').datepicker('show');
            this.$('#toDateText').datepicker('remove');
            //this.$('#fromDateText').val("");
            this.formatDates();

        },
        showToCalendar: function() {

            this.$('#toDateText').datepicker('show');
            this.$('#fromDateText').datepicker('remove');
            //this.$('#toDateText').val("");
            this.formatDates();

        },
        doAllDateFilter: function() {

            this.fromDate = moment().subtract('years', 100);
            this.toDate = moment();
            this.doDateFilter(true, null, null);
            this.$('.active-range').removeClass('active-range');
            this.$('#all-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', 'all');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: 'all-range'
            });

        },
        do2YDateFilter: function() {

            this.fromDate = moment().subtract('years', 2);
            this.toDate = moment();
            this.doDateFilter(false);
            this.$('.active-range').removeClass('active-range');
            this.$('#2yr-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', '2y');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: '2yr-range'
            });
        },
        do1YDateFilter: function() {

            this.fromDate = moment().subtract('years', 1);
            this.toDate = moment();
            this.doDateFilter(false);
            this.$('.active-range').removeClass('active-range');
            this.$('#1yr-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', '1y');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: '1yr-range'
            });
        },
        do3MDateFilter: function() {

            this.fromDate = moment().subtract('months', 3);
            this.toDate = moment();
            this.doDateFilter(false);
            this.$('.active-range').removeClass('active-range');
            this.$('#3mo-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', '3m');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: '3mo-range'
            });
        },
        do1MDateFilter: function() {

            this.fromDate = moment().subtract('months', 1);
            this.toDate = moment();
            this.doDateFilter(false);
            this.$('.active-range').removeClass('active-range');
            this.$('#1mo-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', '1m');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: '1mo-range'
            });
        },
        do7DDateFilter: function() {

            this.fromDate = moment().subtract('days', 7);
            this.toDate = moment();
            this.doDateFilter(false);
            this.$('.active-range').removeClass('active-range');
            this.$('#7d-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', '7d');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: '7d-range'
            });
        },
        do72HrDateFilter: function() {

            this.fromDate = moment().subtract('hours', 72);
            this.toDate = moment();
            this.doDateFilter(false);
            this.$('.active-range').removeClass('active-range');
            this.$('#72hr-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', '72hr');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: '72hr-range'
            });
        },
        do24HrDateFilter: function() {

            this.fromDate = moment().subtract('hours', 24);
            this.toDate = moment();
            this.doDateFilter(false);
            this.$('.active-range').removeClass('active-range');
            this.$('#24hr-range-text-search').addClass('active-range');
            this.clearDateFilters();
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', '24hr');
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: '24hr-range'
            });
        },
        doCustomDateFilter: function() {
            this.$('.active-range').removeClass('active-range');
            var toDateText = this.$('#toDateText').val();
            var fromDateText = this.$('#fromDateText').val();
            var fromDate = moment(fromDateText, 'MM/DD/YYYY');
            var toDate = moment(toDateText, 'MM/DD/YYYY');
            this.fromDate = fromDate;
            this.toDate = toDate;
            if (toDate < fromDate) {
                //switch dates if in wrong order
                this.fromDate = toDate;
                this.toDate = fromDate;
            }
            var customDates = {
                fromDate: this.fromDate,
                toDate: this.toDate
            };
            ADK.SessionStorage.setAppletStorageModel('search', 'filterType', 'custom');
            ADK.SessionStorage.setAppletStorageModel('search', 'customDates', customDates);
            ADK.SessionStorage.setAppletStorageModel('search', 'modalOptions', {
                selectedId: 'custom-range-apply',
                customFromDate: moment(this.fromDate).format('MM/DD/YYYY'),
                customToDate: moment(this.toDate).format('MM/DD/YYYY')
            });
            //console.log(ADK.SessionStorage.getAppletStorageModel('search', 'customDates'));
            this.doDateFilter(false);
        },
        parseDateArray: function(dateArray) {
            var year = parseInt(dateArray[2]);
            var month = parseInt(dateArray[0]) - 1;
            var day = parseInt(dateArray[1]);

            return new Date(year, month, day);
        },
        clearDateFilters: function() {
            this.$('#fromDateText').val("");
            this.$('#toDateText').val("");
            this.toggleApplyBtn();
        },
        refreshDateFilter: function() {
            var showAll = false;
            var filterType = ADK.SessionStorage.getAppletStorageModel('search', 'filterType');
            if(filterType === "all"){
                showAll = true;
            }
            this.doDateFilter(showAll);
        },
        formatDates: function() {
            this.$('#fromDateText').datepicker({
                format: 'mm/dd/yyyy',
                forceParse: false
            });
            this.$('#toDateText').datepicker({
                format: 'mm/dd/yyyy',
                forceParse: false
            });

            this.$('#fromDateText').inputmask('m/d/y', {
                'placeholder': 'MM/DD/YYYY'
            });
            this.$('#toDateText').inputmask('m/d/y', {
                'placeholder': 'MM/DD/YYYY'
            });
        },
        monitorCustomDateRange: function(event) {
            this.toggleApplyBtn();
        },
        toggleApplyBtn: function() {
            this.formatDates();
            if (this.checkCustomRangeCondition()) {
                this.$('#custom-range-apply').removeAttr('disabled');
            } else {
                this.$('#custom-range-apply').prop('disabled', true);
            }
        },
        checkCustomRangeCondition: function() {
            var hasCustomRangeValuesBeenSetCorrectly = true;
            var customFromDate = this.$('#fromDateText').val();
            var customToDate = this.$('#toDateText').val();

            if (!moment(customFromDate, 'MM/DD/YYYY', true).isValid()) {

                hasCustomRangeValuesBeenSetCorrectly = false;
            }

            if (!moment(customToDate, 'MM/DD/YYYY', true).isValid()) {
                hasCustomRangeValuesBeenSetCorrectly = false;
            }

            return hasCustomRangeValuesBeenSetCorrectly;
        },
        doDateFilter: function(displayAll) {

            // $('#fromDateText').datepicker('update', this.fromDate);
            // $('#toDateText').datepicker('update', this.toDate);

            var items = $('#searchResults .searchResultItemFilterable');
            var filteredOut = 0;
            var fromTimeInMilisec = null;
            var toTimeInMilisec = null;
            for (var i = 0; i < items.length; ++i) {
                var nextItem = $(items[i]);

                var dateString = nextItem.attr("date") || null;
                // if all button is selected show me all results
                var itemVisibility = nextItem.css("display");
                if (nextItem.css("display") !== "none")
                    itemDisplay = nextItem.css("display");
                if (displayAll === true) {
                    nextItem.css("display", itemDisplay);
                } else {
                    var hasDate = false;
                    var itemDate = null;
                    var isInvalidDate = (dateString === null || dateString === "" || dateString === "Unknown");
                    if (isInvalidDate) {
                        nextItem.css("display", itemDisplay);
                    } else if (dateString !== null) {
                        var itemDateTimeStr = dateString.split("-") || '';
                        nextDate = moment(itemDateTimeStr[0], 'MM/DD/YYYY');
                        if (this.fromDate !== 'undefined' && this.toDate !== null && this.toDate !== 'undefined') {

                            if (nextDate >= this.fromDate && nextDate <= this.toDate) {
                                nextItem.css("display", itemDisplay);

                            } else
                                nextItem.css("display", "none");
                        }

                    } else
                        nextItem.css("display", "none");
                } //end DateTime not all filters
                var itemCountStr = nextItem.attr("count");


                var itemCount = parseInt(itemCountStr);
                if (nextItem.css("display") !== itemDisplay) {
                    filteredOut = filteredOut + itemCount;
                }


            } //end for-loop
            var results = this.totalResults - filteredOut;
            this.$('#numberOfResults').html(results.toString());


            this.changeEntireSearchResultGroupVisibility();
        },
        changeEntireSearchResultGroupVisibility: function() {


            var groups = $('.dataFetched');

            for (var i = 0; i < groups.length; i++) {
                var newCount = 0;
                var visible = false;
                var nextGroup = $(groups[i]);
                var list = nextGroup.find('.searchResultItemFilterable');

                if (nextGroup.css("display") !== "none") {
                    groupDisplay = nextGroup.css("display");
                }


                for (var k = 0; k < list.length; k++) {
                    var nextItem = $(list[k]);
                    if (nextItem.css("display") === groupDisplay) {
                        visible = true;
                        //var addToCount = parseInt(nextItem.find(".badge").val()) || 1;
                        newCount++;
                    }

                }
                var countBadge = nextGroup.find(".badge");

                if (countBadge.length > 0 && nextGroup.hasClass('documentSubgroup')) {
                    countBadge.html(newCount.toString());
                }
                if (visible === true)
                    nextGroup.css("display", groupDisplay);
                else
                    nextGroup.css("display", "none");
            }
        },
        onSelectSearchResult: function(event) {
            var $resultContainer = $(event.target).closest('.searchResultItem'),
                uid = $resultContainer.attr('data-uid'),
                currentPatient = ADK.PatientRecordService.getCurrentPatient();

            //console.log("search applet sending message: resultClicked: uid=" + uid);
            ADK.Messaging.getChannel('search').trigger('resultClicked', {
                uid: uid,
                patient: {
                    icn: currentPatient.attributes.icn,
                    pid: currentPatient.attributes.pid
                }
            });
        },

        onAccessibilityKeydown: function(keyEvent) {
            if (keyEvent.keyCode === 32 || keyEvent.keyCode === 13) { // trigger click on space/enter key for accessibility
                $(keyEvent.target).trigger('click');
            }
        },

        onCollapseGroup: function(event) {
            var $groupIcon = $(event.target).closest('.searchGroup').children('.searchGroupTitle').children('.searchGroupTitleArrow');
            $groupIcon.removeClass('fa-chevron-down');
            $groupIcon.addClass('fa-chevron-right');
        },

        onExpandGroup: function(event) {
            var $groupIcon = $(event.target).closest('.searchGroup').children('.searchGroupTitle').children('.searchGroupTitleArrow');
            var $group = $(event.target).closest('.searchGroup');
            if ($group.hasClass('dataUnfetched')) {
                this.checkforSubGroups($group);
            }
            $groupIcon.removeClass('fa-chevron-right');
            $groupIcon.addClass('fa-chevron-down');

        }
    });

    return SearchView;
});
