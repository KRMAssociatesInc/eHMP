define([
    "backbone",
    "jquery",
    "api/UrlBuilder",
    "main/Session",
    "main/Utils",
    "api/SessionStorage",
    "api/UserService",
    "api/Navigation",
    "backbone.paginator",
    "backbone.fetch-cache"
], function(Backbone, $, UrlBuilder, session, utils, SessionStorage, UserService, Nav) {
    'use strict';

    var DEFAULT_CACHE = false;
    var INITIAL_NUMBER_OF_ROWS = 15;
    var DEFAULT_CACHE_EXPIRATION = 600; //false - never expires
    Backbone.fetchCache.localStorage = false;

    var Domain = Backbone.Model.extend({});

    Backbone.Collection.prototype.next = function(model) {
        return this.at(this.index(model) + 1) || model;
    };

    Backbone.Collection.prototype.prev = function(model) {
        return this.at(this.index(model) - 1) || model;
    };

    Backbone.Collection.prototype.index = function(model) {
        return this.indexOf(model);
    };

    Backbone.Collection.prototype.count = function() {
        return this.length;
    };

    Backbone.PageableCollection.prototype.next = function(model) {
        return this.fullCollection.at(this.index(model) + 1) || model;
    };

    Backbone.PageableCollection.prototype.prev = function(model) {
        return this.fullCollection.at(this.index(model) - 1) || model;
    };

    Backbone.PageableCollection.prototype.index = function(model) {
        return this.fullCollection.indexOf(model);
    };

    Backbone.PageableCollection.prototype.count = function() {
        return this.fullCollection.length;
    };

    Backbone.Collection.prototype.initialize = function(collection, config) {
        if (config && config.collectionParse) {
            this.collectionParse = function(collection) {
                return config.collectionParse(collection);
            };
        }
    };

    Backbone.Collection.prototype.parse = function(response) {
        var parsedResponse;
        if (response.data) {
            parsedResponse = response.data.items;
        } else {
            parsedResponse = response;
        }

        if (this.collectionParse) {
            var parsedCollection = new Backbone.Collection(parsedResponse);
            parsedResponse = this.collectionParse(parsedCollection);
        }
        return parsedResponse;
    };

    Backbone.PageableCollection.prototype.initialize = function(collection, config) {
        if (config && config.collectionParse) {
            this.collectionParse = function(collection) {
                return config.collectionParse(collection);
            };
        }
    };

    Backbone.PageableCollection.prototype.parse = function(response) {
        var parsedResponse;
        if (response.data) {
            parsedResponse = response.data.items;
        } else {
            parsedResponse = response;
        }

        if (this.collectionParse) {
            var parsedCollection = new Backbone.Collection(parsedResponse);
            parsedResponse = this.collectionParse(parsedCollection);
        }
        return parsedResponse;
    };

    var DomainCollection = Backbone.Collection.extend({
        model: Domain
    });

    var PageableCollection = Backbone.PageableCollection.extend({
        model: Domain
    });

    var resourceService = {
        createEmptyCollection: function(options) {
            var fetchOptions = {};
            _.extend(fetchOptions, options);
            fetchOptions.resourceTitle = undefined;
            return this.fetchCollection(fetchOptions);
        },
        fetchCollection: function(options, existingCollection) {
            var resourceTitle = options.resourceTitle;
            var viewModel = options.viewModel;
            var criteria = options.criteria;
            var onSuccess = options.onSuccess;
            var cache = (options.cache !== undefined) ? options.cache : DEFAULT_CACHE;
            var cacheExpiration = options.cacheExpiration || DEFAULT_CACHE_EXPIRATION;
            var onError = options.onError;
            var createdCollection;
            var collectionConfig = {};
            if (options.resourceTitle) {
                if (options.fetchType === 'POST') {
                    collectionConfig = {
                        url: UrlBuilder.buildUrl(resourceTitle)
                    };
                } else {
                    collectionConfig = {
                        url: UrlBuilder.buildUrl(resourceTitle, criteria)
                    };
                }
            }

            if (existingCollection && options.resourceTitle) {
                if (options.fetchType === 'POST') {
                    existingCollection.url = UrlBuilder.buildUrl(resourceTitle);
                } else {
                    existingCollection.url = UrlBuilder.buildUrl(resourceTitle, criteria);
                }
                createdCollection = existingCollection;
            } else {
                if (options.pageable === true) {
                    var pagingConfig = {
                        mode: 'client',
                        state: {
                            pageSize: INITIAL_NUMBER_OF_ROWS
                        }
                    };

                    //override defaults with options
                    _.extend(pagingConfig, options.collectionConfig);

                    //merge into collectionConfig
                    _.extend(collectionConfig, pagingConfig);

                    createdCollection = new PageableCollection([], collectionConfig);
                } else {
                    _.extend(collectionConfig, options.collectionConfig);
                    createdCollection = new DomainCollection([], collectionConfig);
                }

                createdCollection.url = collectionConfig.url;
            }
            if (viewModel !== undefined) {
                var ExtendedDomain = Domain.extend(viewModel);
                createdCollection.model = ExtendedDomain;
            }
            createdCollection.fetchOptions = options;

            var data = '',
                contentType = '';
            if (options.fetchType === 'POST') {
                data = JSON.stringify(options.criteria);
                contentType = 'application/json';
            }

            if (options.resourceTitle) {
                createdCollection.fetch({
                    data: data,
                    contentType: contentType,
                    cache: cache,
                    expires: cacheExpiration, //expiration in seconds, default 5 minutes, false never expires
                    type: options.fetchType || 'GET',
                    success: function(collection, resp) {
                        if (createdCollection instanceof Backbone.PageableCollection) {
                            createdCollection.originalModels = createdCollection.fullCollection.toJSON();
                        } else {
                            createdCollection.originalModels = createdCollection.toJSON();
                        }

                        if (typeof onSuccess == "function") {
                            onSuccess(collection, resp);
                        }
                    },
                    error: function(collection, resp) {
                        if (typeof onError == "function") {
                            onError(collection, resp);
                        }
                    }
                });

                //Clear cache
                if (cache === false) {
                    this.clearCache(collectionConfig.url);
                }
            }

            return createdCollection;
        },
        resetCollection: function(originalCollection, options) {
            this.fetchCollection(options).on('sync', function(fetchedCollection) {
                originalCollection.reset(fetchedCollection.models);
            });
        },
        filterCollection: function(originalCollection, filterFunction) {
            originalCollection.reset(_.filter(originalCollection.models, function(model) {
                return filterFunction(model);
            }));
            return originalCollection.toJSON();
        },
        fetchModel: function(options) {
            var resourceTitle = options.resourceTitle;
            var viewModel = options.viewModel;
            var criteria = options.criteria;
            var createdModel, DomainModel;

            DomainModel = Backbone.Model.extend({
                parse: function(response) {
                    if (response.data) {
                        return response.data.items[0];
                    } else {
                        return response;
                    }
                }
            });

            if (viewModel !== undefined) {
                var ExtendedDomain = DomainModel.extend(viewModel);
                createdModel = new ExtendedDomain();
            } else {
                createdModel = new DomainModel();
            }
            createdModel.url = UrlBuilder.buildUrl(resourceTitle, criteria);
            return createdModel;
        },
        clearCache: function(url) {
            var clearUrl = url.url || url;
            Backbone.fetchCache.clearItem(clearUrl);
        },
        clearAllCache: function(dominString) {
            if (dominString) {
                for (var domain in Backbone.fetchCache._cache) {
                    if (domain.indexOf(dominString) >= 0) {
                        delete Backbone.fetchCache._cache[domain];
                    }
                }
            } else {
                for (var url in Backbone.fetchCache._cache) {
                    delete Backbone.fetchCache._cache[url];
                }
            }
            Backbone.fetchCache.setLocalStorage();
            console.log(Backbone.fetchCache);
        },
        buildUrl: function(resourceTitle, criteria) {
            return UrlBuilder.buildUrl(resourceTitle, criteria);
        },
        /**
         * Takes an url with :params and replaces them with their matching values. Parameters without a
         * matching value will be replaced with 'undefined'. Parameters are identified by a colon followed
         * by the name of the parameter. The parameter name must start with a letter and can be followed
         * by characters from the word class (e.g. a-z, A-Z, 0-9, _).
         *
         * @param url {string} Source URL. Follows the following form: http://somedomain/path/:param1/some/:param2/...
         * @param params {object} Object containing the key/values. Property names are the keys. (e.g. { param1: 'value1', param2: 'value2 })
         * @returns {string} An URL with all params replaced (e.g. http://somedomain/path/value1/some/value2/...).
         */
        replaceURLRouteParams: function(url, params) {
            return UrlBuilder.replaceURLRouteParams(url, params);
        },
        fetchResponseStatus: function(options) {
            var resourceTitle = options.resourceTitle;
            var criteria = options.criteria;
            var onSuccess = options.onSuccess;
            var cache = (options.cache !== undefined) ? options.cache : DEFAULT_CACHE;
            var cacheExpiration = options.cacheExpiration || DEFAULT_CACHE_EXPIRATION;
            var onError = options.onError;
            var createdCollection;
            var collectionConfig = {};
            if (options.resourceTitle) {
                collectionConfig = {
                    url: UrlBuilder.buildUrl(resourceTitle, criteria)
                };
            }
            _.extend(collectionConfig, options.collectionConfig);
            createdCollection = new DomainCollection([], collectionConfig);

            createdCollection.url = collectionConfig.url;

            createdCollection.fetchOptions = options;
            if (options.resourceTitle) {
                createdCollection.fetch({
                    cache: cache,
                    expires: cacheExpiration, //expiration in seconds, default 5 minutes, false never expires
                    success: function(collection, resp) {
                        if (typeof onSuccess == "function") {
                            onSuccess(resp);
                        }
                    },
                    error: function(collection, resp) {
                        if (resp.status == 200 && (typeof onSuccess == "function")) {
                            onSuccess(resp);
                        } else if (typeof onError == "function") {
                            onError(resp);
                        }
                    }
                });

                //Clear cache
                if (cache === false) {
                    this.clearCache(collectionConfig.url);
                }
            }
        },
        fetchDateFilteredCollection: function(collection, dateFilterOptions) {
            // var date = SessionStorage.getModel('globalDate');
            collection.fetchOptions.criteria.filter = this.buildJdsDateFilter(dateFilterOptions);
            this.fetchCollection(collection.fetchOptions, collection);
        },
        buildJdsDateFilter: function(dateFilterOptions) {
            var fromDate, toDate;

            if (dateFilterOptions.hasOwnProperty('fromDate') || dateFilterOptions.hasOwnProperty('toDate')) {
                fromDate = dateFilterOptions.fromDate;
                toDate = dateFilterOptions.toDate;
            } else {
                var globalDate = SessionStorage.getModel('globalDate');
                fromDate = globalDate.get('fromDate');
                toDate = globalDate.get('toDate');
            }

            if (fromDate === undefined || fromDate === null || fromDate.trim().length === 0) {
                fromDate = '';
            } else {
                fromDate = '"' + utils.formatDate(fromDate, 'YYYYMMDD', 'MM/DD/YYYY') + '"';
            }

            if (toDate === undefined || toDate === null || toDate.trim().length === 0) {
                toDate = '';
            } else {
                toDate = '"' + utils.formatDate(toDate, 'YYYYMMDD', 'MM/DD/YYYY') + '"';
            }

            var dateFilter;

            if (fromDate !== '' && toDate !== '') {
                dateFilter = 'between(' + dateField + ',' + fromDate + ',' + toDate + ')';
            } else if (fromDate === '' && toDate !== '') {
                dateFilter = 'lte(' + dateField + ',' + toDate + ')';
            } else if (fromDate !== '' && toDate === '') {
                dateFilter = 'gte(' + dateField + ',' + fromDate + ')';
            } else {
                // error case
                console.error('ResourceService.js buildJdsDateFilter both fromDate and toDate are empty.');
            }

            // console.log('buildJdsDateFilter ', dateFilter);

            return dateFilter;
        }
    };

    resourceService.patientRecordService = {
        createEmptyCollection: function(options) {
            return resourceService.createEmptyCollection(options);
        },
        fetchCollection: function(options, existingCollection) {
            var patient = options.patient || this.getCurrentPatient();
            if (patient != undefined) {
                if (options.criteria == undefined) {
                    options.criteria = {};
                }
                //JDS patient services require search by ICN if one exists
                //ICN will be used if exists unless patientIdentifierType specified
                if (options.patientIdentifierType && patient.get(options.patientIdentifierType)) {
                    options.criteria.pid = patient.get(patient.get(options.patientIdentifierType));
                } else if (patient.get("icn")) {
                    options.criteria.pid = patient.get("icn");
                } else if (patient.get("pid")) {
                    options.criteria.pid = patient.get("pid");
                } else {
                    options.criteria.pid = patient.get("id");
                }

                if (patient.has("acknowledged")) {
                    options.criteria._ack = 'true';
                }
            }

            return resourceService.fetchCollection(options, existingCollection);
        },
        fetchModel: function(options) {
            var patient = options.patient || this.getCurrentPatient();
            if (patient != undefined) {
                if (options.criteria == undefined) {
                    options.criteria = {};
                }
                if (options.patientIdentifierType && patient.get(options.patientIdentifierType)) {
                    options.criteria.pid = patient.get(patient.get(options.patientIdentifierType));
                } else if (patient.get("icn")) {
                    options.criteria.pid = patient.get("icn");
                } else if (patient.get("pid")) {
                    options.criteria.pid = patient.get("pid");
                } else {
                    options.criteria.pid = patient.get("id");
                }
            }

            return resourceService.fetchModel(options);
        },
        fetchResponseStatus: function(options) {
            var patient = options.patient || this.getCurrentPatient();
            if (patient != undefined) {
                if (options.criteria == undefined) {
                    options.criteria = {};
                }
                //JDS patient services require search by ICN if one exists
                //ICN will be used if exists unless patientIdentifierType specified
                if (options.patientIdentifierType && patient.get(options.patientIdentifierType)) {
                    options.criteria.pid = patient.get(patient.get(options.patientIdentifierType));
                } else if (patient.get("icn")) {
                    options.criteria.pid = patient.get("icn");
                } else if (patient.get("pid")) {
                    options.criteria.pid = patient.get("pid");
                } else {
                    options.criteria.pid = patient.get("id");
                }

                if (patient.has("acknowledged")) {
                    options.criteria._ack = 'true';
                }
            }

            return resourceService.fetchResponseStatus(options);
        },
        getCurrentPatient: function() {
            return SessionStorage.get.sessionModel('patient');
        },
        fetchDateFilteredCollection: function(collection, filterOptions) {
            return resourceService.fetchDateFilteredCollection(collection, filterOptions);
        },
        isPatientInPrimaryVista: function() {
            var domainModel = SessionStorage.get.sessionModel('patient-domain'),
                domainData = domainModel.get('data'),
                vistaSites = domainModel.get('sites'),
                inVista = false;

            _.each(domainData, function(item) {
                var pidSite = item.pid.split(';')[0];
                var match = vistaSites.filter(function(a) {
                    return a.siteCode === pidSite;
                });
                if (match.length) {
                    inVista = true;
                }
            });
            return inVista;
        }
    };



    return resourceService;
});
