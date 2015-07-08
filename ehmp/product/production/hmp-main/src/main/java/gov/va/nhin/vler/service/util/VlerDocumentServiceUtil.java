package gov.va.nhin.vler.service.util;

import gov.hhs.fha.nhinc.common.nhinccommon.*;
import gov.hhs.fha.nhinc.common.nhinccommonentity.RespondingGatewayCrossGatewayQueryRequestType;
import gov.va.nhin.vler.service.VlerDocumentException;
import oasis.names.tc.ebxml_regrep.xsd.query._3.AdhocQueryRequest;
import oasis.names.tc.ebxml_regrep.xsd.query._3.ResponseOptionType;
import oasis.names.tc.ebxml_regrep.xsd.rim._3.AdhocQueryType;
import oasis.names.tc.ebxml_regrep.xsd.rim._3.SlotType1;
import oasis.names.tc.ebxml_regrep.xsd.rim._3.ValueListType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigInteger;

public class VlerDocumentServiceUtil {

    private static final Logger logger = LoggerFactory.getLogger(VlerDocumentServiceUtil.class);

    public static final String LOCAL_HCID = "2.16.840.1.113883.3.426";
    public static final String TARGET_HCID = "2.16.840.1.113883.4.349";
    public static final String VA_HCID = "2.16.840.1.113883.4.349.1";
    public static final String FIND_DOCUMENTS = "urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d";
    public static final String VA_HOME_ID = "urn:oid:2.16.840.1.113883.4.349";
    public static final String SOURCE_PATIENT_ID = "sourcePatientId";
    public static final String REPOSITORY_UNIQUE_ID = "repositoryUniqueId";
    public static final String CREATION_TIME = "creationTime";
    public static final String DOCUMENT_UNIQUE_ID = "XDSDocumentEntry.uniqueId";
    public static final String AUTHOR_INFORMATION = "urn:uuid:93606bcf-9494-43ec-9b4e-a7748d1a838d";
    public static final String AUTHOR_PERSON = "authorPerson";
    public static final String AUTHOR_INSTITUTION = "authorInstitution";
    public static final String CLASS_CODE = "urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a";

    public static final String SSN_OID = "2.16.840.1.113883.4.1";
    public static final String SLOT_CLASS_CODE = "$XDSDocumentEntryClassCode";
    public static final String SLOT_STATUS = "$XDSDocumentEntryStatus";
    public static final String SLOT_PATIENT_ID = "$XDSDocumentEntryPatientId";
    public static final String SLOT_FORMAT_CODE = "$XDSDocumentEntryFormatCode";
    public static final String PATIENT_ICN_STRING = "^^^&2.16.840.1.113883.4.349.1&ISO";
    public static final String CCD_CLASS_CODE = "('34133-9^^2.16.840.1.113883.6.1')";
    public static final String RETURN_TYPE = "LeafClass";
    public static final String SLOT_STATUS_STRING = "('urn:ihe:iti:2010:StatusType:DeferredCreation','urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')";

    /**
     * Helper that generates VLER document query.
     * @param icn Patient ICN
     * @param systemUserName System user name (ehmp)
     * @param systemUserSiteCode System user site code (valid VA site/facility code)
     * @return VLER gateway request object.
     */
    public static RespondingGatewayCrossGatewayQueryRequestType generateDocumentQuery(String icn, String systemUserName, String systemUserSiteCode)
    {
        RespondingGatewayCrossGatewayQueryRequestType qrt = new RespondingGatewayCrossGatewayQueryRequestType();

        AdhocQueryRequest aqr = new AdhocQueryRequest();

        try
        {

            aqr.setId("EHMP_" + System.currentTimeMillis());
            aqr.setStartIndex(BigInteger.valueOf(0));
            aqr.setMaxResults(BigInteger.valueOf(-1));

            //set pat ICN
            SlotType1 stPatICN = new SlotType1();
            ValueListType vlt = new ValueListType();
            vlt.getValue().add("'" + icn + PATIENT_ICN_STRING + "'");
            stPatICN.setName(SLOT_PATIENT_ID);
            stPatICN.setValueList(vlt);

            //set entry class code
            SlotType1 stClassCode = new SlotType1();
            stClassCode.setName(SLOT_CLASS_CODE);
            ValueListType vaList = new ValueListType();
            vaList.getValue().add(CCD_CLASS_CODE);
            stClassCode.setValueList(vaList);

            //set entry status
            SlotType1 stEntryStatus = new SlotType1();
            stEntryStatus.setName(SLOT_STATUS);
            ValueListType vListType = new ValueListType();
            vListType.getValue().add(SLOT_STATUS_STRING);
            stEntryStatus.setValueList(vListType);

            ResponseOptionType rot = new ResponseOptionType();
            rot.setReturnType(RETURN_TYPE);
            rot.setReturnComposedObjects(true);
            aqr.setResponseOption(rot);

            AdhocQueryType aqt = new AdhocQueryType();
            aqt.setHome(VA_HOME_ID);
            aqt.getSlot().add(stClassCode);
            aqt.getSlot().add(stPatICN);
            aqt.getSlot().add(stEntryStatus);
            //        aqt.getSlot().add(stFormatCode);
            aqt.setId(FIND_DOCUMENTS);
            aqr.setAdhocQuery(aqt);

            qrt.setAdhocQueryRequest(aqr);
            qrt.setAssertion(generateAssertion(icn, systemUserName, systemUserSiteCode));

        }
        catch (Exception e)
        {
            throw new VlerDocumentException(e);
        }
        return qrt;
    }

    /**
     * Generates user identity assertion for VLER requests.
     * @param icn Patient ICN
     * @param systemUserName System user name (ehmp)
     * @param systemUserSiteCode System user site code (valid VA site/facility code)
     * @return Assertion Type object.
     */
    public static AssertionType generateAssertion(String icn, String systemUserName, String systemUserSiteCode)
    {
        gov.hhs.fha.nhinc.common.nhinccommon.ObjectFactory atOf = new gov.hhs.fha.nhinc.common.nhinccommon.ObjectFactory();
        AssertionType at = atOf.createAssertionType();

        final String AGENCY = "VA";

        try {

            //HomeCommunityType - required
            HomeCommunityType hct = new HomeCommunityType();
            hct.setName("ehmp");
            hct.setHomeCommunityId(VA_HOME_ID);
            hct.setDescription("ehmp");
            at.setHomeCommunity(hct);

            //user info - required
            UserType ut = new UserType();
            PersonNameType pnt = new PersonNameType();
            String lastName = "";
            String firstName = "";
            String fullName =  systemUserName;
            if(fullName.contains(",")){
                String[] parts = fullName.split(",");
                if(parts[0]!=null)
                    lastName = parts[0].trim();
                if(parts[1]!=null)
                    firstName = parts[1].trim();
            } else {
                lastName = fullName;
            }
            pnt.setFullName(fullName);
            pnt.setGivenName(firstName);
            pnt.setFamilyName(lastName);
            ut.setPersonName(pnt);

            StringBuilder userName = new StringBuilder();

            //if VA user, set the sitecode to the user's login site
            //if DoD user, set the sitecode to 200
            //if VBA user, set the sitecode to 200CORP
            if("VA".equalsIgnoreCase(AGENCY)
                    && !"200CORP".equalsIgnoreCase(systemUserSiteCode))
            {
                userName.append(systemUserSiteCode);

            } else if("DOD".equalsIgnoreCase(AGENCY)){
                userName.append("200");
            }
            else if("VA".equalsIgnoreCase(AGENCY)
                    && "200CORP".equalsIgnoreCase(systemUserSiteCode))
            {
                userName.append("200CORP");
            }
            userName.append(":");
            userName.append(lastName.replaceAll(" ", "").replaceAll(",", "").replaceAll("-", ""));

            ut.setUserName(userName.toString());
            ut.setOrg(hct);

            //setup role
            CeType roleCoded = new CeType();
            roleCoded.setCode("112247003");
            roleCoded.setCodeSystem("2.16.840.1.113883.6.96");
            roleCoded.setCodeSystemName("SNOMED_CT");
            roleCoded.setDisplayName("Medical doctor");
            ut.setRoleCoded(roleCoded);

            at.setUserInfo(ut);

            //setup purpose
            CeType purpose = new CeType();
            purpose.setCode("TREATMENT");
            purpose.setCodeSystem("2.16.840.1.113883.3.18.7.1");
            purpose.setDisplayName("TREATMENT");
            purpose.setCodeSystemName("nhin-purpose");
//          purpose.setCodeSystemVersion("");
//          purpose.setOriginalText("");
            at.setPurposeOfDisclosureCoded(purpose);

            //setup patient id
            at.getUniquePatientId().add(icn + PATIENT_ICN_STRING);

            at.setAuthorized(false);
        }
        catch (Exception e)
        {
            throw new VlerDocumentException(e);
        }

        return at;
    }
}
