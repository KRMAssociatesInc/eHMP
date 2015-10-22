package gov.va.med.vler;

import gov.hhs.fha.nhinc.common.nhinccommonentity.RespondingGatewayCrossGatewayQueryRequestType;
import gov.hhs.fha.nhinc.entitydocquery.EntityDocQueryPortType;
import oasis.names.tc.ebxml_regrep.xsd.query._3.AdhocQueryResponse;

import javax.jws.WebService;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;

@WebService(endpointInterface="gov.hhs.fha.nhinc.entitydocquery.EntityDocQueryPortType")
public class EntityDocQuery implements EntityDocQueryPortType {

    @Override
    public AdhocQueryResponse respondingGatewayCrossGatewayQuery(RespondingGatewayCrossGatewayQueryRequestType respondingGatewayCrossGatewayQueryRequestType) {
        AdhocQueryResponse adhocQueryResponse = null;

        try {

            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("mock-response.xml").getFile());

            JAXBContext jaxbContext = JAXBContext.newInstance(AdhocQueryResponse.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            adhocQueryResponse = (AdhocQueryResponse) jaxbUnmarshaller.unmarshal(file);


        } catch (JAXBException e) {
            e.printStackTrace();
        }

        return adhocQueryResponse;
    }
}
