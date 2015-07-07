package us.vistacore.vxsync.dod;

import com.codahale.metrics.annotation.Timed;

import gov.va.med.jmeadows.webservice.*;

import javax.ws.rs.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import us.vistacore.vxsync.utility.DataConverter;
import us.vistacore.vxsync.utility.NullChecker;
import us.vistacore.vxsync.utility.Utils;

import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import java.security.MessageDigest;

@Path("/dod")
public class JMeadowsSoapHandler
{
	private final String template;
	private final String defaultName;
	private final AtomicLong counter;
	private static final Logger LOG = LoggerFactory.getLogger(JMeadowsSoapHandler.class);
	public static String SOURCE_PROTOCOL_DODADAPTER = "DODADAPTER";
	public static final String SITE_CODE_1="2.16.840.1.113883.3.42.10002.100001.8";
	public static final String SITE_CODE_2="2.16.840.1.113883.3.42.10009.100001.13";
	private static final String NOTE_TYPE_CDA = "CDA";


	public JMeadowsSoapHandler(String template, String defaultName) {
		this.template = template;
		this.defaultName = defaultName;
		this.counter = new AtomicLong();
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/allergy")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsAllergy(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsAllergy: edipi "+edipi);
			List<Allergy> oaAllergy = JMeadowsConnection.getJMeadowsDataClientInstance().getPatientAllergies(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsAllergy: results size "+oaAllergy.size());
			return (DataConverter.convertObjectToJSON(oaAllergy));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsAllergy() error" + e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/lab")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsLab(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsLab: edipi "+edipi);

			List<LabResult> oaLabResults = JMeadowsConnection.getJMeadowsDataClientInstance().getPatientLabResults(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));

			LOG.debug("JMeadowsSoapHandler.getJMeadowsLab: results "+oaLabResults.size());
			return(DataConverter.convertObjectToJSON(oaLabResults));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsLab() error" + e);
			return null;
		}
	}

/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/appointment")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsAppointment(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsAppointment: edipi "+edipi);

			List<PatientAppointments> oaPatientAppointment = JMeadowsConnection.getJMeadowsDataClientInstance().getPatientAppointments(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsAppointment: results "+oaPatientAppointment.size());
			return(DataConverter.convertObjectToJSON(oaPatientAppointment));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsAppointment() error" + e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/immunization")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsImmunization(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsImmunization: edipi "+edipi);

			List<Immunization> oaImmunization = JMeadowsConnection.getJMeadowsDataClientInstance().getPatientImmunizations(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsImmunization: results "+oaImmunization.size());
			return(DataConverter.convertObjectToJSON(oaImmunization));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsImmunization() error" + e);
			return null;
		}
	}

		/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/encounter")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsEncounter(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsEncounter: edipi "+edipi);

			List<Encounter> oaPatientEncounter = JMeadowsConnection.getJMeadowsDataClientInstance().getPatientEncounters(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsEncounter: results "+oaPatientEncounter.size());
			return(DataConverter.convertObjectToJSON(oaPatientEncounter));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsEncounter() error" + e);
			return null;
		}
	}

		/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/demographics")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsDemographics(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsDemographics: edipi "+edipi);

			List<PatientDemographics> oaDemographicsResults = JMeadowsConnection.getJMeadowsDataClientInstance().getPatientDemographics(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsDemographics: results "+oaDemographicsResults.size());
			return(DataConverter.convertObjectToJSON(oaDemographicsResults));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsDemographics() error" + e);
			return null;
		}
	}

		/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/consult")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsConsult(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsConsult: edipi "+edipi);

			List<Consult> oConsults = JMeadowsConnection.getJMeadowsDataClientInstance().getPatientConsultRequests(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsConsult: results "+oConsults.size());
			return(DataConverter.convertObjectToJSON(transformConsultNotes(oConsults)));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsConsultRequest() error" + e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/medication")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsMedication(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsMedication: edipi "+edipi);

			JMeadowsQuery outpatientQuery = JMeadowsQueryBuilder.getJMeadowsQuery(edipi);
			outpatientQuery.setStatus("O");
			
			JMeadowsQuery inpatientQuery = JMeadowsQueryBuilder.getJMeadowsQuery(edipi);
			inpatientQuery.setStatus("I");
			
			//Query for outpatient and inpatient medications separately
			List<Medication> oaOutpatientMedication=JMeadowsConnection.getJMeadowsDataClientInstance().getPatientMedications(outpatientQuery);
			List<Medication> oaInpatientMedication=JMeadowsConnection.getJMeadowsDataClientInstance().getPatientMedications(inpatientQuery);
			
			//Join outpatient and inpatient medications into one list
			List<Medication> oaMedication= new ArrayList<Medication>();
			oaMedication.addAll(oaOutpatientMedication);
			oaMedication.addAll(oaInpatientMedication);
			
			LOG.debug("JMeadowsSoapHandler.getJMeadowsMedication: results "+oaMedication.size());
			return(DataConverter.convertObjectToJSON(oaMedication));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsMedication() error" + e);
			return null;
		}
	}

		/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/order")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsOrder(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsOrder: edipi "+edipi);

			List<Order> oaOrder=JMeadowsConnection.getJMeadowsDataClientInstance().getPatientOrders(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsOrder: results "+oaOrder.size());
			return(DataConverter.convertObjectToJSON(oaOrder));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsOrder() error" + e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/problem")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsProblem(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsProblem: edipi "+edipi);

			List<Problem> oaProblemResults =JMeadowsConnection.getJMeadowsDataClientInstance().getPatientProblemList(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsProblems: results "+oaProblemResults.size());
			return(DataConverter.convertObjectToJSON(oaProblemResults));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsProblems() error" + e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/radiology")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsRadiology(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsRadiology: edipi "+edipi);

			List<RadiologyReport> oaRads =JMeadowsConnection.getJMeadowsDataClientInstance().getPatientRads(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsRadiology: results "+oaRads.size());
			return(DataConverter.convertObjectToJSON(oaRads));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsRadiology() error" + e);
			return null;
		}
	}

		/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/vital")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsVital(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsVital: edipi "+edipi);

			List<Vitals> oaVital =JMeadowsConnection.getJMeadowsDataClientInstance().getPatientVitals(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsVital: results "+oaVital.size());
			return(DataConverter.convertObjectToJSON(oaVital));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsVital() error" + e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/progressNote")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsProgressNote(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsProgressNote: Enter: edipi "+edipi);

			List<ProgressNote> progressNote =JMeadowsConnection.getJMeadowsDataClientInstance().getPatientProgressNotes(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsProgressNotes: results size "+progressNote.size());
			if(progressNote!=null)
			{
				return(DataConverter.convertObjectToJSON(transformProgressNotes(progressNote)));
			}
			else
				return null;

		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsProgressNotes() error" + e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/dischargeSummary")
	@GET
	@Produces("application/json")
	@Timed
	public String getJMeadowsDischargeSummary(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsDischargeSummary: edipi "+edipi);

			List<ProgressNote> progressNote =JMeadowsConnection.getJMeadowsDataClientInstance().getPatientDischargeSummaries(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getJMeadowsDischargeSummaries: results size "+progressNote.size());
			return(DataConverter.convertObjectToJSON(transformProgressNotes(progressNote)));
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsDischargeSummaries() error" + e);
			return null;
		}
	}
	
	@Path("/document")
	@GET
	@Produces("application/octet-stream")
	@Timed
	public String getJMeadowsDocument(@QueryParam("uri") String uri) {
		try
		{
			LOG.debug("JMeadowsSoapHandler.getJMeadowsDocument: uri "+uri);

			NoteImage document = JMeadowsConnection.getJMeadowsDataClientInstance().getBHIENoteImage(JMeadowsQueryBuilder.createDodJMeadowsQueryBuilder().itemId(uri).build());
			LOG.debug("JMeadowsSoapHandler.getJMeadowsDocument: results size " + document.getNoteBytes().length);
			return new String(document.getNoteBytes());
		}
		catch (Exception e)
		{
			LOG.error("getJMeadowsDocument() error"+e);
			return null;
		}
	}

	/*
	This REST endpoint makes a SOAP call to JMeadows, gets the domain object, transforms this into JSON string and returns it.
	@param - String edipi
	@return - JSON string
	 */

	@Path("/VlerDocumentList")
	@GET
	@Produces("application/json")
	@Timed
	public String getVlerDocuments(@QueryParam("edipi") String edipi)
	{
		try
		{
			LOG.debug("JMeadowsSoapHandler.getVlerDocuments: edipi "+edipi);

			List<VlerDocument> vlerDocumentList  =JMeadowsConnection.getJMeadowsDataClientInstance().getVLERDocumentList(JMeadowsQueryBuilder.getJMeadowsQuery(edipi));
			LOG.debug("JMeadowsSoapHandler.getVlerDocuments: results size "+vlerDocumentList.size());
			return(DataConverter.convertObjectToJSON(vlerDocumentList));
		}
		catch (Exception e)
		{
			LOG.error("getVlerDocuments() error" + e);
			return null;
		}
	}

	@Path("/TempTest")
	@GET
	@Produces("application/json")
	@Timed
	public String tempTest()
	{
		try
		{
			String testTime = "20110502114150";
			LOG.debug("JMeadowsSoapHandler.tempTest: time " + testTime);
			XMLGregorianCalendar resultTime = Utils.stringToXMLGregorianCalendar(testTime);
			LOG.debug("JMeadowsSoapHanlder.tempTest: result time " + resultTime.toString());
			return "{resultTime : \'" + resultTime.toString() + "\'}";
		}
		catch (Exception e)
		{
			LOG.error("getVlerDocuments() error" + e);
			return null;
		}
	}
	
	/*
	This method generates a unique CdrEventId and populates it in the consult notes if the CdrEventId is empty and
	the site code starts with SITE_CODE_1 or SITE_CODE_2
	@param - consultNotes
	@return - consultNotes - This consultNotes might contain the generated CdrEventId
	 */

	private List<Consult> transformConsultNotes(List<Consult> consultNotes)
	{
		LOG.debug("JMeadowsSoapHandler.transformNoteJson - Entering method...");

		if(consultNotes!=null)
		{
			for (int i = 0; i < consultNotes.size(); i++) {
				Consult oConsult = consultNotes.get(i);

				if (oConsult != null && isGenerateCdrEventId(oConsult)) {

					String sNoteDateTime = null;
					if (oConsult.getRequestDate() != null) {
						sNoteDateTime = Utils.formatCalendar(oConsult.getRequestDate().toGregorianCalendar());
					}
						//utilize note text as unique hash source
						String sHashSource = oConsult.getReport();

						//if note text is empty then use complex note URL as the hash source
						if (Utils.isEmpty(sHashSource) && !Utils.isEmpty(oConsult.getComplexDataUrl()))
						{
							sHashSource = oConsult.getComplexDataUrl();
						}
						oConsult.setCdrEventId(getCdrEventId(sHashSource,sNoteDateTime));

					}
			}
			return consultNotes;
		}
		else
		{
			return null;
		}
	}


	/*
	This method generates a unique CdrEventId and populates it in the progress notes if the CdrEventId is empty and
	the site code starts with SITE_CODE_1 or SITE_CODE_2. It also generates NoteDate.
	@param - List<ProgressNote>
	@return - List<ProgressNote> - This might contain the generated CdrEventId
	 */
	private List<ProgressNote> transformProgressNotes(List<ProgressNote> progressNote)
	{
		LOG.debug("JMeadowsSoapHandler.transformProgressNotes - Entering method...()");

		if(progressNote!=null)
		{
			for (int i = 0; i < progressNote.size(); i++)
			{
				ProgressNote oNote = progressNote.get(i);

				String sNoteDateTime = null;
				if(oNote.getNoteDate()!= null){
					sNoteDateTime = Utils.formatCalendar(oNote.getNoteDate().toGregorianCalendar());
				}
				
				if(isGenerateNoteDate(oNote))
				{
					try
					{
						LOG.debug("JMeadowsSoapHandler.transformProgressNotes: Generating note date for CDA document with cdrEventId: " + oNote.getCdrEventId());
						//extract note datetime from CDA document
						XPathFactory xPathfactory = XPathFactory.newInstance();
						XPath xpath = xPathfactory.newXPath();
						XPathExpression exprDateTime = xpath.compile("//ClinicalDocument/author/time/@value");
						LOG.debug("JMeadowsSoapHandler.transformProgressNotes: Retrieving note datetime from CDA document with cdrEventId = " + oNote.getCdrEventId());
						sNoteDateTime = (String) exprDateTime.evaluate(Utils.parseXMLDocument(oNote.getNoteText()), XPathConstants.STRING);
						LOG.debug("JMeadowsSoapHandler.transformProgressNotes: Got note datetime from CDA document (cdrEventId = " + oNote.getCdrEventId() + "):" + sNoteDateTime);
						oNote.setNoteDate(Utils.stringToXMLGregorianCalendar(sNoteDateTime));
					}
					catch(Exception e)
					{
						LOG.error("Exception while generating note date"+e);
					}

				}
				if (oNote != null && isGenerateCdrEventId(oNote))
				{
					LOG.debug("JMeadowsSoapHandler.transformProgressNotes: Generating cdrEventId for CDA document with null cdrEventId with noteDateTime: " + oNote.getNoteDate());
					
						//utilize note text as unique hash source
						String sHashSource = oNote.getNoteText();

						//if note text is empty then use complex note URL as the hash source
						if (Utils.isEmpty(sHashSource) && !Utils.isEmpty(oNote.getComplexDataUrl()))
						{
							sHashSource = oNote.getComplexDataUrl();
						}
						oNote.setCdrEventId(getCdrEventId(sHashSource,sNoteDateTime));
						LOG.debug("JMeadowsSoapHandler.transformProgressNotes: Generated cdrEventId: " + oNote.getCdrEventId());
				}
				
			}
			return progressNote;
		}
		else
		{
			return null;
		}
	}



	/*
	Generate uniqueId: SHA-1 hash of source combined with note date
	@param - (String sHashSource,String sNoteDateTime
	@return - String - uniqueId
	 */
	private String getCdrEventId(String sHashSource,String sNoteDateTime)
	{
		LOG.debug("JMeadowsSoapHandler.getCdrEventId - Entering method...()");

		if (!Utils.isEmpty(sHashSource))
		{
			try {
				MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
				messageDigest.update(sHashSource.getBytes("UTF-8"));
				byte[] bHash = messageDigest.digest();
				BigInteger bigInteger = new BigInteger(1, bHash);
				String sHash = bigInteger.toString(16);
				//notes originating from SHARE/Essentris or TMDS do not have an eventId,
				// only notes originating in the CDR.
				String eventId = String.format("%s_%s", sHash, sNoteDateTime == null ? "" : sNoteDateTime);
				return eventId;
			} catch (NoSuchAlgorithmException | UnsupportedEncodingException e)
			{
				LOG.error("An error occurred while generating cdrEventId.", e);

			}
		}
		return null;
	}

	private boolean isGenerateNoteDate(ProgressNote oNote)
	{
		if (oNote==null) return false;

		if(oNote.getNoteDate()==null && (oNote.getStatus()!=null && NOTE_TYPE_CDA.equalsIgnoreCase(oNote.getStatus()))
				&& !Utils.isEmpty(oNote.getNoteText()))
			return true;
		return false;
	}

	/*
	This method checks if the CdrEventId is empty and
	the site code starts with SITE_CODE_1 or SITE_CODE_2
	@param - ProgressNote oNote
 	*/
	private boolean isGenerateCdrEventId(ProgressNote oNote)
	{
		if (oNote.getSite() != null && oNote.getSite().getSiteCode() != null)
		{
			if ((oNote.getSite().getSiteCode().startsWith(SITE_CODE_1) || (oNote.getSite().getSiteCode().startsWith(SITE_CODE_2)))
					&&
					Utils.isEmpty(oNote.getCdrEventId()))
			{
				return true;
			}
		}
		return false;
	}

	/*
	This method checks if the CdrEventId is empty and
	the site code starts with SITE_CODE_1 or SITE_CODE_2
	@param - Consult oNote
 	*/
	private boolean isGenerateCdrEventId(Consult oNote)
	{
		if (oNote.getSite() != null && oNote.getSite().getSiteCode() != null)
		{
			if ((oNote.getSite().getSiteCode().startsWith(SITE_CODE_1) || (oNote.getSite().getSiteCode().startsWith(SITE_CODE_2)))
					&&
					Utils.isEmpty(oNote.getCdrEventId()))
			{
				return true;
			}
		}
		return false;
	}

}