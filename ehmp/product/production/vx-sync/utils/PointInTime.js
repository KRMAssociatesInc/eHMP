'use strict';

//----------------------------------------------------------------------------------
// This class represents a PointInTime object.  This is a subset of the PointInTime
// class that was part of the original HMP system.  The part that was pulled - 
// had to be altered to not use the Ext framework.
//
// Author: Les Westberg
//-----------------------------------------------------------------------------------
require('../env-setup');

var _ = require('underscore');
var moment = require('moment');
var stringUtil = require(global.VX_UTILS + 'string-utils');

//-------------------------------------------------------------------------------------
// BECAUSE OF A CIRCULAR REFERENCE BETWEEN IntervalOfTime and PointInTime THERE IS A
// PROBLEM WHEN YOU PUT THIS EXPORTS AT THE END OF THIS FILE.  IT MUST BE DONE BEFORE
// THE REQUIRE... OF THE CIRCULAR DEPENDENCY.   SO IT MUST REMAIN HERE!!!!!
//-------------------------------------------------------------------------------------
module.exports = PointInTime;
var IntervalOfTime = require(global.VX_UTILS + 'IntervalOfTime');

var CONSTANTS = {
	YEAR: 1,
	MONTH: 2,
	DAY: 3,
	HOUR: 4,
	MINUTE: 5,
	SECOND: 6,
	MILLISECOND: 7
};


//-------------------------------------------------------------------------------------------------------
// Variadic Constructor.
//
//	PointInTime(hl7DateTime)
//      hl7DateTime:  Is a string that represents a date or a dateTime.  It is in the format
//                    of 'yyyyMMdd' for date and 'yyyyMMddHHmmss' for dateTime.
//
//  PointInTime(pointInTimeObject)
//      pointInTimeObejct:  Is another point in time object.  This essentially makes a clone of the
//                          passed in object.
//
//  PointInTime(dateTimeObject)
//		dateTimeObject:  This is an object that contains the discrete fields of the 
//                       date and time.  The following is an example of the object:
//						{
//                           year: 2012,
//                           month: 10,          // valid: 0-11
//                           date: 12,           // valid: 1-31
//                           hour: 10,           // valid: 0-23
//                           minute: 12,         // valid: 0-59
//                           second: 10,         // valid: 0-59
//                           millisecond: 100,   // valid: 0-999
//                           timezoneOffset: 0   // Difference between UTC tie and local time in minutes
//                      }
//
//-------------------------------------------------------------------------------------------------------
function PointInTime(theDateTime) {
	if (!(this instanceof PointInTime)) {
		return new PointInTime(theDateTime);
	}

	// console.log('PointInTime.constructor:  Entered method.  theDateTime: %s; theDateTime: %j', theDateTime, theDateTime);

	this.patterns = {
		HL7: 'yyyyMMddHHmmss',
		HL7Date: 'yyyyMMdd'
	};

	this.year = null;
	this.month = null;			// format 1-12
	this.date = null;
	this.hour = null;
	this.minute = null;
	this.second = null;
	this.millisecond = null;
	this.timezoneOffset = null;
	this.precision = null;
	this.hl7String = null;

	if (typeof theDateTime === 'string') {
		setTimeFieldsFromHl7DateTime(this, theDateTime);
		this.hl7String = theDateTime;
	} else if (theDateTime instanceof PointInTime) {
		this.year = theDateTime.year;
		this.month = theDateTime.month;
		this.date = theDateTime.date;
		this.hour = theDateTime.hour;
		this.minute = theDateTime.minute;
		this.second = theDateTime.second;
		this.millisecond = theDateTime.millisecond;
		this.timezoneOffset = theDateTime.timezoneOffset;
		this.precision = theDateTime.precision;
		this.hl7String = theDateTime.hl7String;
	} else if (typeof theDateTime === 'object') {
		// console.log('PointInTime.constructor: theDateTime: %j', theDateTime)
		setTimeFields(this, theDateTime);
		this.hl7String = getHl7String(this);
	} else {
		throw new Error('Time can only be created with a valid HL7 time or a time object.');
	}
}

//------------------------------------------------------------------------------------
// This method sets the time fields from an HL7 date time string.
//
// self: A pointer to the this pointer.
// hl7DateTime: The HL7 date time string.
//------------------------------------------------------------------------------------
function setTimeFieldsFromHl7DateTime(self, hl7DateTime) {
	if (!hl7DateTime) {
		return;
	}

	// Split dateTime string to date/time token, milliseconds and zone
	//-----------------------------------------------------------------
	var parts = hl7DateTime.match(/(\d{3,14})(\.(\d{1,3}))?([+\-].*)?/);
	var dt = parts[1];

	// Extract all fields based on position
	//-------------------------------------
	var theDateTime = {};
	theDateTime.year = parseInt(dt.slice(0, 4));
	if (dt.length >= 4) {
		var month = stringUtil.nullSafeSliceAndParseInt(dt, 4, 6);
		if (_.isFinite(month)) {
			month -= 1;		// Make it a zero based month
		}
		theDateTime.month = month;
		self.precision = CONSTANTS.MONTH;
	}
	if (dt.length >= 6) {
		theDateTime.date = stringUtil.nullSafeSliceAndParseInt(dt, 6, 8);
		self.precision = CONSTANTS.DAY;
	}
	if (dt.length >= 8) {
		theDateTime.hour = stringUtil.nullSafeSliceAndParseInt(dt, 8, 10);
		self.precision = CONSTANTS.HOUR;
	}
	if (dt.length >= 10) {
		theDateTime.minute = stringUtil.nullSafeSliceAndParseInt(dt, 10, 12);
		self.precision = CONSTANTS.MINUTE;
	}
	if (dt.length >= 12) {
		theDateTime.second = stringUtil.nullSafeSliceAndParseInt(dt, 12, 14);
		self.precision = CONSTANTS.SECOND;
	}
	if (_.isFinite(parts[3])) {
		theDateTime.millisecond = stringUtil.nullSafeSliceAndParseInt(parts[3]);
		self.precision = CONSTANTS.MILLISECOND;
	}
	if (_.isFinite(parts[4])) {
		theDateTime.timezoneOffset = parts[4];
	}
	setTimeFields(self, theDateTime);
}

//------------------------------------------------------------------------------------
// This method sets the time fields from a time object.
//
// self: A pointer to the this pointer.
// theDateTime: The time object containing the individual time field values.
//------------------------------------------------------------------------------------
function setTimeFields(self, theDateTime) {
	if (!_.isFinite(theDateTime.year)) {
		throw new Error('Expected \'year\' to be set');
	}

	self.year = theDateTime.year;
	self.precision = CONSTANTS.YEAR;

	if (_.isFinite(theDateTime.month)) {
		self.month = theDateTime.month + 1;
		self.precision = CONSTANTS.MONTH;
	}
	if (_.isFinite(theDateTime.date)) {
		self.date = theDateTime.date;
		self.precision = CONSTANTS.DAY;
	}
	if (_.isFinite(theDateTime.hour)) {
		self.hour = theDateTime.hour;
		self.precision = CONSTANTS.HOUR;
	}
	if (_.isFinite(theDateTime.minute)) {
		self.minute = theDateTime.minute;
		self.precision = CONSTANTS.MINUTE;
	}
	if (_.isFinite(theDateTime.second)) {
		self.second = theDateTime.second;
		self.precision = CONSTANTS.SECOND;
	}
	if (_.isFinite(theDateTime.millisecond)) {
		self.millisecond = theDateTime.millisecond;
		self.precision = CONSTANTS.MILLISECOND;
	}
	if (theDateTime.timezoneOffset) {
		self.timezoneOffset = theDateTime.timezoneOffset;
	}
}

//----------------------------------------------------------------------------------------
// This method calculates the HL7 string off the set of discrete values.
//
// self: A pointer to the this pointer.
// returns: formatted HL7 time string
//----------------------------------------------------------------------------------------
function getHl7String(self) {
	var hl7TextString = '';

	if (_.isFinite(self.year)) {
		hl7TextString += String(self.year);
	}
	if (_.isFinite(self.month)) {
		hl7TextString += stringUtil.leftPad(self.month, 2, '0');
	}
	if (_.isFinite(self.date)) {
		hl7TextString += stringUtil.leftPad(self.date, 2, '0');
	}
	if (_.isFinite(self.hour)) {
		hl7TextString += stringUtil.leftPad(self.hour, 2, '0');
	}
	if (_.isFinite(self.minute)) {
		hl7TextString += stringUtil.leftPad(self.minute, 2, '0');
	}
	if (_.isFinite(self.second)) {
		hl7TextString += stringUtil.leftPad(self.second, 2, '0');
	}
	if (_.isFinite(self.millisecond)) {
		hl7TextString += '.' + stringUtil.leftPad(self.millisecond, 3, '0');
	}
	if (_.isString(self.timezoneOffset)) {
		hl7TextString += self.timezoneOffset;
	}
	return (hl7TextString);
}

//--------------------------------------------------------------------------------------------
// This method compares the passed in dateTime to the one within this object.  If the one
// within this object is before the passed in one, then it returns true.  If it is on or
// after, it returns false.  NOTE:  This accounts for precision in the two times.  So if the
// precision is different, it will normalize things to account.  This means that it will treat
// a fuzzy time as a time interval and compare the "low" time of the time interval.
//
// otherDateTime: The other date and time to be compared to.
// returns: True if the time in this object is before the otherDateTime.
//--------------------------------------------------------------------------------------------
PointInTime.prototype.before = function(otherDateTime) {
	var self = this;

	if (_.isString(otherDateTime)) {
		return self.before(new PointInTime(otherDateTime));
	} else if (otherDateTime instanceof PointInTime) {
		return self.compareTo(otherDateTime) < 0;
	} else {
		return false;
	}
};

//--------------------------------------------------------------------------------------------
// This method compares the passed in dateTime to the one within this object.  If the one
// within this object is after the passed in one, then it returns true.  If it is on or
// before, it returns false.  NOTE:  This accounts for precision in the two times.  So if the
// precision is different, it will normalize things to account.  This means that it will treat
// a fuzzy time as a time interval and compare the "high" time of the time interval.
//
// otherDateTime: The other date and time to be compared to.
// returns: True if the time in this object is after the otherDateTime.
//--------------------------------------------------------------------------------------------
PointInTime.prototype.after = function(otherDateTime) {
	var self = this;

	if (otherDateTime instanceof PointInTime) {
		return self.compareTo(otherDateTime) > 0;
	} else if (_.isString(otherDateTime)) {
		return self.after(new PointInTime(otherDateTime));
	} else {
		return false;
	}
};


//--------------------------------------------------------------------------------------------
// Compares this PointInTime instance to the specified `other` PointInTime.  If the time in this
// object is less than the parameter then -1 is returned. If they are the same then 0 is returned,
// if greater than, then 1 is returned.
//
// otherDateTime: The other PointInTime to which to compare.
// returns: {Number} -1 if this version is less than the target PointInTime, 1 if this
// PointInTime is greater, and 0 if they are equal.
//--------------------------------------------------------------------------------------------
PointInTime.prototype.compareTo = function(otherDateTime) {
	var self = this;
	// console.log('PointInTime.compareTo: self: %j, otherDateTime: %j', self, otherDateTime);

	if ((otherDateTime === null) || (otherDateTime === undefined)) {
		return 1;
	}

	if (otherDateTime instanceof PointInTime) {
		if (self.precision === otherDateTime.precision) {
			return self.toString().localeCompare(otherDateTime.toString());
		} else {
			var leastPrecise = PointInTime.lessPrecise(self, otherDateTime);
			var mostPrecise = PointInTime.mostPrecise(self, otherDateTime);
			// console.log('PointInTime.compareTo: leastPrecise: %j, mostPrecise: %j', leastPrecise, mostPrecise);

			var i = leastPrecise.promote();
			// console.log('PointInTime.compareTo: Interval on the leastPrecise object.  i: %j', i);
			if (i.contains(mostPrecise)) {
				var l1 = self.toString().length;
				var l2 = otherDateTime.toString().length;
				if (l1 > l2) {
					return 1;
				} else if (l1 < l2) {
					return -1;
				} else {
					return 0;
				}
			}

			var lcd = mostPrecise.toPrecision(leastPrecise.precision);
			// console.log('PointInTime.compareTo: Changing precision leastPrecise.precision: %s; mostPrecise.precision %s; lcd: %j', leastPrecise.precision, mostPrecise.precision, lcd);
			if (self === leastPrecise) {
				// console.log('PointInTime.compareTo: self.compareTo(lcd): self: %j; lcd: %j', self, lcd);
				return self.compareTo(lcd);
			} else {
				// console.log('PointInTime.compareTo: lcd.compareTo(leastPrecise): lcd: %j; leastPrecise: %j', lcd, leastPrecise);
				return lcd.compareTo(leastPrecise);
			}
		}
	} else if (_.isString(otherDateTime)) {
		return this.compareTo(new PointInTime(otherDateTime));
	} else {
		throw new Error('argument to compareTo() must be a String or a PointInTime instance');
	}
};

//--------------------------------------------------------------------------------------------
// This forces the PointInTime to a specific precision.  It defaults values that are not set.
//
// precision: The precision to force this time to be.
// returns:  The new PointInTime that is moved to the new precision
//---------------------------------------------------------------------------------------------
PointInTime.prototype.toPrecision = function(precision) {
	var self = this;
	// console.log('PointInTime.toPrecision: precision: %s; self: %j, ', precision, self);

	if (precision === self.precision) {
		// console.log('PointInTime.toPrecision: The precision was the same as desired...');
		return new PointInTime(self);
	}

	// console.log('PointInTime.toPrecision: The precision was not the same as desired...');

	var dt = moment({
		year: self.year,
		month: (_.isFinite(self.month)) ? self.month - 1 : null,
		date: self.date,
		hour: self.hour,
		minute: self.minute,
		second: self.second,
		millisecond: self.millisecond
	});

	// console.log('PointInTime.toPrecision: before switch.  dt: %s', dt);
	var timeObject = {};


	switch (precision) {
		case CONSTANTS.MILLISECOND:
			timeObject = {
				year: dt.year(),
				month: dt.month(),
				date: dt.date(),
				hour: dt.hour(),
				minute: dt.minute(),
				second: dt.second(),
				millisecond: dt.millisecond()
			};
			// console.log('PointInTime.toPrecision: MILLISECOND CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
		case CONSTANTS.SECOND:
			timeObject = {
				year: dt.year(),
				month: dt.month(),
				date: dt.date(),
				hour: dt.hour(),
				minute: dt.minute(),
				second: dt.second()
			};
			// console.log('PointInTime.toPrecision: SECOND CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
		case CONSTANTS.MINUTE:
			timeObject = {
				year: dt.year(),
				month: dt.month(),
				date: dt.date(),
				hour: dt.hour(),
				minute: dt.minute()
			};
			// console.log('PointInTime.toPrecision: MINUTE CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
		case CONSTANTS.HOUR:
			timeObject = {
				year: dt.year(),
				month: dt.month(),
				date: dt.date(),
				hour: dt.hour()
			};
			// console.log('PointInTime.toPrecision: HOUR CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
		case CONSTANTS.DAY:
			timeObject = {
				'year': dt.year(),
				'month': dt.month(),
				'date': dt.date()
			};
			// console.log('PointInTime.toPrecision: DAY CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
		case CONSTANTS.MONTH:
			timeObject = {
				year: dt.year(),
				month: dt.month()
			};
			// console.log('PointInTime.toPrecision: MONTH CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
		case CONSTANTS.YEAR:
			timeObject = {
				year: dt.year()
			};
			// console.log('PointInTime.toPrecision: YEAR CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
		default:
			timeObject = {
				year: dt.year
			};
			// console.log('PointInTime.toPrecision: DEFAULT CASE - reating PointInTime with timeObject: %j', timeObject);
			return new PointInTime(timeObject);
	}
};

//--------------------------------------------------------------------------------------------------
// Promotes this PointInTime to an IntervalOfTime with both endpoints at second
// precision.  Used to convert an imprecise date/time into a precise date range.
//
// returns: the IntervalOfTime that was creataed.
//--------------------------------------------------------------------------------------------------
PointInTime.prototype.promote = function() {
	var self = this;
	// console.log('PointInTime.promote: Entered Method.  self: %j', self);

	var low = self.createLow();
	var high = self.createHigh();

	// console.log('PointInTime.promote: Before creating IntervalOfTime.  self: %j; low: %j; high: %j', self, low, high);

	var interval = new IntervalOfTime(low, high);

	// console.log('PointInTime.promote: After creating IntervalOfTime.  self: %j; low: %j; high: %j; interval: %j', self, low, high, interval);

	return interval;
};

//--------------------------------------------------------------------------------------------------
// Creates a full prescision PointInTime object from one that is not full precision using default
// values on the lower part of the precision.
//
// returns: the PointInTime that was creataed.
//--------------------------------------------------------------------------------------------------
PointInTime.prototype.createLow = function() {
	var self = this;

	var dateTimeObject = {
		year: self.year,
		month: self.month - 1,
		date: self.date,
		hour: self.hour,
		minute: self.minute,
		second: self.second,
		millisecond: self.millisecond
			// millisecond: self.millisecond
	};
	if (!_.isFinite(self.month)) {
		dateTimeObject.month = 0;
	}
	if (!_.isFinite(self.date)) {
		dateTimeObject.date = 1;
	}
	if (!_.isFinite(self.hour)) {
		dateTimeObject.hour = 0;
	}
	if (!_.isFinite(self.minute)) {
		dateTimeObject.minute = 0;
	}
	if (!_.isFinite(self.second)) {
		dateTimeObject.second = 0;
	}
	if (!_.isFinite(self.millisecond)) {
		dateTimeObject.millisecond = 0;
	}
	return new PointInTime(dateTimeObject);
};

//--------------------------------------------------------------------------------------------------
// Creates a full prescision PointInTime object from one that is not full precision using default
// values on the higher part of the precision.
//
// returns: the PointInTime that was creataed.
//--------------------------------------------------------------------------------------------------
PointInTime.prototype.createHigh = function() {
	var self = this;
	var dt = null;
	var dateTimeObject = {};
	var zeroBasedMonth = 0;

	if (_.isFinite(self.month)) {
		zeroBasedMonth = self.month - 1;
	}

	if (self.precision === CONSTANTS.YEAR) {
		dateTimeObject.year = self.year + 1;
	} else if (self.precision === CONSTANTS.MONTH) {
		dt = moment({
			year: self.year,
			month: zeroBasedMonth
		}).add(1, 'M');
		dateTimeObject.year = dt.year();
		dateTimeObject.month = dt.month();
	} else if (self.precision === CONSTANTS.DAY) {
		dt = moment({
			year: self.year,
			month: zeroBasedMonth,
			date: self.date
		}).add(1, 'd');
		dateTimeObject.year = dt.year();
		dateTimeObject.month = dt.month();
		dateTimeObject.date = dt.date();
	} else if (self.precision === CONSTANTS.HOUR) {
		dt = moment({
			year: self.year,
			month: zeroBasedMonth,
			date: self.date,
			hour: self.hour
		}).add(1, 'h');
		dateTimeObject.year = dt.year();
		dateTimeObject.month = dt.month();
		dateTimeObject.date = dt.date();
		dateTimeObject.hour = dt.hour();
	} else if (self.precision === CONSTANTS.MINUTE) {
		dt = moment({
			year: self.year,
			month: zeroBasedMonth,
			date: self.date,
			hour: self.hour,
			minute: self.minute
		}).add(1, 'm');
		dateTimeObject.year = dt.year();
		dateTimeObject.month = dt.month();
		dateTimeObject.date = dt.date();
		dateTimeObject.hour = dt.hour();
		dateTimeObject.minute = dt.minute();
	} else if (self.precision === CONSTANTS.SECOND) {
		dt = moment({
			year: self.year,
			month: zeroBasedMonth,
			date: self.date,
			hour: self.hour,
			minute: self.minute,
			second: self.second
		}).add(1, 's');
		dateTimeObject.year = dt.year();
		dateTimeObject.month = dt.month();
		dateTimeObject.date = dt.date();
		dateTimeObject.hour = dt.hour();
		dateTimeObject.minute = dt.minute();
		dateTimeObject.second = dt.second();
	} else {
		dt = moment({
			year: self.year,
			month: zeroBasedMonth,
			date: self.date,
			hour: self.hour,
			minute: self.minute,
			second: self.second,
			millisecond: self.millisecond
		}).add(1, 'ms');
		dateTimeObject.year = dt.year();
		dateTimeObject.month = dt.month();
		dateTimeObject.date = dt.date();
		dateTimeObject.hour = dt.hour();
		dateTimeObject.minute = dt.minute();
		dateTimeObject.second = dt.second();
		dateTimeObject.millisecond = dt.millisecond();
	}

	if (!_.isFinite(self.month)) {
		dateTimeObject.month = 0;
	}
	if (!_.isFinite(self.date)) {
		dateTimeObject.date = 1;
	}
	if (!_.isFinite(self.hour)) {
		dateTimeObject.hour = 0;
	}
	if (!_.isFinite(self.minute)) {
		dateTimeObject.minute = 0;
	}
	if (!_.isFinite(self.second)) {
		dateTimeObject.second = 0;
	}
	if (!_.isFinite(self.millisecond)) {
		dateTimeObject.millisecond = 0;
	}
	return new PointInTime(dateTimeObject);
};

//----------------------------------------------------------------------------------------------
// Returns whether this PointInTime equals the supplied argument
//
// @param {String/gov.va.hmp.healthtime.PointInTime} target The PointInTime to compare with
// @returns {Boolean} True if this PointInTime equals the target, false otherwise
//----------------------------------------------------------------------------------------------
PointInTime.prototype.equals = function(target) {
	var self = this;

	if (_.isString(target)) {
		return self.equals(new PointInTime(target));
	} else if (target instanceof PointInTime) {
		return self.toString() === target.toString();
	} else {
		return false;
	}
};


//-------------------------------------------------------------------------------------------
// This function returns the time in HL7 format.
//
// returns: The time in HL7 format.
//-------------------------------------------------------------------------------------------
PointInTime.prototype.toString = function() {
	var self = this;

	return getHl7String(self);
};

//-------------------------------------------------------------------------------------------
// This returns the moment version of this date.
//
// returns: The moment version representing this date.
//-------------------------------------------------------------------------------------------
PointInTime.prototype.toDate = function() {
	var self = this;

	return moment({
		year: self.year,
		month: self.month - 1, // theirs is 0 offset, ours is 1 offset
		date: self.date,
		hour: self.hour,
		minute: self.minute,
		second: self.second,
		millisecond: self.millisecond
	});
};


//--------------------------------------------------------------------------------------------------
// Given two time fields - return the lessPrecise one.
//
// t1: PointInTime 1
// t2: PointInTime 2
// returns: The less precise time.
//--------------------------------------------------------------------------------------------------
function lessPrecise(t1, t2) {
	if (t2.toString().length < t1.toString().length) {
		return t2;
	}
	return t1;
}

//--------------------------------------------------------------------------------------------------
// Given two time fields - return the most precise one.
//
// t1: PointInTime 1
// t2: PointInTime 2
// returns: The most precise time.
//--------------------------------------------------------------------------------------------------
function mostPrecise(t1, t2) {
	if (t2.toString().length > t1.toString().length) {
		return t2;
	}
	return t1;
}


//---------------------------------------------------------------------------------------
// BECAUSE OF A CIRCULAR REFERENCE BETWEEN IntervalOfTime and PointInTime THERE IS A
// PROBLEM WHEN YOU PUT THIS EXPORTS AT THE END OF THIS FILE.  IT MUST BE DONE BEFORE
// THE REQUIRE... OF THE CIRCULAR DEPENDENCY.   SO IT MUST NOT BE HERE - IT IS AT THE TOP
// OF THIS FILE!!!!!
//---------------------------------------------------------------------------------------
//module.exports = PointInTime;
module.exports.CONSTANTS = CONSTANTS;
module.exports.lessPrecise = lessPrecise;
module.exports.mostPrecise = mostPrecise;