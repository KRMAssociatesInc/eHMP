/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';
define(['handlebars', 'hbs!_assets/templates/sparkline'], function(Handlebars, sparklineTemplate) {

    function calculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius) {
        var results = "";

        var angle = Math.PI / arms;

        for (var i = 0; i < 2 * arms; i++) {
            // Use outer or inner radius depending on what iteration we are in.
            var r = (i & 1) === 0 ? outerRadius : innerRadius;

            var currX = centerX + Math.cos(i * angle) * r;
            var currY = centerY + Math.sin(i * angle) * r;

            // Our first time we simply append the coordinates, subsequet times
            // we append a ", " to distinguish each coordinate pair.
            if (i === 0) {
                results = currX + "," + currY;
            } else {
                results += ", " + currX + "," + currY;
            }
        }

        return results;
    }

    function computeX(val, lval, hval, h, w, aw) {
        var valX;
        if (!isNaN(lval) && (val < lval)) {
            valX = Math.floor(aw / 2);
        } else if (!isNaN(hval) && (val > hval)) {
            valX = w - Math.floor(aw / 2);
        } else {
            var nw = w - (lval ? aw : 0) - (hval ? aw : 0);
            if (!isNaN(lval) && !isNaN(hval)) {
                valX = Math.floor((!isNaN(lval) ? aw : 0) + nw * (val - lval) / (hval - lval));
            } else {
                valX = Math.floor((!isNaN(lval) ? aw : 0) + nw / 2);
            }
        }
        return valX;
    }

    function getPositionX(val, lval, hval, flag, useFlag, rval, rIsNormal, w, aw) {
        var valX;
        if (useFlag) {
            switch (flag) {
                case 'H':
                    // is Abnormal Low
                    valX = w - aw - aw / 2;
                    break;
                case 'HH':
                case 'H*':
                    // is Critical High
                    valX = w - aw / 2;
                    break;
                case 'L':
                    // is Abnormal Low
                    valX = aw + aw / 2;
                    break;
                case 'LL':
                case 'L*':
                    // is Critical Low
                    valX = aw / 2;
                    break;
                default:
                    if (!isNaN(lval) && (val < lval)) {
                        // is Abnormal Low
                        valX = aw + aw / 2;
                    } else if (!isNaN(hval) && (val > hval)) {
                        // is Abnormal High
                        valX = w - aw - aw / 2;
                    } else if (!isNaN(rval) && rIsNormal && (val < rval)) {
                        // is Normal and reference value is higher and also Normal
                        valX = 2 * aw + (w - 4 * aw) * 0.25;
                    } else if (!isNaN(rval) && rIsNormal && (val > rval)) {
                        // is Normal and reference value is lower and also Normal
                        valX = 2 * aw + (w - 4 * aw) * 0.75;
                    } else {
                        // default position
                        valX = w / 2;
                    }
            }
        } else {
            if (!isNaN(lval) && (val < lval)) {
                // is Abnormal Low
                valX = aw / 2;
            } else if (!isNaN(hval) && (val > hval)) {
                // is Abnormal High
                valX = w - aw / 2;
            } else {
                var nw = w - 2 * aw;
                if (!isNaN(rval) && rIsNormal && (val < rval)) {
                    // is Normal and reference value is higher and also Normal
                    valX = aw + nw * 0.25;
                } else if (!isNaN(rval) && rIsNormal && (val > rval)) {
                    // is Normal and reference value is lower and also Normal
                    valX = aw + nw * 0.75;
                } else {
                    // default position
                    valX = aw + nw / 2;
                }
            }
        }
        return valX;
    }

    function isCriticalResult(flag) {
        return ((flag === 'HH') || (flag === 'LL') || (flag === 'H*') || (flag === 'L*'));
    }

    function isAbnormalResult(flag, val, lval, hval, useFlag) {
        var isAbnormal = false;
        if (useFlag && (flag !== undefined)) {
            isAbnormal = ((flag === 'H') || (flag === 'L') || (flag === 'HH') || (flag === 'LL') || (flag === 'H*') || (flag === 'L*'));
        } else if (!useFlag) {
            isAbnormal = (!isNaN(lval) && (val < lval)) || (!isNaN(hval) && (val > hval));
        }
        return isAbnormal;
    }

    function getDescription(val, prevVal, lval, hval, flag, useFlag) {
        var desc = '';
        if (!isNaN(lval) || (!isNaN(hval))) {
            desc += 'Normal range' + (!isNaN(lval) ? ' from ' + lval : '') + (!isNaN(hval) ? ' to ' + hval : '') + ';';
        }
        if (!isNaN(val)) {
            desc += 'Current value ' + val + ' is ';
            if (useFlag) {
                switch (flag) {
                    case 'H':
                        desc += 'abnormal high';
                        break;
                    case 'HH':
                    case 'H*':
                        desc += 'critical high';
                        break;
                    case 'L':
                        desc += 'abnormal low';
                        break;
                    case 'LL':
                    case 'L*':
                        desc += 'critical low';
                        break;
                    default:
                        desc += 'normal';
                }
            } else {
                desc += (isAbnormalResult(flag, val, lval, hval, useFlag) ? 'abnormal' : 'normal');
                desc += (!isNaN(lval) && (val < lval)) ? ' low' : '';
                desc += (!isNaN(hval) && (val > hval)) ? 'high' : '';
            }
            if (!isNaN(prevVal)) {
                desc += ' and ';
                if (prevVal < val) {
                    desc += 'increased from ';
                } else if (prevVal > val) {
                    desc += 'decreased from ';
                } else {
                    desc += 'the same as ';
                }
                desc += 'previous value ' + prevVal;
            }
        }
        return desc;
    }

    function initializeRanges(low, high, hasCritical, standardDeviation, aw, w, h, b) {
        var ranges = [];
        var lowLimit, highLimit;
        var tw = w;
        var x0 = 0;
        if (hasCritical && standardDeviation) {
            var mean = (low + high) / 2;
            // TODO: verify the calculation of low & high limits
            lowLimit = mean - mean * standardDeviation;
            highLimit = mean + mean * standardDeviation;
            // tw = w - 2 * b;
            // x0 = b;
        }
        if (hasCritical && lowLimit) {
            ranges.push({
                high: lowLimit,
                includeHigh: true,
                width: 0,
                height: h,
                x: x0,
                y: 0,
                positionValues: 'center',
                rangeClass: 'abnormalRange lowRange',
                interpretations: [{
                    valueClass: 'abnormalValue',
                    flag: 'L',
                    description: 'abnormal low'
                }, {
                    valueClass: 'criticalValue',
                    flag: 'L*',
                    description: 'critical low'
                }]
            });
        }
        if (hasCritical || !isNaN(low)) {
            ranges.push({
                low: lowLimit,
                high: low,
                width: aw,
                height: h,
                x: x0,
                y: 0,
                positionValues: (hasCritical ? 'scaled' : 'relative'),
                rangeClass: 'abnormalRange lowRange',
                interpretations: [{
                    valueClass: 'abnormalValue',
                    flag: 'L',
                    description: 'abnormal low'
                }, {
                    valueClass: 'criticalValue',
                    flag: 'L*',
                    description: 'critical low'
                }]
            });
        }
        ranges.push({
            low: low,
            high: high,
            includeLow: true,
            includeHigh: true,
            width: tw - (hasCritical || !isNaN(low) ? aw : 0) - (hasCritical || !isNaN(high) ? aw : 0),
            height: h,
            x: x0 + (hasCritical || !isNaN(low) ? aw : 0),
            y: 0,
            positionValues: 'scaled',
            rangeClass: 'normalRange',
            interpretations: [{
                valueClass: 'normalValue',
                flag: 'N',
                description: 'normal'
            }]
        });
        if (hasCritical || !isNaN(high)) {
            ranges.push({
                low: high,
                high: highLimit,
                width: aw,
                height: h,
                x: x0 + tw - aw,
                y: 0,
                positionValues: (hasCritical ? 'scaled' : 'relative'),
                rangeClass: 'abnormalRange highRange',
                interpretations: [{
                    valueClass: 'abnormalValue',
                    flag: 'H',
                    description: 'abnormal high'
                }, {
                    valueClass: 'criticalValue',
                    flag: 'H*',
                    description: 'critical high'
                }]
            });
        }
        if (hasCritical && highLimit) {
            ranges.push({
                low: highLimit,
                includeLow: true,
                width: 0,
                height: h,
                x: x0 + tw,
                y: 0,
                positionValues: 'center',
                rangeClass: 'abnormalRange highRange',
                interpretations: [{
                    valueClass: 'abnormalValue',
                    flag: 'H',
                    description: 'abnormal high'
                }, {
                    valueClass: 'criticalValue',
                    flag: 'H*',
                    description: 'critical high'
                }]
            });
        }

        return ranges;
    }

    function setDefaults(ranges, w, h) {
        var x = 0;
        if (ranges) {
            _.each(ranges, function(r) {
                r.x = r.x || x;
                r.y = r.y || 0;
                r.width = r.width || w / ranges.length;
                r.height = r.height || h;
                r.positionValues = r.positionValues || 'center';
                r.rangeClass = r.rangeClass || 'normalRange';
                r.valueClass = r.valueClass || 'normalValue';
                r.flag = r.flag || 'N';
                r.description = r.description || 'normal';

                x += r.width;
            });
        }
    }

    function getRangeByVal(ranges, val) {
        var rangesLowHigh = _.filter(ranges, function(r) {
            return (r.low < val && r.high > val) || (r.includeLow && r.low == val) || (r.includeHigh && r.high == val);
        });
        if (rangesLowHigh.length) {
            return _.first(rangesLowHigh);
        }
        var rangesHigh = _.filter(ranges, function(r) {
            return (r.high > val) || (r.includeHigh && r.high == val);
        });
        if (rangesHigh.length) {
            return _.first(rangesHigh);
        }
        var rangesLow = _.filter(ranges, function(r) {
            return (r.low < val) || (r.includeLow && r.low == val);
        });
        if (rangesLow.length) {
            return _.last(rangesLow);
        }

        return _.find(ranges, function(r) {
            return isNaN(r.low) && isNaN(r.high);
        });
    }

    function getRange(ranges, val, flag, useFlag) {
        var range;

        if (useFlag) {
            var rangesFlag = _.filter(ranges, function(r) {
                return _.some(r.interpretations, function(i) {
                    return i.flag === flag || 'N';
                });
            });
            if (rangesFlag.length) {
                if (rangesFlag.length === 1) {
                    range = rangesFlag[0];
                } else {
                    range = getRangeByVal(rangesFlag, val);
                }
            }
        } else {
            range = getRangeByVal(ranges, val);
        }

        return range;
    }

    function getXfromRanges(range, val, refRange, refVal) {
        var x;

        if (range) {
            switch (range.positionValues) {
                case 'relative':
                    // default position
                    x = range.x + range.width / 2;
                    if (refRange) {
                        if (refRange == range) {
                            if (val < refVal) {
                                // both values are in the same range and reference value is higher
                                x = range.x + range.width * 0.25;
                            } else if (val > refVal) {
                                // both values are in the same range and reference value is lower
                                x = range.x + range.width * 0.75;
                            }
                        }
                    }
                    break;
                case 'scaled':
                    x = range.x + computeX(val, range.low, range.high, range.height, range.width, 0);
                    break;
                case 'center':
                    x = range.x + range.width / 2;
                    break;
                default:
                    x = range.x + range.width / 2;
            }
        }

        return x;
    }

    function getValueClass(range, flag) {
        var valueClass = 'normalValue';
        if (range) {
            var interpretation;
            interpretation = _.findWhere(range.interpretations, {
                flag: flag
            });
            if (!interpretation) {
                interpretation = _.first(range.interpretations);
            }
            if (interpretation) {
                valueClass = interpretation.valueClass;
            }
        }
        return valueClass;
    }

    function ensureMinDistance(curr, prev, defaultMinDx) {
        // Ensure a minimum distance between currX and prevX
        // When both values are in the same range and the positioning of values in this range is 'scaled'
        if (curr.Range && prev.Range && (curr.Range == prev.Range) && (curr.Range.positionValues === 'scaled')) {
            var minDx = parseInt(curr.Range.minimumDistance || defaultMinDx);
            // When current value and previousValue differ and distance between them is smaller than the minimum distance
            if ((curr.Val !== prev.Val) && (Math.abs(curr.X - prev.X) < minDx)) {
                var minX = curr.Range.x;
                var maxX = curr.Range.x + curr.Range.width;
                var difX = minDx - Math.abs(curr.X - prev.X);
                if (curr.Val > prev.Val) {
                    if (prev.X - difX > minX) {
                        prev.X = prev.X - difX;
                    } else if (curr.X + difX < maxX) {
                        curr.X = curr.X + difX;
                    }
                } else {
                    if (prev.X + difX < maxX) {
                        prev.X = prev.X + difX;
                    } else if (curr.X - difX > minX) {
                        curr.X = curr.X - difX;
                    }
                }
            }
        }
    }

    function sparkline(graphOptions, result, previousResult, lowValue, highValue, interpretationCode, previousInterpretationCode, standardDeviation, options) {
        var ret = '';
        graphOptions = graphOptions || {};
        // Read values from parameters
        var low = $.isNumeric(lowValue) ? Number(lowValue) : NaN;
        var high = $.isNumeric(highValue) ? Number(highValue) : NaN;
        var curr = {};
        var prev = {};
        curr.Val = $.isNumeric(result) ? Number(result) : NaN;
        prev.Val = $.isNumeric(previousResult) ? Number(previousResult) : NaN;
        var interpretation = interpretationCode ? interpretationCode.split(":").pop() : interpretationCode;
        var prevInterpretation = previousInterpretationCode ? previousInterpretationCode.split(":").pop() : previousInterpretationCode;
        var sd = standardDeviation || 2.5;
        // Read options for graph
        var h = parseInt(graphOptions.height || 20);
        var w = parseInt(graphOptions.width || 80);
        var id = graphOptions.id || '';
        var aw = parseInt(graphOptions.abnormalRangeWidth || Math.floor(w / 4));
        var a = parseInt(graphOptions.rhombusA || Math.floor(h / 2 * 0.7));
        var b = parseInt(graphOptions.rhombusB || Math.floor(aw / 2 * 0.4));
        var a2 = a * 0.7;
        var b2 = b * 0.7;
        var r = parseInt(graphOptions.radius || 2.5);
        var hasCritical = Boolean(graphOptions.hasCriticalInterpretation);
        var ranges = graphOptions.ranges || [];

        if (ranges.length === 0) {
            ranges = initializeRanges(low, high, hasCritical, sd, aw, w, h, b);
        } else {
            setDefaults(ranges, w, h);
        }

        // Compute coordinates
        var y = Math.floor(h / 2);

        curr.Range = getRange(ranges, curr.Val, interpretation, hasCritical);
        prev.Range = getRange(ranges, prev.Val, prevInterpretation, hasCritical);
        curr.Flag = hasCritical ? interpretation : (_.first((curr.Range || {}).interpretations) || {}).flag || interpretation;
        curr.IsCritical = isCriticalResult(curr.Flag);
        curr.X = getXfromRanges(curr.Range, curr.Val, prev.Range, prev.Val);
        prev.X = getXfromRanges(prev.Range, prev.Val, curr.Range, curr.Val);

        if (curr.Range && !curr.Range.noMinimumDistance) {
            ensureMinDistance(curr, prev, ((b + r + 1) || 10));
        }

        var context = {
            description: getDescription(curr.Val, prev.Val, low, high, curr.Flag, hasCritical),
            id: id,
            width: w,
            height: h,
            paddingTop: 0,
            paddingLeft: b,
            border: {
                x: 0,
                y: 0,
                width: w - (hasCritical && sd ? 2 * b : 0),
                height: h
            },
            ranges: ranges
        };
        if (!isNaN(prev.Val)) {
            $.extend(context, {
                previousValue: {
                    value: prev.Val,
                    x: prev.X,
                    y: y,
                    r: r
                }
            });
        }
        if (!isNaN(curr.Val)) {
            $.extend(context, {
                currentValue: {
                    value: curr.Val,
                    x: curr.X,
                    y: y,
                    class: getValueClass(curr.Range, curr.Flag),
                    isCritical: curr.IsCritical,
                    a: a,
                    b: b,
                    a2: a2,
                    b2: b2
                }
            });
        }

        ret += sparklineTemplate(context);

        return ret;
    }

    Handlebars.registerHelper('sparkline', sparkline);
    return sparkline;
});