package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.dao.IVprUpdateDao;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.SyncOnApplicationInit;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.msg.ErrorLevel;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.TimeoutWaitingForRpcResponseException;
import gov.va.hmp.vista.rpc.broker.conn.ServerNotFoundException;
import gov.va.hmp.vista.rpc.broker.conn.ServerUnavailableException;
import gov.va.hmp.vista.rpc.broker.protocol.InternalServerException;

import java.net.UnknownHostException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.context.ApplicationListener;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class VprUpdateJob implements Runnable, EnvironmentAware,ApplicationListener<ContextClosedEvent> {

    public static final String EXISTING_PT_UPDATE_CALLS = "existingPtUpdateCalls";
    private static Logger LOG = LoggerFactory.getLogger(VprUpdateJob.class);
	private boolean isSiteMonitorInitialized=false;
    private IVistaVprDataExtractEventStreamDAO vistaEventStreamDAO;
    private ISyncService syncService;
    private IVprSyncStatusDao syncStatusDao;
    private IBroadcastService bcSvc;
    private IVistaAccountDao vistaAccountDao;
    private IVprUpdateDao lastUpdateDao;

    private IPrimarySiteMonitorsMap primarySiteMonitorsMap;

	private String serverId;
    private boolean shuttingDown = false;

    SyncOnApplicationInit syncOnApplicationInit;
    private Map<String, Integer> failCount = new HashMap<String, Integer>();
    private Map<String, Long> failTimes = new HashMap<String, Long>();
    private Long syncMaxRetryHours;
    private Integer syncPauseBeforeRetrySeconds;
    private Integer syncRetryOnVistaErrorAttempts;

    
    @Autowired
	public void setPrimarySiteMonitorsMap(IPrimarySiteMonitorsMap monitors) {
		this.primarySiteMonitorsMap = monitors;
	}
    
    @Autowired
    public void setSyncStatusDao(IVprSyncStatusDao syncStatusDao) {
        this.syncStatusDao = syncStatusDao;
    }

    
    @Override
    public void setEnvironment(Environment environment) {
        this.syncMaxRetryHours = environment.getProperty(HmpProperties.SYNC_MAX_RETRY_HOURS, Long.class, 8L);
        this.syncPauseBeforeRetrySeconds = environment.getProperty(HmpProperties.SYNC_PAUSE_BEFORE_RETRY_SECONDS, Integer.class, 0);
        this.syncRetryOnVistaErrorAttempts = environment.getProperty(HmpProperties.SYNC_RETRY_ON_VISTA_ERROR_ATTEMPTS, Integer.class, 3);

    }


    @Autowired
    public void setBroadcastService(IBroadcastService bcSvc) {
        this.bcSvc = bcSvc;
    }

    @Autowired
    public void setSyncOnApplicationInit(SyncOnApplicationInit x) {
        this.syncOnApplicationInit = x;
    }

    @Autowired
    public void setVistaEventStreamDAO(IVistaVprDataExtractEventStreamDAO vistaEventStreamDAO) {
        this.vistaEventStreamDAO = vistaEventStreamDAO;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setLastUpdateDao(IVprUpdateDao lastUpdateDao) {
        this.lastUpdateDao = lastUpdateDao;
    }

    @Required
    public void setServerId(String serverId) {
        this.serverId = serverId;
    }

    //disabled or enable all primary sites. If the primary site is disabled from this method, it will
    //get automatically enabled after the startup time(5 minutes) is reached.
    public synchronized void setDisabled(boolean disabled) 
    {
    	HashMap<String,PrimarySiteMonitor>	monitors=primarySiteMonitorsMap.getPrimarySiteMonitors();

    	if(monitors!=null)
    	{
	    	Iterator<Entry<String, PrimarySiteMonitor>> i=monitors.entrySet().iterator();
	    	if(i!=null)
	    	{
	    		while(i.hasNext())
	    		{
	    			Map.Entry<String, PrimarySiteMonitor> monitor=i.next();
	    			monitor.getValue().setDataStreamDisabled(disabled);
	    			monitor.getValue().setDataStreamDisabledTime(new Date());
	    		}
	    	}
	    	if(disabled)
	    	{
	    		LOG.error("The primary sites are now disabled");
	    	}
	    	else
	    	{
	    		LOG.debug("The primary sites are now enabled");
	    	}
    	}
    }
    
    
    //return true if all the primary sites are disabled.
    public boolean isDisabled() 
    {
    	HashMap<String,PrimarySiteMonitor>	monitors=primarySiteMonitorsMap.getPrimarySiteMonitors();

    	Iterator<Entry<String, PrimarySiteMonitor>> i=monitors.entrySet().iterator();

    	if(i!=null)
    	{
    		while(i.hasNext())
    		{
    			Map.Entry<String, PrimarySiteMonitor> monitor=i.next();
    			
    			if(!isDataStreamDisabled(monitor.getKey()))
    			{
    				return false;
    			}    			
    		}
    		return true;
    	}
       return false;
    }

    private synchronized void setShuttingDown(boolean shuttingDown) {
        this.shuttingDown = shuttingDown;
    }

    @Override
    public void run() 
    {
        LOG.trace("VprUpdateJob.run() - entering method");
    	
    	initializePrimarySiteMonitors();
        if (isShuttingDown()) {
            LOG.trace("VprUpdateJob.run() - leaving method - shutDown in process");
            return;
        }
        if (isDisabled()) {
            LOG.trace("VprUpdateJob.run() - leaving method - all sites are disabled");
            return;
        }
        if (syncOnApplicationInit == null || !syncOnApplicationInit.isDone()) {
            LOG.trace("VprUpdateJob.run() - leaving method - syncOnApplicationInit is NOT done.");
            return;
        }

        LOG.trace("VprUpdateJob.run() - looping through VistaAccounts - checking for updates.");
        List<VistaAccount> accounts = vistaAccountDao.findAllByVistaIdIsNotNull();
        for (VistaAccount account : accounts) 
        {
            String vistaId = account.getVistaId();
            LOG.trace("VprUpdateJob.run() - checking for updates for site: " + vistaId);
            
            if (!isDataStreamDisabled(vistaId) && account.isVprAutoUpdate())
            {
                String division = account.getDivision();
                try {
                    checkForUpdates(vistaId, division);
                    vistaEventStreamDAO.processPatientsWithAppointments(vistaId);
                } catch (Exception e) {
                    if (isFatalException(vistaId, division, e)) {
                        disableEventStream(vistaId, e);
                    } else {
                        if (syncPauseBeforeRetrySeconds > 0) {
                            try {
                                Thread.sleep(syncPauseBeforeRetrySeconds * 1000);
                            } catch (InterruptedException e1) {
                                LOG.error("Error during retry pause, after sync error", e1);
                            }
                        }
                    }
                }
            }
            else {
                LOG.trace("VprUpdateJob.run() - site: " + vistaId + " is disabled.  No updates were received.");
            }
        }

        LOG.trace("VprUpdateJob.run() - leaving method - normal exit.");

    }
   
    
    
    private void initializePrimarySiteMonitors()
    {
    	HashMap<String,PrimarySiteMonitor>	monitors=primarySiteMonitorsMap.getPrimarySiteMonitors();

    	if(!isSiteMonitorInitialized)
    	{
    		monitors=new HashMap<String,PrimarySiteMonitor>();

            List<VistaAccount> accounts = vistaAccountDao.findAllByVistaIdIsNotNull();
            for (VistaAccount account : accounts) 
            {
                PrimarySiteMonitor monitor=new PrimarySiteMonitor();
                
                if(account.getOnExceptionRetryCount()!=null)
                	monitor.setOnExceptionRetryCount(Integer.parseInt(account.getOnExceptionRetryCount()));
                if(account.getStartupWaitTime()!=null)
                	monitor.setStartupWaitTime(Long.parseLong(account.getStartupWaitTime()));
                monitors.put(account.getVistaId(), monitor);
                
            }
            
            primarySiteMonitorsMap.setPrimarySiteMonitors(monitors);
      		isSiteMonitorInitialized=true;
    	}

    }
    
    
    public boolean isDataStreamDisabled(String vistaId)
    {
    	HashMap<String,PrimarySiteMonitor>	monitors=primarySiteMonitorsMap.getPrimarySiteMonitors();
        PrimarySiteMonitor monitor=monitors.get(vistaId);

        //if site is disabled
        if(monitor!=null && monitor.isDataStreamDisabled() && monitor.getDataStreamDisabledTime()!=null)
        {
        	Calendar shutdownTime=Calendar.getInstance();
        	shutdownTime.setTime(monitor.getDataStreamDisabledTime());
        	
        	Calendar currentTime=Calendar.getInstance();
        	currentTime.setTime(new Date());
        	
        	long timeDiff=currentTime.getTimeInMillis()- shutdownTime.getTimeInMillis();
        	
        	//enable the site if startup time is reached.
        	if(timeDiff>monitor.getStartupWaitTime())
        	{
        		syncService.setDataStreamEnabled(true, null,null);
        		monitor.setDataStreamDisabled(false);
        		monitor.setDataStreamDisabledTime(null);
        		LOG.debug(" Enabled vista site id "+vistaId);
        	}
        	monitors.put(vistaId, monitor);

        	primarySiteMonitorsMap.setPrimarySiteMonitors(monitors);
            return monitor.isDataStreamDisabled();
        }
        return false;
    }
    
    @Override
    public void onApplicationEvent(ContextClosedEvent contextClosedEvent) {
        if (!isShuttingDown()) shutdown();
    }

    public void shutdown() {
        LOG.trace(this.toString() + ".shutdown()");
        setShuttingDown(true);
    }

    public boolean isShuttingDown() {
        return shuttingDown;
    }
    
    private void checkForUpdates(final String vistaId, String division)
    {
        LOG.trace(this.toString() + ".checkForUpdates({})", vistaId);

        VprUpdate lastUpdate = lastUpdateDao.findOneBySystemId(vistaId);
        if (lastUpdate == null) {
            lastUpdate = new VprUpdate(vistaId, "0");
        }
        if (StringUtils.isEmpty(lastUpdate.getTimestamp())) {
            lastUpdate.setData("timestamp", "0");
        }

        VprUpdateData rslt = vistaEventStreamDAO.fetchUpdates(vistaId, division, lastUpdate.getTimestamp());

        processChunks(rslt.getChunks());
        processDeletions(rslt.getUidsToDelete());
        lastUpdate.setData("timestamp", rslt.getLastUpdate());

        lastUpdateDao.save(lastUpdate);

        Map<String, Set<String>> domainsByPatientId = getDomainsByPatientId(rslt.getChunks());

        syncService.sendUpdateVprCompleteMsg(serverId, vistaId, lastUpdate.getTimestamp(), !domainsByPatientId.isEmpty() ? domainsByPatientId : null);
        resetFails(vistaId);
    }

    
    private void resetFails(String vistaId) {
        this.failCount.put(vistaId, 0);
        this.failTimes.put(vistaId, null);
    }


    private boolean isFatalException(String vistaId, String division, Exception e) {
        Throwable rootCause = (e.getCause() != null) ? e.getCause() : e;
    	if(rootCause.getClass().equals(RpcException.class)) {
    		rootCause = rootCause.getCause();
    	}
        if(rootCause instanceof UnknownHostException || rootCause instanceof ServerUnavailableException) {
            return checkIfFatal_UnknownHostOrServerUnavailable(vistaId, e);
        } else if(isInternalServerException(e)) {
            return checkIfFatal_InternalServerException(vistaId, e);
        } else if(isRpcTimeout(e)) {
            return checkIfFatal_RpcTimeout(vistaId, division);
        }
        LOG.warn(e.getCause().getClass().getSimpleName()+" encountered contacting VISTA system ID: "+vistaId);
        return true;
    }

    private boolean checkIfFatal_RpcTimeout(String vistaId, String division) {
        LOG.warn("RPC Timeout encountered; Calling health check RPC");
        try {
            JsonNode hc = vistaEventStreamDAO.getVistaHealthCheck(vistaId, division);
            JsonNode items = hc.path("data").path("items");
            if(items instanceof ArrayNode) {
                JsonNode ptcalls = ((ArrayNode)items).get(0).path(EXISTING_PT_UPDATE_CALLS);
                Integer ptupdates = ptcalls.asInt();
                if(ptupdates>0) {
                    LOG.warn("Long-running ptUpdates call seen in VISTA; Emergency-stopping update calls for safety.");
                    return true;
                }
            }
            return false;
        } catch(Exception ex) {
            if(isRpcTimeout(ex)) {
                LOG.warn("Health Check Timeout; Retry pending");
                return false;
            }
            LOG.error("Unknown exception encountered during health check RPC; Disabling Freshness");
            return true;
        }
    }
    
    private boolean checkIfFatal_InternalServerException(String vistaId, Exception e) {
        if(failCount.get(vistaId)!=null) {
            if(failCount.get(vistaId)>=syncRetryOnVistaErrorAttempts) {
                LOG.warn(e.getCause().getClass().getSimpleName()+" encountered contacting VISTA system ID: "+vistaId+"; Max. retry count exceeded");
                return true;
            }
            failCount.put(vistaId, failCount.get(vistaId)+1);
        } else {
            failCount.put(vistaId, 1);
        }
        LOG.warn(e.getCause().getClass().getSimpleName()+" encountered contacting VISTA system ID: "+vistaId+"; Retry pending");
        return false;
    }

    private boolean checkIfFatal_UnknownHostOrServerUnavailable(String vistaId, Exception e) {
        Long firstFail = failTimes.get(vistaId);
        if(firstFail==null) {
            LOG.warn(e.getCause().getClass().getSimpleName()+" encountered contacting VISTA system ID: "+vistaId+"; Retry pending");
            failTimes.put(vistaId, System.currentTimeMillis());
            return false;
        } else {
            long timeDiff = System.currentTimeMillis()-firstFail;
            long timeDiffHours = timeDiff/3600000;
            if(timeDiffHours<=syncMaxRetryHours) {
                // Allow retry
                LOG.warn(e.getCause().getClass().getSimpleName()+" encountered contacting VISTA system ID: "+vistaId+"; Retry pending");
                return false;
            } else {
                LOG.warn(e.getCause().getClass().getSimpleName()+" encountered contacting VISTA system ID: "+vistaId+"; Maximum retry time exceeded");
                return true;
            }
        }
    }
    private boolean isRpcTimeout(Exception e) {
        if(e instanceof DataAccessResourceFailureException) {
            if (e.getCause() instanceof TimeoutWaitingForRpcResponseException) {
                return true;
            }
        }
        return false;
    }
    
    private boolean isInternalServerException(Exception e) {
        if(e instanceof DataRetrievalFailureException) {
            if(e.getCause() instanceof InternalServerException) {
                 return true;
            }
        }
        return false;
    }



    private void disableEventStream(String vistaId, Exception e) {

    	String disabledMsg = "";
        if (e instanceof DataRetrievalFailureException) {
            if (e.getCause() instanceof InternalServerException) {
                disabledMsg = "There was an error in VistA while extracting data.";
            }
            LOG.error("Unable to fetch updates from VistA '" + vistaId + "'", e);
        } else if (e instanceof DataAccessResourceFailureException) {
            if (e.getCause() instanceof ServerUnavailableException || e.getCause() instanceof ServerNotFoundException) 
            {
                disabledMsg = e.getCause().getMessage();
            } 
            else if (e.getCause() instanceof TimeoutWaitingForRpcResponseException) {
                disabledMsg = "Data extract from VistA took long.";
            }
            LOG.error("Unable to fetch updates from VistA '" + vistaId + "'", e);
        }else if (e instanceof SynchronizationCredentialsNotFoundException) {
            String msg = "No updates from VistA " + vistaId + " are available. " + e.getMessage();
            LOG.warn(msg);
            disabledMsg = "Synch user credentials could not be found.";
        } else {
            LOG.error("Unable to fetch updates from VistA '" + vistaId + "'", e);
            disabledMsg = "Unexpected error processing updates from VistA.";
        }
        LOG.error(disabledMsg);
        
    	HashMap<String,PrimarySiteMonitor> monitors=primarySiteMonitorsMap.getPrimarySiteMonitors();
        PrimarySiteMonitor monitor=monitors.get(vistaId);

        LOG.debug(" Vistaid- "+vistaId+" onExceptionRetryCount "+monitor.getOnExceptionRetryCount());
 
        //disable the vista site id if the site throws exceptions multiple ( 3 ) times.
        if(vistaId!=null && monitor.getOnExceptionRetryCount() ==0)
        {
            syncService.setDataStreamEnabled(false, disabledMsg, e);
            Map<String, Object> bcMsg = new HashMap<>();
            bcMsg.put("eventName", "dataStreamDisabled");
            bcMsg.put("disabledMsg", disabledMsg);
            bcSvc.broadcastMessage(bcMsg);
            monitor.setDataStreamDisabled(true);
            monitor.setDataStreamDisabledTime(new Date());
            int retryCount=getPrimarySiteOnExceptionRetryCount(vistaId);
            monitor.setOnExceptionRetryCount((retryCount+1));
            monitors.put(vistaId, monitor);
        	primarySiteMonitorsMap.setPrimarySiteMonitors(monitors);

            LOG.error(" Disabled vista site id "+vistaId+" for "+monitor.getStartupWaitTime()+"ms due to "+monitor.getOnExceptionRetryCount()+" exceptions");
       }
        
        monitor.setOnExceptionRetryCount(monitor.getOnExceptionRetryCount()-1);
        monitors.put(vistaId, monitor);
    }
    

    private void setSyncStatusForDisabledSite(List<SyncStatus> jdsStatii,String vistaId)
    {
        for(SyncStatus stat: jdsStatii) 
        {
            SyncStatus.VistaAccountSyncStatus vstat = stat.getVistaAccountSyncStatusForSystemId(vistaId);
            vstat.setSyncComplete(true);
            vstat.setErrorMessage("Site Down");
            	
            HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
            overwriteErrorMessageForSites.add(vistaId);
            syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
            LOG.debug("setSyncStatusForDisabledSite - SyncStatus "+stat);
        }
    }
    
    private int getPrimarySiteOnExceptionRetryCount(String vistaId)
    {
        List<VistaAccount> accounts = vistaAccountDao.findAllByVistaIdIsNotNull();
        for (VistaAccount account : accounts) 
        {
        	if(vistaId!=null && account.getVistaId()!=null && account.getVistaId().equals(vistaId))
        	{
        		if(account.getOnExceptionRetryCount()!=null)
        		{
        			return (Integer.parseInt(account.getOnExceptionRetryCount()));
        		}
        	}
        	
        }   
        return 0;
    } 
 
    /**
     * Disables all streaming (both synching and freshness) from this VistA system until patch can be applied to fix M
     * routine that errored out
     *
     * @param vistaId
     */
    private void disableAutomaticUpdates(String vistaId) {
        List<VistaAccount> vistaAccounts = vistaAccountDao.findAllByVistaId(vistaId);
        for (VistaAccount vistaAccount : vistaAccounts) {
            vistaAccount.setVprAutoUpdate(false);
            vistaAccountDao.save(vistaAccount);
        }
    }

    private void calculateVistaTimeDiff(VprUpdateData data, String vistaId) {
        PointInTime vistaStartTime = data.getStartDateTime();
        PointInTime vistaEndTime = data.getEndDateTime();
        PointInTime localRpcCallStartTime = data.getCallTime();
        long dtval = System.currentTimeMillis();
        Date dt = new Date(dtval);
        PointInTime localNowTime = PointInTime.fromDateFields(dt);

        if (vistaStartTime != null && vistaEndTime != null && localRpcCallStartTime != null) {
            long callStartLatency = vistaStartTime.subtract(localRpcCallStartTime).getMillis();
            long callFinishLatency = localNowTime.subtract(vistaEndTime).getMillis();
            long vistaShift = (callFinishLatency + callStartLatency) / 2;
            long vistaAveragedTime = ((vistaStartTime.toLocalDateTime().toDate().getTime() + vistaEndTime.toLocalDateTime().toDate().getTime()) / 2) + vistaShift;

            long localAveragedTime = (dt.getTime() + localRpcCallStartTime.toLocalDateTime().toDate().getTime()) / 2;
            long calculatedVistaTimeDiff = ((vistaAveragedTime - localAveragedTime + 50000) / 100000);
            calculatedVistaTimeDiff = calculatedVistaTimeDiff * 100000;
            // If it doesn't come out to a 15-minute interval, we fail, fail fail!
            long diffCheck = calculatedVistaTimeDiff / 900000;
            if (diffCheck * 900000 != calculatedVistaTimeDiff) {
                LOG.warn(this.toString() + ".calculateVistaTimeDiff - Diff was not an even 15 minute interval: " + calculatedVistaTimeDiff);
            } else {
                for (VistaAccount vistaAccount : vistaAccountDao.findAllByVistaId(vistaId)) {
                    if (vistaAccount.getCalculatedVistaTimeDiff() != calculatedVistaTimeDiff) {
                        vistaAccount.setCalculatedVistaTimeDiff(calculatedVistaTimeDiff);
                        vistaAccountDao.save(vistaAccount);
                    }
                }
            }
        }
    }

    private void processChunks(List<VistaDataChunk> chunks) {
        for (VistaDataChunk chunk : chunks) {
            try {
                if (LOG.isDebugEnabled()) {
                    LOG.debug("processChunks: Sending chunk to queue with pid: " + chunk.getPatientId() + "; " + chunk.objectContentsOutput("vistaDataChunk"));
                }
                syncService.sendImportVistaDataExtractItemMsg(chunk);
            } catch (Exception e) {
                LOG.warn("unexpected exception sending import message", e);
            }
        }
    }

    private void processDeletions(Set<String> uidsToDelete) {
        for (String uid : uidsToDelete) {
            syncService.sendClearItemMsg(uid);
        }
    }

    private Map<String, Set<String>> getDomainsByPatientId(List<VistaDataChunk> chunks) {
        Map<String, Set<String>> domainsByPatientId = new HashMap<String, Set<String>>();
        for (VistaDataChunk chunk : chunks) {
            String pid = chunk.getPatientId();
            if (!StringUtils.hasText(pid)) continue;
            if (!domainsByPatientId.containsKey(pid)) {
                domainsByPatientId.put(pid, new HashSet<String>());
            }
            domainsByPatientId.get(pid).add(chunk.getDomain());
        }
        return domainsByPatientId;
    }

    private void processExceptions(VprUpdateData data, String vistaId, String serverId) {
        for (Exception e : data.getExceptions()) {
            LOG.error("exception during fetchUpdates() at " + vistaId, e);
            Map<Object, Object> msg = new HashMap<>();
            msg.put(SyncMessageConstants.VISTA_ID, vistaId);
            msg.put(HmpProperties.SERVER_ID, serverId);
            msg.put(SyncMessageConstants.VISTA_LAST_UPDATED, data.getLastUpdate());
            msg.put(SyncMessageConstants.TIMESTAMP, System.currentTimeMillis());
            syncService.errorDuringMsg(msg, e, ErrorLevel.ERROR);
        }
    }
}
