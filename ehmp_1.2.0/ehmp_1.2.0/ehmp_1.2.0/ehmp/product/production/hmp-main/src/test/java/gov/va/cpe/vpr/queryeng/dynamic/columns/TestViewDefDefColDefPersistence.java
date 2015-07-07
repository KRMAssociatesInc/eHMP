package gov.va.cpe.vpr.queryeng.dynamic.columns;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Map;

import org.hamcrest.CoreMatchers;
import org.junit.Ignore;
import org.junit.Test;

public class TestViewDefDefColDefPersistence {
	
	String srcJsonForVDD = "{\"summary\":\"gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef@1c62f6a\",\"name\":\"test\",\"primaryViewDefClassName\":\"gov.va.cpe.vpr.queryeng.dynamic.PatientPanelViewDef\",\"bjw\":[\"{\\\"summary\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.CheckInTime@4ad23195\\\",\\\"type\\\":\\\"GSP\\\",\\\"viewdefCode\\\":\\\"gov.va.cpe.vpr.queryeng.AppointmentViewDef\\\",\\\"viewdefFilters\\\":{},\\\"configProperties\\\":{},\\\"summaryType\\\":\\\"GSP\\\",\\\"fieldName\\\":\\\"Check-In Time\\\",\\\"fieldDataIndex\\\":\\\"/rollup/brList\\\",\\\"name\\\":\\\"Check-In Time\\\",\\\"appInfo\\\":{\\\"name\\\":\\\"Check-In Time\\\",\\\"code\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.CheckInTime\\\",\\\"type\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef\\\"},\\\"@class\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.CheckInTime\\\"}\",\"{\\\"summary\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.ReasonForVisit@eef0a29\\\",\\\"type\\\":\\\"GSP\\\",\\\"viewdefCode\\\":\\\"gov.va.cpe.vpr.queryeng.AppointmentViewDef\\\",\\\"viewdefFilters\\\":{\\\"range\\\":\\\"+0d\\\"},\\\"configProperties\\\":{},\\\"summaryType\\\":\\\"GSP\\\",\\\"fieldName\\\":\\\"Reason For Visit\\\",\\\"fieldDataIndex\\\":\\\"/rollup/brList\\\",\\\"name\\\":\\\"Reason For Visit\\\",\\\"appInfo\\\":{\\\"name\\\":\\\"Reason For Visit\\\",\\\"code\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.ReasonForVisit\\\",\\\"type\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef\\\"},\\\"@class\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.ReasonForVisit\\\"}\",\"{\\\"summary\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.MedsDue@6ba67ab5\\\",\\\"type\\\":\\\"GSP\\\",\\\"viewdefCode\\\":\\\"gov.va.cpe.vpr.queryeng.MedsViewDef\\\",\\\"viewdefFilters\\\":{\\\"filter_kind\\\":\\\"I\\\",\\\"qfilter_status\\\":[\\\"ACTIVE\\\",\\\"PENDING\\\",\\\"DISCONTINUED\\\",\\\"EXPIRED\\\"],\\\"range\\\":\\\"2000..NOW\\\"},\\\"configProperties\\\":{\\\"qualifiedName\\\":\\\"\\\"},\\\"summaryType\\\":\\\"GSP\\\",\\\"fieldName\\\":\\\"All Meds Due\\\",\\\"fieldDataIndex\\\":\\\"/rollup/brList\\\",\\\"name\\\":\\\"Meds Due\\\",\\\"appInfo\\\":{\\\"name\\\":\\\"Meds Due\\\",\\\"code\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.MedsDue\\\",\\\"type\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef\\\"},\\\"@class\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.MedsDue\\\"}\",\"{\\\"summary\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults@4ad8d990\\\",\\\"type\\\":\\\"GSP\\\",\\\"viewdefCode\\\":\\\"gov.va.cpe.vpr.queryeng.LabViewDef\\\",\\\"viewdefFilters\\\":{\\\"range\\\":\\\"-1y\\\"},\\\"configProperties\\\":{\\\"typeFilters\\\":\\\"glucose, creatinine\\\"},\\\"summaryType\\\":\\\"GSP\\\",\\\"fieldName\\\":\\\"Gluc & Creat\\\",\\\"fieldDataIndex\\\":\\\"/rollup/brList\\\",\\\"name\\\":\\\"Recent Lab Results\\\",\\\"appInfo\\\":{\\\"name\\\":\\\"Recent Lab Results\\\",\\\"code\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults\\\",\\\"type\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef\\\"},\\\"@class\\\":\\\"gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults\\\"}\"],\"cols\":[{\"@class\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.MedsDue\",\"summary\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.MedsDue@401b80c3\",\"type\":\"GSP\",\"viewdefCode\":\"gov.va.cpe.vpr.queryeng.MedsViewDef\",\"viewdefFilters\":{\"qfilter_status\":[\"ACTIVE\"],\"range\":\"2000..NOW\",\"filter_kind\":[\"I\"]},\"configProperties\":{},\"summaryType\":\"GSP\",\"fieldName\":\"Inpt. Meds Due\",\"fieldDataIndex\":\"/rollup/brList\",\"name\":\"Meds Due\",\"appInfo\":{\"name\":\"Meds Due\",\"code\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.MedsDue\",\"type\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef\"}}]}";

	String mapTest = "{\"summary\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults@4ad8d990\",\"type\":\"GSP\",\"viewdefCode\":\"gov.va.cpe.vpr.queryeng.LabViewDef\",\"viewdefFilters\":{\"range\":\"-1y\"},\"configProperties\":{\"typeFilters\":\"glucose, creatinine\"},\"summaryType\":\"GSP\",\"fieldName\":\"Gluc & Creat\",\"fieldDataIndex\":\"/rollup/brList\",\"name\":\"Recent Lab Results\",\"appInfo\":{\"name\":\"Recent Lab Results\",\"code\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults\",\"type\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef\"},\"@class\":\"gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults\"}";
	
	@Ignore
	@SuppressWarnings("unchecked")
	@Test
	public void test() throws IllegalArgumentException, SecurityException, InstantiationException, IllegalAccessException, InvocationTargetException, NoSuchMethodException, ClassNotFoundException {
		Map<String, Object> mp = POMUtils.parseJSONtoMap(srcJsonForVDD);
		ViewDefDef vdd = new ViewDefDef(mp);
		vdd.setBjw(mp.get("bjw").toString());
		vdd.restoreFromBjw();
		assertThat(vdd.getCols().size(), equalTo(4));
		assertThat(vdd.getCols().first().getClass().getName(), equalTo(MedsDue.class.getName()));
		mp = POMUtils.parseJSONtoMap(mapTest);
		assertThat(mp.get("viewdefCode").toString(), equalTo("gov.va.cpe.vpr.queryeng.LabViewDef"));
		assertThat(mp.get("viewdefFilters"), CoreMatchers.instanceOf(Map.class));
		assertThat(mp.get("configProperties"), CoreMatchers.instanceOf(Map.class));
		assertThat(((Map<String, Object>)mp.get("configProperties")).get("typeFilters").toString(), equalTo("glucose, creatinine"));
		String className = mp.get("@class").toString();
		assertThat(className, equalTo("gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults"));// {
		RecentResults rr = new RecentResults(mp);//((RecentResults)Class.forName(className).getConstructor(Map.class).newInstance(mp));
		assertThat(rr.getConfigProperties().get("typeFilters").toString(), equalTo("glucose, creatinine"));	
		
	}

}
