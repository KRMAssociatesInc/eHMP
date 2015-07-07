define([
    'underscore',
    'backbone',
    'marionette',
    'hbs!app/applets/addApplets/list/appletEditor',
    'app/applets/addApplets/list/appletSelectionSlider',
    'app/applets/addApplets/list/switchboardLayoutView',
    'gridster',
], function(_, Backbone, Marionette, appletEditor, AppletSelectionSlider, SwitchboardLayout, gridster) {

    'use strict';

    var isSwitchboardDisplayed = function() {
        var switchboardDiv = $('#gridster2').find($('.view-switchboard'));
        if (switchboardDiv.is(':visible')) {
            //flash the box!!
            for (var i = 0; i < 2; i++) {
                $(switchboardDiv).fadeTo(225, 0.5).fadeTo(225, 1.0);
            }
            return true;
        } else {
            return false;
        }
    };

    var Switchboard = Backbone.Marionette.CollectionView;

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        template: appletEditor,
        appletUnderSwitchboard: '',
        initialize: function() {
            this.gridster = gridster;
            var self = this;
            this.rightmostWidgetGrid = undefined;
            this.hoverRow = undefined;

            // load configs from app.json
            var appConfig = new Backbone.Model();
            appConfig.fetch({
                url: 'app.json',
                async: false
            });
            this.maxMoves = appConfig.get("numMovesBeforeSaveUDSConfig");
            this.gracePeriod = appConfig.get("saveUDSConfigTimeout");
            if (typeof this.maxMoves != 'number') {
                this.maxMoves = 6;
            }
            if (typeof this.gracePeriod != 'number') {
                this.gracePeriod = 5000;
            }

            this.model = new Backbone.Model();
            var screenModule = ADK.ADKApp[Backbone.history.fragment];
            this.lastSave.currentScreenModule = screenModule;
            var screensConfig = ADK.UserDefinedScreens.getScreensConfigFromSession();
            self.screenConfig = _.findWhere(screensConfig.screens, {
                id: screenModule.moduleName
            });
            screenModule.buildPromise.done(function() {
                var deferred = ADK.UserDefinedScreens.getGridsterTemplateForEditor(screenModule);
                deferred.done(function(template) {
                    self.model.set('gridsterTemplate', template);
                    self.render();
                });
            });

            var addAppletsChannel = ADK.Messaging.getChannel('addApplets');
            addAppletsChannel.reply('addAppletToGridster', function(params) {
                var appletId = params.appletId;
                var appletTitle = params.appletTitle;
                var regionId = self.getNextAppletId();
                var appletHtml = '<li class="new" data-appletid="' + appletId + '" data-instanceid="' + regionId + '" id="' + regionId + '" data-view-type="summary" data-min-sizex="4" data-min-sizey="3" data-max-sizex="8" data-max-sizey="12"><div class="edit-applet fa fa-cog"></div><br>' + appletTitle + '</li>';
                if (!isSwitchboardDisplayed()) {
                    setTimeout(function() {
                        var x = params.xPos;
                        var y = params.yPos;
                        var col;
                        var row;
                        var gridsterDimen = self.getGridsterDimension();
                        if ($('.dragHere').length !== 0) {
                            col = $('.dragHere').attr('data-col');
                            row = $('.dragHere').attr('data-row');
                            self.gridster.remove_widget($('.dragHere'));
                        } else {
                            //I'm pretty sure this is going to get deprecated
                            col = Math.ceil((x - Math.floor(x / (gridsterDimen[0] * 4 + 10)) * 5) / (gridsterDimen[0] + 10));
                            if (col < 1) col = 1;
                            row = Math.ceil(y / 25);
                            if (row < 1) row = 1;
                        }

                        self.gridster.add_widget(appletHtml, params.sizeX, params.sizeY, col, row);
                        self.displaySwitchboard(appletId, regionId, appletTitle, function() {
                            self.gridster.arrange_widgets_no_vertical_clipping(self.gridster.$widgets.toArray());
                            setTimeout(function() {
                                self.setGridsterBaseDimension();
                            }, 300);
                        });
                    }, 0);
                    if (!isSwitchboardDisplayed()) {
                        self.gridster.arrange_widgets_no_vertical_clipping(self.gridster.$widgets.toArray());
                        setTimeout(function() {
                            self.setGridsterBaseDimension();
                        }, 300);
                    }
                }
                if (!_.isUndefined(self.rightmostWidgetGrid)) {
                    self.rightmostWidgetGrid = undefined;
                }
            });

            addAppletsChannel.reply('addAppletPlaceholder', function(params) {
                var fontStyle = self.setPlaceholderFontSize();
                var appletHtml = '<li class="preview-holder dragHere" style="font-size:' + fontStyle + '">Drag Applet Here</li>';
                var hoverOverRow = (params.hoverOverRow > 9 ? 9 : params.hoverOverRow);
                var placeholder_x = 4;
                var placeholder_y = 4;
                var placeholderEl = $('.dragHere');
                var noCollisionCol;

                if (_.isUndefined(self.rightmostWidgetGrid)) {
                    self.rightmostWidgetGrid = self.get_highest_occupied_col_for_all_rows();
                }

                var placeholderCol = self.rightmostWidgetGrid[hoverOverRow - 1] + 1;

                if (placeholderEl.length === 0) {
                    placeholderCol = (hoverOverRow === 1 ? self.get_possible_col_for_placeholder_in_row(hoverOverRow + (placeholder_y - 1), placeholderCol, placeholder_x, placeholder_y) : placeholderCol);
                    self.gridster.add_widget(appletHtml, placeholder_x, placeholder_y, placeholderCol, hoverOverRow);
                } else if ($('#gridster2 [id^="applet-"]').length !== 0) {

                    if (Number(placeholderEl.attr('data-row')) !== hoverOverRow && self.hoverRow !== hoverOverRow) {

                        var topRowPossible = self.find_any_widgets_above(hoverOverRow, placeholderCol);
                        placeholderCol = self.rightmostWidgetGrid[topRowPossible - 1] + 1;
                        if (topRowPossible === 1) {
                            noCollisionCol = self.get_possible_col_for_placeholder_in_row(topRowPossible + (placeholder_y - 1), placeholderCol, placeholder_x, placeholder_y);

                        } else {
                            noCollisionCol = self.get_possible_col_for_placeholder_in_row(topRowPossible, placeholderCol, placeholder_x, placeholder_y);

                        }

                        placeholderEl.attr('data-row', topRowPossible);
                        placeholderEl.attr('data-col', noCollisionCol);
                        self.hoverRow = hoverOverRow;
                    }
                }
            });

            $(window).resize(function() {
                self.setGridsterBaseDimension();
            });
        },
        get_highest_occupied_col_for_all_rows: function() {
            var row;
            var gm = this.gridster.gridmap;
            var numRows = gm[1].length;
            var rightmostWidgetGrid = [];
            for (row = 1; row <= numRows; row++) {
                var cols = [];
                for (var col = gm.length - 1; col >= 1; col--) {
                    if (this.gridster.is_widget(col, row)) {
                        cols.push(col);
                        break;
                    }
                }
                var highestCol = Math.max.apply(Math, cols);
                highestCol = (highestCol === -Infinity ? 0 : highestCol);
                rightmostWidgetGrid.push(highestCol);
            }
            return rightmostWidgetGrid;
        },
        find_any_widgets_above: function(startRow, col) {
            var row = startRow - 1;
            if (startRow === 1) {
                return startRow;
            }
            for (row; row >= 0; row--) {
                if (this.rightmostWidgetGrid[row - 1] >= col || row === 0) {
                    return row + 1;
                }
            }
        },
        get_possible_col_for_placeholder_in_row: function(startRow, startCol, placeholder_sizeX, placeholder_sizeY) {

            var row = startRow;
            var col = startCol;
            for (col; col <= startCol + (placeholder_sizeX - 1); col++) {
                for (row; row < startRow + (placeholder_sizeY - 1); row++) {
                    var cell = this.gridster.is_widget(col, row);
                    if (cell && !cell.hasClass('dragHere')) {
                        return this.get_possible_col_for_placeholder_in_row(startRow, startCol + 1, placeholder_sizeY, placeholder_sizeX);
                    }

                }
            }
            return startCol;
        },
        getNextAppletId: function() {
            var nextId = 0;
            console.log("outside");
            this.$el.find('.gridsterContainer ul li').not('.gridsterContainer ul .dragHere, .gridsterContainer ul li li').each(function() {
                console.log('inside');
                var idStr = $(this).attr('id');
                var index = idStr.indexOf('applet-');
                if (index === 0) {
                    var id = parseInt(idStr.substring(7, idStr.length));
                    if (nextId < id)
                        nextId = id;
                }
            });
            ++nextId;
            return 'applet-' + nextId;
        },
        setPlaceholderFontSize: function() {
            var styleStr = '';
            var widgetWidth = this.gridster.min_widget_width;
            if (widgetWidth >= 45) {
                styleStr = '2.5rem"';
            } else if (widgetWidth >= 23) {
                styleStr = '2rem"';
            } else if (widgetWidth >= 17) {
                styleStr = '1.5rem"';
            } else {
                styleStr = '1rem';
            }
            return styleStr;
        },
        regions: {
            appletSlider: '.applet-tray'
        },
        events: {
            'keyup #searchApplets': 'filterApplets',
            'click #exitEditing': 'hideOverlay',
            'click .edit-applet': 'editClicked',
            'click .applet-exit-options-button': 'closeSwitchboard',
            'keydown .options-box': 'handleSpacebarOrEnter',
            'keydown .applet-thumbnail': function(evt) {
                if (evt.which === 13) {
                    var $el = $(evt.currentTarget);
                    var addAppletsChannel = ADK.Messaging.getChannel('addApplets');
                    var d = addAppletsChannel.request('addAppletToGridster', {
                        appletId: $el.attr('data-appletid'),
                        appletTitle: $el.text(),
                        sizeX: 4,
                        sizeY: 4,
                        col: 4,
                        row: 4
                    });
                }
            }
        },                                                                                      
        handleSpacebarOrEnter: function(e) {
            if (e.which === 13 || e.which === 32) {
                e.preventDefault();
                e.stopPropagation();
                $(e.target).click();
                return false;
            }
        },
        hideOverlay: function() {
            this.saveGridsterAppletsConfig(true);
            ADK.hideFullscreenOverlay();
            ADK.Navigation.navigate(Backbone.history.fragment);
        },
        onRender: function() {
            if (this.screenConfig) {
                $(this.el).find('#screen-title').text(this.screenConfig.title);
            }
            this.appletSlider.show(new AppletSelectionSlider());
            this.initGridster();
        },
        getSwitchboard: function(appletId, region, appletTitle, onChangeView, currentView) {
            var switchboardOptions = {
                region: region,
                appletId: appletId,
                switchOnClick: false,
                appletTitle: appletTitle
            };
            if (onChangeView) {
                switchboardOptions.onChangeView = onChangeView;
            }
            if (currentView) {
                switchboardOptions.currentView = currentView;
            }
            var SwitchboardView = new SwitchboardLayout(switchboardOptions);
            return SwitchboardView;
        },
        editClicked: function(e) {
            var self = this;
            if (isSwitchboardDisplayed()) {
                return;
            } else {
                var gridsterContainer;
                if ($(e.target).parent().attr('data-appletid') !== undefined) {
                    gridsterContainer = $(e.target).parent();
                } else {
                    gridsterContainer = $(e.target).parent().parent();
                }

                var appletId = gridsterContainer.attr('data-appletid');
                var regionId = gridsterContainer.attr('id');
                var appletTitle = gridsterContainer.find('.applet-title').text();
                var currentView = gridsterContainer.attr('data-view-type');
                gridsterContainer.addClass("bringToFront");

                this.addRegions({
                    appletRegion: '#' + regionId
                });

                Switchboard = this.getSwitchboard(appletId, this.appletRegion, appletTitle, function() {
                    self.gridster.arrange_widgets_no_vertical_clipping(self.gridster.$widgets.toArray());
                    self.setGridsterBaseDimension();
                }, currentView);
                this.appletRegion.show(Switchboard);
                this.fixSwitchboardPosition();
                $('.view-switchboard').find('.applet-exit-options-button').removeClass('hide');
            }
        },
        displaySwitchboard: function(newAppletId, newRegionId, newAppletTitle, onChangeView) {
            this.addRegions({
                appletRegion: '#' + newRegionId
            });

            Switchboard = this.getSwitchboard(newAppletId, this.appletRegion, newAppletTitle, onChangeView);

            this.appletRegion.show(Switchboard);
            $('#' + newRegionId).addClass("bringToFront");

            this.fixSwitchboardPosition();

        },
        fixSwitchboardPosition: function() {
            var $switchboard = $('div.view-switchboard');
            var leftOffset = $switchboard.offset().left;
            var rightOffset = $switchboard.offset().left + $switchboard.width();
            var windowWidth = $(self).width();

            if (leftOffset < 0) {
                $switchboard.css('margin-left', Math.abs(leftOffset) + 'px');
            } else if (rightOffset > windowWidth) {
                var rightMargin = rightOffset - windowWidth;
                $switchboard.css('right', rightMargin / 2 + 'px');
                $switchboard.css('left', '-10px');
            }
        },
        closeSwitchboard: function(e) {
            // $(this.appletRegion.el).removeClass('bringToFront');
        },
        saveGridsterAppletsConfig: function(overrideThrottle) {
            var screen = ADK.ADKApp.currentScreen.id;
            var $gridsterEl = this.$el.find(".gridsterContainer");
            var appletsConfig = ADK.UserDefinedScreens.serializeGridsterScreen($gridsterEl, screen);

            //check if anything changed from last save
            if (ADK.UserDefinedScreens.getGridsterTemplate(this.lastSave.currentScreenModule) === ADK.UserDefinedScreens.getGridsterTemplate(appletsConfig)) {
                // nothing changed since last save, reset number of moves, skip save check
                // console.log("  notthing changed, not saved, resetting moveCount");
                this.lastSave.numMoves = 0;
                return;
            }

            // save to the session
            ADK.UserDefinedScreens.saveGridsterConfigToSession(appletsConfig, screen);

            var currentTime = this.getSaveTime();
            var timeDiff = currentTime - this.lastSave.time;
            this.lastSave.numMoves++;
            if (this.lastSave.numMoves === 1 && !overrideThrottle) {
                // This is the first move so let's start a "timer"
                // console.log("  first, not saved, start timer");
                this.lastSave.time = currentTime;
            } else if (overrideThrottle || timeDiff > this.gracePeriod || this.lastSave.numMoves >= this.maxMoves) {
                // Force save, elapsed time longer than grace perieod, or more than enough moves to do the save
                // so svae and reset the counters/"timer"
                console.log("  saving GridsterConfig screen: " + screen);
                ADK.UserDefinedScreens.saveGridsterConfig(appletsConfig, screen);
                this.lastSave.time = currentTime;
                this.lastSave.numMoves = 0;
                this.lastSave.currentScreenModule = appletsConfig;
            } else {
                // console.log("  not saved");
            }
            // else don't save
        },
        getGridsterDimension: function() {
            var windowWidth = $(window).width();
            var hightestCol = this.gridster.get_highest_occupied_cell().col;
            if (hightestCol < 1) {
                return [40, 20];
            }
            var x = Math.floor(windowWidth / hightestCol) - 10;
            if (x > 40) x = 40;
            return [x, 20];
        },
        setGridsterBaseDimension: function() {
            this.gridster.resize_widget_dimensions({
                widget_base_dimensions: this.getGridsterDimension()
            });
            this.setBoundaryIndicator();
        },
        initGridster: function() {
            var self = this;

            function gridsterResizeSnap($widget) {
                var sizeX = parseInt($widget.attr('data-sizex'));
                var mod = sizeX % 2;
                if (mod === 1) {
                    self.gridster.resize_widget($widget, sizeX + 1);
                }
            }
            this.gridster = this.$el.find(".gridsterContainer ul").gridster({
                namespace: '#gridster2',
                widget_selector: "li",
                widget_base_dimensions: [40, 20],
                widget_margins: [5, 5],
                helper: 'clone',
                avoid_overlapped_widgets: true,
                autogrow_cols: true,
                min_cols: 100,
                resize: {
                    enabled: true,
                    resize: function(e, ui, $widget) {
                        gridsterResizeSnap($widget);
                    },
                    stop: function(e, ui, $widget) {
                        gridsterResizeSnap($widget);
                        self.setGridsterBaseDimension();
                        self.saveGridsterAppletsConfig();
                    }
                },
                draggable: {
                    drag: function(e, ui) {
                        // if(isSwitchboardDisplayed()) {
                        // self.fixSwitchboardPosition();
                        // }
                    },
                    stop: function(e, ui) {
                        self.setGridsterBaseDimension();
                        self.saveGridsterAppletsConfig();
                    }
                }
            }).data('gridster');
            if (this.gridster) {
                this.setGridsterBaseDimension();
                this.$el.find('.gridsterContainer #gridster2').height('380px');
            }

        },
        filterApplets: function() {
            var filterText = this.$el.find('#searchApplets').val();
            this.appletSlider.currentView.filterApplets(filterText);
        },
        lastSave: {
            time: 0,
            numMoves: 0
        },
        getSaveTime: function() {
            var d = new Date();
            return d.getTime();
        },
        setBoundaryIndicator: function() {
            var xSize = ADK.utils.resize.getXSize(self);

            var workspaceTotalApplets = Math.floor($(window).width() / (xSize * 4));
            var workspaceAppletsPerPage = workspaceTotalApplets < 3 ? 3 : workspaceTotalApplets;
            var workspaceScrollPosition = $('#center-region').scrollLeft();
            var workspaceWidth = $('#center-region').width() - 20;

            var editorAppletSize = (this.getGridsterDimension()[0] * 4) + 45;
            var editorIndicatorWidth = editorAppletSize * workspaceAppletsPerPage;

            var ratio = editorIndicatorWidth / workspaceWidth;

            ADK.UserDefinedScreens.saveScrollPositionToSession(workspaceScrollPosition);

            $('#boundaryIndicator').css('width', editorIndicatorWidth + 15 + "px");
            $('#boundaryIndicator').css('left', (workspaceScrollPosition) * ratio + "px");
        },
    });

    return AppletLayoutView;
});
