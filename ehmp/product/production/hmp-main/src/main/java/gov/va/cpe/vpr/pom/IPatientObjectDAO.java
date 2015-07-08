package gov.va.cpe.vpr.pom;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Map;

public interface IPatientObjectDAO<T extends IPatientObject> extends Repository<IPatientObject, String> {

	// save/delete
	public T save(T obj);
	public void deleteByUID(String uid);
	public void deleteByPID(String pid);

	// simple finder
	public T findByUID(String uid);
	
	// query finders
	public Page<T> findAllByPID(String pid, Pageable page);
	public List<T> findAllByIndex(String pid, String indexName, String start, String end, Map<String, Object> where);
}
