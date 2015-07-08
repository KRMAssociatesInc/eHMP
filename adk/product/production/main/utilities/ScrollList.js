/*jslint node: true, nomen: true, unparam: true, white: true */
/*global define */

define([ 'jquery', 'backbone' ],
    function ($, Backbone) {
        'use strict';
        return (function () {
            var _ScrollList = {},
                scrollView = {
                    onShow: function () {
                        this.$el.trigger('create');

                        this.calculateListHeight();

                        this.stopListening();
                        this._initialEvents();
                        this.bindEvents();

                        if ($.isFunction(this.parentOnShow)) {
                            this.parentOnShow();
                        }
                    },
                    onScroll: function (e, collection) {
                        var scrollHeight = e.currentTarget.scrollHeight,
                            scrollTop = e.currentTarget.scrollTop,
                            clientHeight = e.currentTarget.clientHeight;

                        if (scrollHeight - scrollTop <= clientHeight + 150) {
                            collection.trigger('scroll-down');
                        }
                    },
                    onRender: function () {
                        var that = this;

                        $(this.itemViewContainer)
                            .off()
                            .on('scroll', function (e) {
                                that.onScroll(e, that.collection);
                            });

                        if ($.isFunction(this.parentOnRender)) {
                            this.parentOnRender();
                        }
                    },
                    moveScrollUp: function (parentObj) {
                        var $ordersList = $(parentObj.itemViewContainer),
                            scrollUp = $ordersList.scrollTop() - 10;

                        $ordersList.scrollTop(scrollUp);
                    },
                    bindEvents: function () {
                        var that = this;

                        this.collection
                            .on('fetch-done', function () {
                                that.moveScrollUp(that);
                            })
                            .on('change', this.render);
                    }
                },
                scrollCollection = {
                    bindEvents: function () {
                        this.on('scroll-down', this.scrollDown);
                    },
                    setUpCollection: function (options) {
                        options = options || {};

                        this.maxPerPage = options.maxPerPage || 20;
                        this.nextNum = 3;

                        this.tempCollection = Backbone.Collection.extend({
                            model: this.model,
                            parse: this.parse,
                            parentParse: this.parentParse
                        });

                        this.reset();

                        this.bindEvents();
                    },
                    parse: function (response) {
                        var type,
                            firstChar,
                            parsedResponse;

                        this.count = response.recordCount || response.size;
                        this.numPages = response.pageCount || 1;

                        if ($.isFunction(this.parentParse)) {
                            parsedResponse = this.parentParse(response);
                        } else {
                            type = response["object-type"];
                            firstChar = type.charAt(0).toLowerCase();

                            type = type.substr(0, type.length - 1);
                            type = firstChar + type.slice(1);

                            parsedResponse = response[type];
                        }

                        return parsedResponse;
                    },
                    fetch: function (options) {
                        options = options || {};

                        var that = this,
                            url = this.url;

                        this.nextNum = 3;

                        this.url += this.getParams();

                        this.reset();

                        return Backbone.Collection.prototype.fetch.call(this, {
                            success: function () {
                                that.nextPage = [];

                                that.url = url;

                                if ($.isFunction(options.success)) {
                                    options.success(that);
                                }

                                that.trigger('change');

                                if (that.numPages > 1) {
                                    that.getData({
                                        page: 2,
                                        success: function () {
                                            that.trigger('fetch-done');
                                        }
                                    });
                                }
                            }
                        }, {reset: true});
                    },
                    scrollDown: function () {
                        var that = this;

                        if (this.nextPage.length) {
                            this.add(this.nextPage);
                            this.nextPage = [];

                            if (this.nextNum <= this.numPages) {
                                this.getData({
                                    page: this.nextNum,
                                    success: function () {
                                        that.nextNum += 1;
                                        that.trigger('fetch-done');
                                    }
                                });
                            }
                        }
                    },
                    getData: function (options) {
                        var that = this,
                            tempCollection = new this.tempCollection();

                        tempCollection.url = this.url + this.getParams(options.page);

                        tempCollection.fetch({
                            success: function (response) {
                                that.nextPage = response.toJSON();

                                if ($.isFunction(options.success)) {
                                    options.success(response);
                                }
                            }
                        });
                    },
                    getParams: function (page) {
                        page = page || 1;

                        return "&max-per-page=" + this.maxPerPage + "&go-to-page=" + page;
                    }
                };

            _ScrollList.build = function (view, options) {
                var parentOnShow = view.onShow,
                    parentOnRender = view.onRender,
                    parentParse = view.collection.parse;

                $.extend(view, scrollView);
                $.extend(view.collection, scrollCollection);

                view.parentOnShow = parentOnShow;
                view.parentOnRender = parentOnRender;
                view.collection.parentParse = parentParse;

                options = options || {};

                view.collection.setUpCollection(options);

                return view;
            };

            return _ScrollList;
        }());
    });
