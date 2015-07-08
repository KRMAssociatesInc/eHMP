package gov.va.cpe.vpr.ws.link;

import gov.va.hmp.feed.atom.Link;

/**
 * A ILinkGenerator is responsible for generating a related atom link for an arbitrary object.
 * <p/>
 * Atom links have a "rel" property that models the type of "relation" to the object.
 * For example: "self", "next", "prev", "alternate", "edit", "first", "last"
 */
public interface ILinkGenerator {

    /**
     * Checks wheter the ILinkGenerator is able/intended to support the given Object
     *
     * @param object the object which is about getting related links
     * @return <code>true</code> if the generator can/should generate a related link, <code>false</code> otherwise
     */
    boolean supports(Object object);

    /**
     * Generates the link
     *
     * @param object the object which is about getting a related link generated
     */
    Link generateLink(Object object);
}
