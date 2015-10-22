package gov.va.hmp.healthtime.format;

import org.joda.time.ReadWritablePeriod;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Implementation of {@link org.joda.time.format.PeriodParser} that will parse simple period strings
 * that consist of a numeric part followed directly by a unit.
 * <p/>
 * The following unit strings are defined:
 * <blockquote>
 *     <dl>
 *         <dt>Y,y</dt>
 *         <dd>Years</dd>
 *         <dt>M,MO,mo</dt>
 *         <dd>Months</dd>
 *         <dt>W,w</dt>
 *         <dd>Weeks</dd>
 *         <dt>D,d</dt>
 *         <dd>Days</dd>
 *         <dt>H,h</dt>
 *         <dd>Hours</dd>
 *         <dt>m,MI,mi</dt>
 *         <dd>Minutes</dd>
 *         <dt>S,s</dt>
 *         <dd>Seconds</dd>
 *     </dl>
 * </blockquote>
 */
class PeriodParser implements org.joda.time.format.PeriodParser {
    public static Pattern PERIOD_PATTERN = Pattern.compile("(\\d*)([a-zA-Z]*|')");

    @Override
    public int parseInto(ReadWritablePeriod period, String periodStr, int position, Locale locale) {
        Matcher match = PERIOD_PATTERN.matcher(periodStr.substring(position));
        if (match.matches()) {
            int num = 0;
            String numstr = match.group(1);
            if (numstr != null && !numstr.equals("")) {
                num = Integer.parseInt(numstr);
            }
            String unit = match.group(2);
            if (unit == null || unit.equals("") || unit.startsWith("d") || unit.startsWith("D")) {
                period.setDays(num);
            } else if (unit.startsWith("w") || unit.startsWith("W")) {
                period.setWeeks(num);
            } else if (unit.startsWith("mo") || unit.startsWith("MO") || unit.equals("M") || unit.equals("m")) {
                period.setMonths(num);
            } else if (unit.startsWith("y") || unit.startsWith("Y")) {
                period.setYears(num);
            } else if (unit.startsWith("h") || unit.startsWith("H")) {
                period.setHours(num);
            } else if (unit.startsWith("mi") || unit.startsWith("MI") || unit.equals("'")) {
                period.setMinutes(num);
            } else if (unit.startsWith("s") || unit.startsWith("S")) {
                period.setSeconds(num);
            }
            return periodStr.length();
        }
        // unrecognized period/units
        return 0;
    }
}
