package gov.va.cpe.vpr.pom;

import gov.va.hmp.dao.HmpRepository;

public interface IPOMObjectDAO<T extends IPOMObject> extends HmpRepository<T, String> {

}
