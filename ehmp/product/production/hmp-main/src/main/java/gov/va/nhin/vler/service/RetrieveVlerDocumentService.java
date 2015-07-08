package gov.va.nhin.vler.service;

import gov.hhs.fha.nhinc.common.nhinccommonentity.RespondingGatewayCrossGatewayQueryRequestType;
import gov.hhs.fha.nhinc.entitydocquery.EntityDocQueryPortType;
import gov.hhs.fha.nhinc.entitydocretrieve.EntityDocRetrievePortType;
import oasis.names.tc.ebxml_regrep.xsd.query._3.AdhocQueryResponse;
import oasis.names.tc.ebxml_regrep.xsd.rim._3.*;
import oasis.names.tc.ebxml_regrep.xsd.rs._3.RegistryError;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBElement;
import java.net.ConnectException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;

import static gov.va.nhin.vler.service.util.VlerDocumentServiceUtil.*;

/**
 * Retrieves VLER document.
 * <p/>
 * Retrieves VLER documents asynchronously by utilizing the Hystrix API.
 */
@Service
public class RetrieveVlerDocumentService implements IRetrieveVlerDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(RetrieveVlerDocumentService.class);

    private NhinAdapterCfg nhinAdapterCfg;
    private EntityDocQueryPortType entityDocQuery;
    private EntityDocRetrievePortType entityDocRetrieve;

    /**
     * Constructs a Retrieve VLER document service instance.
     */
    @Autowired
    public RetrieveVlerDocumentService(NhinAdapterCfg nhinAdapterCfg) {
        this.nhinAdapterCfg = nhinAdapterCfg;

        entityDocQuery = EntityDocQueryFactory.getInstance(this.nhinAdapterCfg);
        entityDocRetrieve = EntityDocRetrieveFactory.getInstance(this.nhinAdapterCfg);
    }

    /**
     * Sets entityDocQuery
     *
     * @param entityDocQuery EntityDocQuery client instance.
     */
    public void setEntityDocQuery(EntityDocQueryPortType entityDocQuery) {
        this.entityDocQuery = entityDocQuery;
    }

    /**
     * Sets entityDocRetrieve
     *
     * @param entityDocRetrieve EntityDocRetrieve client instance.
     */
    public void setEntityDocRetrieve(EntityDocRetrievePortType entityDocRetrieve) {
        this.entityDocRetrieve = entityDocRetrieve;
    }

    /**
     * Asynchronously retrieve VLER document.
     *
     * @param vlerQuery vler query.
     * @return Result of asynchronous execution.
     */
    public Future<VLERDocRetrieveResponse> retrieveVlerDocument(VlerQuery vlerQuery) {
        logger.debug("retrieveVlerDocument begin");
        return new RetrieveVlerDocumentCommand(entityDocRetrieve, vlerQuery, nhinAdapterCfg).queue();
    }

    /**
     * Retrieve list of VLER document metadata.
     * @param vlerQuery vler query.
     * @return VLER doc query Response.
     */
    @Override
    public VLERDocQueryResponse retrieveVlerDocumentList(VlerQuery vlerQuery) {
        logger.debug("retrieveVlerDocumentList begin");

        if (vlerQuery == null ||
                vlerQuery.getPatientIds() == null ||
                StringUtils.isBlank(vlerQuery.getPatientIds().getIcn()))
            throw new IllegalArgumentException("Patient Ids icn is null or missing");

        VLERDocQueryResponse vlerDocQueryResponse = new VLERDocQueryResponse();

        try
        {
            RespondingGatewayCrossGatewayQueryRequestType qrt =
                    generateDocumentQuery(
                        vlerQuery.getPatientIds().getIcn(),
                        nhinAdapterCfg.getSystemUserName(),
                        nhinAdapterCfg.getSystemSiteCode());

            AdhocQueryResponse aqr = entityDocQuery.respondingGatewayCrossGatewayQuery(qrt);
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
                        logger.error(vlerDocQueryResponse.getErrorMsg());
                    } else {

                        vlerDocQueryResponse.setError(true);
                        vlerDocQueryResponse.setErrorMsg("VLER Document Query Error" + " :: " + "The server returned an empty/invalid response");
                        logger.error(vlerDocQueryResponse.getErrorMsg());
                    }
                }

            }
            else if(aqr.getTotalResultCount() == null
                    && aqr.getStatus() != null
                    && aqr.getStatus().indexOf("Success") > 0)
            {
                vlerDocQueryResponse.setError(true);
                vlerDocQueryResponse.setErrorMsg("VLER Document Query Error" + " :: " + "The server returned an empty response; most likely no patient correlation.");
                logger.error(vlerDocQueryResponse.getErrorMsg());
            }
            else if(aqr.getTotalResultCount() == null)
            {
                vlerDocQueryResponse.setError(true);
                vlerDocQueryResponse.setErrorMsg("VLER Document Query Error" + " :: " + "The server returned an empty/invalid response.");
                logger.error(vlerDocQueryResponse.getErrorMsg());
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

                            VLERDoc vDoc = new VLERDoc();
                            vDoc.setDocumentUniqueId("");
                            vDoc.setHomeCommunityId(extrinsicObject.getHome());
                            vDoc.setRepositoryUniqueId("");
                            vDoc.setName(extrinsicObject.getName().getLocalizedString().get(0).getValue());

                            for(SlotType1 st1 : extrinsicObject.getSlot())
                            {
                                if(SOURCE_PATIENT_ID.equalsIgnoreCase(st1.getName()))
                                {
                                    vDoc.setSourcePatientId(st1.getValueList().getValue().get(0));
                                }
                                else if(REPOSITORY_UNIQUE_ID.equalsIgnoreCase(st1.getName()))
                                {
                                    vDoc.setRepositoryUniqueId(st1.getValueList().getValue().get(0));
                                }
                                else if(CREATION_TIME.equalsIgnoreCase(st1.getName()))
                                {
                                    vDoc.setCreationTime(st1.getValueList().getValue().get(0));
                                }
                            }

                            for(ExternalIdentifierType it : extrinsicObject.getExternalIdentifier())
                            {
                                if(DOCUMENT_UNIQUE_ID.equalsIgnoreCase(it.getName().getLocalizedString().get(0).getValue()))
                                {
                                    vDoc.setDocumentUniqueId(it.getValue());
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
                            vDoc.getAuthorList().addAll(authorList);

                            vlerDocQueryResponse.getDocumentList().add(vDoc);
                        }
                    }
                }
            }
        }
        catch (RuntimeException e)
        {
            if(e.getCause() instanceof ConnectException)
            {
                vlerDocQueryResponse.setError(true);
                vlerDocQueryResponse.setErrorMsg("VLER Document Query Error" + " :: " + e.getMessage());
                logger.error(vlerDocQueryResponse.getErrorMsg());

                return vlerDocQueryResponse;
            }
            throw new VlerDocumentException(e);
        }
        catch (Exception e)
        {
            logger.error("Error performing VLER Document Query: " + e.getMessage());
            throw new VlerDocumentException(e);
        }

        return vlerDocQueryResponse;
    }
}