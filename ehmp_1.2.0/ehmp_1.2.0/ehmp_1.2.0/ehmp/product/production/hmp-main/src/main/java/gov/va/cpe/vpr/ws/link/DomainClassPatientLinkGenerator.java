package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.hmp.feed.atom.Link;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

@Component
public class DomainClassPatientLinkGenerator implements ILinkGenerator, InitializingBean {

    private ILinkService linkService;
    private List<Class> omitClasses = new ArrayList<Class>();

    public ILinkService getLinkService() {
        return linkService;
    }
    @Autowired
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public List<Class> getOmitClasses() {
        return omitClasses;
    }

    public void setOmitClasses(List<Class> omitClasses) {
        this.omitClasses = omitClasses;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "linkService must not be null");
    }

    public boolean supports(Object object) {
        return object instanceof IPatientObject && !(object instanceof PatientDemographics);
    }

    public Link generateLink(Object object) {
        if (omitClasses.contains(object.getClass())) return null;

        IPatientObject patientRelated = (IPatientObject) object;
        String href = linkService.getPatientHref(patientRelated.getPid());
        Link link = new Link(href, LinkRelation.PATIENT.toString());
        return link;
    }

}
