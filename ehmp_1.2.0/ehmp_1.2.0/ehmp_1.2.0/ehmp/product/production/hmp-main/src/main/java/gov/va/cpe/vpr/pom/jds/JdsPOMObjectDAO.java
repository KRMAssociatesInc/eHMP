package gov.va.cpe.vpr.pom.jds;

import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.IPOMObjectDAO;
import org.apache.commons.lang.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public class JdsPOMObjectDAO<T extends IPOMObject> extends JdsDaoSupport implements IPOMObjectDAO<T> {

    private IGenericPOMObjectDAO genericDao;
    private Class<T> type;
    static final Logger LOG = LoggerFactory.getLogger(JdsPOMObjectDAO.class);

    public JdsPOMObjectDAO(Class<T> type, IGenericPOMObjectDAO genericDao, JdsOperations jdsTemplate) {
        this.genericDao = genericDao;
        this.type = type;
        setJdsTemplate(jdsTemplate);
    }

    protected IGenericPOMObjectDAO getGenericDao() {
        return genericDao;
    }

    public Class<T> getType() {
        return type;
    }

    @Override
    public T save(T entity) {
        LOG.debug("save:  Entered Method");
        LOG.debug("save:  Calling genericDao.save now...");
        genericDao.save(entity);
        return entity;
    }

    @Override
    public long count() {
        return genericDao.count(type);
    }

    public int count(String index) {
        return genericDao.count(index);
    }

    public int count(String index, String topic) {
        return genericDao.count(index, topic);
    }

    @Override
    public void delete(String uid) {
        genericDao.deleteByUID(type, uid);
    }

    @Override
    public void delete(T entity) {
        genericDao.delete(entity);
    }

    @Override
    public void deleteAll() {
        genericDao.deleteAll(type);
    }

    @Override
    public T findOne(String uid) {
        return genericDao.findByUID(type, uid);
    }

    @Override
    public List<T> findAll() {
        return genericDao.findAll(type);
    }


    @Override
    public List<T> findAll(Sort sort) {
        // TODO: implement me
        throw new NotImplementedException();
    }

    @Override
    public Page<T> findAll(Pageable pageable) {
        return genericDao.findAll(type, pageable);
    }
}
