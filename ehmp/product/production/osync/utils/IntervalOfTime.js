'use strict';

//-------------------------------------------------------------------------------------
// This class represents an IntervalOfTime object.  It can be used when you need a low
// and high time or a time range.  This is a subset of the IntervalOfTime
// class that was part of the original HMP system.  The part that was pulled - 
// had to be altered to not use the Ext framework.
//
// Author: Les Westberg
//-------------------------------------------------------------------------------------
require('../env-setup');

var _ = require('underscore');

//-------------------------------------------------------------------------------------
// BECAUSE OF A CIRCULAR REFERENCE BETWEEN IntervalOfTime and PointInTime THERE IS A
// PROBLEM WHEN YOU PUT THIS EXPORTS AT THE END OF THIS FILE.  IT MUST BE DONE BEFORE
// THE REQUIRE... OF THE CIRCULAR DEPENDENCY.   SO IT MUST REMAIN HERE!!!!!
//-------------------------------------------------------------------------------------
module.exports = IntervalOfTime;
var PointInTime = require(global.OSYNC_UTILS + 'PointInTime');

//-------------------------------------------------------------------------------------
// Constructor
//
// low:  PointInTime of the low side of the interval.
// high: PointInTime of the high side of the interval.
// lowClosed: Is the lower endpoint closed or open.
// highClosed: Is the higher endpoint closed or open.
// equalEndpointsAllowed: True if the low and high can be the same.  False if they
//                        cannot be the same.
//------------------------------------------------------------------------------------
function IntervalOfTime(low, high, lowClosed, highClosed, equalEndpointsAllowed) {
	// console.log('IntervalOfTime.constructor: Entered method.  low: %j; high: %j; equalEndpointsAllowed: %s', low, high, equalEndpointsAllowed);

	if (!(this instanceof IntervalOfTime)) {
		return new IntervalOfTime(low, high, equalEndpointsAllowed);
	}

	// console.log('IntervalOfTime.constructor: Checkpoint 1.  self: %j', this);


	if ((!low) || (!(low instanceof PointInTime))) {
		throw new Error('Expected \'low\' to be a PointInTime and be set');
	}

	// console.log('IntervalOfTime.constructor: Checkpoint 2.  self: %j', this);

	if ((!high) || (!(high instanceof PointInTime))) {
		throw new Error('Expected \'high\' to be a PointInTime and be set');
	}

	// console.log('IntervalOfTime.constructor: Checkpoint 3.  self: %j', this);

	// Make sure the low is really the low and the high is really the high.
	//---------------------------------------------------------------------
	this.low = null;
	this.high = null;
	this.lowClosed = false;
	this.highClosed = false;

	if ((_.isUndefined(lowClosed)) || (_.isNull(lowClosed))) {
		this.lowClosed = true;
	}

	if ((highClosed !== undefined) && (highClosed !== null)) {
		this.highClosed = highClosed;
	}

	// console.log('IntervalOfTime.constructor: Checkpoint 4.  self: %j', this);

	if (low.after(high)) {
		this.setLow(high);
		this.setHigh(low);
	} else {
		this.setLow(low);
		this.setHigh(high);
	}

	// console.log('IntervalOfTime.constructor: Checkpoint 5.  low: %j; high: %j; equalEndpointsAllowed: %s', low, high, equalEndpointsAllowed);

	if ((high.equals(low)) && (!equalEndpointsAllowed)) {
		throw new Error('The end point should be unequal to the low point in time when equalEndpointsAllowed is false');
	}

	// console.log('IntervalOfTime.constructor: After setting data.  low: %j; high: %j; equalEndpointsAllowed: %s', low, high, equalEndpointsAllowed);

}

//-------------------------------------------------------------------------
// This method sets the low value to a clone of the passed in PointInTime
// promoted to millisecond.
//
// low: The point in time to set to the low value.
//-------------------------------------------------------------------------
IntervalOfTime.prototype.setLow = function(low) {
	var self = this;

	// console.log('IntervalOfTime.setLow: self: %j; low: %j', self, low);

	if (low.precision === PointInTime.CONSTANTS.MILLISECOND) {
		self.low = new PointInTime(low);
	} else {
		self.low = (new PointInTime(low)).promote().low;
	}
};

//-------------------------------------------------------------------------
// This method sets the high value to a clone of the passed in PointInTime
// promoted to millisecond.
//
// low: The point in time to set to the high value.
//-------------------------------------------------------------------------
IntervalOfTime.prototype.setHigh = function(high) {
	var self = this;

	// console.log('IntervalOfTime.setHigh: self: %j; high: %j', self, high);

	if (high.precision === PointInTime.CONSTANTS.MILLISECOND) {
		self.high = new PointInTime(high);
	} else {
		self.high = (new PointInTime(high)).promote().high;
	}
};

//-------------------------------------------------------------------------
// This method checks to see if the given time or interval is contained
// within our time interval.
//
// t:  This is either a PointInTime or an IntervalOfTime
// returns:  TRUE if the given parameter is wholly contained within our
//           time interval.
//-------------------------------------------------------------------------
IntervalOfTime.prototype.contains = function(t) {
	var self = this;

	if (t instanceof PointInTime) {
		return self.contains(t.promote());
	} else if (t instanceof IntervalOfTime) {
		return self.low.before(t.low) && self.high.after(t.high);
	} else {
		throw new Error('argument to contains() must be a PointInTime or IntervalOfTime instance');
	}
};


//------------------------------------------------------------------------
// This method outputs the string form of this IntervalOfTime.
//
// returns: The string form of this interval of time.
//------------------------------------------------------------------------
IntervalOfTime.prototype.toString = function() {
	var self = this;

	var s = self.lowClosed ? '[' : ']';
	s += self.low.toString();
	s += ';';
	s += self.high.toString();
	s += self.highClosed ? ']' : '[';
	return s;
};

//------------------------------------------------------------------------
// This method outputs the date range form of this IntervalOfTime.  Which
// is an array of two dates a low date and a high date.
//
// returns: The the array of [low, high] representing this interval.
//------------------------------------------------------------------------
IntervalOfTime.prototype.toDateRange = function() {
	var self = this;
	return [self.low.toDate(), self.high.toDate()];
};



//---------------------------------------------------------------------------------------
// BECAUSE OF A CIRCULAR REFERENCE BETWEEN IntervalOfTime and PointInTime THERE IS A
// PROBLEM WHEN YOU PUT THIS EXPORTS AT THE END OF THIS FILE.  IT MUST BE DONE BEFORE
// THE REQUIRE... OF THE CIRCULAR DEPENDENCY.   SO IT MUST NOT BE HERE - IT IS AT THE TOP
// OF THIS FILE!!!!!
//---------------------------------------------------------------------------------------
//module.exports = IntervalOfTime;