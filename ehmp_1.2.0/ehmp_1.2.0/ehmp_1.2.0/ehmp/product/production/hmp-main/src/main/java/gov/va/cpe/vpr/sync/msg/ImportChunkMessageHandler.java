package gov.va.cpe.vpr.sync.msg;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.dao.RoutingDataStore;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.frameeng.IFrameRunner;
import gov.va.cpe.vpr.pom.*;
import gov.va.cpe.vpr.queryeng.dynamic.IViewDefDefDAO;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.asu.AsuDecisionRequest;
import gov.va.hmp.access.asu.AsuPolicyDecisionPoint;
import gov.va.hmp.access.asu.DocumentAction;
import gov.va.hmp.access.asu.DocumentAsuDecisionRequest;
import gov.va.hmp.auth.HmpUser;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.TeamPosition;
import gov.va.hmp.auth.VistaUserClassAuthority;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.util.NullChecker;
import gov.va.hmp.vista.rpc.RpcIoException;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.convert.ConversionService;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.security.core.GrantedAuthority;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.access.Decision.DENY;
import static gov.va.hmp.access.Decision.INDETERMINATE;

public class ImportChunkMessageHandler implements SessionAwareMessageListener, EnvironmentAware {
    public static final String VPR_IMPORT_TIMER = MessageDestinations.IMPORT_QUEUE;
    private static SecureRandom RANDOM = new SecureRandom();
    private static Logger log = LoggerFactory.getLogger(ImportChunkMessageHandler.class);

    private MetricRegistry metrics;
    private IFrameRunner runner;
    private ConversionService conversionService;
    private RoutingDataStore routingDao;
    private IGenericPatientObjectDAO dao;
    private IBroadcastService bcSvc;
    private ApplicationContext ctx;
    private IViewDefDefDAO vddDao; // for now; refactration imminent (famous last words!)
    private IGenericPOMObjectDAO dao2;
    private SimpleMessageConverter messageConverter;
    private IVprSyncErrorDao errorDao;
    private IVprSyncStatusDao syncStatusDao;
    private IVistaAccountDao vistaAccountDao;
    @Autowired
    private AsuPolicyDecisionPoint asuPolicyDecisionPoint;

    private boolean simulateErrors = false;
    private static String LOW_PRIVILEGE_USER = null;
    private static HmpUserDetails HMPUSER;

    @Autowired
    public void setEnvironment(Environment environment) {
        log.debug("setEnvironment: entering setEnvironment method.");
        LOW_PRIVILEGE_USER = environment.getProperty(HmpProperties.LOW_PRIV_USER);
    }

    public void initialize() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        String userClass = LOW_PRIVILEGE_USER;
        if(userClass == null) {
            userClass = "";
        }
        authorities.add(new VistaUserClassAuthority(UidUtils.getUserUid("Salar", "Eric"), userClass));
        HMPUSER = new HmpUser(null, null, null, null, null, null, null, false, true, true, true, 0, 0, authorities, new ArrayList<TeamPosition>());
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }
    
    @Autowired
    public void setMetricRegistry(MetricRegistry metrics) {
        this.metrics = metrics;
    }

    @Autowired
    public void setFrameRunner(IFrameRunner runner) {
        this.runner = runner;
    }

    @Autowired
    public void setConversionService(ConversionService conversionService) {
        this.conversionService = conversionService;
    }
    @Autowired
    public void setRoutingDao(RoutingDataStore routingDao) {
        this.routingDao = routingDao;
    }
    @Autowired
    public void setPatientObjectDao(IGenericPatientObjectDAO dao) {
        this.dao = dao;
    }
    @Autowired
    public void setBroadcastService(IBroadcastService bcSvc) {
        this.bcSvc = bcSvc;
    }
    @Autowired
    public void setCtx(ApplicationContext ctx) {
        this.ctx = ctx;
    }
    @Autowired
    public void setVddDao(IViewDefDefDAO vddDao) {
        this.vddDao = vddDao;
    }
    @Autowired
    public void setDao2(IGenericPOMObjectDAO dao2) {
        this.dao2 = dao2;
    }

    @Autowired
    public void setMessageConverter(SimpleMessageConverter messageConverter) {
    	this.messageConverter = messageConverter;
    }
    
    @Autowired
    public void setSyncStatusDao(IVprSyncStatusDao syncStatusDao) {
        this.syncStatusDao = syncStatusDao;
    }

    public void setSimulateErrors(boolean simulateErrors) {
        this.simulateErrors = simulateErrors;
    }

    public void onMessage(Message message, Session session) {
    	if (log.isDebugEnabled()) log.debug("ImportChunkMessageHandler.onMessage().  Entering method...");
    	try {
            List<String> vistaIds = vistaAccountDao.findAllVistaIds();

            Map msg = (Map) messageConverter.fromMessage(message);
			 Timer.Context importTimerContext = metrics.timer(MetricRegistry.name(VPR_IMPORT_TIMER)).time();

            /**
             * Am I abusing VistaDataChunk to put a command in there?
             */
		        VistaDataChunk chunk = null;
		        try {
		            // turn the message into a chunk
		            chunk = conversionService.convert(msg, VistaDataChunk.class);

		            if (log.isDebugEnabled()) {
		                log.debug("ImportChunkMessageHandler:importing item: {}", chunk.toString());
                        log.debug("ImportChunkMessageHandler:item detail: {}", chunk.getJson());
		            }

		            // turn the chunk into a domain object
                    if(chunk.getType().equals(VistaDataChunk.COMMAND)) {
                        Map<String, Object> commandMap = conversionService.convert(chunk, Map.class);
                        String command = commandMap.get("command").toString();
                        if(command.equalsIgnoreCase("deleteUidForPatient")) {
                            dao.deleteByUID(commandMap.get("uid").toString());
                        } else if(command.equalsIgnoreCase("deleteOperationalUid")) {
                            dao2.deleteByUID(commandMap.get("uid").toString());
                        } else if(command.equalsIgnoreCase("deleteDomainForPatient")) {
                            String domain = commandMap.get("domain").toString();
                            String pid = commandMap.get("pid").toString();
                            String system = commandMap.get("system").toString();
                            dao.deleteCollectionByPIDAndSystem(domain, pid, system);
                        } else if(command.equalsIgnoreCase("deleteOperationalDomain")) {
                            String domain = commandMap.get("domain").toString();
                            String system = commandMap.get("system").toString();
                            dao2.deleteCollectionBySystem(domain, system);
                        }
                    } else if(chunk.getType().equals(VistaDataChunk.ERROR)) {
                        // Good luck!
                    } else {
                        try {
                            IPOMObject domainObject = conversionService.convert(chunk, IPOMObject.class);

                            // save the domain object
                            IPatientObject oldPtObject = null;
                            Timer domainPersistTimer = getDomainPersistTimer(chunk.getDomain());
                            Timer.Context persistTimerContext = domainPersistTimer.time();
                            // Sync Status is a special case.  It means we have processed all of the items to be stored and we
                            // should now set sync status to be true for this site.
                            //-------------------------------------------------------------------------------------------------
                            if (domainObject instanceof SyncStatus) {
                                SyncStatus stat = (SyncStatus) domainObject;
                                log.debug("ImportChunkMessageHandler: Found a domainObject of type syncStatus  The original received structure.  SyncStatus: " + stat.toJSON());
                                String pid = chunk.getPatientId();
                                String vistaId = "";
                                if (NullChecker.isNotNullish(pid)) {
                                    vistaId = PidUtils.getVistaId(pid);
                                }
                                if (NullChecker.isNotNullish(vistaId)) {
                                    stat.setSyncComplete(vistaId, true);
                                    HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
                                    overwriteErrorMessageForSites.add(vistaId);
                                    log.debug("ImportChunkMessageHandler: Before saving sync status.  SyncStatus: " + stat.toJSON());
                                    stat = syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
                                    log.debug("ImportChunkMessageHandler: After saving sync status.  SyncStatus: " + stat.toJSON());
                                }
                                else {
                                    log.error("ImportChunkMessageHandler:  Failed to update sync complete - because the syncStatus chunk did not contain a valid pid.");
                                    // I am worried about this code here - the problem is without knowing the VistaId, we cannot know which item to set to true - which
                                    // also means we cannot know which one to set as an error message.  That means hitting this will cause a timeout error because one of the
                                    // sites will never be set to true.  But there is not enough infomration that we have received at this point to solve this.
                                }
                            }
                            else if (domainObject instanceof IPatientObject) {
                                log.debug("ImportChunkMessageHandler: Found a domainObject of type IPatientObject.  " + domainObject.getClass().getCanonicalName());

                                if(simulateErrors && !(domainObject instanceof PatientDemographics)) {
                                    long rnd = (long) (RANDOM.nextDouble() * 1000);
                                    if(rnd==500) {
                                        throw new RuntimeException("Simulated random error.");
                                    }
                                }
                                // get/save the old object (if any) to compute the changes later (if any)
                                oldPtObject = null;
                                try {
                                    oldPtObject = dao.findByUID(domainObject.getClass().asSubclass(IPatientObject.class), domainObject.getUid());
                                } catch(Exception e) {
                                    log.warn("Could not create class from JSON;",e);
                                }

                                if(!asuRestrictedDocument((IPatientObject) domainObject, vistaIds)) {
                                    routingDao.save((IPatientObject) domainObject);
                                } else {
                                    log.debug("Not saving due to failed ASU check. "+domainObject.getUid());
                                }

                            } else {
                                log.debug("ImportChunkMessageHandler: Found a domainObject which is NOT SyncStatus or IPatientObject.  " + domainObject.getClass().getCanonicalName());
                                dao2.save(domainObject);
                                if (domainObject instanceof ViewDefDef) {
			                    /*
			            		 * The boards have this funny ArrayList of abstract column classes.
			            		 * The special "viewdefdef" DAO has logic to re-inflate these into their actual classes.
			            		 * JSON parsing does not handle this correctly - could be I am just not using the Serializer and Deserializer stuff correctly.
			            		 */
                                    ViewDefDef vdd = vddDao.findByUid(((ViewDefDef) domainObject).getUid());
                                    FrameRegistry.ViewDefDefFrameLoader fload = (FrameRegistry.ViewDefDefFrameLoader) ctx.getBean("vddLoader");
                                    fload.update(vdd);
                                }
                            }
                            persistTimerContext.stop();

                            // trigger frameeng and ui.notify events (currently only for IPatientObjects - probably need to expand)
                            broadcastMessage(domainObject, chunk, oldPtObject);
                        } catch(Exception e) {
                            log.error("ImportChunkMessageHandler:error handling msg: " + msg.toString(), e);
                            errorDao.save(new SyncError(message, msg, e));
                            session.recover();
                        }
                    }
                } catch (RpcIoException e) {
                    log.error("ImportChunkMessageHandler:error handling msg: " + msg.toString(), e);
                    errorDao.save(new SyncError(message, msg, e));
                    session.recover();
		        } catch (Exception e) {
		            log.error("ImportChunkMessageHandler:error handling msg: " + msg.toString(), e);
                    errorDao.save(new SyncError(message, msg, e));
                    session.recover();
		        } finally {
		            importTimerContext.stop();
		        }
		} catch (Exception e) {
            log.error("ImportChunkMessageHandler:Unable to dispatch JMS message to converter", e);
            try {
//              TODO:  message.setStringProperty("rollbackMessage","Unable to dispatch JMS message to converter: "+e.getMessage());
                session.recover();
            } catch (JMSException e1) {
                e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }
    }

    private boolean asuRestrictedDocument(IPatientObject domainObject, List<String> vistaIds) {
        String uid = domainObject.getUid();
        if (UidUtils.getDomainClassByUid(uid) != Document.class || LOW_PRIVILEGE_USER == null) return false;
        String siteId = VistaStringUtils.piece(uid, ":", 4);
        if (isVistaSite(siteId, vistaIds) && Document.isTIU(domainObject)) {
            Document document = (Document) domainObject;
            AsuDecisionRequest request = new DocumentAsuDecisionRequest(ImportChunkMessageHandler.HMPUSER, DocumentAction.VIEW, document);

            AuthorizationDecision decision = asuPolicyDecisionPoint.evaluate(request);
            if (INDETERMINATE.equals(decision.getDecision())) {
                return true;
            } else if (DENY.equals(decision.getDecision())) {
                return true;
            }
        }

        return false;
    }

    private boolean isVistaSite(String site, List<String> vistaIds) {
        boolean bVistaSite = false;
        if ((NullChecker.isNotNullish(site)) &&
                (NullChecker.isNotNullish(vistaIds)) &&
                (vistaIds.contains(site))) {
            bVistaSite = true;
        }

        return bVistaSite;
    }

    private void broadcastMessage(IPOMObject domainObject, VistaDataChunk chunk, IPatientObject oldPtObject) {
        if (domainObject instanceof IPatientObject) {
            IPatientObject ptObject = (IPatientObject) domainObject;

            // compute the update events differently for freshness update vs inital (re)sync
            List<PatientEvent<IPatientObject>> events = null;
            String pid = "";
            if (!chunk.isBatch()) {
                if (oldPtObject != null) {
                    oldPtObject.setData(ptObject.getData());
                    events = oldPtObject.getEvents();
                    pid = oldPtObject.getPid();
                }

                // send the domainChange broadcast messages
                Map<String, Object> evt = new HashMap<String, Object>();
                evt.put("eventName", "domainChange");
                evt.put("domain", UidUtils.getDomainNameByUid(domainObject.getUid()));
                evt.put("pid", pid);
                bcSvc.broadcastMessage(evt);

            } else {
                // this is a (re)sync, do not compute field changes (they should all be new)
                // also mark the event type as RELOAD (instead of CREATE)
                events = ptObject.getEvents();
                if (events == null) events = Collections.emptyList();
                for (PatientEvent<IPatientObject> evt : events) {
                    evt.setType(PatientEvent.Type.RELOAD);
                }
            }

            // if any events were generated (for freshness update or sync), push them
            if (events != null) {
                Timer.Context pushEventsContext = metrics.timer(MetricRegistry.name("vpr.pushevents", chunk.getDomain())).time();
                runner.pushEvents(events);
                pushEventsContext.stop();
            }
        } else if (domainObject instanceof SyncStatus) {
            Map<String, Object> message = new HashMap<String, Object>();
            message.put("eventName", "syncStatusChange");
            message.put("syncStatus", domainObject.getData());
            bcSvc.broadcastMessage(message);
        } else {
            if (!chunk.isBatch()) {
// send the domainChange broadcast messages
                Map<String, Object> evt = new HashMap<String, Object>();
                evt.put("eventName", "operationalDataChange");
                evt.put("domain", UidUtils.getCollectionNameFromUid(domainObject.getUid()));
                evt.put("uid", domainObject.getUid());
                bcSvc.broadcastMessage(evt);
            }
        }
    }

    private Timer getDomainPersistTimer(String domain) {
        return metrics.timer(MetricRegistry.name("vpr.persist", domain));
    }
}