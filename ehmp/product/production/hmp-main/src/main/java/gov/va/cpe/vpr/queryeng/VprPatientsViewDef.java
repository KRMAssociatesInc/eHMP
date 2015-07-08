package gov.va.cpe.vpr.queryeng;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * {@link ViewDef} for browsing through all patients in the VPR
 */
@Component(value = "gov.va.cpe.vpr.queryeng.VprPatientsViewDef")
@Scope("prototype")
public class VprPatientsViewDef extends ViewDef {
    public VprPatientsViewDef() {
        // fetch VPR PIDs for all patients in the VPR
        QueryDef qry = new QueryDef("syncstatus");
        qry.setForPatientObject(false);
        qry.where("forOperational").is("false");
        
        JDSQuery query = new JDSQuery("uid", qry);
        addQuery(query);

        // fetch domain counts per patient
        addQuery(new QueryMapper.PerRowAppendMapper(new JDSQuery("pid", new QueryDef(), "/vpr/{pid}/count/collection") {
            @Override
            protected void filterTransformResults(RenderTask task, Map<String, Object> params, List<Map<String, Object>> items) {
                RenderTask.RowRenderSubTask rowtask = (RenderTask.RowRenderSubTask) task;
                String pid = (String) rowtask.getParentRowVal("pid");
                Map<String, Integer> allStats = getAllStatsFromJdsResult(rowtask.getParentRow());
                Map<String, Object> jdsKeyedStats = new HashMap<>();
                for(String key: allStats.keySet()) {
                    // We can't compare raw VISTA to raw SOLR; SOLR has the converted domains such as lab->result and appt/visit->encounter.
                    // So, let's drive this off of our "official" UID-to-class map in UidUtils.
                    String domainKey = UidUtils.getDomainClass(key).getSimpleName().toLowerCase();
                    domainKey = domainKey.equals("medication")?"med":domainKey.equals("observation")?"obs":domainKey;
                            Integer eval = (Integer)jdsKeyedStats.get(getJdsDomainCountKey(domainKey));
                    if(eval!=null) {
                        eval = eval + allStats.get(key);
                    }
                    else {
                        eval = allStats.get(key);
                    }
                    jdsKeyedStats.put(getJdsDomainCountKey(domainKey), eval);
                }
                task.appendRow(pid, jdsKeyedStats);
            }
        }));
        // fetch domain counts per patient from Solr
        addQuery(new QueryMapper.PerRowAppendMapper(new SOLRFacetQuery("pid", "pid:#{getParentRowVal('pid')}", "domain") {
            @Override
            protected void modifySolrQuery(SolrQuery qry, RenderTask task) {
                super.modifySolrQuery(qry, task);
                qry.setFacetMinCount(0);
            }

            @Override
            protected void mapResults(RenderTask task, QueryResponse resp) {
                FacetField ff = resp.getFacetFields().get(0);
                if (ff == null || ff.getValues() == null) {
                    return;
                }

                if (task instanceof RenderTask.RowRenderSubTask) {
                    Map<String, Object> map = new HashMap<String, Object>();
                    map.put(getPK(), ((RenderTask.RowRenderSubTask) task).getParentRowVal(getPK()));
                    for (FacetField.Count c : ff.getValues()) {
                        String solrDomainCountKey = getSolrDomainCountKey(c.getName());
                        map.put(solrDomainCountKey, c.getCount());
                    }
                    task.add(mapRow(task, map));
                }
            }

            @Override
            protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
                row.put("jdsSolrCountMismatch", isJdsSolrCountMismatch(row));
                return row;
            }

            private boolean isJdsSolrCountMismatch(Map<String, Object> row) {
                for (String domain : UidUtils.getAllPatientDataDomains()) {
                    String jdsKey = getJdsDomainCountKey(domain);
                    String solrKey = getSolrDomainCountKey(domain);
                    Object jdsValue = row.get(jdsKey);
                    Object solrValue = row.get(solrKey);
                    if (jdsValue == null && solrValue == null) continue;
                    if ((jdsValue != null && solrValue == null) || (jdsValue == null && solrValue != null)) {
                        return true;
                    }
                    if (!jdsValue.equals(solrValue)) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
        }));

        addColumns(query,
                "pid",
                "displayName",
                "error");

        List<String> domains = new ArrayList(UidUtils.getAllPatientDataDomainClasses());
        List<String> jdsDomains = Lists.transform(domains, new Function<String, String>() {
            public String apply(String input) {
                return getJdsDomainCountKey(input);
            }
        });
        List<String> solrDomains = Lists.transform(domains, new Function<String, String>() {
            public String apply(String input) {
                return getSolrDomainCountKey(input);
            }
        });

        addColumns(query, jdsDomains);
        addColumns(query, solrDomains);
    }

    private Map<String, Integer> getAllStatsFromJdsResult(Map<String, Object> parentRow) {
        Map<String, Integer> allDomainTotals = new HashMap<>();
        Object stat = parentRow.get("syncStatusByVistaSystemId");
        if((stat != null) && (stat instanceof Map)) {
            for(Object systemMap: ((Map)stat).values()) {
                Object dtots = ((Map)systemMap).get("domainExpectedTotals");
                if(dtots!=null && dtots instanceof Map) {
                    for(Object key: ((Map)dtots).keySet()) {
                        Object countsMap = ((Map)dtots).get(key);
                        if(countsMap!=null && countsMap instanceof Map) {
                            Object count = ((Map)countsMap).get("count");
                            if(count!=null) {
                                Integer cnt = Integer.parseInt(count.toString());
                                allDomainTotals.put(key.toString(), allDomainTotals.get(key.toString())!=null?allDomainTotals.get(key.toString()):0 + cnt);
                            }
                        }
                    }
                }
            }
        }
        return allDomainTotals;
    }

    private String getJdsDomainCountKey(String key) {
        return "jds" + StringUtils.capitalize(key);
    }

    private String getSolrDomainCountKey(String key) {
        return "solr" + StringUtils.capitalize(key);
    }
}
