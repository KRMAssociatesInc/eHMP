package gov.va.cpe.vpr.pom.jds;

import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.*;
import gov.va.hmp.jsonc.JsonCCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.dao.support.DaoSupport;
import org.springframework.data.domain.*;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class JdsDaoSupport extends DaoSupport {

    protected final Logger logger;

    protected JdsOperations jdsTemplate;
    protected IVprSyncStatusDao syncStatusDao;

    protected POMObjectMapper jsonMapper = new POMObjectMapper();
    protected INamingStrategy namingStrategy = new JdsNamingStrategy();

    public JdsDaoSupport() {
        logger = LoggerFactory.getLogger(getClass());
    }

    protected static void addPaginationQueryParams(Pageable pageable, UriComponentsBuilder uri) {
        if (pageable == null) return;

        uri.queryParam("start", pageable.getOffset());
        uri.queryParam("limit", pageable.getPageSize());

        addSortQueryParams(pageable.getSort(), uri);
    }

    protected static void addSortQueryParams(Sort sort, UriComponentsBuilder uri) {
        if (sort == null) return;

        for (Sort.Order order : sort) {
            uri.queryParam("order", order.getProperty());
        }
    }

    public void setJdsTemplate(JdsOperations jdsTemplate) {
        this.jdsTemplate = jdsTemplate;
    }

    @Override
    protected void checkDaoConfig() throws IllegalArgumentException {
        Assert.notNull(this.jdsTemplate, "jdsTemplate must not be null");
    }

    protected String getCollectionName(Class type) {
        return namingStrategy.collectionName(type);
    }

    protected <T extends IPOMObject> Page<T> findAllInternal(Class<T> type, String uri) {
        return findAllInternal(type, uri, null);
    }

    protected <T extends IPOMObject> Page<T> findAllInternal(Class<T> type, String uri, Map<String, Object> uriVariables) {
        JsonCCollection<Map<String, Object>> jsonc = uriVariables == null ? jdsTemplate.getForJsonC(uri) : jdsTemplate.getForJsonC(uri, uriVariables);
        if (jsonc == null) throw new DataRetrievalFailureException("JDS getForJsonC at '" + uri + "' returned null");

        List<T> list = new ArrayList<T>(jsonc.getItems().size());
        for (Map<String, Object> item : jsonc.getItems()) {
            list.add(POMUtils.newInstance(type, item));
        }
        if (jsonc.getStartIndex() != null && jsonc.getItemsPerPage() != null && jsonc.getItemsPerPage() > 0) {
            int pageNum = jsonc.getStartIndex() / jsonc.getItemsPerPage();
            return new PageImpl<T>(list, new PageRequest(pageNum, jsonc.getItemsPerPage()), jsonc.getTotalItems());
        } else {
            return new PageImpl<T>(list, null, jsonc.getTotalItems());
        }
    }

    protected <T extends IPOMObject> List<T> findAllByUrl(Class<T> clazz, String url, Map<String, Object> params) {
        Page<T> page = findAllInternal(clazz, url, params);
        return page.getContent();
    }

    public static String quoteAndWildcardQuery(String query) {
        if (StringUtils.hasText(query)) {
            query = "\"" + query + "\"";
            if (!query.endsWith("*"))
                query += "*";
        }
        return query;
    }
}
