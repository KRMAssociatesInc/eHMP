Ext.require('gov.va.hmp.healthtime.IntervalOfTime');

describe("gov.va.hmp.healthtime.IntervalOfTimeTests", function () {

    it("create with same precision", function() {
        var t1 = PointInTime.parse("19750723");
        var t2 = PointInTime.parse("19810812");

        var i = IntervalOfTime.create(t1, t2);
        expect(i.lowClosed).toBe(true);
        expect(i.highClosed).toBe(false);
        expect(i.toString()).toEqual("[19750723000000.000;19810813000000.000[");
        expect(i.low).not.toBe(t1);
        expect(i.high).not.toBe(t2);
        expect(i.low.precision).toEqual(Ext.Date.MILLI);
        expect(i.low.toString()).toEqual("19750723000000.000");
        expect(i.high.precision).toEqual(Ext.Date.MILLI);
        expect(i.high.toString()).toEqual("19810813000000.000");
    });

    it("toDateRange()", function () {
        var t1 = PointInTime.parse("19750723");
        var t2 = PointInTime.parse("19810812");

        var i = IntervalOfTime.create(t1, t2);
        var dateRange = i.toDateRange();

        expect(dateRange.length).toEqual(2);
        expect(dateRange[0] instanceof Date).toBe(true);
        expect(dateRange[1] instanceof Date).toBe(true);

        expect(dateRange[0].getFullYear()).toEqual(1975);
        expect(dateRange[0].getMonth()).toEqual(6);
        expect(dateRange[0].getDate()).toEqual(23);
        expect(dateRange[0].getHours()).toEqual(0);
        expect(dateRange[0].getMinutes()).toEqual(0);
        expect(dateRange[0].getSeconds()).toEqual(0);
        expect(dateRange[0].getMilliseconds()).toEqual(0);

        expect(dateRange[1].getFullYear()).toEqual(1981);
        expect(dateRange[1].getMonth()).toEqual(7);
        expect(dateRange[1].getDate()).toEqual(13);
        expect(dateRange[1].getHours()).toEqual(0);
        expect(dateRange[1].getMinutes()).toEqual(0);
        expect(dateRange[1].getSeconds()).toEqual(0);
        expect(dateRange[1].getMilliseconds()).toEqual(0);
    });
});