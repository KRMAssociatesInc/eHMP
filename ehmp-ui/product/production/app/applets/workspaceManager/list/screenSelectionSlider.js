// var dependencies = [
//     'underscore',
//     'main/ADK',
//     'backbone',
//     'marionette',
//     'hbs!app/applets/workspaceManager/list/slider',
//     'main/ScreenBuilder',
//     'api/UserDefinedScreens'
// ];

// define(dependencies, onResolveDependencies);

// function onResolveDependencies(_, ADK, Backbone, Marionette, Slider, ScreenBuilder, UserDefinedScreens) {

//     'use strict';
//     var SliderLayoutView = Backbone.Marionette.LayoutView.extend({
//         template: Slider,
//         start: function(screenConfig) {
//             var self = this;
//             var promise = UserDefinedScreens.getScreensConfig();
//             promise.done(function(screensConfig) {
//                 self.collection = new Backbone.Collection(screensConfig.screens);
//                 self.collectionOrig = self.collection.clone();
//                 self.model = new Backbone.Model({});
//                 self.setModel(0);
//                 self.render();
//             });
//         },
//         initialize: function(options) {
//             var self = this;
//             self.start();
//             $(window).resize(function() {
//                 if (self.isDestroyed) return;
//                 self.start();
//             });
//         },
//         getNumberPerSlides: function() {
//             var windowWidth = $(window).width();
//             return Math.ceil((windowWidth - 300) / 160);
//         },
//         setModel: function(activePage) {
//             var appletsPerSlide = this.getNumberPerSlides();
//             var slides = Math.ceil(this.collection.length / appletsPerSlide);
//             this.model.set({
//                 'paginationHtml': this.getPaginationHtml(slides, activePage),
//                 'appletItemsHtml': this.getAppletItemsHtml(this.collection, appletsPerSlide, activePage)
//             });
//         },
//         onRender: function() {
//             var carousel = this.$el.find('.carousel').carousel({
//                 interval: false,
//                 wrap: false //no cycle
//             });

//             var $el = this.$el;

//             //add key listening
//             $el.find('.fa-chevron-right').on('keydown', function(evt){
//                 if(evt.which === 13){
//                     /* after slide, put focus on first item */
//                     carousel.on('slid.bs.carousel', function () {
//                             $el.find('.active').find('.screen-thumbnail').first().focus();
//                             carousel.off('slid.bs.carousel');
//                     });
//                 }
//             });
//             $el.find('.fa-chevron-left').on('keydown', function(evt){
//                 if(evt.which === 13){
//                     /* after slide, put focus on first item */
//                     carousel.on('slid.bs.carousel', function () {
//                             $el.find('.active').find('.screen-thumbnail').first().focus();
//                             carousel.off('slid.bs.carousel');
//                     });
//                 }
//             });

//             //fix display issue when changing win size
//             this.$el.find('.carousel-inner').width($(window).width() - 200);
//             this.$el.find('.pagination').css('top', '110px');

//             //enable drag
//             var self = this;
//             var dragLocation = '';
//             this.$el.find('.item').drag({
//                 items: '.screen-thumbnail',
//                 //helper: 'clone',
//                 start: function(e) {
//                     $(this).css('z-index', 99999);
//                     $(this).css('left', e.pageX - $(this).width() / 2 + 'px');
//                     $(this).css('top', e.pageY - $(this).height() / 2 + 'px');
//                     $(this).css('position', 'fixed');
//                     $(this).before('<div class="screen-thumbnail toInsert"></div>');
//                     $('body').append($(this));
//                 },
//                 drag: function(e) {
//                     $(this).addClass('draggingItem');
//                     $(this).css('left', e.pageX - $(this).width() / 2 + 'px');
//                     $(this).css('top', e.pageY - $(this).height() / 2 + 'px');
//                     $(this).css('position', 'fixed');
//                     var playerTitle = $(this).text();

//                     var rightArrowX = $el.find('.fa-chevron-right').offset().left;
//                     var leftArrow = $el.find('.fa-chevron-left');
//                     var leftArrowX = leftArrow.offset().left + leftArrow.width();

//                     var slides = $el.find('.carousel-indicators li').length;
//                     var $toInsert = $el.find('.toInsert');

//                     var currentSlideIndex = $el.find('.carousel-indicators li.active').attr('data-slide-to');
//                     var totalSlides = $el.find('.carousel-indicators li').length;
//                     var $activeSlide = $el.find('.carousel-inner .active');
//                     var screensPerSlide = self.getNumberPerSlides();
//                     if (slides > 1 && currentSlideIndex < (totalSlides - 1) && e.pageX > rightArrowX && dragLocation != 'rightArrrow') {
//                         //move slide to left
//                         var nextSlide = $activeSlide.next();
//                         var nextSlideFirstItem = nextSlide.children('.screen-thumbnail').first();
//                         $toInsert.before(nextSlideFirstItem[0]);
//                         $toInsert.prev().hide().fadeIn(500, 'linear', function() {
//                             nextSlide.append('<div class="toInsert screen-thumbnail"></div>');
//                             $el.find('.carousel').carousel('next');
//                         });
//                         $toInsert.remove();
//                     } else if (slides > 1 && currentSlideIndex > 0 && e.pageX < leftArrowX && dragLocation != 'leftArrow') {
//                         //move slide to right
//                         var prevSlide = $activeSlide.prev();
//                         var prevSlideLastItem = prevSlide.children('.screen-thumbnail').last();
//                         $toInsert.after(prevSlideLastItem[0]);
//                         $toInsert.next().hide().fadeIn(500, 'linear', function() {
//                             prevSlide.append('<div class="toInsert screen-thumbnail"></div>');
//                             $el.find('.carousel').carousel('prev');
//                         });
//                         $toInsert.remove();
//                     } else {
//                         $('.active .screen-thumbnail:not(.toInsert)').each(function() {
//                             var coveredOffset = $(this).offset();
//                             var coveredWidth = $(this).width();
//                             var coveredHeight = $(this).height();
//                             var left = coveredOffset.left; // + coveredPosition.left;
//                             var top = coveredOffset.top; // + coveredPosition.top;
//                             if (playerTitle !== $(this).text() && e.pageX > left && e.pageX < (left + coveredWidth / 2)) {
//                                 $el.find('.toInsert').remove();
//                                 $(this).before('<div class="screen-thumbnail toInsert"></div>');
//                             } else if (playerTitle !== $(this).text() && e.pageX > (left + coveredWidth / 2) && e.pageX < (left + coveredWidth)) {
//                                 $el.find('.toInsert').remove();
//                                 $(this).after('<div class="screen-thumbnail toInsert"></div>');
//                             }
//                         });
//                     }

//                     if (e.pageX > rightArrowX) {
//                         dragLocation = 'rightArrrow';
//                     } else if (e.page < leftArrowX) {
//                         dragLocation = 'leftArrow';
//                     } else {
//                         dragLocation = 'between';
//                     }

//                 },
//                 stop: function(e, ui) {
//                     $(this).removeClass('draggingItem');
//                     var $toInsert = $el.find('.toInsert');
//                     $toInsert.html(ui.$player.html());
//                     $toInsert.attr('data-screen-id', ui.$player.attr('data-screen-id'));
//                     ui.$player.remove();
//                     $toInsert.removeClass('toInsert');
//                     self.saveScreens();

//                 }
//             });
//         },
//         getPaginationHtml: function(slides, activePage) {
//             var html = '';
//             for (var i = 0; i < slides; i++) {
//                 html += '<li data-target="#screens-carousel" data-slide-to="' + i + '"';
//                 if (i === activePage) {
//                     html += ' class="active"';
//                 }
//                 html += '></li>';
//             }
//             return html;
//         },
//         getAppletItemsHtml: function(collection, numberPerSlide, activePage) {
//             var html = '';
//             var i = 1,
//                 j = 1;
//             _.each(collection.models, function(model) {
//                 if (i % numberPerSlide === 1) {
//                     if (activePage === Math.floor((i - 1) / numberPerSlide))
//                         html += '<div class="item  active">';
//                     else
//                         html += '<div class="item">';
//                 }
//                 var left = (j % (numberPerSlide + 1) * 147 - 50) + 'px';
//                 html += '<div class="screen-thumbnail" tabindex=0 data-screen-id="' + model.get('id') + '">';
//                 if (model.get('defaultScreen')) {
//                     html += '<i class="fa fa-star"></i>';
//                     html += '<p class="defaultScreenTitle">' + model.get('title') + '</p></div>';
//                 } else {
//                     html += '<p>' + model.get('title') + '</p></div>';
//                 }

//                 if (i % numberPerSlide === 0) {
//                     html += '</div>';
//                     j = 0;
//                 }
//                 i++;
//                 j++;
//             });
//             html += '</div>';
//             return html;

//         },
//         saveScreens: function() {
//             var ids = [];
//             this.$el.find('.screen-thumbnail').each(function() {
//                 ids.push($(this).attr('data-screen-id'));
//             });
//             UserDefinedScreens.sortScreensByIds(ids);
//         },
//         filterScreens: function(filterText) {
//             this.initialize();
//             this.collection.reset(_.filter(this.collectionOrig.models, function(model) {
//                 return model.get('title').toLowerCase().indexOf(filterText.toLowerCase()) >= 0 || model.get('description').toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
//             }));
//             this.setModel(0);
//             this.render();
//         }

//     });

//     return SliderLayoutView;
// }