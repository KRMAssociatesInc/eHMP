(function() {
    'use strict';

    var vxRdkDocumentationModule = angular.module('vx-rdk-documentation', ['ngSanitize']);

    vxRdkDocumentationModule.controller('DocumentationCtrl', ['$scope', 'Documentation', function($scope, Documentation) {
        Documentation.getResources(function(data) {
            $scope.links = data.link;
        });
    }]);

    vxRdkDocumentationModule.factory('Documentation', ['$http', function($http) {
        return {
            getResources: function(callback) {
                $http.get('/resource/resourcedirectory').success(callback);
            }
        };
    }]);

    vxRdkDocumentationModule.filter('fuzzyFilter', function() {
        function buildFuzzySearchParts(string) {
            // escape JS regex special characters
            var searchParts = string.replace(/./g, function(char) {
                if(/[-\/\\^$*+?.()|[\]{}]/.test(char)) {
                    return '\\' + char + '.*';
                } else {
                    return char + '.*';
                }
            });
            return searchParts;
        }

        function buildFuzzySearcher(string) {
            var searchParts = buildFuzzySearchParts(string);
            var searcher = new RegExp(searchParts);
            return searcher;
        }

        function testFuzzyObject(input, filter) {
            if(!input || (typeof filter !== typeof input)) {
                return false;
            }
            for(var key in filter) {
                if(filter.hasOwnProperty(key) && input.hasOwnProperty(key)) {
                    if(typeof filter[key] === 'object') {
                        var treePassed = testFuzzyObject(input[key], filter[key]);
                        if(!treePassed) {
                            return false;
                        }
                    }
                    var stringPassed = testFuzzyString(input[key], filter[key]);
                    if(!stringPassed) {
                        return false;
                    }
                }
            }
            return true;
        }

        function testFuzzyString(input, filter) {
            if(typeof input !== 'string' || typeof filter !== 'string') {
                return false;
            }
            if(filter.length === 0) {
                return true;
            }
            var searcher = buildFuzzySearcher(filter);
            return searcher.test(input);
        }

        return function(input, filter) {
            if(!filter || (typeof filter !== typeof input)) {
                return input;
            }
            var result = [];
            for(var i = 0; i < input.length; i++) {
                var matched;
                if(typeof filter === 'object') {
                    matched = testFuzzyObject(input[i], filter);
                }
                if(typeof filter === 'string') {
                    matched = testFuzzyString(input[i], filter);
                }
                if(matched) {
                    result.push(input[i]);
                }
            }
            return result;
        };
    });
    vxRdkDocumentationModule.filter('fuzzyFilterHighlight', ['$sce', function($sce) {
        function buildFuzzySearchParts(string) {
            // escape JS regex special characters
            var searchParts = string.replace(/./g, function(char) {
                if(/[-\/\\^$*+?.()|[\]{}]/.test(char)) {
                    return '\\' + char + '.*';
                } else {
                    return char + '.*';
                }
            });
            return searchParts;
        }

        function highlightString(input, filter, tag) {
            var chars = filter.split('');
            var resultBuffer = '';
            var start = 0;
            var end = 0;
            for(var i = 0; i < chars.length; i++) {
                end = input.indexOf(chars[i], start);
                resultBuffer += input.substring(start, end);
                resultBuffer += '<' + tag + '>';
                resultBuffer += chars[i];
                resultBuffer += '</' + tag + '>';
                start = end + 1;
            }
            resultBuffer += input.substring(start);
            return resultBuffer;
        }

        return function(input, filter, tag) {
            if(!filter || (typeof filter !== typeof input)) {
                return $sce.trustAsHtml(input);
            }
            tag = tag || 'strong';

            var searchParts = buildFuzzySearchParts(filter);
            var highlighter = new RegExp(searchParts);
            if(!highlighter.test(input)) {
                return $sce.trustAsHtml(input);
            }

            var result = highlightString(input, filter, tag);
            return $sce.trustAsHtml(result);
        };
    }]);

})();
