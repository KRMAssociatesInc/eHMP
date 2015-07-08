package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.Allergy;
import gov.va.cpe.vpr.dao.ISolrDao;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.jms.support.converter.SimpleMessageConverter;

import javax.jms.Message;
import javax.jms.Session;
import java.util.Collections;
import java.util.LinkedHashMap;

import static org.mockito.Mockito.*;

public class ReindexPatientMessageHandlerTest {
    @Test
    public void testOnMessage() throws Exception {
        ReindexPatientMessageHandler handler = new ReindexPatientMessageHandler();

        ISolrDao solrServiceMock = Mockito.mock(ISolrDao.class);
        IGenericPatientObjectDAO genericPatientRelatedDaoMock = Mockito.mock(IGenericPatientObjectDAO.class);
        handler.setSolrDao(solrServiceMock);
        handler.setGenericPatientRelatedDao(genericPatientRelatedDaoMock);

        LinkedHashMap<String, Object> allergyValues = new LinkedHashMap<String, Object>(2);
        allergyValues.put("pid", "3");
        allergyValues.put("summary", "test");
        Allergy al = new Allergy(allergyValues);
        Page<Allergy> page = new PageImpl(Collections.singletonList(al));
        when(genericPatientRelatedDaoMock.findAllByPID(Allergy.class, "3", null)).thenReturn(page);

        LinkedHashMap<String, String> map1 = new LinkedHashMap<String, String>(1);
        map1.put("patientId", "3");
        Session mockSession = Mockito.mock(Session.class);
        Message mockMessage = Mockito.mock(Message.class);
        SimpleMessageConverter converter = Mockito.mock(SimpleMessageConverter.class);
        handler.converter = converter;
        when(converter.fromMessage(mockMessage)).thenReturn(map1);
        handler.onMessage(mockMessage, mockSession);
        verify(genericPatientRelatedDaoMock, times(1)).findAllByPID(Allergy.class, "3", null);
        verify(solrServiceMock, times(1)).save(al);
    }

}
