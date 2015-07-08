// register date patterns
Ext.Date.patterns = {
    HL7: "YmdHis.u",
    HL7Date: "Ymd",
    Year: "Y",
    CPRSDateTime: "M d,y H:i",
    CPRSTimeDate: "H:i M d,y",
    CPRSDate: "M d,y",
    CPRSMonthYear: "M Y",
    SortableDateTime: "Y-m-d H:i",
    SortableTimeDate: "H:i Y-m-d",
    SortableDate: "Y-m-d",
    SortableMonthYear: "Y-m",
    MSCUIDateTime: "d-M-Y H:i",
    MSCUITimeDate: "H:i d-M-Y",
    MSCUIDate: "d-M-Y",
    MSCUIMonthYear: "M-Y",
    Time: "H:i"
};

/**
 * Models imprecise dates and times by splitting individual fields into their
 */
Ext.define('gov.va.hmp.healthtime.PointInTime', {
    alternateClassName: ['PointInTime'],
    uses: [
        'gov.va.hmp.healthtime.IntervalOfTime'
    ],
    /**
     * @property {Boolean} isPointInTime
     * @readonly
     * `true` in this class to identify an object as an instantiated PointInTime.
     */
    isPointInTime: true,
    /**
     * @property {Number}
     * @readonly
     */
    year: null,
    /**
     * @property {Number}
     * @readonly
     */
    month: null,
    /**
     * @property {Number}
     * @readonly
     */
    date: null,
    /**
     * @property {Number}
     * @readonly
     */
    hour: null,
    /**
     * @property {Number}
     * @readonly
     */
    minute: null,
    /**
     * @property {Number}
     * @readonly
     */
    second: null,
    /**
     * @property {Number}
     * @readonly
     */
    millisecond: null,
    /**
     * @property {String}
     * @readonly
     */
    timezoneOffset: null,
    /**
     * @property {String}
     * @readonly
     */
    precision: null,
    //private
    hl7string: null,
    constructor: function (config) {
        if (!config.year) throw new Error("Expected 'year' to be set");
        this.year = config.year;
        this.precision = Ext.Date.YEAR;

        if (config.month != null) {
            this.month = config.month;
            this.precision = Ext.Date.MONTH;
        }
        if (config.date != null) {
            this.date = config.date;
            this.precision = Ext.Date.DAY;
        }
        if (config.hour != null) {
            this.hour = config.hour;
            this.precision = Ext.Date.HOUR;
        }
        if (config.minute != null) {
            this.minute = config.minute;
            this.precision = Ext.Date.MINUTE;
        }
        if (config.second != null) {
            this.second = config.second;
            this.precision = Ext.Date.SECOND;
        }
        if (config.millisecond != null) {
            this.millisecond = config.millisecond;
            this.precision = Ext.Date.MILLI;
        }
        if (config.timezoneOffset) {
            this.timezoneOffset = config.timezoneOffset;
        }
        this.callParent(arguments);
    },
    /**
     * Included for API Compatibility with javascript {@link Date}.
     * @return {Number} Four digit representation of the year.
     */
    getFullYear: function () {
        return this.year;
    },
    /**
     * Returns 0-based month.
     * Included for API Compatibility with javascript {@link Date}.
     * @return {Number} An integer between 0 and 11. 0 corresponds to January, 1 to February, and so on.
     * @see #getMonthOfYear
     */
    getMonth: function () {
        return this.month ? this.month - 1 : null;
    },
    /**
     * Returns 1-based month.
     * @return {Number} An integer between 1 and 12. 1 corresponds to January, 2 to February, and so on.
     * @see #getMonth
     */
    getMonthOfYear: function () {
        return this.month;
    },
    /**
     * Included for API Compatibility with javascript {@link Date}.
     * @return {Number} Value between 1 and 31.
     */
    getDate: function () {
        return this.date;
    },
    /**
     * Included for API Compatibility with javascript {@link Date}.
     * @return {Number} Value between 0 and 23, using 24-hour clock.
     */
    getHours: function () {
        return this.hour;
    },
    /**
     * Included for API Compatibility with javascript {@link Date}.
     * @return {Number} Value between 0 and 59.
     */
    getMinutes: function () {
        return this.minute;
    },
    /**
     * Included for API Compatibility with javascript {@link Date}.
     * @return {Number} Value between 0 and 59.
     */
    getSeconds: function () {
        return this.second;
    },
    /**
     * Included for API Compatibility with javascript {@link Date}.
     * @return {Number} A number between 0 and 999.
     */
    getMilliseconds: function () {
        return this.millisecond;
    },
    /**
     * Promotes this PointInTime to an {@link gov.va.hmp.healthtime.IntervalOfTime} with both endpoints at millisecond
     * precision.  Used to convert an imprecise date/time into a precise date range.
     * @return {gov.va.hmp.healthtime.IntervalOfTime}
     */
    promote: function() {
        var low = this.createLow();
        var high = this.createHigh();
        return IntervalOfTime.create(low, high);
    },
    /**
     * @param {String/gov.va.hmp.healthtime.PointInTime} other The other PointInTime to which to compare.
     * @returns {Boolean}
     */
    before: function(other) {
        if (Ext.isString(other)) {
            return this.before(PointInTime.parse(other));
        } else if (PointInTime.isPointInTime(other)) {
            return this.compareTo(other) < 0;
        } else {
            return false;
        }
    },
    /**
     * @param {String/gov.va.hmp.healthtime.PointInTime} other The other PointInTime to which to compare.
     * @returns {Boolean}
     */
    after: function(other) {
        if (PointInTime.isPointInTime(other)) {
            return this.compareTo(other) > 0;
        } else if (Ext.isString(other)) {
            return this.after(PointInTime.parse(other));
        } else {
            return false;
        }
    },
    /**
     * Compares this PointInTime instance to the specified `other` PointInTime.
     *
     * @param {String/gov.va.hmp.healthtime.PointInTime} other The other PointInTime to which to compare.
     * @returns {Number} -1 if this version is less than the target PointInTime, 1 if this
     * PointInTime is greater, and 0 if they are equal.
     */
    compareTo: function(other) {
        if (other == null) {
            return 1;
        }

        if (PointInTime.isPointInTime(other)) {
            if (this.precision === other.precision) {
                return this.toString().localeCompare(other.toString());
            } else {
                var leastPrecise = PointInTime.lessPrecise(this, other);
                var mostPrecise = PointInTime.mostPrecise(this, other);
                var i = leastPrecise.promote();
                if (i.contains(mostPrecise)) {
                    var l1 = this.toString().length;
                    var l2 = other.toString().length;
                    if (l1 > l2) return 1;
                    else if (l1 < l2) return -1;
                    else return 0;
                }
                var lcd = mostPrecise.toPrecision(leastPrecise.precision);
                if (this === leastPrecise)
                    return this.compareTo(lcd);
                else
                    return lcd.compareTo(leastPrecise);
            }
        } else if (Ext.isString(other)) {
            return this.compareTo(PointInTime.parse(other));
        } else {
            throw new Error('argument to compareTo() must be a String or a PointInTime instance');
        }
    },
    /**
     * Returns whether this PointInTime equals the supplied argument
     * @param {String/gov.va.hmp.healthtime.PointInTime} target The PointInTime to compare with
     * @returns {Boolean} True if this PointInTime equals the target, false otherwise
     */
    equals:function(target) {
        if (Ext.isString(target)) {
            return this.equals(PointInTime.parse(target));
        } else if (PointInTime.isPointInTime(target)) {
            return this.toString() === target.toString();
        } else {
            return false;
        }
    },
    toDate:function() {
        return new Date(this.year,
            this.getMonth(),
            this.date,
            this.hour,
            this.minute,
            this.second,
            this.millisecond);
    },
    toUTC: function() {
        return null;
    },
    toString: function () {
        if (this.hl7string == null) {
            var leftPad = Ext.String.leftPad;
            var s = "" + this.year;
            if (this.month !== null) s += leftPad(this.month, 2, '0');
            if (this.date !== null) s += leftPad(this.date, 2, '0');
            if (this.hour !== null) s += leftPad(this.hour, 2, '0');
            if (this.minute !== null) s += leftPad(this.minute, 2, '0');
            if (this.second !== null) s += leftPad(this.second, 2, '0');
            if (this.millisecond !== null) s += "." + leftPad(this.millisecond, 3, '0');
            if (this.timezoneOffset !== null) s += this.timezoneOffset;
            this.hl7string = s;
        }
        return this.hl7string;
    },
    clone: function() {
        return Ext.create('gov.va.hmp.healthtime.PointInTime', {
            year: this.year,
            month: this.month,
            date: this.date,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            millisecond: this.millisecond
        });
    },
    /**
     * @private
     */
    createHigh: function () {
        var dt = null,
            cfg = {};
        if (this.precision === Ext.Date.YEAR) {
            cfg.year = this.year + 1;
        } else if (this.precision === Ext.Date.MONTH) {
            dt = Ext.Date.add(new Date(this.year, this.getMonth()), Ext.Date.MONTH, 1);
            cfg.year = dt.getFullYear();
            cfg.month = dt.getMonth() + 1;
        } else if (this.precision === Ext.Date.DAY) {
            dt = Ext.Date.add(new Date(this.year,
                this.getMonth(),
                this.date), Ext.Date.DAY, 1);
            cfg.year = dt.getFullYear();
            cfg.month = dt.getMonth() + 1;
            cfg.date = dt.getDate();
        } else if (this.precision === Ext.Date.HOUR) {
            dt = Ext.Date.add(new Date(this.year,
                this.getMonth(),
                this.date,
                this.hour), Ext.Date.HOUR, 1);
            cfg.year = dt.getFullYear();
            cfg.month = dt.getMonth() + 1;
            cfg.date = dt.getDate();
            cfg.hour = dt.getHours();
        } else if (this.precision === Ext.Date.MINUTE) {
            dt = Ext.Date.add(new Date(this.year,
                this.getMonth(),
                this.date,
                this.hour,
                this.minute), Ext.Date.MINUTE, 1);
            cfg.year = dt.getFullYear();
            cfg.month = dt.getMonth() + 1;
            cfg.date = dt.getDate();
            cfg.hour = dt.getHours();
            cfg.minute = dt.getMinutes();
        } else if (this.precision === Ext.Date.SECOND) {
            dt = Ext.Date.add(new Date(this.year,
                this.getMonth(),
                this.date,
                this.hour,
                this.minute,
                this.second), Ext.Date.SECOND, 1);
            cfg.year = dt.getFullYear();
            cfg.month = dt.getMonth() + 1;
            cfg.date = dt.getDate();
            cfg.hour = dt.getHours();
            cfg.minute = dt.getMinutes();
            cfg.second = dt.getSeconds();
        } else {
            dt = Ext.Date.add(new Date(this.year,
                this.getMonth(),
                this.date,
                this.hour,
                this.minute,
                this.second,
                this.millisecond), Ext.Date.MILLI, 1);
            cfg.year = dt.getFullYear();
            cfg.month = dt.getMonth() + 1;
            cfg.date = dt.getDate();
            cfg.hour = dt.getHours();
            cfg.minute = dt.getMinutes();
            cfg.second = dt.getSeconds();
            cfg.millisecond = dt.getMilliseconds();
        }

        if (this.month === null) {
            cfg.month = 1;
        }
        if (this.date === null) {
            cfg.date = 1;
        }
        if (this.hour === null) {
            cfg.hour = 0;
        }
        if (this.minute === null) {
            cfg.minute = 0;
        }
        if (this.second === null) {
            cfg.second = 0;
        }
        if (this.millisecond === null) {
            cfg.millisecond = 0;
        }
        return Ext.create('gov.va.hmp.healthtime.PointInTime', cfg);
    },
    /**
     * @private
     */
    createLow: function () {
        var cfg = {
            year: this.year,
            month: this.month,
            date: this.date,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            millisecond: this.millisecond
        };
        if (this.month === null) {
            cfg.month = 1;
        }
        if (this.date === null) {
            cfg.date = 1;
        }
        if (this.hour === null) {
            cfg.hour = 0;
        }
        if (this.minute === null) {
            cfg.minute = 0;
        }
        if (this.second === null) {
            cfg.second = 0;
        }
        if (this.millisecond === null) {
            cfg.millisecond = 0;
        }
        return Ext.create('gov.va.hmp.healthtime.PointInTime', cfg);
    },
    /**
     * @private
     * @param precision
     */
    toPrecision: function(precision) {
        if (precision == this.precision) return this.clone();
//        if (precision greaterthan this.precision) throw new Error("foo")
        switch (precision.toLowerCase()) {
            case Ext.Date.SECOND:
                return Ext.create('gov.va.hmp.healthtime.PointInTime', {year: this.year, month: this.month, date: this.date, hour: this.hour, minute: this.minute, second: this.second});
            case Ext.Date.MINUTE:
                return Ext.create('gov.va.hmp.healthtime.PointInTime', {year: this.year, month: this.month, date: this.date, hour: this.hour, minute: this.minute});
            case Ext.Date.HOUR:
                return Ext.create('gov.va.hmp.healthtime.PointInTime', {year: this.year, month: this.month, date: this.date, hour: this.hour});
            case Ext.Date.DAY:
                return Ext.create('gov.va.hmp.healthtime.PointInTime', {year: this.year, month: this.month, date: this.date});
            case Ext.Date.MONTH:
                return Ext.create('gov.va.hmp.healthtime.PointInTime', {year: this.year, month: this.month});
            case Ext.Date.YEAR:
            default:
                return Ext.create('gov.va.hmp.healthtime.PointInTime', {year: this.year});
        }
    },
    statics: {
        /**
         * Returns true if the passed value is a PointInTime.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isPointInTime: function (obj) {
            return obj && obj.isPointInTime;
        },
        /**
         * Parses an HL7 string representation of an imprecise date.
         *
         * HL7 date strings are of the form YYYY[MM[DD[HHMM[SS[.S[S[S[S]]]]]]]][+/-ZZZZ], for example
         *     19750723152342.398-0700
         * or
         *     19750723
         * or
         *     1975
         *
         * @param (String) hl7datetime A string representing a date.
         * @return {gov.va.hmp.healthtime.PointInTime}
         */
        parse: function (hl7datetimestring) {
            if (!hl7datetimestring) return "";
            if (!Ext.isString(hl7datetimestring)) {
                throw new Error("Attempting to parse an HL7 datetime from an object that is not as String.");
            }
            // Split dateTime string to date/time token, milliseconds and zone
            var parts = hl7datetimestring.match(/(\d{3,14})(\.(\d{1,3}))?([+\-].*)?/);
            var dt = parts[1];

            // Extract all fields based on position
            var cfg = {};
            cfg.year = parseInt(dt.slice(0, 4));
            if (dt.length >= 4) cfg.month = PointInTime.nullSafeSliceAndParseInt(dt, 4, 6);
            if (dt.length >= 6) cfg.date = PointInTime.nullSafeSliceAndParseInt(dt, 6, 8);
            if (dt.length >= 8) cfg.hour = PointInTime.nullSafeSliceAndParseInt(dt, 8, 10);
            if (dt.length >= 10) cfg.minute = PointInTime.nullSafeSliceAndParseInt(dt, 10, 12);
            if (dt.length >= 12) cfg.second = PointInTime.nullSafeSliceAndParseInt(dt, 12, 14);

            if (Ext.isDefined(parts[3])) {
                var ms = parts[3];
                if (ms.length == 1) ms += '00';
                if (ms.length == 2) ms += '0';
                cfg.millisecond = parseInt(ms);
            }
            if (Ext.isDefined(parts[4])) {
                cfg.timezoneOffset = parts[4];
            }
            return Ext.create('gov.va.hmp.healthtime.PointInTime', cfg);
        },

        /**
         * @private
         */
        lessPrecise: function(t1, t2) {
            if (t2.toString().length < t1.toString().length) {
                return t2;
            }
            return t1;
        },
        /**
         * @private
         */
        mostPrecise: function(t1, t2) {
            if (t2.toString().length > t1.toString().length) {
                return t2;
            }
            return t1;
        },

        // private
        nullSafeSliceAndParseInt:function(s, start, end) {
            var v = s.slice(start, end);
            if (v == "") return null;
            while(v.indexOf("0")==0 && v.length>1) {
            	v = v.substring(1);
            }
            return parseInt(v);
        },

        /**
         * Formats the passed date using the specified format pattern.
         *
         * @param {String/Date/gov.va.hmp.healthtime.PointInTime} value The value to format. If a string is passed, it is converted to a {@link gov.va.hmp.healthtime.PointInTime}
         * @param {String} [pattern] Any valid date format string. Defaults to {@link Ext.Date#defaultFormat}.
         * @return {String} The formatted date string.
         */
        format: function (value, pattern) {
            if (!value) return '';

            if (Ext.isNumber(value)) {
            	value = value + "";
            }
            if (Ext.isString(value)) {
                value = PointInTime.parse(value);
            }

            if (!pattern) pattern = PointInTime.defaultPattern;

            var formatFunctions = Ext.Date.formatFunctions;

            if (formatFunctions[pattern] == null) {
                formatFunctions[pattern] = PointInTime.createFormat(pattern);
            }

            var rslt = formatFunctions[pattern].call(value) + '';
        	
        	return rslt;
        },
        // private
        defaultPattern: 'MSCUIDateTime',

        setDefaultPattern:function (pattern) {
            PointInTime.defaultPattern = pattern;
        },

        getDefaultPattern:function () {
            return PointInTime.defaultPattern;
        },

        /**
         * Attempts to determine the pattern set of the default pattern based on its prefix.
         * @returns {String} 'CPRS', 'Sortable', or 'MSCUI' if default pattern is set to one of the patterns starting
         * with that prefix, or null otherwise.
         */
        getDefaultPatternSet:function () {
            var p = PointInTime.defaultPattern;
            var i = p.indexOf('TimeDate');
            if (i == -1) {
                i = p.indexOf('DateTime');
            }
            if (i == -1) {
                i = p.indexOf('Date');
            }
            if (i == -1) {
                return null;
            }
            var patternSet = p.substring(0, i);
            return patternSet;
        },

        formatDateFromNow:function(datetime) {
            if (datetime.length > 8) {
                datetime = datetime.substr(0, 8);
            }
            var now = new Date();
            var t = PointInTime.parse(datetime);
            if (t.getFullYear() === now.getFullYear() && t.getMonth() === now.getMonth()) {
                if (t.getDate() === now.getDate()) {
                    return "Today";
                } else if (t.getDate() === now.getDate() - 1) {
                    return "Yesterday";
                } else if (t.getDate() === now.getDate() + 1) {
                    return "Tomorrow";
                }
            }
            return PointInTime.format(t);
        },
        formatMonthYearFromNow: function(datetime) {
            if (datetime.length > 6) {
                datetime = datetime.substr(0, 6);
            }
            var now = new Date();
            var t = PointInTime.parse(datetime);
            if (t.getFullYear() === now.getFullYear() && t.getMonth() === now.getMonth()) {
                return "This Month";
            }
            return PointInTime.format(t, 'F Y');
        },

        /**
         * Returns a date rendering function that can be reused to apply a date format multiple times efficiently.
         *
         * @param String pattern Any valid date format string.
         * @return {Function} The date formatting function
         */
        renderer: function (pattern) {
            return function (v) {
                return PointInTime.format(v, pattern);
            };
        },

        /**
         * The base format-code to formatting-function hashmap used by the {@link #format} method.
         * Formatting functions are strings (or functions which return strings) which
         * will return the appropriate value when evaluated in the context of the {@link PointInTime} object
         * from which the {@link #format} method is called.
         * Add to / override these mappings for custom date formatting.
         *
         * __Note:__ PointInTime.format() treats characters as literals if an appropriate mapping cannot be found.
         *
         * Example:
         *
         *     Ext.Date.formatCodes.x = "Ext.util.Format.leftPad(this.getDate(), 2, '0')";
         *     console.log(Ext.Date.format(new Date(), 'X'); // returns the current day of the month
         * @type Object
         */
        formatCodes: {
            d: "(this.getDate() != null ? Ext.String.leftPad(this.getDate(), 2, '0') : '?')",
            D: "Ext.Date.getShortDayName(this.getDay())", // get localized short day name
            j: "(this.getDate() != null ? this.getDate() : '?')",
            l: "Ext.Date.dayNames[this.getDay()]",
            N: "(this.getDay() ? this.getDay() : 7)",
            S: "Ext.Date.getSuffix(this)",
            w: "this.getDay()",
            z: "Ext.Date.getDayOfYear(this)",
            W: "Ext.String.leftPad(Ext.Date.getWeekOfYear(this), 2, '0')",
            F: "(this.getMonth() != null ? Ext.Date.monthNames[this.getMonth()] : '?')",
            m: "(this.getMonth() != null ? Ext.String.leftPad(this.getMonth() + 1, 2, '0') : '?')",
            M: "(this.getMonth() != null ? Ext.Date.getShortMonthName(this.getMonth()) : '?')", // get localized short month name
            n: "(this.getMonth() != null ? this.getMonth() + 1 : '?')",
            t: "Ext.Date.getDaysInMonth(this)",
            L: "(Ext.Date.isLeapYear(this) ? 1 : 0)",
            o: "(this.getFullYear() + (Ext.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Ext.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
            Y: "Ext.String.leftPad(this.getFullYear(), 4, '0')",
            y: "('' + this.getFullYear()).substring(2, 4)",
            a: "(this.getHours() != null ? (this.getHours() < 12 ? 'am' : 'pm') : '?')",
            A: "(this.getHours() != null ? (this.getHours() < 12 ? 'AM' : 'PM') : '?')",
            g: "(this.getHours() != null ? ((this.getHours() % 12) ? this.getHours() % 12 : 12) : '?')",
            G: "(this.getHours() != null ? this.getHours() : '?')",
            h: "(this.getHours() != null ? Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0') : '?')",
            H: "(this.getHours() != null ? Ext.String.leftPad(this.getHours(), 2, '0') : '?')",
            i: "(this.getMinutes() != null ? Ext.String.leftPad(this.getMinutes(), 2, '0') : '?')",
            s: "(this.getSeconds() != null ? Ext.String.leftPad(this.getSeconds(), 2, '0') : '?')",
            u: "(this.getMilliseconds() != null ? Ext.String.leftPad(this.getMilliseconds(), 3, '0') : '?')",
            O: "Ext.Date.getGMTOffset(this)",
            P: "Ext.Date.getGMTOffset(this, true)",
            T: "Ext.Date.getTimezone(this)",
            Z: "(this.getTimezoneOffset() * -60)",

            c: function () { // ISO-8601 -- GMT format
                var c, code, i, l, e;
                for (c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                    e = c.charAt(i);
                    code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e)); // treat T as a character literal
                }
                return code.join(" + ");
            },
            /*
             c: function() { // ISO-8601 -- UTC format
             return [
             "this.getUTCFullYear()", "'-'",
             "Ext.util.Format.leftPad(this.getUTCMonth() + 1, 2, '0')", "'-'",
             "Ext.util.Format.leftPad(this.getUTCDate(), 2, '0')",
             "'T'",
             "Ext.util.Format.leftPad(this.getUTCHours(), 2, '0')", "':'",
             "Ext.util.Format.leftPad(this.getUTCMinutes(), 2, '0')", "':'",
             "Ext.util.Format.leftPad(this.getUTCSeconds(), 2, '0')",
             "'Z'"
             ].join(" + ");
             },
             */

            U: "Math.round(this.getTime() / 1000)"
        },

        // private
        getFormatCode: function (character) {
            var f = PointInTime.formatCodes[character];

            if (f) {
                f = typeof f == 'function' ? f() : f;
                PointInTime.formatCodes[character] = f; // reassign function result to prevent repeated execution
            }

            // note: unknown characters are treated as literals
            return f || ("'" + Ext.String.escape(character) + "'");
        },

        // private
        createFormat: function (format) {
            var code = [],
                special = false,
                ch = '',
                i,
                formatFn;

            for (i = 0; i < format.length; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    code.push("'" + Ext.String.escape(ch) + "'");
                } else {
                    code.push(PointInTime.getFormatCode(ch));
                }
            }
            return Ext.functionFactory("return " + code.join('+'));
        },

        patternSets: {}
    }
});

//register parse functions
Ext.applyIf(Ext.Date.parseFunctions, {
	HL7: function(date, strict) {
		var pit = gov.va.hmp.healthtime.PointInTime.parse(date);
		if (!pit) return null;
		
		if (pit.precision === Ext.Date.YEAR) {
			return new Date(pit.getFullYear(), 0); // must pass at least 2 args
		} else if (pit.precision === Ext.Date.MONTH) {
			return new Date(pit.getFullYear(), pit.getMonth());
		} else if (pit.precision === Ext.Date.DAY) {
			return new Date(pit.getFullYear(), pit.getMonth(), pit.getDate());
		} else if (pit.precision === Ext.Date.HOUR) {
			return new Date(pit.getFullYear(), pit.getMonth(), pit.getDate(), pit.getHours());
		} else if (pit.precision === Ext.Date.MINUTE) {
			return new Date(pit.getFullYear(), pit.getMonth(), pit.getDate(), pit.getHours(), pit.getMinutes());
		} else if (pit.precision === Ext.Date.SECOND) {
			return new Date(pit.getFullYear(), pit.getMonth(), pit.getDate(), pit.getHours(), pit.getMinutes(), pit.getSeconds());
		} else if (pit.precision === Ext.Date.MILLI) {
			return new Date(pit.getFullYear(), pit.getMonth(), pit.getDate(), pit.getHours(), pit.getMinutes(), pit.getSeconds(), pit.getMilliseconds());
		}
		
		return null;
	}
});


// register format functions
Ext.applyIf(Ext.Date.formatFunctions, {
    DefaultDateTime: function () {
        var patternSet = PointInTime.getDefaultPatternSet();
        if (patternSet) {
            return PointInTime.format(this, patternSet + 'DateTime');
        } else {
            return PointInTime.format(this);
        }
    },
    DefaultTimeDate: function () {
        var patternSet = PointInTime.getDefaultPatternSet();
        if (patternSet) {
            return PointInTime.format(this, patternSet + 'TimeDate');
        } else {
            return PointInTime.format(this);
        }
    },
    DefaultDate: function () {
        var patternSet = PointInTime.getDefaultPatternSet();
        if (patternSet) {
            return PointInTime.format(this, patternSet + 'Date');
        } else {
            return PointInTime.format(this);
        }
    },
    CPRSDate: function () {
        var ps = PointInTime.patternSets['CPRSDate'];
        if (ps == null) {
            ps = PointInTime.patternSets['CPRSDate'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.CPRSMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.CPRSDate;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.CPRSDate);
        }
    },
    CPRSDateTime: function () {
        var ps = PointInTime.patternSets['CPRSDateTime'];
        if (ps == null) {
            ps = PointInTime.patternSets['CPRSDateTime'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.CPRSMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.CPRSDateTime;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.CPRSDateTime;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.CPRSDateTime;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.CPRSDateTime);
        }
    },
    CPRSTimeDate: function () {
        var ps = PointInTime.patternSets['CPRSTimeDate'];
        if (ps == null) {
            ps = PointInTime.patternSets['CPRSTimeDate'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.CPRSMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.CPRSDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.CPRSTimeDate;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.CPRSTimeDate;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.CPRSTimeDate;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.CPRSTimeDate);
        }
    },
    SortableDate: function () {
        var ps = PointInTime.patternSets['SortableDate'];
        if (ps == null) {
            ps = PointInTime.patternSets['SortableDate'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.SortableMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.SortableDate;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.SortableDate);
        }
    },
    SortableDateTime: function () {
        var ps = PointInTime.patternSets['SortableDateTime'];
        if (ps == null) {
            ps = PointInTime.patternSets['SortableDateTime'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.SortableMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.SortableDateTime;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.SortableDateTime;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.SortableDateTime;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.SortableDateTime);
        }
    },
    SortableTimeDate: function () {
        var ps = PointInTime.patternSets['SortableTimeDate'];
        if (ps == null) {
            ps = PointInTime.patternSets['SortableTimeDate'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.SortableMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.SortableDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.SortableTimeDate;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.SortableTimeDate;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.SortableTimeDate;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.SortableTimeDate);
        }
    },
    MSCUIDate: function () {
        var ps = PointInTime.patternSets['MSCUIDate'];
        if (ps == null) {
            ps = PointInTime.patternSets['MSCUIDate'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.MSCUIMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.MSCUIDate;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.MSCUIDate);
        }
    },
    MSCUIDateTime: function () {
        var ps = PointInTime.patternSets['MSCUIDateTime'];
        if (ps == null) {
            ps = PointInTime.patternSets['MSCUIDateTime'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.MSCUIMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.MSCUIDateTime;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.MSCUIDateTime;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.MSCUIDateTime;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.MSCUIDateTime);
        }
    },
    MSCUITimeDate: function () {
        var ps = PointInTime.patternSets['MSCUITimeDate'];
        if (ps == null) {
            ps = PointInTime.patternSets['MSCUITimeDate'] = {};
            ps[Ext.Date.YEAR] = Ext.Date.patterns.Year;
            ps[Ext.Date.MONTH] = Ext.Date.patterns.MSCUIMonthYear;
            ps[Ext.Date.DAY] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.HOUR] = Ext.Date.patterns.MSCUIDate;
            ps[Ext.Date.MINUTE] = Ext.Date.patterns.MSCUITimeDate;
            ps[Ext.Date.SECOND] = Ext.Date.patterns.MSCUITimeDate;
            ps[Ext.Date.MILLI] = Ext.Date.patterns.MSCUITimeDate;
        }

        if (this.isPointInTime) {
            return PointInTime.format(this, ps[this.precision]);
        } else if (Ext.isDate(this)) {
            return PointInTime.format(this, Ext.Date.patterns.MSCUITimeDate);
        }
    }
});