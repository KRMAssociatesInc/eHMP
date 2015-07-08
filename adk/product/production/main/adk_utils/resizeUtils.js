define(["backbone"], function(Backbone) {

    var ResizeUtils = {};

    //Adding margin to top of contentRegion to allow topRegion to have fixed position
    //On resize of the window, re-calulate the height of topRegion
    ResizeUtils.centerRegion = function(centerRegion_layoutView, topRegion_layoutView, ADKApp) {
        //getting the height of the topRegion to calaculate the margin-top for the centerRegion
        centerRegion_layoutView.$el.parent().css('margin-top', topRegion_layoutView.$el.height() + 'px');
        centerRegion_layoutView.$el.parent().css('height', $(window).height() - topRegion_layoutView.$el.height() - ADKApp.bottomRegion.$el.children().height() + 'px');
    };

    ResizeUtils.getXSize = function() {
        var $gridsterEl = $(document).find(".gridster");
        if ($gridsterEl.length > 0) {
            var breakPoint1 = 12;
            var breakPoint2 = 12;
            var breakPoint3 = 16;
            var breakPoint4 = 20;
            var breakPoint5 = 24;
            var winWidth = $(window).width() - 2 * $gridsterEl.position().left;
            var baseGridster = winWidth - (breakPoint1 * 10 + 30);
            var maxCol = 1;

            $(document).find('.gridster div[data-col]').each(function() {
                var col = parseInt($(this).attr('data-col'));
                var size = parseInt($(this).attr('data-sizex'));
                col += size;
                if (col > maxCol) maxCol = col;
            });
            if ($(window).width() <= 1024) {
                return (1024 - 2 * $gridsterEl.position().left - 150) / breakPoint1;
            } else if ($(window).width() > 1024 && $(window).width() < 1280) {
                return baseGridster / 12;
            } else if ($(window).width() >= 1280 && $(window).width() < 1440) {
                return (winWidth - (breakPoint2 * 10 + 30)) / breakPoint2;
            } else if ($(window).width() >= 1440 && $(window).width() < 1920) {
                if (maxCol <= 13) {
                    return baseGridster / breakPoint1;
                } else {
                    return (winWidth - (breakPoint3 * 10 + 30)) / breakPoint3;
                }
            } else if ($(window).width() >= 1920 && $(window).width() < 2560) {
                if (maxCol <= 13) {
                    return baseGridster / breakPoint1;
                } else if (maxCol <= 17) {
                    return (winWidth - (breakPoint3 * 10 + 30)) / breakPoint3;
                } else {
                    return (winWidth - (breakPoint4 * 10 + 30)) / breakPoint4;
                }
            } else {
                if (maxCol <= 13) {
                    return baseGridster / breakPoint1;
                } else if (maxCol <= 17) {
                    return (winWidth - (breakPoint3 * 10 + 30)) / breakPoint3;
                } else if (maxCol <= 21) {
                    return (winWidth - (breakPoint4 * 10 + 30)) / breakPoint4;
                } else {
                    return (winWidth - (breakPoint5 * 10 + 30)) / breakPoint5;
                }
            }
        }
    };
    ResizeUtils.hasMob = function() {
        var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] + 'MutationObserver' in window) {
                return window[prefixes[i] + 'MutationObserver'];
            }
        }
        return false;
    };
    ResizeUtils.deployMob = function(ma) {
        var mobArgs = $.extend({
            name: '',
            target: false,
            args: {},
            mobCb: function() {}
        }, ma);
        if (ResizeUtils.hasMob()) {
            // Create an observer instance
            if (_.isUndefined($(document).data('mobs'))) {
                $(document).data('mobs', {});
            }
            var mobs = $(document).data('mobs');
            mobs[mobArgs.name] = new MutationObserver(function(mutations) {
                mobArgs.mobCb(mutations);
            });
            // Pass in the target node, as well as the observer options
            mobs[mobArgs.name].observe(mobArgs.target, mobArgs.args);
        }
    };
    ResizeUtils.destroyMob = function(mobName) {
        if ((!_.isUndefined($(document).data('mobs'))) && (!_.isUndefined($(document).data('mobs')[mobName]))) {
            $(document).data('mobs')[mobName].disconnect();
            delete $(document).data('mobs')[mobName];
        }
    };
    ResizeUtils.jqPlugs = function() {
        (function($) {
            $.fn.resizeEnd = function(a) {
                var args = $.extend({
                    cb: function() {},
                    namespace: '',
                    duration: 100,
                    timeoutName: 'resizeTimeout',
                    timeoutCallbackName: 'resizeCallback',
                    timeoutFunctionName: 'resizeFunction'
                }, a);
                this.each(function() {
                    var t = $(this);
                    t.data(args.timeoutCallbackName, args.cb);
                    t.data(args.timeoutFunctionName, function() {
                        clearTimeout($(this).data(args.timeoutName));
                        $(this).data(args.timeoutName, setTimeout(function() {
                            args.cb();
                        }), args.duration);
                    });
                    t.bind('resize' + (args.namespace === '' ? '' : '.' + args.namespace), function() {
                        clearTimeout($(this).data(args.timeoutName));
                        $(this).data(args.timeoutName, setTimeout(function() {
                            clearTimeout($(this).data('resizeTimeout'));
                            $(this).data(args.timeoutName, setTimeout(function() {
                                args.cb();
                            }), args.duration);
                        }, args.duration));
                    });
                });
            };
        })(jQuery);
    }();
    ResizeUtils.filteredView = function(view) {
        if (!_.isUndefined(view)) {
            console.log(view.indexOf('-full'));
            if (view.indexOf('-full') > -1) {
                if (ResizeUtils.hasMob()) {
                    var mobName = 'captureFilter';
                    ResizeUtils.deployMob({
                        name: mobName,
                        target: $('#center-region')[0],
                        args: {
                            attributes: false,
                            childList: true,
                            characterData: false,
                            subtree: true
                        },
                        mobCb: function(mutes) {
                            for (var i = 0; i < mutes.length; i++) {
                                var mute = mutes[i];
                                var nodes = mute.addedNodes;
                                for (var j = 0; j < nodes.length; j++) {
                                    var node = nodes[j];
                                    if ($(node).find('.gridContainer').not('.filter-parsed').length > 0) {
                                        var gc = $('.gridContainer');
                                        gc.addClass('filter-parsed');
                                        ResizeUtils.destroyMob(mobName);
                                        break;
                                    }
                                }
                            }
                            var fp = $('.gridContainer.filter-parsed');
                            var scrollingView = fp.find('.grid-container');

                            var svAdjustHeight = function(obj) {
                                var sh = 0;
                                obj.siblings().each(function() {
                                    console.log($(this));
                                    console.log($(this).is(':visible'));
                                    console.log($(this).height());
                                    if ($(this).is(':visible')) {
                                        sh += $(this).height();
                                    }
                                });
                                obj.height(obj.parent().height() - sh);
                            };
                            svAdjustHeight(scrollingView);

                            var collapsingDiv = fp.find('[id^="grid-filter"]');
                            collapsingDiv.on('hidden.bs.collapse', function() {
                                svAdjustHeight(scrollingView);
                            });
                            collapsingDiv.on('shown.bs.collapse', function() {
                                svAdjustHeight(scrollingView);
                            });
                            // i set a resize event listener to window in order to resize the scrolling area
                            $(window).resizeEnd({
                                cb: function() {
                                    svAdjustHeight(scrollingView);
                                },
                                namespace: 'fullViewFilterResize',
                                duration: 300,
                                timeoutName: 'fr_resizeTimeout',
                                timeoutCallbackName: 'fr_resizeCallback',
                                timeoutFunctionName: 'fr_resizeFunction'
                            });
                            // now i have to remove the window resize event listener if i go outside the full applet view
                            ResizeUtils.deployMob({
                                name: 'removeCaptureFilter',
                                target: $('#center-region')[0],
                                args: {
                                    attributes: false,
                                    childList: true,
                                    characterData: false,
                                    subtree: true
                                },
                                mobCb: function(mutes_2) {
                                    console.log('mute_2');
                                    for (var i = 0; i < mutes_2.length; i++) {
                                        var mute_2 = mutes_2[i];
                                        var nodes_2 = mute_2.removedNodes;
                                        for (var j = 0; j < nodes_2.length; j++) {
                                            var node_2 = nodes_2[j];
                                            if ($(node_2).find('.gridContainer.filter-parsed').length > 0) {
                                                console.log('found');
                                                var win = $(window);
                                                win.unbind('resize.fullViewFilterResize');
                                                delete win.data().fr_resizeTimeout;
                                                delete win.data().fr_resizeCallback;
                                                delete win.data().fr_resizeFunction;
                                                ResizeUtils.destroyMob('removeCaptureFilter');
                                                break;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
    };

    return ResizeUtils;
});