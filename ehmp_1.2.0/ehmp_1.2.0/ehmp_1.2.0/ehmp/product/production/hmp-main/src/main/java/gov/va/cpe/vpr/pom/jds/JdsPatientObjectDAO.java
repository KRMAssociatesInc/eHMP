package gov.va.cpe.vpr.pom.jds;

import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.IPatientObjectDAO;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public class JdsPatientObjectDAO<T extends IPatientObject> extends JdsDaoSupport implements IPatientObjectDAO<T> {

    protected IGenericPatientObjectDAO genericDao;
    private Class<T> clazz;

    public JdsPatientObjectDAO(Class<T> clazz) {
        this.clazz = clazz;
    }

    @Required
    public void setGenericDao(IGenericPatientObjectDAO genericDao) {
        this.genericDao = genericDao;
    }

    @Override
    public T save(T obj) {
        genericDao.save(obj);
        return obj;
    }

    @Override
    public void deleteByUID(String uid) {
        genericDao.deleteByUID(clazz, uid);
    }

    @Override
    public void deleteByPID(String pid) {
       genericDao.deleteByPID(clazz, pid);
    }

    @Override
    public T findByUID(String uid) {
        return genericDao.findByUID(clazz, uid);
    }

    @Override
    public Page<T> findAllByPID(String pid, Pageable page) {
        return genericDao.findAllByPID(clazz, pid, page);
    }

    @Override
    public List<T> findAllByIndex(String pid, String indexName, String start, String end, Map<String, Object> where) {
        return genericDao.findAllByIndex(clazz, pid, indexName, start, end, where);
    }
}
