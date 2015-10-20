package us.vistacore.asu.time;


/**
 * TODOC: Provide summary documentation of class IntervalOfTimeFormat
 */
public class IntervalOfTimeFormat {

    private static IntervalOfTimeFormatter defaultFormatter;
    private static IntervalOfTimeFormatter intervalFormFormatter;

    public static IntervalOfTimeFormatter getDefault() {
        if (defaultFormatter == null) {
            defaultFormatter = new IntervalOfTimeFormatter();
        }
        return defaultFormatter;
    }

    public static IntervalOfTimeFormatter intervalForm() {
        if (intervalFormFormatter == null) {
            intervalFormFormatter = new IntervalOfTimeFormatter(true);
        }
        return intervalFormFormatter;
    }

    public static IntervalOfTime parse(String text) {
        return getDefault().parseInterval(text);
    }

    public static IntervalOfTime parseIntervalForm(String text) {
        return getDefault().parseInterval(text);
    }

    public static String print(IntervalOfTime text) {
        return getDefault().print(text);
    }

    public static String printIntervalForm(IntervalOfTime text) {
        return intervalForm().print(text);
    }

    public static String toString(IntervalOfTime text) {
        return print(text);
    }
}
