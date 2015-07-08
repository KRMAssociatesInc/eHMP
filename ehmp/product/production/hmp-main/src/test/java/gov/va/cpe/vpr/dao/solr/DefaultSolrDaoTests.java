package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.search.SolrMockito;
import gov.va.cpe.vpr.sync.vista.Foo;
import gov.va.hmp.healthtime.PointInTime;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.core.convert.ConversionService;

import java.io.IOException;
import java.io.Serializable;
import java.util.Collections;
import java.util.LinkedHashMap;

import static org.mockito.Mockito.verify;

public class DefaultSolrDaoTests {

    private DefaultSolrDao solrDao = new DefaultSolrDao();
    private SolrServer mockSolrServer;
    private ConversionService mockConversionService;

    @Before
    public void setUp() throws Exception {
        mockSolrServer = SolrMockito.mockSolrServer();
        mockConversionService = Mockito.mock(ConversionService.class);

        solrDao = new DefaultSolrDao();
        solrDao.setSolrServer(mockSolrServer);
        solrDao.setConversionService(mockConversionService);
        solrDao.afterPropertiesSet();
    }

    @Test
    public void testSave() throws IOException, SolrServerException {
        Foo item = new Foo(Collections.singletonMap("uid", 23));

        SolrInputDocument doc = new SolrInputDocument();
        doc.addField("uid", 23);

        Mockito.when(mockConversionService.convert(item, SolrInputDocument.class)).thenReturn(doc);

        solrDao.save(item);

        verify(mockConversionService).convert(item, SolrInputDocument.class);
        verify(mockSolrServer).add(doc);
        verify(mockSolrServer, Mockito.never()).commit();
    }

    @Test
    public void testSaveResultOrganizer() throws IOException, SolrServerException {

        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(7);
        map.put("pid", "1");
        map.put("facilityCode", "500");
        map.put("facilityName", "CAMP MASTER");
        map.put("localId", "CH;6959389.875453");
        map.put("observed", new PointInTime(1975, 7, 23, 10, 58));
        map.put("specimen", "BLOOD");
        map.put("organizerType", "accession");
        ResultOrganizer ro = new ResultOrganizer(map);

        LinkedHashMap<String, Object> map1 = new LinkedHashMap<String, Object>(4);
        map1.put("localId", "CH;6959389.875453;2");
        map1.put("typeName", "SODIUM");
        map1.put("result", "140");
        map1.put("units", "meq/L");
        Result sodium = new Result(map1);
        LinkedHashMap<String, Object> map2 = new LinkedHashMap<String, Object>(4);
        map2.put("localId", "CH;6949681.986571;6");
        map2.put("typeName", "POTASSIUM");
        map2.put("result", "5.2");
        map2.put("units", "meq/L");
        Result potassium = new Result(map2);
        ro.addToResults(sodium);
        ro.addToResults(potassium);

        solrDao.save(ro);

        verify(mockConversionService).convert(sodium, SolrInputDocument.class);
        verify(mockConversionService).convert(potassium, SolrInputDocument.class);
        verify(mockSolrServer, Mockito.never()).commit();
    }

    @Test
    public void testSaveVitalSignOrganizer() throws IOException, SolrServerException {
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(3);
        map.put("id", null);
        map.put("icn", "12345");
        map.put("lastUpdated", PointInTime.now());

        LinkedHashMap<String, Object> map1 = new LinkedHashMap<String, Object>(4);
        map1.put("code", "500");
        map1.put("name", "CAMP MASTER");
        map1.put("homeSite", true);
        map1.put("localPatientId", "229");
        PatientFacility facility = new PatientFacility(map1);

        LinkedHashMap<String, Object> map2 = new LinkedHashMap<String, Object>(6);
        map2.put("pid", "1");
        map2.put("facility", facility);
        map2.put("uid", "urn:va:vs:ABCDEF:229:70:20090115171037.000");
        map2.put("observed", new PointInTime(2009, 1, 15, 17, 18, 0, 0));
        map2.put("resulted", new PointInTime(2009, 1, 15, 17, 10, 37, 0));
        map2.put("location", "ER");
        VitalSignOrganizer vitals = new VitalSignOrganizer(map2);

        LinkedHashMap<String, Object> map3 = new LinkedHashMap<String, Object>(3);
        map3.put("uid", "urn:va:vs:ABCDEF:20679");
        map3.put("typeName", "BLOOD PRESSURE");
        map3.put("result", "170/120");
        VitalSign bloodPressure = new VitalSign(map3);
        LinkedHashMap<String, Object> map4 = new LinkedHashMap<String, Object>(3);
        map4.put("uid", "urn:va:vs:ABCDEF:20679");
        map4.put("typeName", "TEMPERATURE");
        map4.put("result", "101");
        VitalSign temp = new VitalSign(map4);
        vitals.addToVitalSigns(bloodPressure);
        vitals.addToVitalSigns(temp);

        solrDao.save(vitals);

        verify(mockConversionService).convert(bloodPressure, SolrInputDocument.class);
        verify(mockConversionService).convert(temp, SolrInputDocument.class);
        verify(mockSolrServer, Mockito.never()).commit();
    }

}
