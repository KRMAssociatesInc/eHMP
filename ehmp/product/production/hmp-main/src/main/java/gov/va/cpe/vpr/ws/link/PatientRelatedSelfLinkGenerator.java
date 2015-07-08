package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.hmp.feed.atom.Link;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Component
public class PatientRelatedSelfLinkGenerator implements ILinkGenerator {

    private IPatientDAO patientDao;

    public IPatientDAO getPatientDao() {
        return patientDao;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    public boolean supports(Object object) {
        return object instanceof IPatientObject;
    }

    public Link generateLink(Object object) {
        String url = getSelfUrl(object);
        if (!StringUtils.hasText(url)) {
            return null;
        }
        Link link = new Link(url, LinkRelation.SELF.toString());
        return link;
    }

    private String getSelfUrl(Object o) {
        if (o == null) return null;
        if (o instanceof PatientDemographics) {
            final String icn = ((PatientDemographics) o).getIcn();
            return getPatientHref(StringUtils.hasText(icn) ? icn : ((PatientDemographics) o).getPid());
        }

        IPatientObject patientRelated = (IPatientObject) o;
        PatientDemographics patient = patientDao.findByPid(patientRelated.getPid());
        if (patient != null) {
            final String icn = patient.getIcn();
            return getSelfHref(StringUtils.hasText(icn) ? icn : patient.getPid(), o.getClass(), patientRelated.getUid());
        }

        return null;
    }

    public static String getPatientHref(long pid) {
        return getPatientHref("" + pid);
    }

    public static String getPatientHref(final String pid) {
        return "/vpr/v1/" + pid;
    }

    public static String getSelfHref(String pid, Class clazz, String uid) {
        return getSelfHref(pid, ClassUtils.getShortName(clazz).toLowerCase(), uid);
    }

    public static String getSelfHref(final String pid, final String domain, String uid) {
        try {
            String s = URLEncoder.encode(uid, "UTF-8");
            return PatientRelatedSelfLinkGenerator.getPatientHref(pid) + "/" + domain + "/show/" + s;
        } catch (UnsupportedEncodingException e) {
            // NOOP (shouldn't ever happen, UTF-8 is built in encoding
            return null;
        }
    }
}
