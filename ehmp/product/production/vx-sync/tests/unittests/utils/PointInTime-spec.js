'use strict';

//-----------------------------------------------------------------------
// This tests the PointInTime.js class.  Most of this code was pulled
// from the previous EHMP solution and converted to run against our
// framework.
//
// Author: Les Westberg
//-----------------------------------------------------------------------

require('../../../env-setup');

var _ = require('underscore');
var IntervalOfTime = require(global.VX_UTILS + 'IntervalOfTime');
var PointInTime = require(global.VX_UTILS + 'PointInTime');
var stringUtil = require(global.VX_UTILS + 'string-utils');
var slice = stringUtil.nullSafeSliceAndParseInt;


describe('gov.va.hmp.healthtime.PointInTimeTests', function () {
    var parse, format;

    beforeEach(function () {
        // parse = gov.va.hmp.healthtime.PointInTime.parse;
        // format = gov.va.hmp.healthtime.PointInTime.format;
    });

    it('slice date string', function() {
    	expect(slice('200908031300', 0, 4)).toEqual(2009);
    	expect(slice('200908031300', 4, 6)).toEqual(8);
    	expect(slice('200908031300', 6, 8)).toEqual(3);
    	expect(slice('200908031300', 8, 10)).toEqual(13);
    	expect(slice('200908031300', 10, 12)).toEqual(0);
    });

    // it('format default', function () {
    //     expect(format('2013')).toEqual('2013');
    //     expect(format('201302')).toEqual('Feb-2013');
    //     expect(format('20130226')).toEqual('26-Feb-2013');
    //     expect(format('2013022607')).toEqual('26-Feb-2013');
    //     expect(format('201302260756')).toEqual('26-Feb-2013 07:56');
    //     expect(format('201003051000')).toEqual('05-Mar-2010 10:00');
    //     expect(format('200908031300')).toEqual('03-Aug-2009 13:00');
    //     expect(format('20130226075612')).toEqual('26-Feb-2013 07:56');
    //     expect(format(new Date(2013, 1, 26, 7, 56, 12))).toEqual('26-Feb-2013 07:56');
    // });

    // it('format HL7 Strings', function () {
    //     expect(format('20130226', Ext.Date.patterns.Year)).toEqual('2013');

    //     expect(format('20130226', Ext.Date.patterns.CPRSMonthYear)).toEqual('Feb 2013');
    //     expect(format('20130226', Ext.Date.patterns.SortableMonthYear)).toEqual('2013-02');
    //     expect(format('20130226', Ext.Date.patterns.MSCUIMonthYear)).toEqual('Feb-2013');

    //     expect(format('20130226', Ext.Date.patterns.CPRSDate)).toEqual('Feb 26,13');
    //     expect(format('20130226', Ext.Date.patterns.SortableDate)).toEqual('2013-02-26');
    //     expect(format('20130226', Ext.Date.patterns.MSCUIDate)).toEqual('26-Feb-2013');

    //     expect(format('201302260756', Ext.Date.patterns.CPRSDateTime)).toEqual('Feb 26,13 07:56');
    //     expect(format('201302260756', Ext.Date.patterns.SortableDateTime)).toEqual('2013-02-26 07:56');
    //     expect(format('201302260756', Ext.Date.patterns.MSCUIDateTime)).toEqual('26-Feb-2013 07:56');
    // });

    // it('format HL7 Strings with not enough precision', function () {
    //     expect(format('2013', Ext.Date.patterns.CPRSDateTime)).toEqual('? ?,13 ?:?');
    //     expect(format('201302', Ext.Date.patterns.CPRSDateTime)).toEqual('Feb ?,13 ?:?');
    //     expect(format('20130226', Ext.Date.patterns.CPRSDateTime)).toEqual('Feb 26,13 ?:?');
    //     expect(format('2013022607', Ext.Date.patterns.CPRSDateTime)).toEqual('Feb 26,13 07:?');

    //     expect(format('2013', Ext.Date.patterns.SortableDateTime)).toEqual('2013-?-? ?:?');
    //     expect(format('201302', Ext.Date.patterns.SortableDateTime)).toEqual('2013-02-? ?:?');
    //     expect(format('20130226', Ext.Date.patterns.SortableDateTime)).toEqual('2013-02-26 ?:?');
    //     expect(format('2013022607', Ext.Date.patterns.SortableDateTime)).toEqual('2013-02-26 07:?');
    // });

    // it('format a Date', function () {
    //     expect(format(new Date(2013, 1, 26), Ext.Date.patterns.CPRSDate)).toEqual('Feb 26,13');
    // });

    // it('format null', function () {
    //     expect(format(null, Ext.Date.patterns.CPRSDate)).toEqual('');
    // });

    // it('CPRSDateTime format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['CPRSDateTime'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb 2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('Feb 26,13 07:56');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('Feb 26,13 07:56');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('Feb 26,13 07:56');
    // });

    // it('CPRSTimeDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['CPRSTimeDate'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb 2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('07:56 Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('07:56 Feb 26,13');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('07:56 Feb 26,13');
    // });

    // it('CPRSDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['CPRSDate'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb 2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('Feb 26,13');
    // });

    // it('SortableDateTime format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['SortableDateTime'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('2013-02');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('2013-02-26 07:56');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('2013-02-26 07:56');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('2013-02-26 07:56');
    // });

    // it('SortableTimeDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['SortableTimeDate'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('2013-02');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('07:56 2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('07:56 2013-02-26');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('07:56 2013-02-26');
    // });

    // it('SortableDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['SortableDate'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('2013-02');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('2013-02-26');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('2013-02-26');
    // });

    // it('MSCUIDateTime format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['MSCUIDateTime'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('26-Feb-2013 07:56');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('26-Feb-2013 07:56');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('26-Feb-2013 07:56');
    // });

    // it('MSCUITimeDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['MSCUITimeDate'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('07:56 26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('07:56 26-Feb-2013');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('07:56 26-Feb-2013');
    // });

    // it('MSCUIDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['MSCUIDate'];
    //     expect(formatFn).not.toBeNull();
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('26-Feb-2013');
    // });

    // it('DefaultDateTime format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['DefaultDateTime'];
    //     expect(formatFn).not.toBeNull();

    //     PointInTime.setDefaultPattern('MSCUIDateTime');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('26-Feb-2013 07:56');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('26-Feb-2013 07:56');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('26-Feb-2013 07:56');

    //     PointInTime.setDefaultPattern('CPRSTimeDate');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb 2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('Feb 26,13 07:56');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('Feb 26,13 07:56');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('Feb 26,13 07:56');

    //     PointInTime.setDefaultPattern('SortableDate');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('2013-02');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('2013-02-26 07:56');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('2013-02-26 07:56');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('2013-02-26 07:56');
    // });

    // it('DefaultTimeDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['DefaultTimeDate'];
    //     expect(formatFn).not.toBeNull();

    //     PointInTime.setDefaultPattern('MSCUIDateTime');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('07:56 26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('07:56 26-Feb-2013');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('07:56 26-Feb-2013');

    //     PointInTime.setDefaultPattern('CPRSTimeDate');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb 2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('07:56 Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('07:56 Feb 26,13');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('07:56 Feb 26,13');

    //     PointInTime.setDefaultPattern('SortableDate');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('2013-02');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('07:56 2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('07:56 2013-02-26');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('07:56 2013-02-26');
    // });

    // it('DefaultDate format function (precision-safe)', function () {
    //     var formatFn = Ext.Date.formatFunctions['DefaultDate'];
    //     expect(formatFn).not.toBeNull();

    //     PointInTime.setDefaultPattern('MSCUIDateTime');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('26-Feb-2013');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('26-Feb-2013');

    //     PointInTime.setDefaultPattern('CPRSTimeDate');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('Feb 2013');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('Feb 26,13');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('Feb 26,13');

    //     PointInTime.setDefaultPattern('SortableDate');
    //     expect(formatFn.call(PointInTime.parse('2013'))).toEqual('2013');
    //     expect(formatFn.call(PointInTime.parse('201302'))).toEqual('2013-02');
    //     expect(formatFn.call(PointInTime.parse('20130226'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('2013022607'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('201302260756'))).toEqual('2013-02-26');
    //     expect(formatFn.call(PointInTime.parse('20130226075612'))).toEqual('2013-02-26');
    //     expect(formatFn.call(new Date(2013, 1, 26, 7, 56, 12))).toEqual('2013-02-26');
    // });

    it('parse creates PointInTime instance', function () {
        var t = new PointInTime('20130226');
        expect(t instanceof PointInTime).toBe(true);
    });

    it('parse HL7 date strings with precision: year', function () {
        var t = new PointInTime('2013');
        expect(t.year).toEqual(2013);
        expect(t.month).toBeNull();
        expect(t.month).toBeNull();
        expect(t.date).toBeNull();
        expect(t.hour).toBeNull();
        expect(t.minute).toBeNull();
        expect(t.second).toBeNull();
        expect(t.millisecond).toBeNull();
        expect(t.timezoneOffset).toBeNull();
        expect(t.precision).toEqual(PointInTime.CONSTANTS.YEAR);
    });

    it('parse HL7 date strings with precision: month', function () {
        var t = new PointInTime('201302');
        expect(t.year).toEqual(2013);
        expect(t.month).toEqual(2);
        expect(t.date).toBeNull();
        expect(t.hour).toBeNull();
        expect(t.minute).toBeNull();
        expect(t.second).toBeNull();
        expect(t.millisecond).toBeNull();
        expect(t.timezoneOffset).toBeNull();
        expect(t.precision).toEqual(PointInTime.CONSTANTS.MONTH);
    });

    it('parse HL7 date strings with precision: date', function () {
        var t = new PointInTime('20130226');
        expect(t.year).toEqual(2013);
        expect(t.month).toEqual(2);
        expect(t.date).toEqual(26);
        expect(t.hour).toBeNull();
        expect(t.minute).toBeNull();
        expect(t.second).toBeNull();
        expect(t.millisecond).toBeNull();
        expect(t.timezoneOffset).toBeNull();
        expect(t.precision).toEqual(PointInTime.CONSTANTS.DAY);
    });

    it('parse HL7 date strings with precision: hour', function () {
        var t = new PointInTime('2013022607');
        expect(t.year).toEqual(2013);
        expect(t.month).toEqual(2);
        expect(t.date).toEqual(26);
        expect(t.hour).toEqual(7);
        expect(t.minute).toBeNull();
        expect(t.second).toBeNull();
        expect(t.millisecond).toBeNull();
        expect(t.timezoneOffset).toBeNull();
        expect(t.precision).toEqual(PointInTime.CONSTANTS.HOUR);
    });

    it('parse HL7 date strings with precision: minute', function () {
        var t = new PointInTime('201302260756');
        expect(t.year).toEqual(2013);
        expect(t.month).toEqual(2);
        expect(t.date).toEqual(26);
        expect(t.hour).toEqual(7);
        expect(t.minute).toEqual(56);
        expect(t.second).toBeNull();
        expect(t.millisecond).toBeNull();
        expect(t.timezoneOffset).toBeNull();
        expect(t.precision).toEqual(PointInTime.CONSTANTS.MINUTE);
    });

    it('parse HL7 date strings with precision: second', function () {
        var t = new PointInTime('20130226075645');
        expect(t.year).toEqual(2013);
        expect(t.month).toEqual(2);
        expect(t.date).toEqual(26);
        expect(t.hour).toEqual(7);
        expect(t.minute).toEqual(56);
        expect(t.second).toEqual(45);
        expect(t.millisecond).toBeNull();
        expect(t.timezoneOffset).toBeNull();
        expect(t.precision).toEqual(PointInTime.CONSTANTS.SECOND);
    });

    it('parse HL7 date strings with precision: millisecond', function () {
        var t = new PointInTime('20130226075645.654');
        expect(t.year).toEqual(2013);
        expect(t.month).toEqual(2);
        expect(t.date).toEqual(26);
        expect(t.hour).toEqual(7);
        expect(t.minute).toEqual(56);
        expect(t.second).toEqual(45);
        expect(t.millisecond).toEqual(654);
        expect(t.timezoneOffset).toBeNull();
        expect(t.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
    });

    it('parse HL7 date strings with timezoneOffset', function () {
        var t = new PointInTime('20130226075645.123-0700');
        expect(t.year).toEqual(2013);
        expect(t.month).toEqual(2);
        expect(t.date).toEqual(26);
        expect(t.hour).toEqual(7);
        expect(t.minute).toEqual(56);
        expect(t.second).toEqual(45);
        expect(t.millisecond).toEqual(123);
        expect(t.timezoneOffset).toEqual('-0700');
        expect(t.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
    });

    it('toString()', function () {
        expect(new PointInTime('2013').toString()).toEqual('2013');
        expect(new PointInTime('201302').toString()).toEqual('201302');
        expect(new PointInTime('20130226').toString()).toEqual('20130226');
        expect(new PointInTime('2013022607').toString()).toEqual('2013022607');
        expect(new PointInTime('201302260756').toString()).toEqual('201302260756');
        expect(new PointInTime('20130226075645').toString()).toEqual('20130226075645');
        expect(new PointInTime('20130226075645.123').toString()).toEqual('20130226075645.123');
        expect(new PointInTime('20130226075645.123-0600').toString()).toEqual('20130226075645.123-0600');
    });

    it('equality', function () {
        expect(new PointInTime('2013').equals(new PointInTime('2013'))).toBe(true);
        expect(new PointInTime('201302').equals(new PointInTime('201302'))).toBe(true);
        expect(new PointInTime('20130226').equals(new PointInTime('20130226'))).toBe(true);
        expect(new PointInTime('2013022607').equals(new PointInTime('2013022607'))).toBe(true);
        expect(new PointInTime('201302260756').equals(new PointInTime('201302260756'))).toBe(true);
        expect(new PointInTime('20130226075645').equals(new PointInTime('20130226075645'))).toBe(true);
        expect(new PointInTime('20130226075645.123').equals(new PointInTime('20130226075645.123'))).toBe(true);
        expect(new PointInTime('20130226075645.123-0600').equals(new PointInTime('20130226075645.123-0600'))).toBe(true);

        expect(new PointInTime('2013').equals('2013')).toBe(true);
        expect(new PointInTime('201302').equals('201302')).toBe(true);
        expect(new PointInTime('20130226').equals('20130226')).toBe(true);
        expect(new PointInTime('2013022607').equals('2013022607')).toBe(true);
        expect(new PointInTime('201302260756').equals('201302260756')).toBe(true);
        expect(new PointInTime('20130226075645').equals('20130226075645')).toBe(true);
        expect(new PointInTime('20130226075645.123').equals('20130226075645.123')).toBe(true);
        expect(new PointInTime('20130226075645.123-0600').equals('20130226075645.123-0600')).toBe(true);
    });

    it('inequality of value', function () {
        expect(new PointInTime('1975').equals(new PointInTime('1984'))).toBe(false);
        expect(new PointInTime('197507').equals(new PointInTime('197503'))).toBe(false);
        expect(new PointInTime('19750723').equals(new PointInTime('19750711'))).toBe(false);
        expect(new PointInTime('1975072310').equals(new PointInTime('1975072306'))).toBe(false);
        expect(new PointInTime('197507231054').equals(new PointInTime('197507231031'))).toBe(false);
        expect(new PointInTime('19750723105417').equals(new PointInTime('19750723105447'))).toBe(false);
        expect(new PointInTime('19750723105417.123').equals(new PointInTime('19750723105417.321'))).toBe(false);

        expect(new PointInTime('1975').equals('1984')).toBe(false);
        expect(new PointInTime('197507').equals('197503')).toBe(false);
        expect(new PointInTime('19750723').equals('19750711')).toBe(false);
        expect(new PointInTime('1975072310').equals('1975072306')).toBe(false);
        expect(new PointInTime('197507231054').equals('197507231031')).toBe(false);
        expect(new PointInTime('19750723105417').equals('19750723105447')).toBe(false);
        expect(new PointInTime('19750723105417.123').equals('19750723105417.321')).toBe(false);
    });

    it('inequality of precision', function () {
        var times = [
            new PointInTime('1975'),
            new PointInTime('197507'),
            new PointInTime('19750723'),
            new PointInTime('1975072310'),
            new PointInTime('197507231054'),
            new PointInTime('19750723105441'),
            new PointInTime('19750723105441.675')
        ];

        _.each(times, function(time) {
        	_.each(times, function (innerTime) {
        		if (innerTime !== time) {
        			expect(time.equals(innerTime)).toBe(false);
        		} else {
        			expect(time.equals(innerTime)).toBe(true);
        		}
        	});
        });
    });

    it('comparison of same precision', function () {
        var t1 = new PointInTime('19750723');
        var t2 = new PointInTime('19840311');
        expect(t1.compareTo(t2)).toBeLessThan(0);
        expect(t2.compareTo(t1)).toBeGreaterThan(0);

        t1 = new PointInTime('197507231030');
        t2 = new PointInTime('198407231030');
        expect(t1.compareTo(t2)).toBeLessThan(0);
        expect(t2.compareTo(t1)).toBeGreaterThan(0);

        t1 = new PointInTime('1984072210');
        t2 = new PointInTime('1984072310');
        expect(t1.compareTo(t2)).toBeLessThan(0);
        expect(t2.compareTo(t1)).toBeGreaterThan(0);

        t1 = new PointInTime('1984072310');
        t2 = new PointInTime('1984072310');
        expect(t1.compareTo(t2)).toEqual(0);
        expect(t2.compareTo(t1)).toEqual(0);
    });

    it('comparison of different precisions', function () {
        var t1 = new PointInTime('19750723');
        var t2 = new PointInTime('1984031110');
        expect(t1.compareTo(t2)).toBeLessThan(0);
        expect(t2.compareTo(t1)).toBeGreaterThan(0);

        t1 = new PointInTime('200412161800');
        t2 = new PointInTime('20041216180001');
        expect(t1.compareTo(t2)).toBeLessThan(0);
        expect(t2.compareTo(t1)).toBeGreaterThan(0);

        t1 = new PointInTime('20041215');
        t2 = new PointInTime('20041216180001');
        expect(t1.compareTo(t2)).toBeLessThan(0);
        expect(t2.compareTo(t1)).toBeGreaterThan(0);

        t1 = new PointInTime('20041217');
        t2 = new PointInTime('200412161800');
        expect(t1.compareTo(t2)).toBeGreaterThan(0);
        expect(t2.compareTo(t1)).toBeLessThan(0);
    });

    it('comparison with null', function () {
        var t1 = new PointInTime('19750723');
        expect(t1.compareTo(null)).toBeGreaterThan(0);
    });

    it('before()', function () {
        var t1 = new PointInTime('19750724');
        var t2 = new PointInTime('19750723');
        expect(t2.before(t1)).toBe(true);
        expect(t1.before(t2)).toBe(false);
        expect(t2.before(t2)).toBe(false);
    });

    it('after()', function () {
        var t1 = new PointInTime('19750723');
        var t2 = new PointInTime('19750724');
        expect(t2.after(t1)).toBe(true);
        expect(t1.after(t2)).toBe(false);
        expect(t2.after(t2)).toBe(false);
    });

    it('lessPrecise()', function () {
        var t1 = new PointInTime('200412161800');
        var t2 = new PointInTime('20041216180001');
        expect(PointInTime.lessPrecise(t1, t2)).toBe(t1);
    });

    it('mostPrecise()', function () {
        var t1 = new PointInTime('200412161800');
        var t2 = new PointInTime('20041216180001');
        expect(PointInTime.mostPrecise(t1, t2)).toBe(t2);
    });

    it('promote year precision', function () {
        var t = new PointInTime('1975');
        var i = t.promote();
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750101000000.000');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19760101000000.000');
    });

    it('promote month precision', function () {
        var t = new PointInTime('197507');
        var i = t.promote();
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750701000000.000');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19750801000000.000');
    });

    it('promote date precision', function () {
        var t = new PointInTime('19750723');
        var i = t.promote();
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750723000000.000');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19750724000000.000');
    });

    it('promote hour precision', function () {
        var t = new PointInTime('1975072310');
        var i = t.promote();
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750723100000.000');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19750723110000.000');
    });

    it('promote minute precision', function () {
        var t = new PointInTime('197507231042');
        var i = t.promote();
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750723104200.000');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19750723104300.000');
    });

    it('promote second precision', function () {
        var t = new PointInTime('19750723104215');
        var i = t.promote();
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750723104215.000');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19750723104216.000');
    });

    it('promote millisecond precision', function () {
        var t = new PointInTime('19750723104215.532');
        var i = t.promote();
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750723104215.532');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19750723104215.533');
    });
});
