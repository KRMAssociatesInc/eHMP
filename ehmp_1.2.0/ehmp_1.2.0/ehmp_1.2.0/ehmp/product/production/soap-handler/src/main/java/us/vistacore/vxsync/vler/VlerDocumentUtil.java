package us.vistacore.vxsync.vler;

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

    public static final String FLD_TEMPLATE_IDS = "templateIds";
    public static final String FLD_ROOT = "root";
    public static final String FLD_CODE = "code";
    public static final String FLD_CODE_SYSTEM = "codeSystem";
    public static final String FLD_CODE_SYSTEM_NAME = "codeSystemName";
    public static final String FLD_DISPLAY_NAME = "displayName";
    public static final String FLD_TITLE = "title";
    public static final String FLD_TEXT = "text";

    /**
     *  Extracts the narrative text and associated metadata (templateIds, codes, & title) from VLER CCD document.
     * @param ccdDoc VLER CCD XML document.
     * @return A list of narrative data from each section in the VLER CCD document.
     * @throws VlerDocumentUtilException If an error occurs while parsing the CCD.
     */
    public static List<Section> extractSectionNarrativesFromCCD(Document ccdDoc) throws VlerDocumentUtilException {

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

            List<Section> sectionList = new ArrayList<>();

            for (int i = 0; i < sectionNodeList.getLength(); i++) {
                Section section = new Section();

                Node sectionNode = sectionNodeList.item(i);

                if (sectionNode == null)
                    continue;

                sectionNode.getParentNode().removeChild(sectionNode);

                //section templateIds
                NodeList templateIdNodeList = (NodeList) exprTemplateId.evaluate(sectionNode, XPathConstants.NODESET);
                if (templateIdNodeList != null) {

                    for(int tmpIdx = 0; tmpIdx < templateIdNodeList.getLength(); tmpIdx++) {
                        Node templateIdNode = templateIdNodeList.item(tmpIdx);

                        if (templateIdNode == null)
                            continue;

                        templateIdNode.getParentNode().removeChild(templateIdNode);

                        if (templateIdNode.getAttributes() == null ||
                                templateIdNode.getAttributes().getNamedItem("root") == null)
                            continue;

                        TemplateId templateId = new TemplateId();
                        templateId.setRoot(templateIdNode.getAttributes().getNamedItem("root").getNodeValue());
                        section.getTemplateIds().add(templateId);
                    }
                }

                //section codes
                Node codeNode = (Node) exprCode.evaluate(sectionNode, XPathConstants.NODE);
                if (codeNode != null && codeNode.getAttributes() != null) {

                    NamedNodeMap codeAttrs = codeNode.getAttributes();

                    Code code = new Code();

                    if (codeAttrs.getNamedItem(FLD_CODE) != null)
                        code.setCode(codeAttrs.getNamedItem(FLD_CODE).getNodeValue());

                    if (codeAttrs.getNamedItem(FLD_CODE_SYSTEM) != null)
                        code.setSystem(codeAttrs.getNamedItem(FLD_CODE_SYSTEM).getNodeValue());

                    if (codeAttrs.getNamedItem(FLD_CODE_SYSTEM_NAME) != null)
                        code.setSystemName(codeAttrs.getNamedItem(FLD_CODE_SYSTEM_NAME).getNodeValue());

                    if (codeAttrs.getNamedItem(FLD_DISPLAY_NAME) != null)
                        code.setDisplay(codeAttrs.getNamedItem(FLD_DISPLAY_NAME).getNodeValue());

                    section.setCode(code);
                }

                //section title
                Node titleNode = (Node) exprTitle.evaluate(sectionNode, XPathConstants.NODE);
                if (titleNode != null && titleNode.getFirstChild() != null) {
                    section.setTitle(titleNode.getFirstChild().getNodeValue());
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

                    section.setText(writer.toString());
                }

                sectionList.add(section);
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

            DocumentBuilder builder = factory.newDocumentBuilder();
            factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            
            InputSource is = new InputSource(new ByteArrayInputStream(xmlDocumentBytes));

            return builder.parse(is);

        } catch (ParserConfigurationException | IOException | SAXException e) {
            throw new VlerDocumentUtilException("An error occurred while parsing XML string.", e);
        }

    }
}
