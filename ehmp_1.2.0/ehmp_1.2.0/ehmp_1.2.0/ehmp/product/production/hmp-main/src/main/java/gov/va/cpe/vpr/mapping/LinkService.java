package gov.va.cpe.vpr.mapping;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.ws.link.ILinkGenerator;
import gov.va.cpe.vpr.ws.link.PatientRelatedSelfLinkGenerator;
import gov.va.hmp.feed.atom.Link;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class LinkService implements ILinkService {

    private ApplicationContext applicationContext;
    private IPatientDAO patientDao;

    @Autowired
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    public String getPatientHref(String pid) {
        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt == null) return null;
        return getSelfHref(pt);
    }

    public String getSelfHref(Object o) {
        final Link link = getSelfLink(o);
        return (link == null ? null : link.getHref());
    }

    public List<Link> getLinks(final Object domainObject) {
        if (domainObject == null) return Collections.emptyList();
        Map<String, ILinkGenerator> generatorBeans = applicationContext.getBeansOfType(ILinkGenerator.class);
        List<ILinkGenerator> generators = new ArrayList<>();
        for (ILinkGenerator generator : generatorBeans.values()) {
            if (generator.supports(domainObject)) {
                generators.add(generator);
            }
        }

        List<Link> links = new ArrayList<Link>();
        for (ILinkGenerator generator: generators) {
            Link link = generator.generateLink(domainObject);
            if (link != null) {
                links.add(link);
            }
        }
        return links;
    }

    public Link getSelfLink(Object domainObject) {
        ILinkGenerator generator = applicationContext.getBean(PatientRelatedSelfLinkGenerator.class);
        if (((PatientRelatedSelfLinkGenerator) generator).supports(domainObject))
            return ((PatientRelatedSelfLinkGenerator) generator).generateLink(domainObject);
        else return null;
    }
}
