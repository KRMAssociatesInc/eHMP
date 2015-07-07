package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.ResultOrganizer;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.VitalSignOrganizer;
import gov.va.cpe.vpr.dao.ISolrDao;
import gov.va.cpe.vpr.pom.IPOMObject;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.ConcurrentUpdateSolrServer;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrException;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.dao.*;
import org.springframework.util.StringUtils;

import java.io.IOException;

import static org.apache.solr.common.SolrException.ErrorCode.*;

public class DefaultSolrDao implements ISolrDao, InitializingBean, DisposableBean {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultSolrDao.class);

    private ConversionService conversionService;
    private SolrServer querySolrServer;
    private SolrServer updateSolrServer;

    @Autowired
    public void setSolrServer(SolrServer solrServer) {
        this.querySolrServer = solrServer;
    }

    @Autowired
    public void setConversionService(ConversionService conversionService) {
        this.conversionService = conversionService;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        if (querySolrServer instanceof HttpSolrServer) {
            HttpSolrServer httpSolrServer = (HttpSolrServer) querySolrServer;
            this.updateSolrServer = new ConcurrentUpdateSolrServer(httpSolrServer.getBaseURL(), httpSolrServer.getHttpClient(), 20, 4);
        } else {
            this.updateSolrServer = querySolrServer;
        }
    }

    @Override
    public void destroy() throws Exception {
        if (this.updateSolrServer instanceof ConcurrentUpdateSolrServer) {
            ((ConcurrentUpdateSolrServer) this.updateSolrServer).shutdown();
        }
    }

    public QueryResponse search(String query) {
        return search(new SolrQuery(query));
    }

    public QueryResponse search(SolrQuery solrQuery) {
        try {
            return querySolrServer.query(solrQuery);
        } catch (SolrServerException e) {
            LOGGER.error("unable to execute SolrQuery", e);
            throw new RuntimeException(e);
        }
    }

    public <T extends IPOMObject> T save(T entity) {
        if (entity instanceof ResultOrganizer) {
            ResultOrganizer o = (ResultOrganizer) entity;
            // index each individual result
            for (Result r : o.getResults()) {
                indexInternal(r);
            }
        } else if (entity instanceof VitalSignOrganizer) {
            VitalSignOrganizer o = (VitalSignOrganizer) entity;
            for (VitalSign vs : o.getVitalSigns()) {
                indexInternal(vs);
            }
        } else {
            indexInternal(entity);
        }
        return entity;
    }

    private <T extends IPOMObject> void indexInternal(T entity) {
        SolrInputDocument doc = conversionService.convert(entity, SolrInputDocument.class);
        if (doc == null) return;

        try {
            updateSolrServer.add(doc);
        } catch (IOException e) {
            LOGGER.error("unable to add document to Solr: " + doc.toString(), e);
            throw new TransientDataAccessResourceException("unable to add document to Solr: " + doc.toString(), e);
        } catch (SolrServerException e) {
            LOGGER.error("unable to add document to Solr: " + doc.toString(), e);
            throw new InvalidDataAccessApiUsageException("unable to add document to Solr: " + doc.toString(), e);
        } catch (SolrException e) {
            LOGGER.error("unable to add document to Solr: " + doc.toString(), e);
            throw translateSolrException("unable to add document to Solr: " + doc.toString(), e);
        }
    }

    public <T extends IPOMObject> void delete(T entity) {
        String uid = entity.getUid();
        if (!StringUtils.hasText(uid)) return;

        try {
            updateSolrServer.deleteById(uid);
        } catch (SolrServerException e) {
            LOGGER.error("unable to delete entity from Solr with uid " + entity.getUid(), e);
            throw new InvalidDataAccessApiUsageException("unable to delete entity from Solr with uid " + entity.getUid(), e);
        } catch (IOException e) {
            LOGGER.error("unable to delete entity from Solr with uid " + entity.getUid(), e);
            throw new TransientDataAccessResourceException("unable to delete entity from Solr with uid " + entity.getUid(), e);
        } catch (SolrException e) {
            LOGGER.error("unable to delete entity from Solr with uid " + entity.getUid(), e);
            throw translateSolrException("unable to delete entity from Solr with uid " + entity.getUid(), e);
        }
    }

    public void deleteByQuery(String query) {
        try {
            updateSolrServer.deleteByQuery(query);
        } catch (SolrServerException e) {
            LOGGER.error("unable to delete from Solr by query: " + query, e);
            throw new InvalidDataAccessApiUsageException("unable to delete from Solr by query: " + query, e);
        } catch (IOException e) {
            LOGGER.error("unable to delete from Solr by query: " + query, e);
            throw new TransientDataAccessResourceException("unable to delete from Solr by query: " + query, e);
        } catch (SolrException e) {
            LOGGER.error("unable to delete from Solr by query: " + query, e);
            throw translateSolrException("unable to delete from Solr by query: " + query, e);
        }
    }

    private DataAccessException translateSolrException(String message, SolrException e) {
        if (e.code() == BAD_REQUEST.ordinal()) {
            return new InvalidDataAccessResourceUsageException(message, e);
        } else if (e.code() == UNAUTHORIZED.ordinal() || e.code() == FORBIDDEN.ordinal()) {
            return new PermissionDeniedDataAccessException(message, e);
        } else if (e.code() == NOT_FOUND.ordinal()) {
            return new InvalidDataAccessApiUsageException(message, e);
        } else {
            return new DataAccessResourceFailureException(message, e);
        }
    }
}
