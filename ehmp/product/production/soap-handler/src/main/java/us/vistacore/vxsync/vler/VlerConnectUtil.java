package us.vistacore.vxsync.vler;

import gov.hhs.fha.nhinc.common.nhinccommon.*;
import gov.hhs.fha.nhinc.common.nhinccommon.ObjectFactory;
import gov.hhs.fha.nhinc.common.nhinccommon.PersonNameType;
import gov.hhs.fha.nhinc.common.nhinccommon.UserType;
import gov.hhs.fha.nhinc.common.nhinccommonentity.RespondingGatewayCrossGatewayQueryRequestType;
import gov.hhs.fha.nhinc.common.nhinccommonentity.RespondingGatewayCrossGatewayRetrieveRequestType;
import ihe.iti.xds_b._2007.RetrieveDocumentSetRequestType;
import oasis.names.tc.ebxml_regrep.xsd.query._3.AdhocQueryRequest;
import oasis.names.tc.ebxml_regrep.xsd.query._3.AdhocQueryResponse;
import oasis.names.tc.ebxml_regrep.xsd.query._3.ResponseOptionType;
import oasis.names.tc.ebxml_regrep.xsd.rim._3.*;
import oasis.names.tc.ebxml_regrep.xsd.rs._3.RegistryError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.bind.JAXBElement;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

public class VlerConnectUtil {

    private static final Logger logger = LoggerFactory.getLogger(VlerConnectUtil.class);

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
     * Helper that generates VLER document list query.
     * @param icn Patient ICN
     * @param systemUserName System user name (ehmp)
     * @param systemUserSiteCode System user site code (valid VA site/facility code)
     * @return VLER gateway request object.
     */
    public static RespondingGatewayCrossGatewayQueryRequestType generateDocumentListQuery(String icn, String systemUserName, String systemUserSiteCode)
    {
        RespondingGatewayCrossGatewayQueryRequestType qrt = new RespondingGatewayCrossGatewayQueryRequestType();

        AdhocQueryRequest aqr = new AdhocQueryRequest();

        try
        {

            aqr.setId("eHMP_" + System.currentTimeMillis());
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
        ObjectFactory atOf = new ObjectFactory();
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

    /**
     * Helper that generates VLER document query.
     * @param icn Patient ICN
     * @param documentId VLER document unique ID
     * @param homeCommunityId VLER document home community unique ID
     * @param repositoryId VLER document repository unique ID
     * @param systemSiteCode System user site code (valid VA site/facility code)
     * @return VLER document query
     */
    public static RespondingGatewayCrossGatewayRetrieveRequestType generateDocumentQuery(String icn, String documentId,
                                        String homeCommunityId, String repositoryId, String systemSiteCode) {

        RespondingGatewayCrossGatewayRetrieveRequestType query = new RespondingGatewayCrossGatewayRetrieveRequestType();
        RetrieveDocumentSetRequestType srt = new RetrieveDocumentSetRequestType();

        RetrieveDocumentSetRequestType.DocumentRequest dr = new RetrieveDocumentSetRequestType.DocumentRequest();
        dr.setDocumentUniqueId(documentId);
        dr.setHomeCommunityId(homeCommunityId);
        dr.setRepositoryUniqueId(repositoryId);

        srt.getDocumentRequest().add(dr);

        query.setAssertion(
                generateAssertion(icn,
                        systemSiteCode,
                        systemSiteCode));

        query.setRetrieveDocumentSetRequest(srt);

        return query;
    }

    /**
     * Transforms AdocQueryResponse to a VlerDocQueryResponse object.
     * @param aqr AdhocQueryResponse object to transform
     * @return Transformed VlerDocQueryResponse
     */
    public static VlerDocQueryResponse toVlerDocResponse(AdhocQueryResponse aqr) {

        VlerDocQueryResponse vlerDocQueryResponse = new VlerDocQueryResponse();

        RegistryObjectListType rolt = aqr.getRegistryObjectList();

        ObjectRefType objectRef;
        ExtrinsicObjectType extrinsicObject;

        //checking to see if results are empty, and errors exist
        if((aqr.getTotalResultCount() != null) &&
                (aqr.getTotalResultCount().intValue() == 0) &&
                (aqr.getRegistryErrorList() != null))
        {
            for (RegistryError re : aqr.getRegistryErrorList().getRegistryError())
            {
                if(re != null){

                    vlerDocQueryResponse.setError(true);
                    vlerDocQueryResponse.setErrorMsg(re.getErrorCode() + " :: " + "Error: " + re.getCodeContext() + "::" + re.getValue());
                    logger.error("VlerUtil.toVlerDocResponse: " + vlerDocQueryResponse.getErrorMsg());
                } else {

                    vlerDocQueryResponse.setError(true);
                    vlerDocQueryResponse.setErrorMsg("VLER Document Query Error" + " :: " + "The server returned an empty/invalid response");
                    logger.error("VlerUtil.toVlerDocResponse: " + vlerDocQueryResponse.getErrorMsg());
                }
            }

        }
        else if(aqr.getTotalResultCount() == null
                && aqr.getStatus() != null
                && aqr.getStatus().indexOf("Success") > 0)
        {
            vlerDocQueryResponse.setError(true);
            vlerDocQueryResponse.setErrorMsg("VLER Document Query Error" + " :: " + "The server returned an empty response; most likely no patient correlation.");
            logger.error("VlerUtil.toVlerDocResponse: " + vlerDocQueryResponse.getErrorMsg());
        }
        else if(aqr.getTotalResultCount() == null)
        {
            vlerDocQueryResponse.setError(true);
            vlerDocQueryResponse.setErrorMsg("VLER Document Query Error" + " :: " + "The server returned an empty/invalid response.");
            logger.error("VlerUtil.toVlerDocResponse: " + vlerDocQueryResponse.getErrorMsg());
        }


        if(rolt != null){

            List<JAXBElement<? extends IdentifiableType >> jbList = rolt.getIdentifiable();

            for( JAXBElement <? extends IdentifiableType> jaxb : jbList)
            {
                if (jaxb.getValue() instanceof ObjectRefType) {
                    objectRef = (ObjectRefType) jaxb.getValue();

                    if (objectRef != null &&
                            (objectRef.getHome() == null || objectRef.getHome().isEmpty())) {
                        objectRef.setHome("test");
                    }
                }
                if (jaxb.getValue() instanceof ExtrinsicObjectType) {
                    extrinsicObject = (ExtrinsicObjectType) jaxb.getValue();

                    if (extrinsicObject != null &&
                            (extrinsicObject.getHome() != null && !extrinsicObject.getHome().isEmpty())) {

                        VlerMetadata vMetadata = new VlerMetadata();
                        vMetadata.setDocumentUniqueId("");
                        vMetadata.setHomeCommunityId(extrinsicObject.getHome());
                        vMetadata.setRepositoryUniqueId("");
                        vMetadata.setName(extrinsicObject.getName().getLocalizedString().get(0).getValue());

                        for(SlotType1 st1 : extrinsicObject.getSlot())
                        {
                            if(SOURCE_PATIENT_ID.equalsIgnoreCase(st1.getName()))
                            {
                                vMetadata.setSourcePatientId(st1.getValueList().getValue().get(0));
                            }
                            else if(REPOSITORY_UNIQUE_ID.equalsIgnoreCase(st1.getName()))
                            {
                                vMetadata.setRepositoryUniqueId(st1.getValueList().getValue().get(0));
                            }
                            else if(CREATION_TIME.equalsIgnoreCase(st1.getName()))
                            {
                                vMetadata.setCreationTime(st1.getValueList().getValue().get(0));
                            }
                        }

                        for(ExternalIdentifierType it : extrinsicObject.getExternalIdentifier())
                        {
                            if(DOCUMENT_UNIQUE_ID.equalsIgnoreCase(it.getName().getLocalizedString().get(0).getValue()))
                            {
                                vMetadata.setDocumentUniqueId(it.getValue());
                            }
                        }

                        List<Author> authorList = new ArrayList<Author>();
                        for(ClassificationType ct : extrinsicObject.getClassification())
                        {
                            //author info
                            if(AUTHOR_INFORMATION.equals(ct.getClassificationScheme()))
                            {
                                Author docAuth = new Author();
                                for(SlotType1 st : ct.getSlot())
                                {
                                    if( !st.getValueList().getValue().isEmpty())
                                    {

                                        if(AUTHOR_PERSON.equalsIgnoreCase(st.getName()) )
                                        {
                                            docAuth.setName(st.getValueList().getValue().get(0));
                                        }
                                        else if(AUTHOR_INSTITUTION.equalsIgnoreCase(st.getName()))
                                        {
                                            docAuth.setInstitution(st.getValueList().getValue().get(0));
                                        }

                                    }
                                }
                                authorList.add(docAuth);

                            }
                        }
                        vMetadata.getAuthorList().addAll(authorList);

                        vlerDocQueryResponse.getDocumentList().add(vMetadata);
                    }
                }
            }
        }

        return vlerDocQueryResponse;
    }
}
