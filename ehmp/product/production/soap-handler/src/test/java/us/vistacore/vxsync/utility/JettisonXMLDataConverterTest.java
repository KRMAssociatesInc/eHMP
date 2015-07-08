package us.vistacore.vxsync.utility;

import static org.junit.Assert.*;

import javax.xml.stream.XMLStreamException;

import org.junit.Test;

public class JettisonXMLDataConverterTest {

	private DataConverter converter = new DataConverter();
	
	@Test
	public void simpleXMLTest() throws Exception {
		String xml = "<root><foo>foo string</foo><bar><x>1</x><y>5</y></bar></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test
	public void xmlWithAttributesTest() throws Exception {
		String xml = "<root><foo stuff=\"hi2u\">foo string</foo><bar><x>1</x><y>5</y></bar></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test
	public void deepNestedXMLTest() throws Exception {
		String xml = "<root><bar><x><y><z><alpha><beta><delta>5</delta></beta></alpha></z></y></x></bar></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test
	public void xmlWithDefaultNameSpaceTest() throws Exception {
		String xml = "<root xmlns=\"http://foo.com\"><foo>foo string</foo><bar><x>1</x><y>5</y></bar></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test
	public void xmlWithMultipleNameSpacesTest() throws Exception {
		String xml = "<root xmlns:h=\"http://foo.com\"><h:foo>foo string</h:foo><h:bar><h:x>1</h:x><y>5</y></h:bar></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test
	public void xmlWithCDATATest() throws Exception {
		String xml = "<root><foo><![CDATA[function matchwo(a,b){if (a < b && a < 0) then{return 1;}else{return 0;}}]]></foo></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}

	@Test(expected=XMLStreamException.class)
	public void xmlWithCommentsTest() throws Exception {
		String xml = "<root><foo><!-- My Comment --></foo></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test(expected=XMLStreamException.class)
	public void invalidXMLWithMissingTagTest() throws Exception {
		String xml = "<root><foo>foo string</foo><bar><x>1</x><y>5</bar></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test(expected=XMLStreamException.class)
	public void invalidXMLWithMultipleRootsTest() throws Exception {
		String xml = "<root><foo>foo string</foo></root><bar><x>4</x></bar>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
	
	@Test(expected=XMLStreamException.class)
	public void invalidXMLWithNewLineTest() throws Exception {
		String xml = "<root><fo\no>foo string</foo></root><bar><x>4</x></bar>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}

	@Test
	public void xmlWithCharactersEscapesTest() throws Exception {
		String xml = "<root><foo>foo &lt;&amp;&gt; string</foo><bar><x>1</x><y>5</y></bar></root>";
		String result = converter.convertXMLtoJSON(xml);
		assertNotNull(result);
	}
}
