package gov.va.cpe.vpr.search;

import org.apache.solr.client.solrj.ResponseParser;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.impl.XMLResponseParser;
import org.apache.solr.common.util.NamedList;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import java.io.StringReader;
import java.lang.reflect.Modifier;

public class SolrMockito {
    public static SolrServer mockSolrServer() {
        return Mockito.mock(SolrServer.class, new MockSolrServerDefaultAnswer());
    }

    public static XmlSolrQueryResponseAnswer solrXmlResponse(String xml) {
        return new XmlSolrQueryResponseAnswer(xml);
    }

    /**
     * Mockito {link Answer} to mock SolrServer.request() with a String xml response
     *
     * @see Answer
     * @see org.apache.solr.client.solrj.SolrServer
     */
    public static class XmlSolrQueryResponseAnswer implements Answer<NamedList<Object>> {
        public XmlSolrQueryResponseAnswer(String xml) {
            this.xml = xml;
            this.parser = new XMLResponseParser();
        }

        public NamedList<Object> answer(InvocationOnMock invocation) {
            return parser.processResponse(new StringReader(xml));
        }

        private ResponseParser parser;
        private String xml;
    }

    /**
     * Mockito Answer that will return the mock for abstract methods and will call the real method for concrete methods.
     *
     * @see "http://stackoverflow.com/questions/1087339/using-mockito-to-test-abstract-classes"
     */
    public static class MockSolrServerDefaultAnswer implements Answer<Object> {
        public Object answer(InvocationOnMock invocation) throws Throwable {
            Answer<Object> answer = null;

            if (Modifier.isAbstract(invocation.getMethod().getModifiers())) {
                answer = Mockito.RETURNS_DEFAULTS;
            } else {
                answer = Mockito.CALLS_REAL_METHODS;
            }


            return answer.answer(invocation);
        }

    }
}
