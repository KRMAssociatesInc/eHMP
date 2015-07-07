/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $, define, navigator, window */

'use strict';
define([], function () {
    return (function () {
        var _parser = {};

        _parser.preFlattenLinks = function (response, linkProperty) {
            var links = (typeof linkProperty !== 'undefined') ? response[linkProperty] : response.link,
                title;
            if (typeof links !== 'undefined') {
                for (var i= 0, size = links.length; i<size; i++) {
                    title = links[i].title;
                    if (title) {
                        response[title] = links[i];
                    } else {
                        response.self = links[i];
                    }
                }
                delete response.link;
            }
        };

        _parser.flattenLinks = function (object, linkProperty) {
            var links = (typeof linkProperty !== 'undefined') ? object.get(linkProperty) : object.get('link');
            if (typeof links !== 'undefined') {
                for (var i= 0, size = links.length; i<size; i++) {
                    if (links[i].title) {
                        object.set(links[i].title,links[i]);
                    } else {
                        object.set('self',links[i]);
                    }
                }
                object.unset('link');
            }
            return object;
        };

        return _parser;
    }());
});
