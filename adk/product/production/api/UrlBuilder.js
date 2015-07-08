define([
    'main/ResourceDirectory'
], function(ResourceDirectory) {
    'use strict';

    var resourceDirectory = ResourceDirectory.instance();

    var UrlBuilder = {
        buildUrl: function(resourceTitle, criteria) {
            var url;
            var queryParams = '';
            // "resourceDirectory.get" was failing because it wasn't doing an exact match.  More specifically given
            //       two models 'user-defined-filter', and 'user-defined-filters', searching for 'user-defined-filter' was returning 'user-defined-filters'
            var resourceModel = _.find(resourceDirectory.models, function(i) { return i.id === resourceTitle; });

            if (resourceModel !== undefined) {
                url = resourceModel.get("href");
            } else {
                console.error("No resource found in resource directory with title: " + resourceTitle);
            }

            if (criteria) {
                var encodedCriteria = [];
                _.each(criteria, function(v, k) {
                    encodedCriteria.push(encodeURIComponent(k).concat('=', encodeURIComponent(v)));
                });
                queryParams = '?' + encodedCriteria.join('&');
            }

            return url + queryParams;
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
            return url.replace(/:([a-zA-Z]+\w*)/g, function(match, p) { return params[p]; });
        }
    };

    var amdModule = UrlBuilder;
    return amdModule;
});
