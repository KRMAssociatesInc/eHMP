package gov.va.med.vler;


import gov.hhs.fha.nhinc.common.nhinccommonentity.RespondingGatewayCrossGatewayRetrieveRequestType;
import gov.hhs.fha.nhinc.entitydocretrieve.EntityDocRetrievePortType;
import ihe.iti.xds_b._2007.RetrieveDocumentSetRequestType;
import ihe.iti.xds_b._2007.RetrieveDocumentSetResponseType;
import org.apache.commons.codec.binary.Base64;

import javax.jws.WebService;
import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;

@WebService(endpointInterface="gov.hhs.fha.nhinc.entitydocretrieve.EntityDocRetrievePortType")
public class EntityDocRetrieve implements EntityDocRetrievePortType {

    @Override
    public RetrieveDocumentSetResponseType respondingGatewayCrossGatewayRetrieve(RespondingGatewayCrossGatewayRetrieveRequestType respondingGatewayCrossGatewayRetrieveRequestType) {

        RetrieveDocumentSetRequestType.DocumentRequest dr = respondingGatewayCrossGatewayRetrieveRequestType.getRetrieveDocumentSetRequest().getDocumentRequest().get(0);

        RetrieveDocumentSetResponseType responseType = new RetrieveDocumentSetResponseType();

        responseType.getDocumentResponse().add(getDocument(dr.getDocumentUniqueId()));

        return responseType;
    }

    private RetrieveDocumentSetResponseType.DocumentResponse getDocument(String docId) {

        String filename = "default.b64";

        if ("29deea5f-efa3-4d1c-a43d-d64ea4f4de30".equals(docId))
        {
            filename = "Conemaugh_C32_Deidentified.b64";
        }
        else if ("8315f76c-f58a-4eab-ab92-c77966c4ea21".equals(docId))
        {
            filename = "Hawaii_C32_T1_DeIdentified.b64";
        }
        else if ("5a31395c-b245-4333-b62f-e94fb0c7ae5d".equals(docId))
        {
            filename = "HEALTHELINK_C32_Deidentified.b64";
        }
        else if ("f0c8af6f-a988-49e7-a4c2-581ba7962b77".equals(docId))
        {
            filename = "IHIE_B1_Deidentified.b64";
        }
        else if ("c9e5685b-d5f9-41f3-bcfb-f341010a1b71".equals(docId))
        {
            filename = "INHS_C32_Deidentified.b64";
        }
        else if ("29deea5f-efa3-4d1c-c2de-f53fb2e2fa89".equals(docId))
        {
            filename = "CCDA_epic_patient_level.b64";
        }
        else if ("55ceeacf-dda2-4d1c-c2de-a53fbae2fa65".equals(docId))
        {
            filename = "CCDA_epic_encounter_level_data.b64";
        }
        else if ("29deea5f-efa3-4d1c-c2de-c567f2d72b22".equals(docId))
        {
            filename = "CCDA_allScripts_toc.b64";
        }
        else if ("29deea5f-efa3-4d1c-c2de-f672de134c11".equals(docId))
        {
            filename = "CCDA_cerner_toc.b64";
        }

        ClassLoader classLoader = getClass().getClassLoader();
        File b64File = new File(classLoader.getResource(filename).getFile());

        RetrieveDocumentSetResponseType.DocumentResponse documentResponse = new RetrieveDocumentSetResponseType.DocumentResponse();
        documentResponse.setDocumentUniqueId(docId);
        documentResponse.setHomeCommunityId("urn:oid:1.3.6.1.4.1.26580.10");
        documentResponse.setMimeType("text/xml");

        byte[] docBytes = new byte[0];
        try {
            docBytes = Base64.decodeBase64(Files.readAllBytes(FileSystems.getDefault().getPath(b64File.getAbsolutePath())));
        } catch (IOException e) {
            e.printStackTrace();
        }

        documentResponse.setDocument(docBytes);

        return documentResponse;
    }
}
