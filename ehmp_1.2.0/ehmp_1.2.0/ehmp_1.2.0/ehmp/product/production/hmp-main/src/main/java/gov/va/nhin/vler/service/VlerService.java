package gov.va.nhin.vler.service;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.VlerDocument;
import gov.va.nhin.vler.service.util.VlerDocumentUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class VlerService implements IVlerService {

    public static final String DOMAIN_VLER_DOCUMENT = "vlerdocument";
    private static final Logger LOG = LoggerFactory.getLogger(VlerService.class);
    private IRetrieveVlerDocumentService vlerDocumentService;

    /**
     * Constructs a JMeadowsVitalService instance.
     */
    @Autowired
    public VlerService(IRetrieveVlerDocumentService vlerDocumentService) {
        this.vlerDocumentService = vlerDocumentService;
    }

    /**
     * Retrieve VLER data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param patientIds patient identifiers (ICN is required)
     * @return The VistaDataChunk list that contains the VLER data.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    public List<VistaDataChunk> fetchVlerData(PatientIds patientIds) {
        LOG.debug("VlerService.fetchVlerData - Entering method...");

        if (patientIds == null ||
                StringUtils.isBlank(patientIds.getIcn()))
            throw new IllegalArgumentException("Missing patient icn");

        List<VistaDataChunk> vlerDocChunks = new ArrayList<>();

        VlerQuery query = new VlerQuery();

        query.setPatientIds(patientIds);

        List<VLERDoc> vlerDocuments = retrieveVlerDocuments(query);
        LOG.debug("VlerService.fetchVlerData: " +
                ((vlerDocuments == null) ? "NO" : "" + vlerDocuments.size()) +
                " results retrieved from JMeadows.");

        if ((vlerDocuments != null) && (vlerDocuments.size() > 0)) {

            int curVlerDocIdx = 1;		// One based index
            for (VLERDoc vlerDocument : vlerDocuments) {
                LOG.debug("VlerService.fetchVlerData: Found VLER Document - Processing it... idx: " + curVlerDocIdx);
                VistaDataChunk vlerDocChunk = transformVlerDocChunk(vlerDocument, query.getPatientIds(), vlerDocuments.size(), curVlerDocIdx);
                if (vlerDocChunk != null) {
                    vlerDocChunks.add(vlerDocChunk);
                    curVlerDocIdx++;
                }
            }
        }


        return vlerDocChunks;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this vital.
     *
     * @param vlerDocument The vler document that was returned from JMeadows
     * @param patientIds Patient identifiers.
     * @param numVlerDocs The number of vler documents
     * @param curVlerDocIdx The index of this vler document in the list.
     * @return The VistaDataChunk for this vler document.
     */
    private VistaDataChunk transformVlerDocChunk(VLERDoc vlerDocument, PatientIds patientIds, int numVlerDocs, int curVlerDocIdx) {
        LOG.debug("VlerService.transformVlerDocChunk - Entering method...");
        VistaDataChunk vlerDocChunk = new VistaDataChunk();

        vlerDocChunk.setBatch(false);
        vlerDocChunk.setDomain(DOMAIN_VLER_DOCUMENT);
        vlerDocChunk.setItemCount(numVlerDocs);
        vlerDocChunk.setItemIndex(curVlerDocIdx);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (org.springframework.util.StringUtils.hasText(patientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(patientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(patientIds.getUid());
            vlerDocChunk.setLocalPatientId(sLocalPatientId);
            vlerDocChunk.setSystemId(sSystemId);

            Map<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            vlerDocChunk.setParams(oParams);
        }

        vlerDocChunk.setPatientIcn(patientIds.getIcn());
        vlerDocChunk.setPatientId(PidUtils.getPid("VLER", patientIds.getIcn()));
        vlerDocChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        vlerDocChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        vlerDocChunk.setContent(transformVlerDocumentJson(vlerDocument, "VLER", patientIds.getIcn()));

        return vlerDocChunk;
    }

    /**
     * This method will transform the vler document from the JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param vlerDocument The JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param icn The patient ICN
     * @return The JSON for this vler document data in VPR format.
     */
    private String transformVlerDocumentJson(VLERDoc vlerDocument, String sSystemId, String icn) {
        LOG.debug("VlerService.transformVlerDocumentJson - Entering method...");

        gov.va.cpe.vpr.VLERDocument vprVlerDocument = VlerDocumentUtil.buildVlerDocument(vlerDocument);
        vprVlerDocument.setData("uid", UidUtils.getVLERDocumentUid(sSystemId, icn, vprVlerDocument.getDocumentUniqueId()));

        String vlerDocJson = vprVlerDocument.toJSON(JSONViews.JDBView.class);
        LOG.debug("VlerService.transformVlerDocumentJson - Returning JSON String: " + vlerDocJson);
        return vlerDocJson;
    }

    /**
     * Retrieves all VLER patient documents from jMeadows.
     * @param query VLER query bean.
     * @return List of VLER documents.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    protected List<VLERDoc> retrieveVlerDocuments(VlerQuery query) {

        long startTime, endTime;

        startTime = System.currentTimeMillis();

        VLERDocQueryResponse vlerDocQueryResponse = vlerDocumentService.retrieveVlerDocumentList(query);

        if (vlerDocQueryResponse.isError()) {
            LOG.error("VlerService.retrieveVlerDocument An error occurred::" + vlerDocQueryResponse.getErrorMsg());
            throw new VlerServiceException(vlerDocQueryResponse.getErrorMsg());
        }

        List<VLERDoc> vlerMetaDocumentList = vlerDocQueryResponse.getDocumentList();

        endTime = System.currentTimeMillis();

        LOG.debug("VlerService.getVlerDocuments: fetched VLER document list - count: {}, completed in {} ms",
                vlerMetaDocumentList != null ? vlerMetaDocumentList.size() : "is null", (endTime-startTime));

        //return null if meta list
        if (vlerMetaDocumentList == null)
            return null;

        final String KEY_VLER_FUTURE = "future";
        final String KEY_VLER_METADATA = "vlerMetadata";

        List<Map<String, Object>> vlerMetaFutureMapList = new ArrayList<>();

        for(VLERDoc vlerMetaDoc : vlerMetaDocumentList) {
            Map<String, Object> vlerMetaFutureMap = new HashMap<>();

            vlerMetaFutureMap.put(KEY_VLER_METADATA, vlerMetaDoc);

            VlerQuery vlerDocRetrieveQuery = new VlerQuery();
            vlerDocRetrieveQuery.setVlerDoc(vlerMetaDoc);
            vlerDocRetrieveQuery.setPatientIds(query.getPatientIds());

            vlerMetaFutureMap.put(KEY_VLER_FUTURE, vlerDocumentService.retrieveVlerDocument(vlerDocRetrieveQuery));
            vlerMetaFutureMapList.add(vlerMetaFutureMap);
        }

        List<VLERDoc> vlerDocumentList = new ArrayList<>();
        for(Map<String, Object> vlerMap : vlerMetaFutureMapList) {
            try {
                Future vlerFuture = (Future) vlerMap.get(KEY_VLER_FUTURE);
                VLERDocRetrieveResponse vlerDocRetrieveResponse = (VLERDocRetrieveResponse) vlerFuture.get();
                vlerDocumentList.add(vlerDocRetrieveResponse.getVlerDoc());
            } catch (InterruptedException | ExecutionException e) {

                VlerDocument vlerMetaDoc = (VlerDocument) vlerMap.get(KEY_VLER_METADATA);

                LOG.error("An error occurred while retrieving VLER document.", e);
                LOG.debug("Failed to fetch vler document! Document Id: " + vlerMetaDoc.getDocumentUniqueId() +
                        " Home Community Id: " + vlerMetaDoc.getHomeCommunityId() +
                        " Repository Id: " + vlerMetaDoc.getRepositoryUniqueId());
            }
        }

        return vlerDocumentList;
    }
}
