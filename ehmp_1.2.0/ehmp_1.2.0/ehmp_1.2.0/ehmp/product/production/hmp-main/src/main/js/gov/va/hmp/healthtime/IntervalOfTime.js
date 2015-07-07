/**
 * Models HL7 interval of time stamps (IVL_TS) data type, which describes a low value time stamp, which is usually a
 * "start" time, a high value time stamp, which is usually a "stop" or "end" time, and the interval between,
 * either as a "width" (value and units) or center point time stamp.
 *
 * Each endpoint of the interval are guaranteed to be millisecond precision so one can "promote" imprecise PointInTime
 * instances into an IntervalOfTime that can be used for date/time comparison and/or calculation
 */
Ext.define('gov.va.hmp.healthtime.IntervalOfTime', {
    alternateClassName: ['IntervalOfTime'],
    /**
     * @property {Boolean} isIntervalOfTime
     * @readonly
     * `true` in this class to identify an object as an instantiated PointInTime.
     */
    isIntervalOfTime: true,
    /**
     * @property {gov.va.hmp.healthtime.PointInTime}
     * @readonly
     */
    low: null,
    /**
     * @property {gov.va.hmp.healthtime.PointInTime}
     * @readonly
     */
    high: null,
    /**
     * @property {Boolean}
     * @readonly
     */
    lowClosed: false,
    /**
     * @property {Boolean}
     * @readonly
     */
    highClosed: false,
    constructor: function (config) {
        if (!config.low) throw new Error("Expected 'low' to be set");
        if (!config.high) throw new Error("Expected 'high' to be set");

        if (PointInTime.isPointInTime(config.low) && PointInTime.isPointInTime(config.high)) {
            if (config.low.after(config.high)) {
                this.setLow(config.high);
                this.setHigh(config.low);
            } else {
                this.setLow(config.low);
                this.setHigh(config.high);
            }
        }

        if (config.lowClosed) {
            this.lowClosed = config.lowClosed;
        }
        if (config.highClosed) {
            this.highClosed = config.highClosed;
        }

        var equalEndpointsAllowed = config.equalEndpointsAllowed ? config.equalEndpointsAllowed : false;
        if (this.high.equals(this.low) && !equalEndpointsAllowed) {
            throw new Error("The end point should be unequal to the low point in time when equalEndpointsAllowed is false");
        }

        this.callParent(arguments);
    },
    contains: function(t) {
       if (PointInTime.isPointInTime(t)) {
           return this.contains(t.promote());
       } else if (IntervalOfTime.isIntervalOfTime(t)) {
           return this.low.before(t.low) && this.high.after(t.high);
       } else {
           throw new Error('argument to contains() must be a PointInTime or IntervalOfTime instance');
       }
    },
    toString: function() {
        var s = this.lowClosed ? '[' : ']';
        s += this.low.toString();
        s += ';';
        s += this.high.toString();
        s += this.highClosed ? ']' : '[';
        return s;
    },
    /**
     *
     * @returns {Array}
     */
    toDateRange:function() {
        return [this.low.toDate(), this.high.toDate()];
    },
    /**
     * @private
     * @param low
     */
    setLow: function(low) {
        if (low.precision === Ext.Date.MILLI) {
            this.low = low.clone();
        } else {
            this.low = low.promote().low;
        }
    },
    /**
     * @private
     * @param high
     */
    setHigh: function(high) {
        if (high.precision === Ext.Date.MILLI) {
            this.high = high.clone();
        } else {
            this.high = high.promote().high;
        }
    },
    statics: {
        isIntervalOfTime: function (obj) {
            return obj && obj.isIntervalOfTime;
        },
        create:function(low, high, lowClosed, highClosed, equalEndpointsAllowed) {
            if(typeof(lowClosed)==='undefined') lowClosed = true;
            if(typeof(highClosed)==='undefined') highClosed = false;
            if(typeof(equalEndpointsAllowed)==='undefined') equalEndpointsAllowed = false;
            return Ext.create('gov.va.hmp.healthtime.IntervalOfTime', {
                low: low,
                high: high,
                lowClosed: lowClosed,
                highClosed: highClosed,
                equalEndpointsAllowed: equalEndpointsAllowed
            });
        }
    }
});
