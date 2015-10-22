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
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.*;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

/**
 * VLER document utility class.
 */
public class VlerDocumentUtil {

    private static final Logger LOG = LoggerFactory.getLogger(VlerDocumentUtil.class);

    private static final String XPATH_CCDA_TEMPLATEID = "/ClinicalDocument/templateId[@root='2.16.840.1.113883.10.20.22.1.1']";
    private static final String XSL_PATH_C32 = "xsl/c32styles/nhin/cda2detail.xsl";
    private static final String XSL_PATH_CCDA = "xsl/ccdaStyles/cdaHFG.xsl";
    /*
     * Return true if XML document is CCDA document.
     *
     * @param ccdDoc VLER CCD XML document.
     * @return true if root CCDA template ID is present.  Otherwise, false.
     * @throws VlerDocumentUtilException If an error occurs while parsing the CCD.
     */
    public static boolean isCcdaDoc(Document ccdDoc) throws VlerDocumentUtilException {
        if (ccdDoc == null) {
            throw new IllegalArgumentException("ccdDoc is null");
        }

        XPathFactory xPathfactory = XPathFactory.newInstance();
        XPath xpath = xPathfactory.newXPath();
        try {
            XPathExpression exprCcdaTemplateId = xpath.compile(XPATH_CCDA_TEMPLATEID);
            NodeList ccdaTemplateIdNodeList = (NodeList) exprCcdaTemplateId.evaluate(ccdDoc, XPathConstants.NODESET);
            if (ccdaTemplateIdNodeList != null && ccdaTemplateIdNodeList.getLength() > 0) {
                return true;
            }
        } catch (XPathExpressionException e) {
            throw new VlerDocumentUtilException("An error occurred while checking CCDA template ID.", e);
        }
        return false;
    }

    /**
     * XSLT VLER C32 XML and return html.
     *
     * @param ccdDocXml VLER CCD XML document.
     * @return transformed html string.
     * @throws VlerDocumentUtilException If an error occurs while parsing the CCD.
     */
    public static String xsltC32Document(String ccdDocXml) throws VlerDocumentUtilException {
        if (ccdDocXml == null) {
            throw new IllegalArgumentException("ccdDoc is null");
        }

        return transformXml(ccdDocXml, VlerDocumentUtil.class.getClassLoader().getResource(XSL_PATH_C32));
    }
    /**
     * XSLT VLER CCDA XML and return html.
     *
     * @param ccdDocXml VLER CCD XML document.
     * @return transformed html string.
     * @throws VlerDocumentUtilException If an error occurs while parsing the CCD.
     */
    public static String xsltCcdaDocument(String ccdDocXml) throws VlerDocumentUtilException {
        if (ccdDocXml == null) {
            throw new IllegalArgumentException("ccdDoc is null");
        }

        return transformXml(ccdDocXml, VlerDocumentUtil.class.getClassLoader().getResource(XSL_PATH_CCDA));
    }

    private static String transformXml(String xmlString, URL xsl) throws VlerDocumentUtilException {
        StringWriter outputWriter = null;

        try {

            StreamSource xmlInput = new StreamSource(new StringReader(xmlString));
            Source xslStreamSource = new StreamSource(xsl.openStream(), xsl.toString());

            TransformerFactory factory = TransformerFactory.newInstance();
            Transformer transformer = factory.newTransformer(xslStreamSource);

            outputWriter = new StringWriter();

            Result outputResult = new StreamResult(outputWriter);

            transformer.transform(xmlInput, outputResult);
            return outputWriter.toString();
        }catch (TransformerException | IOException e) {
            throw new VlerDocumentUtilException("An error occurred while transforming XML.", e);
        } finally {
            try {
                outputWriter.close();
            }catch (IOException ie) {
                throw new VlerDocumentUtilException("An error occurred while closing writer", ie);
            }
        }
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
