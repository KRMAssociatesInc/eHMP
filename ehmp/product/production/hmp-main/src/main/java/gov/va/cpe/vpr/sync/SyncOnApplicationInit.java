package gov.va.cpe.vpr.sync;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.IVprUpdateDao;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import org.apache.solr.client.solrj.SolrServerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Triggers a sync of operational data on Spring {@link org.springframework.context.event.ContextStartedEvent}.
 */
@Component
public class SyncOnApplicationInit implements Runnable {

    private ISyncService syncService;
    private IVistaAccountDao vistaAccountDao;
    private JdsOperations jdsTemplate;
    private Logger logger = LoggerFactory.getLogger(getClass());
    private IVprUpdateDao lastUpdateDao;
    private int darfRetrySeconds = 30;
    private int tdaRetrySeconds = 4;

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    private boolean done = false;

    @Autowired
    public SyncOnApplicationInit(IVistaAccountDao vistaAccountDao, ISyncService syncService, JdsOperations jdsTemplate) {
        this.syncService = syncService;
        this.vistaAccountDao = vistaAccountDao;
        this.jdsTemplate = jdsTemplate;
    }

    @Autowired
    public void setLastUpdateDao(IVprUpdateDao lastUpdateDao) {
        this.lastUpdateDao = lastUpdateDao;
    }

    @Override
    public void run() {
        // TODO: Reindex on a condition that makes sense, or perhaps in hmpmgr when doing an upgrade
//        syncService.sendReindexAllPatientsMsg();
        while(!done) {
            try {
           /*
            Skip if operational data exists
            TODO: Querying by site doesn't exist in the JDS yet.
            When we can do operational data totals by site, we should put this down in the site loop
            for the case when a new site has been added and the system restarted.
         */

                if(operationalDataExists()) {
                    if(solrReindexRequired()) {
                        syncService.setReindexAllComplete(false);
                        syncService.sendReindexAllPatientsMsg();
                    }
                    done = true;
                    logger.info("Operational data found in JDS; Skipping first-time operational data synch.");
                    return;
                }

                logger.info("Starting first-time operational data synchronization.");

                List<VistaAccount> vistaInstances = vistaAccountDao.findAllByVistaIdIsNotNull();
                for (VistaAccount vista : vistaInstances) {
                    if (vista.isOdcAutoInit()) {
                        String vistaId = vista.getVistaId();
                        lastUpdateDao.deleteAll();
                        syncService.resetServerSubscriptions(vistaId);
                        syncService.subscribeOperational(vistaId);
                    }
                }
                done = true;
            } catch(DataAccessResourceFailureException e) {
                /*
                Case: Server is down or unreachable. Let's wait 30sec and retry.
                 */

                logger.error("Unable to connect to VISTA server. Retry in "+darfRetrySeconds+" seconds.", e);
                try {
                    Thread.sleep(darfRetrySeconds*1000);
                } catch (InterruptedException e1) {
                    e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
            } catch(TransientDataAccessException e) {
                /*
                Case: Flaky network sorta stuff. Timeouts / etc.
                 */
                logger.error("General network error. Retrying in "+tdaRetrySeconds+" seconds.",e);
                try {
                    Thread.sleep(tdaRetrySeconds*1000);
                } catch (InterruptedException e1) {
                    e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
            } catch(InvalidDataAccessResourceUsageException e) {
                logger.error("Vista configuration incorrect, or account misconfigured. Synch and auto-update disabled.",e);
                break;
            } catch(PermissionDeniedDataAccessException e) {
                logger.error("Vista configuration incorrect, or account misconfigured. Synch and auto-update disabled.",e);
                break;
            } catch(InvalidDataAccessApiUsageException e) {
                logger.error("Vista configuration incorrect, or account misconfigured. Synch and auto-update disabled.",e);
                break;
            } catch(Exception e) {
                logger.error("Error during operational data initialization; Synch and auto-update disabled.",e);
                break;
            }
        }
    }

    private boolean solrReindexRequired() throws SolrServerException {
        Map<String, Integer> solrJdsPids = syncService.getIndexAndJdsPatientCounts();
        if(solrJdsPids.get("solrPidCount")>=solrJdsPids.get("jdsPidCount")) {
            return false;
        }
        return true;
    }

    private boolean operationalDataExists() {
        JsonCCollection<Map<String, Object>> jsonc = jdsTemplate.getForJsonC("/data/all/count/collection");
        for (Map item : jsonc.getItems()) {
             if(UidUtils.getAllDomains().contains(item.get("topic")) && (Integer) item.get("count") > 0) {
                 return true;
             }
        }
        return false;
    }
}
