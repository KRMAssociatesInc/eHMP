'use strict';

//-----------------------------------------------------------------------
// This tests the IntervalOfTime.js class.  Most of this code was pulled
// from the previous EHMP solution and converted to run against our
// framework.
//
// Author: Les Westberg
//-----------------------------------------------------------------------

require('../../../env-setup');

var IntervalOfTime = require(global.VX_UTILS + 'IntervalOfTime');
var PointInTime = require(global.VX_UTILS + 'PointInTime');
var moment = require('moment');

describe('IntervalOfTime', function () {

    it('create with same precision', function() {
        var t1 = new PointInTime('19750723');
        var t2 = new PointInTime('19810812');

        var i = new IntervalOfTime(t1, t2);
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.toString()).toEqual('[19750723000000.000;19810813000000.000[');
        expect(i.low).not.toBe(t1);
        expect(i.high).not.toBe(t2);
        expect(i.low.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.low.toString()).toEqual('19750723000000.000');
        expect(i.high.precision).toEqual(PointInTime.CONSTANTS.MILLISECOND);
        expect(i.high.toString()).toEqual('19810813000000.000');
    });

    it('toDateRange()', function () {
        var t1 = new PointInTime('19750723');
        var t2 = new PointInTime('19810812');

        var i = new IntervalOfTime(t1, t2);
        var dateRange = i.toDateRange();

        expect(dateRange.length).toEqual(2);

        expect(moment.isMoment(dateRange[0])).toBe(true);
        expect(moment.isMoment(dateRange[1])).toBe(true);

        expect(dateRange[0].year()).toEqual(1975);
        expect(dateRange[0].month()).toEqual(6);
        expect(dateRange[0].date()).toEqual(23);
        expect(dateRange[0].hour()).toEqual(0);
        expect(dateRange[0].minute()).toEqual(0);
        expect(dateRange[0].second()).toEqual(0);
        expect(dateRange[0].millisecond()).toEqual(0);

        expect(dateRange[1].year()).toEqual(1981);
        expect(dateRange[1].month()).toEqual(7);
        expect(dateRange[1].date()).toEqual(13);
        expect(dateRange[1].hour()).toEqual(0);
        expect(dateRange[1].minute()).toEqual(0);
        expect(dateRange[1].second()).toEqual(0);
        expect(dateRange[1].millisecond()).toEqual(0);
    });
});