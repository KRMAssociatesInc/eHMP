package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Order Retriever Service
 */
@Service
public class JMeadowsOrderService implements IJMeadowsOrderService {
	private static final Logger LOG = LoggerFactory.getLogger(JMeadowsOrderService.class);
    private JMeadowsData jMeadowsClient;

    public static final String DOMAIN_ORDER= "order";

    public static final String TYPE_CONSULT = "CONSULT";
    public static final String TYPE_LAB = "LAB";
    public static final String TYPE_MEDICATION = "MEDICATION";
    public static final String TYPE_RADIOLOGY = "RADIOLOGY";

    public static final String SERVICE_CODE_CONSULT = "GMRC";
    public static final String SERVICE_CODE_LAB = "LR";
    public static final String SERVICE_CODE_NON_VA_MEDICATION = "PSH";
    public static final String SERVICE_CODE_RADIOLOGY = "RA";

    /**
     * Constructs a JMeadowsOrderService instance.
     */
    @Autowired
    public JMeadowsOrderService(JMeadowsConfiguration jMeadowsConfiguration) {
        jMeadowsClient = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);
    }

    /**
     * Sets JMeadowsClient
     * @param jMeadowsClient JMeadows client instance.
     */
    public void setJMeadowsClient(JMeadowsData jMeadowsClient) {
        this.jMeadowsClient = jMeadowsClient;
    }

    /**
	 * This routine will calculate the total number of orders that are in the result set.  It does this by
	 * counting all the orders that are part of the DoD domain.  We ignore all that are from any VistA site.
	 *
	 * @param oaOrder The list of orders returned.
	 * @return The number of orders that are from a DoD site.
	 */
	private int calculateNumOrders(List<Order> oaOrder) {
        return (oaOrder != null) ? oaOrder.size() : 0;
	}

	/**
	 * Retrieve DoD order data and format it into a VistaChunk to be included into the set of data returned to the system.
	 *
	 * @param query JMeadows query bean.
     * @param patientIds Patient identifier bean.
	 * @return The VistaDataChunk list that contains the order data.
	 * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
	 */
	@Override
    public List<VistaDataChunk> fetchDodPatientOrders(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {
		LOG.debug("JMeadowsOrderService.fetchDodPatientOrders - Entering method...");
	
		validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaOrderChunk = new ArrayList<VistaDataChunk>();
		
		List<Order> oaOrder = jMeadowsClient.getPatientOrders(query);
		LOG.debug("JMeadowsOrderService.fetchDodPatientOrders: " +
				  ((oaOrder == null)? "NO" : ""+oaOrder.size()) + " results retrieved from JMeadows.");
		if (CollectionUtils.isNotEmpty(oaOrder)) {
            //remove DoD adaptor status report
            oaOrder = (List<Order>) filterOnSourceProtocol(oaOrder, SOURCE_PROTOCOL_DODADAPTER);

            int iNumOrders = calculateNumOrders(oaOrder);
			int iCurOrderIdx = 1;		// One based index
			for (Order oOrder : oaOrder) {
                LOG.debug("JMeadowsOrderService.fetchDodPatientOrders: Found DoD Order - Processing it... idx: " + iCurOrderIdx);
                if (StringUtils.isBlank(oOrder.getType()) || StringUtils.isBlank(oOrder.getDescription())) {
                    LOG.debug("skip not enough order chunk data");
                }else {
                    VistaDataChunk oOrderChunk = transformOrderChunk(oOrder, patientIds, iNumOrders, iCurOrderIdx);
                    if (oOrderChunk != null) {
                        oaOrderChunk.add(oOrderChunk);
                        iCurOrderIdx++;
                    }
                }
			}
		}
		return oaOrderChunk;
	}

    /**
     * Create an instance of a VistaDataChunk that represents this order.
     *
     * @param oOrder The order that was returned from JMeadows
     * @param oPatientIds Patient identifiers.
     * @param iNumOrders The number of orders
     * @param iCurOrderIdx The index of this order in the list.
     * @return The VistaDataChunk for this order.
     */
    private VistaDataChunk transformOrderChunk(Order oOrder, PatientIds oPatientIds, int iNumOrders, int iCurOrderIdx) {
        LOG.debug("JMeadowsOrderService.transformOrderChunk - Entering method...");
        VistaDataChunk oOrderChunk = new VistaDataChunk();

        oOrderChunk.setBatch(false);
        oOrderChunk.setDomain(DOMAIN_ORDER);
        oOrderChunk.setItemCount(iNumOrders);
        oOrderChunk.setItemIndex(iCurOrderIdx);
        //		oOrderChunk.setJson(null);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (org.springframework.util.StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oOrderChunk.setLocalPatientId(sLocalPatientId);
            oOrderChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oOrderChunk.setParams(oParams);
        }

        oOrderChunk.setPatientIcn(oPatientIds.getIcn());
        oOrderChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oOrderChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oOrderChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oOrderChunk.setContent(transformOrderJson(oOrder, "DOD", oPatientIds.getEdipi()));

        return oOrderChunk;
    }

	/**
	 * This method will transform the order from the DoD JMeadows format to the VPR format and return it as a
	 * JSON string.
	 * 
	 * @param oOrder The DoD JMeadows format of the data.
	 * @param sSystemId The site system ID
	 * @param sEdipi The patient EDIPI
	 * @return The JSON for this order data in VPR format.
	 */
	private String transformOrderJson(Order oOrder, String sSystemId, String sEdipi) {
		LOG.debug("JMeadowsOrderService.transformOrderJson - Entering method...");
		gov.va.cpe.vpr.Order oVprOrder = new gov.va.cpe.vpr.Order();

		// Extract the codes
		//--------------------
        if (CollectionUtils.isNotEmpty(oOrder.getCodes())) {
			List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
			for (Code oCode : oOrder.getCodes()) {
				boolean bHasData = false;
				JdsCode oJdsCode = new JdsCode();
                if (StringUtils.isNotEmpty(oCode.getCode())) {
					oJdsCode.setCode(oCode.getCode());
					bHasData = true;
				}
                if (StringUtils.isNotEmpty(oCode.getSystem())) {
                    JLVTerminologySystem termSystem = JLVTerminologySystem.getSystemByName(oCode.getSystem());

                    //pass OID urn if one exists
                    if (termSystem != null) {
                        oJdsCode.setSystem(termSystem.getUrn());
                    }
                    //default to code system display name
                    else oJdsCode.setSystem(oCode.getSystem());

					bHasData = true;
				}
                if (StringUtils.isNotEmpty(oCode.getDisplay())) {
					oJdsCode.setDisplay(oCode.getDisplay());
					bHasData = true;
				}
				if (bHasData) {
					oaJdsCode.add(oJdsCode);
				}
			}
			
			if (CollectionUtils.isNotEmpty(oaJdsCode)) {
				oVprOrder.setData("codes", oaJdsCode);
			}
		}

        if (TYPE_CONSULT.equals(oOrder.getType())) {
            oVprOrder.setData("service", SERVICE_CODE_CONSULT);
        }else if (TYPE_LAB.equals(oOrder.getType())) {
            oVprOrder.setData("service", SERVICE_CODE_LAB);
        }else if (TYPE_MEDICATION.equals(oOrder.getType())) {
            oVprOrder.setData("service", SERVICE_CODE_NON_VA_MEDICATION);
        }else if (TYPE_RADIOLOGY.equals(oOrder.getType())) {
            oVprOrder.setData("service", SERVICE_CODE_RADIOLOGY);
        }else {
            LOG.error("Not supported type: " + oOrder.getType());
            throw new IllegalArgumentException("Not supported type: " + oOrder.getType());
        }
        if (oOrder.getOrderDate() != null) {
            oVprOrder.setData("entered", formatCalendar(oOrder.getOrderDate().toGregorianCalendar()));
        }

        oVprOrder.setData("name", oOrder.getDescription());
        oVprOrder.setData("content", oOrder.getDescription());
        oVprOrder.setData("providerName", oOrder.getOrderingProvider());
        oVprOrder.setData("statusName", "");

        if (oOrder.getStartDate() != null) {
            oVprOrder.setData("start", formatCalendar(oOrder.getStartDate().toGregorianCalendar()));
        }
        if (oOrder.getCompletedDate() != null) {
            oVprOrder.setData("stop", formatCalendar(oOrder.getCompletedDate().toGregorianCalendar()));
        }
		oVprOrder.setData("facilityName", sSystemId);
		oVprOrder.setData("facilityCode", sSystemId);
        oVprOrder.setData("uid", UidUtils.getOrderUid(sSystemId, sEdipi, oOrder.getCdrEventId()));

		String sOrderJson = oVprOrder.toJSON(JDBView.class);
		LOG.debug("JMeadowsOrderService.transformOrderJson - Returning JSON String: " + sOrderJson);
		return sOrderJson;
	}

}
