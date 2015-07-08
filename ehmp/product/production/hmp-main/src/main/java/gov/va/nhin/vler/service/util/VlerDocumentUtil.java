package gov.va.nhin.vler.service.util;

import gov.va.cpe.vpr.VLERDocument;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.jmeadows.JMeadowsClientUtils;
import gov.va.nhin.vler.service.Author;
import gov.va.nhin.vler.service.VLERDoc;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.*;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.*;

/**
 * VLER document utility class.
 */
public class VlerDocumentUtil {

    private static final Logger LOG = LoggerFactory.getLogger(VlerDocumentUtil.class);

    private static final String XPATH_SECTION =
            "//*[local-name()='ClinicalDocument']/*[local-name()='component']/*[local-name()='structuredBody']" +
                    "/*[local-name()='component']/*[local-name()='section']";
    private static final String XPATH_TITLE = "./*[local-name()='title']";
    private static final String XPATH_TEMPLATE_ID = "./*[local-name()='templateId']";
    private static final String XPATH_CODE = "./*[local-name()='code']";
    private static final String XPATH_TEXT = "./*[local-name()='text']";

    public static final String FLD_AUTHOR_LIST = "authorList";
    public static final String FLD_INSTITUTION = "institution";
    public static final String FLD_CREATION_TIME = "creationTime";
    public static final String FLD_DOCUMENT_UNIQUE_ID = "documentUniqueId";
    public static final String FLD_HOME_COMMUNITY_ID = "homeCommunityId";
    public static final String FLD_MIME_TYPE = "mimeType";
    public static final String FLD_NAME = "name";
    public static final String FLD_REPOSITORY_UNIQUE_ID = "repositoryUniqueId";
    public static final String FLD_SOURCE_PATIENT_ID = "sourcePatientId";
    public static final String FLD_SECTIONS = "sections";
    public static final String FLD_TEMPLATE_IDS = "templateIds";
    public static final String FLD_ROOT = "root";
    public static final String FLD_CODE = "code";
    public static final String FLD_CODE_SYSTEM = "system";
    public static final String FLD_DISPLAY_NAME = "display";
    public static final String FLD_TITLE = "title";
    public static final String FLD_TEXT = "text";

    /**
     * Builds a VLER document with section narratives from the jMeadows VLER response.
     *
     * @param vlerDoc VLER model.
     * @return Map containing VLER document with narratives and metadata.
     * @throws VlerDocumentUtilException If an error occurs while building VLER document.
     */
    public static VLERDocument buildVlerDocument(VLERDoc vlerDoc) {

        if (vlerDoc == null)
            throw new IllegalArgumentException("jMeadows VLER response is null");

        Map<String, Object> vlerDocMap = new LinkedHashMap<>();

        //author list
        if (vlerDoc.getAuthorList() != null) {
            List<Map<String, String>> authorMapList = new ArrayList<>();
            for(Author author : vlerDoc.getAuthorList()) {
                Map<String, String> authorMap = new LinkedHashMap<>();
                authorMap.put(FLD_INSTITUTION, author.getInstitution());
                authorMap.put(FLD_NAME, author.getName());
                authorMapList.add(authorMap);
            }

            vlerDocMap.put(FLD_AUTHOR_LIST, authorMapList);
        }

        //creation time
        if (vlerDoc.getCreationTime() != null) {
            vlerDocMap.put(FLD_CREATION_TIME,
                    new PointInTime(vlerDoc.getCreationTime()));
        }

        //document unique id
        if (vlerDoc.getDocumentUniqueId() != null) {
            vlerDocMap.put(FLD_DOCUMENT_UNIQUE_ID, vlerDoc.getDocumentUniqueId());
        }

        //home community id
        if (vlerDoc.getHomeCommunityId() != null) {
            vlerDocMap.put(FLD_HOME_COMMUNITY_ID, vlerDoc.getHomeCommunityId());
        }

        //mime type
        if (vlerDoc.getMimeType() != null) {
            vlerDocMap.put(FLD_MIME_TYPE, vlerDoc.getMimeType());
        }

        //name
        if (vlerDoc.getName() != null) {
            vlerDocMap.put(FLD_NAME, vlerDoc.getName());
        }

        //repository unique id
        if (vlerDoc.getRepositoryUniqueId() != null) {
            vlerDocMap.put(FLD_REPOSITORY_UNIQUE_ID, vlerDoc.getRepositoryUniqueId());
        }

        //source patient id
        if (vlerDoc.getSourcePatientId() != null) {
            vlerDocMap.put(FLD_SOURCE_PATIENT_ID, vlerDoc.getSourcePatientId());
        }

        Document ccdDocument = parseXMLDocument(vlerDoc.getDocument());

        vlerDocMap.put(FLD_SECTIONS, extractSectionNarrativesFromCCD(ccdDocument));

        return new VLERDocument(vlerDocMap);
    }

    /**
     *  Extracts the narrative text and associated metadata (templateIds, codes, & title) from VLER CCD document.
     * @param ccdDoc VLER CCD XML document.
     * @return A list of narrative data from each section in the VLER CCD document.
     * @throws VlerDocumentUtilException If an error occurs while parsing the CCD.
     */
    public static List<Map<String, Object>> extractSectionNarrativesFromCCD(Document ccdDoc) throws VlerDocumentUtilException {

        if (ccdDoc == null)
            throw new IllegalArgumentException("ccdDoc is null");

        XPathFactory xPathfactory = XPathFactory.newInstance();
        XPath xpath = xPathfactory.newXPath();

        XPathExpression exprSections = null;
        XPathExpression exprTemplateId = null;
        XPathExpression exprCode = null;
        XPathExpression exprTitle = null;
        XPathExpression exprText = null;

        try {

            exprSections = xpath.compile(XPATH_SECTION);
            exprTemplateId = xpath.compile(XPATH_TEMPLATE_ID);
            exprCode = xpath.compile(XPATH_CODE);
            exprTitle = xpath.compile(XPATH_TITLE);
            exprText = xpath.compile(XPATH_TEXT);

            //sections
            NodeList sectionNodeList = (NodeList) exprSections.evaluate(ccdDoc, XPathConstants.NODESET);

            if (sectionNodeList == null)
                throw new IllegalArgumentException("VLER document is not a valid CCD.");

            List<Map<String, Object>> sectionList = new ArrayList<>();

            for (int i = 0; i < sectionNodeList.getLength(); i++) {
                Map<String, Object> sectionMap = new LinkedHashMap<>();

                Node sectionNode = sectionNodeList.item(i);

                if (sectionNode == null)
                    continue;

                sectionNode.getParentNode().removeChild(sectionNode);

                //section templateIds
                NodeList templateIdNodeList = (NodeList) exprTemplateId.evaluate(sectionNode, XPathConstants.NODESET);
                if (templateIdNodeList != null) {
                    List<Map<String, String>> templateIdList = new ArrayList<>();
                    for(int tmpIdx = 0; tmpIdx < templateIdNodeList.getLength(); tmpIdx++) {
                        Node templateIdNode = templateIdNodeList.item(tmpIdx);

                        if (templateIdNode == null)
                            continue;

                        templateIdNode.getParentNode().removeChild(templateIdNode);

                        if (templateIdNode.getAttributes() == null ||
                                templateIdNode.getAttributes().getNamedItem("root") == null)
                            continue;

                        Map<String, String> templateIdMap = new LinkedHashMap<>();
                        templateIdMap.put(FLD_ROOT,
                                templateIdNode.getAttributes().getNamedItem("root").getNodeValue());
                        templateIdList.add(templateIdMap);
                    }

                    sectionMap.put(FLD_TEMPLATE_IDS, templateIdList);
                }

                //section codes
                Node codeNode = (Node) exprCode.evaluate(sectionNode, XPathConstants.NODE);
                if (codeNode != null && codeNode.getAttributes() != null) {

                    NamedNodeMap codeAttrs = codeNode.getAttributes();

                    Map<String, String> codeMap = new LinkedHashMap<>();

                    if (codeAttrs.getNamedItem(FLD_CODE) != null)
                        codeMap.put(FLD_CODE, codeAttrs.getNamedItem(FLD_CODE).getNodeValue());

                    if (codeAttrs.getNamedItem(FLD_CODE_SYSTEM) != null)
                        codeMap.put(FLD_CODE_SYSTEM, codeAttrs.getNamedItem(FLD_CODE_SYSTEM).getNodeValue());

                    if (codeAttrs.getNamedItem(FLD_DISPLAY_NAME) != null)
                        codeMap.put(FLD_DISPLAY_NAME, codeAttrs.getNamedItem(FLD_DISPLAY_NAME).getNodeValue());

                    sectionMap.put(FLD_CODE, codeMap);
                }

                //section title
                Node titleNode = (Node) exprTitle.evaluate(sectionNode, XPathConstants.NODE);
                if (titleNode != null && titleNode.getFirstChild() != null) {
                    sectionMap.put(FLD_TITLE, titleNode.getFirstChild().getNodeValue());
                }

                //section text
                Node textNode = (Node) exprText.evaluate(sectionNode, XPathConstants.NODE);
                if (textNode != null) {

                    StringWriter writer = new StringWriter();
                    Transformer transformer = TransformerFactory.newInstance().newTransformer();
                    transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");

                    //remove any javascript code embedded in the narrative
                    removeJavascripts(textNode);

                    transformer.transform(new DOMSource(textNode), new StreamResult(writer));

                    sectionMap.put(FLD_TEXT, writer.toString());
                }

                sectionList.add(sectionMap);
            }

            return sectionList;

        } catch (XPathExpressionException | TransformerException e) {
            throw new VlerDocumentUtilException("An error occurred while extracting VLER section narratives.", e);
        }
    }

    /**
     * List of event handler attributes that could contain javascript code.
     */
    private static final List<String> eventAttributeList =
            Arrays.asList("onclick", "onmousedown",
                    "onmouseup", "onmouseover", "onmouseout", "onchange", "onsubmit", "onreset");

    /**
     * Recursive method that traverses text node and removes any markup that could possibly contain javascript code.
     * @param node Node in text tree.
     * @return Node in text tree.
     */
    private static Node removeJavascripts(Node node) {

        if (node == null) return node;

        //check for <script> tags
        if ("script".equalsIgnoreCase(node.getNodeName())) {
            node.getParentNode().removeChild(node);
        }

        //check for event handlers in attributes (onclick, etc.)
        NamedNodeMap attributes = node.getAttributes();
        if (attributes != null) {
            for(int attrIdx = 0; attrIdx < attributes.getLength(); attrIdx++) {
                Node attr = attributes.item(attrIdx);

                for(String embedJsEvent : eventAttributeList) {
                    if (embedJsEvent.equalsIgnoreCase(attr.getNodeName())) {
                        attributes.removeNamedItem(attr.getNodeName());
                    }
                }
            }
        }

        if (node.hasChildNodes()) {
            NodeList children = node.getChildNodes();
            for(int i = 0; i < children.getLength(); i++) {
                removeJavascripts(children.item(i));
            }
        }

        return node;
    }

    /**
     * Parses an XML string and transforms it into an XML Document model.
     * @param xmlDocumentBytes binary representation of xml document
     * @return XML Document model
     * @throws VlerDocumentUtilException If an error occurs while parsing XML string.
     */
    protected static Document parseXMLDocument(byte[] xmlDocumentBytes) {
        try {

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

            factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            // Added per Fortify recommendation
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

            DocumentBuilder builder = factory.newDocumentBuilder();

            InputSource is = new InputSource(new ByteArrayInputStream(xmlDocumentBytes));

            return builder.parse(is);

        } catch (ParserConfigurationException | IOException | SAXException e) {
            throw new VlerDocumentUtilException("An error occurred while parsing XML string.", e);
        }

    }
}
