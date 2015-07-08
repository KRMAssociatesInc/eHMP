package gov.va.cpe.vpr;

import gov.va.hmp.ptselect.PatientSelect;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

public class PidUtils {

    public static final String SEPARATOR = ";";

    public static String getPid(String vistaId, String dfn) {
        Assert.hasText(vistaId);
        Assert.hasText(dfn);
        return vistaId + SEPARATOR + dfn;
    }

    public static String getPid(PatientSelect pat) {
        return getPid(UidUtils.getSystemIdFromPatientUid(pat.getUid()), UidUtils.getLocalPatientIdFromPatientUid(pat.getUid()));
    }

    public static String getPid(PatientDemographics pat) {
        return getPid(UidUtils.getSystemIdFromPatientUid(pat.getUid()), UidUtils.getLocalPatientIdFromPatientUid(pat.getUid()));
    }

    public static String getVistaId(String pid) {
        int sep = pid.lastIndexOf(SEPARATOR);
        if (sep == -1) throw new IllegalArgumentException("[Assertion failed] - 'pid' argument should contain a '" + SEPARATOR + "' character");
        return pid.substring(0, sep);
    }

    public static String getDfn(String pid) {
        int sep = pid.lastIndexOf(SEPARATOR);
        if (sep == -1) throw new IllegalArgumentException("[Assertion failed] - 'pid' argument should contain a '" + SEPARATOR + "' character");
        return pid.substring(sep + 1);
    }
}
