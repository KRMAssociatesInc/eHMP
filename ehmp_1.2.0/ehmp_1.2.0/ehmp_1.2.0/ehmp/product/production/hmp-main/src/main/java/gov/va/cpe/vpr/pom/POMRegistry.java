package gov.va.cpe.vpr.pom;

/**
 * TODO: Idea here is that we need a central "registry" of all pom/domain ojects.
 * - this could assume the responsibilities of UidUtils
 * - if we stored index information in the POMOBjects as annotations, then this could be used
 *  to generate any new JDS indexes if necessary
 * - should be able to provide lists of domains to fetch from vista and which domains to store in solr
 * - should be able to have smarter indexes, so dao.fetchAllByClass() doesn't have to nievly relly on equivelently named indexes
 * - Should be runtime pluggable.
 * TODO: maybe we could also use it to build a solr schema on-the-fly?
 * TODO: how could we use OSGi to contribute domain objects as well?
 * 
 * @author brian
 */
public class POMRegistry {

}
