/* global window,Q,Backbone,$,_,Waypoint,Prism,console */

$(function() {
    'use strict';

    var md;
    if (window.markdownit) {
        md = window.markdownit({
                html: true,
                langPrefix: 'language-',
                highlight: function(str, lang) {
                    if (lang === 'HTML') {
                        lang = 'markup';
                    }
                    try {
                        var prismLang = Prism.languages[lang.toLowerCase()];
                        if (!prismLang) {
                            return '';
                        }
                        return Prism.highlight(str, prismLang);
                    } catch (__) {}
                    return ''; // use external default escaping
                }
            })
            .use(window.markdownitContainer, 'page-description')
            .use(window.markdownitContainer, 'callout')
            .use(window.markdownitContainer, 'side-note')
            .use(window.markdownitContainer, 'definition');
        console.log('Rendering with markdown-it');
    } else if (window.marked) {
        console.log('Rendering with marked');
    } else if (window.markdown) {
        console.log('Rendering with markdown-js');
    }

    var ReadmeApp = {};
    //ReadmeApp.sectionDelimiter = '§';
    // scrollspy doesn't support symbols on a 104-key keyboard other than _ and -
    //ReadmeApp.sectionDelimiter = '--';
    ReadmeApp.sectionDelimiter = '#'; // We have our own scroll watcher so we can use # again.

    ReadmeApp.MarkdownModel = Backbone.Model.extend({
        sync: function(method, model, options) {
            if (method === 'read') {
                // This is only a markdown reader
                Backbone.sync(method, model, options);
            }
        },
        url: function(page) {
            // Hiding .md from filename because it looks ugly in the URL
            return (page || this.get('page')) + '.md';
        },
        defaults: {
            page: '',
            html: '<h1>No markdown loaded</h1>',
            text: '# No markdown loaded',
            rewriteRules: []
        },
        /**
         * Rewrite rules let you transparently redirect one page to another URL.
         * There are 2 types of rewrite rules:
         *
         * Simple type:
         * The URL fetched from the server will be: path.replace(find, rewriter) + '.md'
         * { find: /regex(.*)/,
         *   rewriter: 'replacement$1'
         * }
         *
         * Advanced type:
         * rewriter gets passed the page string and a Q deferred.
         * If the page can be rewritten, call deferred.resolve(rewrittenPage) and return
         * If the page can't be rewritten, call deferred.reject() and return
         *
         * {
         *   find: /regex(.*)/,
         *   rewriter: function(page, deferred) {
         *     rewriteAsynchronously(page,
         *       function success(newPage) {
         *         deferred.resolve(newPage);
         *       },
         *       function error() {
         *         deferred.reject();
         *       }
         *     );
         *   }
         * }
         */
        initialize: function(props) {
            props = props || {};
            this.set('rewriteRules', props.rewriteRules || this.defaults.rewriteRules);
            this.set('page', props.page || this.defaults.page);
            this.on('error', this.handleFailedFetch);
        },
        handleFailedFetch: function() {
            this.set({
                html: '<h1>Error loading page</h1>',
                text: '# Error loading page'
            });
            this.trigger('sync');
        },
        fetch: function(options) {
            if (this.get('page') === '') {
                this.set('html', this.defaults.html);
                this.set('text', this.defaults.text);
                this.trigger('sync');
                return;
            }
            this.set({
                html: '<h1>Loading ' +
                    '<div style="display: inline-block; vertical-align: middle;">' +
                    '<div class="sk-spinner sk-spinner-cube-grid">' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '<div class="sk-cube"></div>' +
                    '</div>' +
                    '</div>' +
                    '</h1>',
                text: '# Loading'
            });
            this.trigger('sync');
            var self = this;
            var rewriteRules = this.get('rewriteRules');
            var originalPage = self.get('page');
            Q.any(_.map(rewriteRules, function(rewriteRule) {
                    var deferred = Q.defer();
                    // There's some code duplication with the return lines, but
                    // I'd rather bail early and avoid a long if-else chain
                    if (!rewriteRule.find || !rewriteRule.rewriter) {
                        deferred.reject();
                        return deferred.promise;
                    }
                    if (!rewriteRule.find.test(originalPage)) {
                        deferred.reject();
                        return deferred.promise;
                    }
                    if (!_.isFunction(rewriteRule.rewriter)) {
                        var rewrittenPage = originalPage.replace(rewriteRule.find, rewriteRule.rewriter);
                        deferred.resolve(rewrittenPage);
                        return deferred.promise;
                    }
                    rewriteRule.rewriter(originalPage, deferred);
                    return deferred.promise;
                }))
                .then(function rewriteHappened(rewrittenPage) {
                    return rewrittenPage;
                }, function noRewriteHappened() {
                    return originalPage;
                })
                .then(function(page) {
                    options = _.extend(options || {}, {
                        // set both dataType and mimeType to prevent console errors
                        // when loading the page locally
                        dataType: 'text',
                        mimeType: 'text/plain; charset=utf-8',
                        cache: 'false',
                        url: self.url(page)
                    });
                    self.constructor.__super__.fetch.call(self, options);
                });
        },
        parse: function(response) {
            response = {
                html: this.processCompiledMarkdown(
                    (window.markdownit && md.render(response)) ||
                    (window.marked && window.marked(response)) ||
                    (window.markdown && window.markdown.toHTML(response))
                ),
                text: response
            };
            return response;
        },
        processCompiledMarkdown: function(unprocessedCompiledMarkdown) {
            var self = this;
            var processingCompiledMarkdown = $('<div />').append($(unprocessedCompiledMarkdown));
            var d = ReadmeApp.sectionDelimiter;
            var ids = [];
            processingCompiledMarkdown.find('*').each(function() {
                var $tag = $(this);
                addIdToHeadingIfMissing($tag);
                prefixPageToHeadingId($tag);
                prefixPageToSectionLink($tag);
                transformGithubStyleMarkdownPageLinks($tag);
            });
            var processedCompiledMarkdown = processingCompiledMarkdown.html();
            return processedCompiledMarkdown;

            function addIdToHeadingIfMissing($tag) {
                // Add ids manually for convenience of switching between markdown renderers
                if ($tag.is('h1,h2,h3,h4,h5,h6') && !$tag.attr('id')) {
                    $tag.attr('id', $tag.text().trim().replace(/[^a-zA-Z0-9]/g, '-'));

                    for (var i = 1; _.contains(ids, $tag.attr('id')); i++) {
                        $tag.attr('id', $tag.attr('id') + '-' + i);
                    }
                    ids.push($tag.attr('id'));
                }
            }

            function prefixPageToHeadingId($tag) {
                if ($tag.attr('id')) {
                    $tag.attr('id', '/' + self.get('page') + d + $tag.attr('id'));
                }
            }

            function prefixPageToSectionLink($tag) {
                var isSectionLink = /^#.+/.test($tag.attr('href'));
                if (isSectionLink) {
                    $tag.attr('href', '#/' + self.get('page') + d + $tag.attr('href').slice(1));
                }
            }

            function transformGithubStyleMarkdownPageLinks($tag) {
                var targetLocation = $tag.prop('href') || $tag.prop('src') || '';
                var path = $tag.attr('href') || $tag.attr('src') || '';
                var basename = (window.location.pathname.match(/(.*)\/[^\/]*$/) || [])[1] || '';
                var currentLocation = window.location.protocol + '//' + window.location.host + basename;
                var isRelativePath = targetLocation.indexOf(currentLocation) !== -1;
                var pageBasename = (self.get('page').match(/(.*)\/[^\/]*$/) || [])[1];
                if ($tag.is('a') && isRelativePath && path.match(/.+\.md/)) {
                    var cleanedUrlParts = $tag.attr('href').match(new RegExp('^(.+)\\.md(?:(#|' + d + ')(.*))?'));
                    var cleanedUrl = cleanedUrlParts[1];
                    var delimiter = cleanedUrlParts[2];
                    var section = cleanedUrlParts[3];
                    if (delimiter && section) {
                        cleanedUrl += d + section;
                    }
                    $tag.attr('href', _.compact(['#', pageBasename, cleanedUrl]).join('/'));
                }
                if ($tag.is('img') && isRelativePath) {
                    var page = ReadmeApp.markdownModel.get('page');
                    var folder = page.match(/^[^\/]*/)[0];
                    if (folder === 'rdk') {
                        // we have inevitably already saved the rdk path by this point
                        var rdkPath = ReadmeApp.mainModel.get('rdkPath');
                        $tag.attr('src', rdkPath + path);
                    } else {
                        $tag.attr('src', _.compact([pageBasename ,path]).join('/'));
                    }
                }
            }
        }
    });

    ReadmeApp.MarkdownView = Backbone.View.extend({
        initialize: function() {
            ReadmeApp.markdownModel.on('sync', this.render, this);
        },
        render: function() {
            this.$el.html(this.model.get('html'));
            this.$el.find('table').addClass('table table-striped table-bordered');
            // avoid race conditions when setting up waypoints
            ReadmeApp.markdownModel.trigger('markdownViewRendered', this.$el);
            this.scrollIntoView();
        },
        scrollIntoView: function() {
            var id = ReadmeApp.id;
            var loadedDelimiter = ReadmeApp.loadedDelimiter;
            if (loadedDelimiter === ReadmeApp.sectionDelimiter && id === '') {
                window.scrollTo(0, 0);
            } else if (id.length > 0) {
                var idMatch = document.getElementById(ReadmeApp.fragment);
                if (idMatch) {
                    idMatch.scrollIntoView(true);
                }
            }
        }
    });

    ReadmeApp.WaypointView = Backbone.View.extend({
        headingSelector: _.map(['h1', 'h2', 'h3'], function(heading) {
            var excludedParentSelectors = [
                // Exclude headings from within our custom classes
                'blockquote',
                '.side-note',
                '.callout',
                '.page-description',
                '.definition'
            ];
            var excludedParentsSelector = excludedParentSelectors.map(function(selector) {
                return selector + ' *';
            }).join(',');
            var headingSelector = heading + '[id]' + ':not(' + excludedParentsSelector + ')';
            return headingSelector;
        }).join(','),
        initialize: function() {
            _.bindAll(this, 'makeToc');
            ReadmeApp.markdownModel.on('markdownViewRendered', this.refreshWaypoints, this);
        },
        render: function() {
            var self = this;
            var toc = self.makeToc(self.model.get('html'));
            var backToTop2 = $('<a onclick="window.scrollTo(0, 0)"/>')
                .attr('href', '#/' + ReadmeApp.markdownModel.get('page') + '#')
                .addClass('back-to-top')
                .html('Back to top &uarr;');
            var container = $('<div />');
            container.append(toc);
            if($(toc).find('li').length) {
                container.append(backToTop2);
            }
            this.$el.html(container);

            var $li = this.$('li');
            $li.addClass('active activechild');
            var liWidth = $li.outerWidth(true) + 5;
            var titleWidth = this.$('a.nav-page-title:first').width();
            var width = Math.max(liWidth, titleWidth);
            $li.removeClass('active activechild');
            this.$el.find('ul').outerWidth(width);
            self.$el.affix({
                offset: {
                    top: 0,
                    bottom: function() {
                        var scrollHelperHeight = 235;
                        return -$(document).height() + $('body').height() + scrollHelperHeight;
                    }
                }
            });
            this.$el.css('position', 'fixed');
        },
        refreshWaypoints: function($markdownEl) {
            this.render();
            //this.highlightSingleHeading($markdownEl);
            this.highlightVisibleHeadings($markdownEl);
        },
        highlightSingleHeading: function($markdownEl) {
            var self = this;
            var headings = $markdownEl.find(this.headingSelector);
            headings.each(function(index, contentsElem) {
                var $contentsElem = $(contentsElem);
                var $tocElem = self.getTocElemFromContentsElem($contentsElem);
                $contentsElem.waypoint(function(direction) {
                    self.$el.find('.active').removeClass('active');
                    var $activeTocElem;
                    if (direction === 'up') {
                        $activeTocElem = $tocElem.prev().find('li:last-child').addBack();
                        if ($activeTocElem.length === 0) {
                            $activeTocElem = $tocElem.parentsUntil(self.$el, 'li').first();
                        }
                    }
                    if (direction === 'down') {
                        $activeTocElem = $tocElem;
                    }
                    $activeTocElem.addClass('active');
                    $activeTocElem.parentsUntil(self.$el, 'li').addClass('active');
                }, {
                    offset: '20'
                });
            });
        },
        highlightVisibleHeadings: function($markdownEl) {
            var self = this;
            var headings = $markdownEl.find(this.headingSelector);
            headings.each(function(index, contentsElem) {
                var nextHeading = headings[index + 1];
                var $contentsElem = $(contentsElem);
                var $tocElem = self.getTocElemFromContentsElem($contentsElem);
                var $parents = $tocElem.parentsUntil(self.$el, 'li');
                var $siblings = $tocElem.siblings();
                $contentsElem.waypoint(function(direction) {
                    if (direction === 'down') {
                        $tocElem.addClass('active');
                        $parents.addClass('activechild');
                    }
                }, {
                    offset: 0
                });
                $contentsElem.waypoint(function(direction) {
                    if (direction === 'up') {
                        $tocElem.removeClass('active');
                        $tocElem.removeClass('activechild');
                    }
                    if (direction === 'down') {
                        $tocElem.addClass('active');
                        $parents.addClass('activechild');
                    }
                }, {
                    offset: 'bottom-in-view'
                });
                if (nextHeading) {
                    var $nextHeading = $(nextHeading);
                    $nextHeading.waypoint(function(direction) {
                        if (direction === 'up') {
                            $tocElem.addClass('active');
                            $parents.addClass('activechild');
                        }
                        if (direction === 'down') {
                            $tocElem.removeClass('active');
                            if (!$siblings.hasClass('active')) {
                                $parents.removeClass('activechild');
                            }
                        }
                    }, {
                        offset: 1
                    });
                } else {
                    $contentsElem.waypoint(function(direction) {
                        if (direction === 'up') {
                            $tocElem.removeClass('active');
                        }
                    }, {
                        offset: 'bottom-in-view'
                    });
                }
            });
        },
        getTocElemFromContentsElem: function($contentsElem) {
            if (!$contentsElem.attr('id')) {
                return $(null);
            }
            // Special selector characters taken from http://api.jquery.com/category/selectors/
            var escapedSizzleTarget = '#' + $contentsElem.attr('id').replace(
                /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&');
            var $tocElem = this.$('a[href="' + escapedSizzleTarget + '"]').parents('li').first();
            return $tocElem;
        },
        makeToc: function(body) {
            var parent = $('<ul class="nav" data-heading-ref="H1">');
            var depth = 1;
            var headingSelector = this.headingSelector;
            var $body = $('<div />').append(body);
            $body.find(headingSelector).each(
                function(index, elem) {
                    var $elem = $(elem);
                    var $lastItem = parent.children().last();
                    var $link = $('<a>')
                        .attr('href', '#' + $elem.attr('id'))
                        .text($elem.text());
                    if ($elem.prop('tagName') > parent.attr('data-heading-ref')) {
                        var newParent = $('<ul class="nav">').attr('data-heading-ref', $elem.prop('tagName'));
                        if ($lastItem.length) {
                            $lastItem.append(newParent);
                            parent = newParent;
                        } else {
                            parent.attr('data-heading-ref', $elem.prop('tagName'));
                        }
                    }
                    while ($elem.prop('tagName') < parent.attr('data-heading-ref')) {
                        if (parent.parent().parent().length > 0) {
                            parent = parent.parent().parent();
                        } else {
                            parent.attr('data-heading-ref', $elem.prop('tagName'));
                        }
                    }
                    parent.append(
                        $('<li>').append($link)
                    );
                }
            );
            while (parent.parent().length > 0) {
                parent = parent.parent();
            }
            var pageTitle = $body.find('.page-description h1:first').first();
            if (pageTitle.length) {
                var backToTop1 = $('<a onclick="window.scrollTo(0, 0)"/>')
                    .attr('href', '#/' + ReadmeApp.markdownModel.get('page') + '#')
                    .addClass('nav-page-title')
                    .text(pageTitle.text().trim());
                parent.prepend(backToTop1);
            }
            return $('<div />').append(parent).html();
        }
    });
    ReadmeApp.HeaderModel = Backbone.Model.extend({
        defaults: {
            currentConfig: {},
            rdk: {},
            adk: {},
            sdk: {}
        },
        initialize: function(props) {
            if (_.isObject(props)) {
                this.set(props);
            }
        },
        updateNavigationConfig: function updateNavigationConfig() {
            var self = this;
            var page = ReadmeApp.markdownModel.get('page');
            var folder = page.match(/^[^\/]*/)[0];
            if (!_.isEmpty(this.get(folder))) {
                this.set('currentConfig', this.get(folder));
                return;
            }
            Q.fcall(function() {
                    if (folder === 'adk') {
                        return './adk/';
                    } else if (folder === 'rdk') {
                        return fetchRdkPath();
                    } else {
                        return './';
                    }
                })
                .then(self.getNavConfig)
                .then(function(data) {
                    self.set(folder, data);
                    return updateNavigationConfig.bind(self)();
                });
        },
        getNavConfig: function(path) {
            var deferred = Q.defer();
            $.ajax({
                    url: path + 'navigation-config.json',
                    dataType: 'json',
                    mimeType: 'application/json; charset=utf-8'
                })
                .done(function(data) {
                    deferred.resolve(data);
                })
                .fail(function() {
                    return deferred.reject();
                });
            return deferred.promise;
        }
    });

    ReadmeApp.HeaderView = Backbone.View.extend({
        el: $('#header'),
        initialize: function() {
            this.model = new ReadmeApp.HeaderModel();
            ReadmeApp.markdownModel.on('change:page', this.updateHeader, this);
            this.model.on('change:currentConfig', this.render, this);
        },
        render: function() {
            var className = ReadmeApp.markdownModel.get('page').match(/^[^\/]*/)[0];
            $('body').removeClass('adk rdk sdk').addClass(className);
            var htmlString = "";
            htmlString += (this.model.get('currentConfig').showHomeButton) ? '<a alt="back to SDK Documentation" href="./" class="home-button"><i class="fa fa-home"></i></a>' : '';
            htmlString += '<div class="navbar-header">' +
                '<a id="headline" href="' + this.model.get('currentConfig').titleLink + '" class="navbar-brand">' +
                this.model.get('currentConfig').title + '</a>' +
                '<div class="navbar-collapse bs-navbar-collapse collapse" id="main-navbar">' +
                '<ul class="nav navbar-nav">';
            _.each(this.model.get('currentConfig').left_nav_items, function(navItem) {
                htmlString += '<li><a href="' + navItem.url + '">' + navItem.name + '</a></li>';
            });
            htmlString += '</ul><ul class="nav navbar-nav navbar-right">';
            _.each(this.model.get('currentConfig').right_nav_items, function(navItem) {
                htmlString += '<li><a href="' + navItem.url + '">' + navItem.name + '</a></li>';
            });
            htmlString += '</ul></div></div>';
            this.$el.html(htmlString);
            this.renderFooterView();
        },
        updateHeader: function() {
            this.model.updateNavigationConfig();
        },
        renderFooterView: function() {
            var htmlString = "";
            _.each(this.model.get('currentConfig').footer_nav_items, function(navItem) {
                htmlString += '<li><a href="' + navItem.url + '">' + navItem.name + '</a></li>';
            });
            $('footer .nav').html(htmlString);
        }
    });

    ReadmeApp.MainModel = Backbone.Model.extend({
        defaults: {
            indexPage: 'index'
        },
        initialize: function(props) {
            if (_.isObject(props)) {
                this.set(props);
            }
        }
    });
    ReadmeApp.mainModel = new ReadmeApp.MainModel();

    ReadmeApp.MainView = Backbone.View.extend({
        el: $('#container'),
        initialize: function() {
            //_.bindAll(this, '_render');
            this.markdownView = new ReadmeApp.MarkdownView({
                model: ReadmeApp.markdownModel
            });
            this.waypointView = new ReadmeApp.WaypointView({
                model: ReadmeApp.markdownModel
            });
            ReadmeApp.markdownModel.on('change:page', this.render, this);
        },
        render: function() {
            var isIndexPage = ReadmeApp.mainModel.get('indexPage') === ReadmeApp.markdownModel.get('page');
            if (isIndexPage) {
                this.$el.html(
                    '<div class="bump-header bump-footer container">' +
                    '<div class="row">' +
                    '<div id="markdown" class="col-md-12"></div>' +
                    '</div>' +
                    '</div>'
                );
                this.markdownView.$el = this.$('#markdown');
                return;
            }
            this.$el.html(
                '<div id="mainContent" class="container">' +
                    '<div class="row">' +
                        '<div id="markdown" class="col-md-8"></div>' +
                            '<div class="col-md-4">' +
                                '<div id="toc"></div>' +
                            '</div>' +
                            '<div class="row" id="bottom-row">' +
                            '<img class="img-responsive center-block hidden very-special" src="dist/image/manatee_watches_you_scroll.png" style="position: fixed;top: 0;right: ' + (document.body.clientWidth - 350) + 'px;" />' +
                            '<div class="specialButton" onClick="$(\'.very-special\').toggleClass(\'hidden\')" style="position:fixed;bottom:30px;right:0;background-color:transparent;height:20px;width:20px;"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '<div id="bottomImage"></div>'
            );

            //this.$el.parent().append(scrollyFooter);
            this.markdownView.$el = this.$('#markdown');
            this.waypointView.$el = this.$('#toc');
        }
    });

    function fetchRdkPath(customDeferred) {
        var deferred = customDeferred || Q.defer();
        var savedRdkPath = ReadmeApp.mainModel.get('rdkPath');
        if(savedRdkPath) {
            deferred.resolve(savedRdkPath);
            return deferred.promise;
        }
        $.ajax({
            url: '/app.json',
            dataType: 'json',
            mimeType: 'application/json; charset=utf-8'
        })
            .done(function(data) {
                var rdkPath = data.resourceDirectoryPath;
                rdkPath = rdkPath.match(/(.*)resourcedirectory$/)[1] || '';
                if(!/resource/.test(rdkPath)) {
                    rdkPath += 'resource/';
                }
                rdkPath += 'docs/';
                ReadmeApp.mainModel.set('rdkPath', rdkPath);
                fetchRdkPath(deferred);
            })
            .fail(function() {
                return deferred.reject();
            });
        return deferred.promise;
    }

    ReadmeApp.markdownModel = new ReadmeApp.MarkdownModel({
        rewriteRules: [{
            find: /^rdk\/(.*)/,
            rewriter: function rewriter(page, deferred) {
                var self = this;
                fetchRdkPath()
                    .then(function(rdkPath) {
                        var newPath = rdkPath + page.replace(self.find, '$1');
                        return deferred.resolve(newPath);
                    })
                    .fail(function() {
                        return deferred.reject();
                    });
            }
        }]
    });
    ReadmeApp.Router = Backbone.Router.extend({
        initialize: function() {
            ReadmeApp.mainModel.set('indexPage', 'sdk');
            this.lastFile = '';
            this.header = new ReadmeApp.HeaderView();
            this.container = new ReadmeApp.MainView();
        },
        routes: {
            '': 'index',
            '/vx-api': 'vxApi',
            '*markdownFile': 'markdownFile'
        },
        index: function() {
            this.navigate('/' + ReadmeApp.mainModel.get('indexPage'), {
                replace: true,
                trigger: true
            });
        },
        vxApi: function vxApiRoute() {
            fetchRdkPath()
                .then(function(rdkPath) {
                    var vxApiPath = rdkPath + 'vx-api';
                    window.location.href = vxApiPath;
                });
        },
        markdownFile: function(fragment) {
            var fileHeading = fragment.match(new RegExp('/?(.+?)(' + ReadmeApp.sectionDelimiter + '|$)(.*$)'));
            var file = fileHeading[1];
            var delimiter = fileHeading[2];
            var id = fileHeading[3];
            ReadmeApp.id = id;
            ReadmeApp.loadedDelimiter = delimiter;
            ReadmeApp.fragment = fragment;
            if (this.lastFile !== file) {
                this.lastFile = file;
                ReadmeApp.markdownModel.set('page', file);
                ReadmeApp.markdownModel.fetch();
            }
        }
    });

    _.extend(Backbone.History.prototype, {
        // Put leading slashes in the URL with the fragment for cosmetics
        getFragment: function(fragment, forcePushState) {
            var routeStripper = /^#|\s+$/g;
            if (fragment == null) { // jshint ignore:line
                if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                    fragment = decodeURI(this.location.pathname + this.location.search);
                    var trailingSlash = /\/$/;
                    var root = this.root.replace(trailingSlash, '');
                    if (!fragment.indexOf(root)) {
                        fragment = fragment.slice(root.length);
                    }
                } else {
                    fragment = this.getHash();
                }
            }
            return fragment.replace(routeStripper, '');
        }
    });
    ReadmeApp.router = new ReadmeApp.Router();
    Backbone.history.start();
    window.ReadmeApp = ReadmeApp;
});
