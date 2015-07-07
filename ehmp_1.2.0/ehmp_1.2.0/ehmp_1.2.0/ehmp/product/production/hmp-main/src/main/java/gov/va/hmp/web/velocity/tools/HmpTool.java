package gov.va.hmp.web.velocity.tools;

import gov.va.cpe.param.IParamService;
import gov.va.cpe.vpr.UidUtils;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.util.HtmlUtils;

import java.util.Locale;

public class HmpTool {

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private IParamService paramService;

    @Autowired
    private UserContext userContext;

    public String paramVal() {
        return "";
    }

    public String userPref(String key, String defaultVal) {
        Object pref = paramService.getUserPreference(key);
        String val = defaultVal;
        if (pref != null) {
            val = pref.toString();
        }
        return HtmlUtils.htmlEscape(val);
    }

    public String userPrefResource(String key, String defaultVal) {
        Object pref = paramService.getUserPreference(key);
        String val = defaultVal;
        if (pref != null) {
            Resource resource = resourceLoader.getResource(pref.toString());
            if (resource != null && resource.exists()) {
                val = pref.toString();
            }
        }
        return HtmlUtils.htmlEscape(val);
    }

    public String formatDate(PointInTime t) {
        if (t == null) return "";
        return userContext.getHealthTimePrinterSet().date().print(t, Locale.getDefault());
    }

    public String formatDateTime(PointInTime t) {
        if (t == null) return "";
        return userContext.getHealthTimePrinterSet().dateTime().print(t, Locale.getDefault());
    }

    public String formatTime(PointInTime t) {
        if (t == null) return "";
        return userContext.getHealthTimePrinterSet().time().print(t, Locale.getDefault());
    }

    public String formatYear(PointInTime t) {
        if (t == null) return "";
        return userContext.getHealthTimePrinterSet().year().print(t, Locale.getDefault());
    }

    public String formatDate(PointInTime t, String format) {
        if (t == null) return "";
        DateTimeFormatter formatter = PointInTimeFormat.forPattern(format);
        return formatter.print(t);
    }

    public String formatDate(String t) {
        if (t == null) return "";
        return formatDate(HL7DateTimeFormat.parse(t));
    }

    public String formatDateTime(String t) {
        if (t == null) return "";
        return formatDateTime(HL7DateTimeFormat.parse(t));
    }

    public String formatDateTime(Integer t) {
        return formatDateTime(t.toString());
    }

    public String formatDateTime(Long t) {
        return formatDateTime(t.toString());
    }

    public String formatTime(String t) {
        if (t == null) return "";
        return formatTime(HL7DateTimeFormat.parse(t));
    }

    public String formatYear(String t) {
        if (t == null) return "";
        return formatYear(HL7DateTimeFormat.parse(t));
    }

    public String formatDate(String t, String format) {
        if (t == null) return "";
        return formatDate(HL7DateTimeFormat.parse(t), format);
    }

    public String nameCase(String s) {
        return VistaStringUtils.nameCase(s);
    }

    private String replaceAllMatches(String original, String searchTerm) {
        return original.replaceAll("(?ims)("+searchTerm+")", "<span class=\"cpe-search-term-match\">$1</span>");
    }

    public String getKind(String uid) {
        return UidUtils.getDomainNameByUid(uid);
    }
}
