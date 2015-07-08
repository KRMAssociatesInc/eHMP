package gov.va.cpe.vpr;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import gov.va.cpe.vpr.frameeng.FrameAction.ObsDateRequestAction;
import gov.va.cpe.vpr.frameeng.FrameAction.ObsRequestAction;
import gov.va.cpe.vpr.pom.jds.JdsGenericDAO;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.springframework.web.client.RestTemplate;

public class PatientAlertITCase {
	
	
	@Test
	public void test() {
		RestTemplate resttpl = new RestTemplate();
		JdsTemplate tpl = new JdsTemplate();
		tpl.setRestTemplate(resttpl);
		tpl.setJdsUrl("http://localhost:9080");
		JdsGenericDAO dao = new JdsGenericDAO();
		dao.setJdsTemplate(tpl);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("uid", "urn:va:::alert:10:teratogenic:med:33456");
		map.put("pid", "10");
		map.put("frameID", "gov.va.cpe.vpr.frameeng.TeratogenicMedsFrame");
		map.put("title", "Foo2");
		map.put("description", "Bar");
		PatientAlert pa = new PatientAlert(map);
		pa.addSubAction(new ObsDateRequestAction("10", "Observe this", "urn:lnc:1234-5"));
		pa.addSubAction(new ObsRequestAction("10", "Observe this as well", "urn:lnc:1234-5"));
		dao.save(pa);
		
		pa = dao.findByUID("urn:va:::alert:10:teratogenic:med:33456");
		System.out.println(pa.getData());
		
		assertEquals("Foo2", pa.getTitle());
		assertEquals("10", pa.getPid());
		assertEquals(2, pa.getActions().size());
		assertSame(ObsDateRequestAction.class, pa.getActions().get(0).getClass());
		assertSame(ObsRequestAction.class, pa.getActions().get(1).getClass());
	}

}
