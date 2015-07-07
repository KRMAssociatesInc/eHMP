package gov.va.cpe.vpr.mapping;

import gov.va.hmp.feed.atom.Link;

import java.util.List;

/**
 * TODOC: Provide summary documentation of class DomainClassUrlCreator
 */
public interface ILinkService {
    String getPatientHref(String pid);
    String getSelfHref(Object domainObject);
    List<Link> getLinks(Object domainObject);
}
