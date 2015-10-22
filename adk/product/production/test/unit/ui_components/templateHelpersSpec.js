/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'backbone', 'marionette', 'handlebars', 'api/UIComponents', 'jasminejquery'],
    function ($, Backbone, Marionette, Handlebars) {

        var clearAndSetFixture = function(){
            $('#fixture').remove();
            $('body').append('<div id="fixture"></div>');
        };

        var template;

        describe('The UI Components template helper', function () {

            describe('has a button helper', function () {

                beforeEach(function () {
                    clearAndSetFixture();
                });

                describe('that creates a button based on given properties', function(){

                    beforeEach(function(){
                        template = Handlebars.compile('{{ui-button "Test button" type="submit" title="custom title"' +
                        'classes="class1 class2" id="id1" icon="icon" state="active" size="xs" status="active"}}');
                        $('#fixture').append(template);
                    });

                    it('sets button text to provided', function () {
                        expect($('#fixture button').text().trim()).toBe('Test button');
                    });

                    it('sets button with title to specified title', function () {
                        expect($('#fixture button').attr('title')).toBe('custom title');
                    });

                    it('sets button with type set to specified type', function () {
                        expect($('#fixture button').attr('type')).toBe('submit');
                    });

                    it('sets button with classes set to specified classes', function () {
                        expect($('#fixture button')).toHaveClass("class1");
                        expect($('#fixture button')).toHaveClass("class2");
                    });

                    it('sets button id to specified id', function () {
                        expect($('#fixture button')).toHaveId("id1");
                    });

                    it('sets icon to specified icon', function () {
                        expect($('#fixture button i').length).toBe(1);
                        expect($('#fixture button i')).toHaveClass('icon');
                    });

                    it('sets btn state class to specified state', function () {
                        expect($('#fixture button')).toHaveClass('btn-active');
                    });

                    it('sets btn size class to specified size', function () {
                        expect($('#fixture button')).toHaveClass('btn-xs');
                    });

                });
            });
        });
    });