package gov.va.cpe.vpr.queryeng.dynamic;

import gov.va.cpe.vpr.pom.IPatientObject;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface IViewDefDefDAO extends Repository<IPatientObject, String> {
	// save
	public void save(ViewDefDef obj);
	// simple finder
	public ViewDefDef findByUid(String name);
	// Get all available dynamic panels
	public List<ViewDefDef> findAll();
	
	public void delete(ViewDefDef obj);
}
