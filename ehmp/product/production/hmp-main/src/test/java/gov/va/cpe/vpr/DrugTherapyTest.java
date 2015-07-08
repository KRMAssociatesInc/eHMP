package gov.va.cpe.vpr;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import gov.va.cpe.vpr.DrugTherapy.MedStatus;
import gov.va.cpe.vpr.DrugTherapy.MedType;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.healthtime.CPRSDateTimePrinterSet;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.MSCUIDateTimePrinterSet;
import gov.va.hmp.healthtime.PointInTime;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;

import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.Ignore;
import org.mockito.Matchers;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

/*
 * This class tests a snapshot of avivapatient 6's medication history and
 * tests the structure of the DrugTherapy derivative objects
 */
public class DrugTherapyTest {
	
	private static HealthTimePrinterSet FORMATTER = new CPRSDateTimePrinterSet();
	private static Map<String,DrugTherapy> data = new HashMap<>();
	private static int medCount=0;
	private static List<Medication> meds = null;
	private static IGenericPOMObjectDAO DAO = mock(IGenericPOMObjectDAO.class);
	private static Map<String,DrugTherapy> DAO_DATA = new HashMap<>();
	private static POMObjectTester<Medication> LOADER = new POMObjectTester<Medication>() {
		@Override
		protected Medication handle(Medication med) {
	        // get the default type/category classification
	        MedType type = DrugTherapy.MedType.typeOf(med);
	        String dispName = med.getQualifiedName();
	        String key = type.getGroup() + ":" + dispName;
	        
	        // Initialize a new DrugTherapy if we don't have one yet and add the med to it
	        DrugTherapy dt = data.get(key);
	        if (dt == null) {
	        	data.put(key, dt = new DrugTherapy(type, dispName));
	        }
	        dt.addMed(med);
	        med.save(DAO);
	        medCount++;
	        return med;
		}
	};

	@BeforeClass
	public static void setup() throws URISyntaxException, IOException {

		// setup mock methods for save/find
		when(DAO.findByUID((Class<DrugTherapy>) any(), anyString())).thenAnswer(new Answer<DrugTherapy>() {
			@Override
			public DrugTherapy answer(InvocationOnMock invocation) throws Throwable {
				String uid = (String) invocation.getArguments()[1];
				return DAO_DATA.get(uid);
			}
		});
		
		when(DAO.save(Matchers.any(DrugTherapy.class))).thenAnswer(new Answer<DrugTherapy>() {
			@Override
			public DrugTherapy answer(InvocationOnMock invocation) throws Throwable {
				DrugTherapy dt = (DrugTherapy) invocation.getArguments()[0];
				DAO_DATA.put(dt.getUid(), dt);
				return dt;
		}});
		
		// load all the data
		if (data.isEmpty()) {
			File file = new File(DrugTherapyTest.class.getResource("avivapatient.six.20140304.zip").toURI()); 
			meds = LOADER.loadZipFile(file, "5000000346","med");
		}
	}
	
	@Test
	public void testBasicGroups() {
		// PT 6 has 183 records collapsed into 64 therapy objects
		assertEquals(183, medCount);
		assertEquals(52, data.size());
		
		// check for one med that should be in each of 5 categories
		assertTrue(data.containsKey("Inpatient Meds:MORPHINE INJ"));
		assertTrue(data.containsKey("Outpatient Meds:ACETAMINOPHEN TAB"));
		assertTrue(data.containsKey("Non-VA Meds:ACETAMINOPHEN TAB"));
		assertTrue(data.containsKey("Clinic Orders:MORPHINE INJ"));
	}
	
	@Test
	public void testClinicOrder() {
		// clinic order: morphine has 1 order
		DrugTherapy dt = data.get("Clinic Orders:MORPHINE INJ");
		assertEquals("MORPHINE INJ", dt.getName());
		assertTrue(dt.hasMeds());
		assertEquals(1, dt.getMeds().size());
		assertEquals(DrugTherapy.MedType.IMO, dt.getType());
		assertFalse(dt.isRecent());
		assertTrue(dt.getPrimary().isIMO());
	}
	
	@Test
	public void testExternalMeds() {
		// external meds has 2 groups, one of which is ACETAMINOPHEN TAB
		DrugTherapy dt = data.get("Non-VA Meds:ACETAMINOPHEN TAB");
		assertTrue(dt.hasMeds());
		assertEquals(1, dt.getMeds().size());
		assertEquals(DrugTherapy.MedType.NonVA, dt.getType());
		assertTrue(dt.getPrimary().isNonVA());
	}
	
	@Test
	public void testOutpatientMeds() {
		// outpatient meds has 15, one of which is ACETAMINOPHEN TAB
		DrugTherapy dt = data.get("Outpatient Meds:ACETAMINOPHEN TAB");
		assertTrue(dt.hasMeds());
		assertEquals(1, dt.getMeds().size());
		assertEquals(DrugTherapy.MedType.OutPRN, dt.getType());
		assertTrue(dt.getPrimary().isOutPatient());
		assertTrue(dt.getPrimary().isPRN());
	}
	
	@Test
	public void testInpatientMORPHINE() {
		// there are 2 inpatient MORPHINE TAB orders, 1 is current, 1 is old
		DrugTherapy dt = data.get(MedType.InPT.getGroup() + ":MORPHINE INJ");
		assertTrue(dt.hasMeds());
		assertEquals(2, dt.getMeds().size());
		assertEquals(DrugTherapy.MedType.PRN, dt.getType());
		assertTrue(dt.getPrimary().isInPatient());
		assertTrue(dt.getPrimary().isPRN());
		assertEquals(new PointInTime("201307091500"), dt.getTherapyStart());
		assertEquals(new PointInTime("201407211400"), dt.getTherapyStop());
		
		// min/max dose is 2mg Q6H=12mg/daily
		Float[] vals = dt.calcDoseRange();
		assertNotNull(vals);
		assertEquals(4, vals.length);
		assertEquals(12.0f, vals[0], 0);
		assertEquals(12.0f, vals[1], 0);
		assertEquals(2.0f, vals[2], 0);
		assertEquals(2.0f, vals[3], 0);
	}
	
	@Test
	public void testOutpatientVENLAFAXINE() {
		// there are 5 outpatient VENLAFAXINE CAP,SA orders
		DrugTherapy dt = data.get(MedType.OutPT.getGroup() + ":VENLAFAXINE CAP,SA");

		assertTrue(dt.hasMeds());
		assertEquals(5, dt.getMeds().size());
		assertEquals(DrugTherapy.MedType.OutPT, dt.getType());
		assertTrue(dt.getPrimary().isOutPatient());
		assertEquals(8, dt.getAllFills().size());
		assertEquals(new PointInTime("20081119"), dt.getTherapyStart());
		assertEquals(new PointInTime("20140722"), dt.getTherapyStop());
		
		// 2 doses in this history: 75mg BID (150mg/day) and and 225mg daily (225/day)
		Float[] vals = dt.calcDoseRange();
		assertNotNull(vals);
		assertEquals(4, vals.length);
		assertEquals(150.0f, vals[0], 0); // minDD
		assertEquals(225.0f, vals[1], 0); // maxDD
		assertEquals(75f, vals[2], 0); // minDose
		assertEquals(225f, vals[3], 0); // maxDose
		
	}
	
	
	@Test
	@Ignore
	public void testInpatientGeneric() {
		// loop through all recent inpatient DrugTherapy groups
		for (String key : data.keySet()) {
//			System.out.println("TEsting: " + dt.getPrimary().getUid());
			DrugTherapy dt = data.get(key);
			assertNotNull(dt);
			assertTrue(dt.hasMeds());
			assertEquals(dt.getName(), key.split(":")[1]);

			if (key.startsWith("Inpatient Meds")) {
				assertTrue(dt.getPrimary().isInPatient());
			} else if (key.startsWith("External Meds")) {
				assertTrue(dt.getPrimary().isNonVA());
			} else if (key.startsWith("Outpatient Meds")) {
				assertTrue(dt.getPrimary().isOutPatient());
			}
			
			testGeneric(dt);
		}
	}
	
	private void testGeneric(DrugTherapy dt) {
		// meds are sorted by date desc, therefore meds.first() == therapystop and meds.last() == therapystart
		// TODO: this isn't always true, need to re-evaluate
//		assertEquals(dt.getTherapyStop(), dt.getMeds().first().getOverallStop());
//		assertEquals(dt.getTherapyStart(), dt.getMeds().last().getOverallStart());

		// test the map
		Medication prim = dt.getPrimary();
		MedType type = dt.getType();
		Map<String,Object> map = dt.buildRow(new HashMap<String,Object>(), new MSCUIDateTimePrinterSet());
		assertEquals(dt.getName(), map.get("name"));
		assertEquals(type.getGroup(), map.get("groupName"));
		assertEquals(prim.getUid(), map.get("uid"));
		assertEquals(DrugTherapy.MedStatus.statusOf(prim).displayName(), map.get("vaStatus"));
		
		// not inpatient? Should never have a last admin
		if (!prim.isInPatient()) {
			assertNull(dt.getLastAdmin());
		}
		
		// if it does have last admin, ensure its the latest admin ever
		if (dt.getLastAdmin() != null) {
			int adminCount = 0;
			for (Medication med : dt.getMeds()) {
				for (MedicationAdministration admin : med.getAdministrations()) {
					assertTrue(admin.getDateTime().equals(dt.getLastAdmin()) ||
							admin.getDateTime().before(dt.getLastAdmin()));
					adminCount++;
				}
			}
			assertEquals(adminCount, dt.getAllAdmins().size());
		} else {
			// if no last admin, should have no admins
			assertTrue(dt.getAllAdmins().isEmpty());
			assertTrue(prim.getAdministrations().isEmpty());
		}
		
		// not outpatient? should never have a last fill
		if (!prim.isOutPatient()) {
			assertNull(dt.getLastFill());
		}
		
		// if it does have a last fill, ensure its the lastest fill ever
		if (dt.getLastFill() != null) {
			int fillCount = 0; 
			for (Medication med : dt.getMeds()) {
				for (MedicationFill fill : med.getFills()) {
					fillCount++;
					Object partial = fill.getProperty("partial");
					if (partial != null && partial.equals(1)) continue; // skip this
					assertTrue(fill.getDispenseDate().equals(dt.getLastFill()) ||
							fill.getDispenseDate().before(dt.getLastFill()));
				}
			}
			assertEquals(fillCount, dt.getAllFills().size());
		} else {
			// if no last fill, should have no fills anywhere
			assertTrue(dt.getAllFills().isEmpty());
			assertTrue(prim.getFills().isEmpty());
		}
		
		// test daily dose
		testGenericDailyDose(dt);
		
		// TODO: How to test
		// tagline
		// status
		// doseStr
		// doseScheduleStr
		// svg
		// selfLink
	}
	
	private void testGenericDailyDose(DrugTherapy dt) {
		// nothing should have daily dose b/c they are all old
		Number dd = dt.getDailyDose();
		if (dd != null) {
			// check all the meds/doses
			int activeCnt = 0;
			String units = dt.getPrimary().getUnits();
			for (Medication med : dt.getMeds()) {
				if (med.isActive()) {
					activeCnt++;
				}
				
				// all units should be the same
				assertEquals(units, med.getUnits());
				for (MedicationDose dose : med.getDosages()) {
					assertEquals(units, dose.getUnits());
					
					// must have > daily dose frequencies
					Integer freq = dose.getScheduleFreq();
					if (freq != null) {
						assertTrue(freq < 1440);
					}
				}
			}
			
			// must have active meds
			assertTrue(activeCnt > 0);
			
			// must be different than main dose value
			assertFalse(dd.equals(dt.getPrimary().getDosages().get(0).calcDailyDose()));
		}
		
	}
	
	@Test
	public void testDailyDose() {
		
		// create a DrugTherapy with 2 active orders for Warfarin representing 7MG daily
		
		// m1 dose = 2MG DAILY
		Medication m1 = new Medication();
		m1.setData("uid", "urn:foo:bar:warfarin:AAA");
		m1.setData("vaType", "O");
		m1.setData("vaStatus", "ACTIVE");
		m1.setData("overallStart", PointInTime.today());
		m1.setData("overallStop", PointInTime.today().addDays(7));
		
		Medication m2 = new Medication();
		m2.setData("uid", "urn:foo:bar:warfarin:BBB");
		m2.setData("vaType", "O");
		m2.setData("vaStatus", "ACTIVE");
		m2.setData("overallStart", PointInTime.today());
		m2.setData("overallStop", PointInTime.today().addDays(7));
		
		Map<String, Object> d1 = new HashMap<>();
		d1.put("doseVal", 2);
		d1.put("units", "MG");
		d1.put("scheduleFreq", 1440);
		m1.setData("dosages", Arrays.asList(d1));
		
		// m2 dose = 5MG DAILY
		Map<String, Object> d2 = new HashMap<>();
		d2.put("doseVal", 5);
		d2.put("units", "MG");
		d2.put("scheduleFreq", 1440);
		m2.setData("dosages", Arrays.asList(d2));
		
		// setup our test
		MedicationDose dose1 = m1.getDosages().get(0);
		MedicationDose dose2 = m2.getDosages().get(0);
		DrugTherapy dt = new DrugTherapy(MedType.OutPT, "Warfarin");
		dt.addMed(m1);
		assertEquals(2, m1.getDailyDose());
		
		// total daily dose with just the first med should be 2, but will
		// return null since its <= daily frequency
		assertNull(dt.getDailyDose());
		
		dt.addMed(m2);
		assertEquals(5, m2.getDailyDose());
		
		// total daily dose should be 7MG (and even though they are both <= daily, they 
		// should return since there are two orders)
		assertEquals(7, dt.getDailyDose());
		
		// should be not null if greater than daily
		dose1.setData("scheduleFreq", 720);
		dose2.setData("scheduleFreq", 720);
		assertEquals(14, dt.getDailyDose());
		
		// prefix should initially be total daily
		assertEquals("Total daily", dt.getDailyDosePrefix());
		
		// prefix should change to max daily for PRN
		dose1.setData("scheduleName", "BID PRN");
		assertEquals("Max daily", dt.getDailyDosePrefix());
	}
	
	@Test
	public void testStatusCounts() {
		
		
		/* uncomment to list
		for (String key : data.keySet()) {
			DrugTherapy dt = data.get(key);
			System.out.println("KEY=" + key);
			
			for (MedStatus ms : MedStatus.values()) {
				System.out.printf("\t%s=%s\n", ms.name(), dt.getStatusCount(ms));
			}
		}
		*/
		
		// Outpatient Meds:CALCIUM CARBONATE TAB has 1 pending
		assertEquals(1, data.get("Outpatient Meds:CALCIUM CARBONATE TAB").getStatusCount(MedStatus.PENDING));
		
		// Inpatient Meds:SIMVASTATIN TAB has 1 active
		assertEquals(1, data.get("Inpatient Meds:SIMVASTATIN TAB").getStatusCount(MedStatus.ACTIVE));
		
		// Outpatient Meds:GLYBURIDE TAB has 9 DISCONTINUED
		assertEquals(9, data.get("Outpatient Meds:GLYBURIDE TAB").getStatusCount(MedStatus.DISCONTINUED));
		
		// Outpatient Meds:ASPIRIN TAB,EC has 2 EXPIRED
		assertEquals(2, data.get("Outpatient Meds:ASPIRIN TAB,EC").getStatusCount(MedStatus.EXPIRED));
	}
	
	@Test
	public void testIsRecent() {
		// bulk testing isRecent by creating a new DrugTherapy for each individual Medication record
		// and comparing DrugTherapy.isRecent() to Medication.isRecent()
		
		for (Medication med : meds) {
			DrugTherapy dt = new DrugTherapy(MedType.typeOf(med), "FOO");
			dt.addMed(med);
			assertEquals(med.isRecent(), dt.isRecent());
		}
	}
	
	@Test
	public void testMedStatus() {
		Medication med = new Medication();
		assertSame(MedStatus.OTHER, MedStatus.statusOf(med));
		
		med.setData("vaStatus", "ACTIVE");
		assertSame(MedStatus.ACTIVE, MedStatus.statusOf(med));

		med.setData("vaStatus", "CANCELED");
		assertSame(MedStatus.CANCELED, MedStatus.statusOf(med));

		med.setData("vaStatus", "DISCONTINUED");
		assertSame(MedStatus.DISCONTINUED, MedStatus.statusOf(med));

		med.setData("vaStatus", "DISCONTINUED/EDIT");
		assertSame(MedStatus.DISCONTINUEDEDIT, MedStatus.statusOf(med));

		med.setData("vaStatus", "EXPIRED");
		assertSame(MedStatus.EXPIRED, MedStatus.statusOf(med));

		med.setData("vaStatus", "HOLD");
		assertSame(MedStatus.HOLD, MedStatus.statusOf(med));

		med.setData("vaStatus", "foo");
		assertSame(MedStatus.OTHER, MedStatus.statusOf(med));

		med.setData("vaStatus", "PENDING");
		assertSame(MedStatus.PENDING, MedStatus.statusOf(med));

		med.setData("vaStatus", "SUSPEND");
		assertSame(MedStatus.SUSPEND, MedStatus.statusOf(med));
	}
	
	@Test
	public void testMedType() {
		Medication med = new Medication();
		
		assertSame(MedType.Other, MedType.typeOf(med));
	}
	
//	@Test // broken, work in progress
	public void testSerialization() {
		// how does DrugTherapy.getType() serialize?
		Map<String,Object> map = data.get("Outpatient Meds:ACETAMINOPHEN TAB").getData();
		assertNotNull(map.get("type"));
		assertNotNull(map.get("statusCounts"));
		assertEquals("OutPRN", map.get("type"));
		
		
		// should serialize ok
		DrugTherapy dt = new DrugTherapy(map);
		assertEquals(dt.getType(), MedType.OutPRN);
		System.out.println(map);
	}
		
	public void testCompareAll() {
		assertEquals(data.size(), DAO_DATA.size());
		for (DrugTherapy dt1 : data.values()) {
			// compare that the two objects
			DrugTherapy dt2 = DAO_DATA.get(DrugTherapy.getDrugTherapyUID(dt1.getPrimary()));
			assertNotNull(dt2);
			assertNotSame(dt1,dt2);

			assertEquals(dt1.getName(), dt2.getName());
			assertEquals(dt1.getTherapyStart(), dt2.getTherapyStart());
			assertEquals(dt1.getTherapyStop(), dt2.getTherapyStop());
			assertEquals(dt1.getMeds().size(), dt2.getMeds().size());
			
			// check the fields that go to the ViewDefGridPanel for consistency
			Map<String,Object> data1=dt1.buildRow(new HashMap<String,Object>(), FORMATTER), data2=dt2.getData();
			
			assertNotEquals(data1.get("uid"), data2.get("uid"));
			assertEquals(data1.get("name"), data2.get("name"));
			assertEquals(data1.get("groupName"), data2.get("groupName"));
			assertEquals(nvl(data1.get("lastAdmin")), data2.get("lastAdmin"));
			assertEquals(nvl(data1.get("lastFill")), data2.get("lastFill"));
			
			// fields in MedsPanel.js (need to be serialized): name,groupName,tagline(lastFill,fillsRemain,fillDays,cssClass),doseStr,dailyDose,dailyDosePrefix,dailyDoseUnits,doseScheduleStr,status,svg
			// fields in medicationhistory.vm (not serialized): lastAdmin,lastFill,overallStart,overallStop,.....

			// TODO: check additional fields that will be stored in JDS
			
			
			
			// fields in buildRow() not in getData(): renewBy
			//doseScheduleStr,svg,status,vaStatus,selfLink,orderCount,doseStr,vaType,dailyDosePrefix,dailyDoseUnits,medType,tagline
			
//			assertEquals(data1.size(), data2.size());
//			for (String key : data1.keySet()) {
//				Object val1 = data1.get(key), val2 = data2.get(key);
//				assertEquals(val1,val2);
//			}
			
//			SortedSet<Medication> meds1 = dt1.getMeds();
//			SortedSet<Medication> meds2 = dt2.getMeds();
			
		}
	}
	
	private static String nvl(Object val) {
		return nvl(val, null);
	}
	
	private static String nvl(Object val, String ifnull) {
		return (val == null) ? ifnull : val.toString();
	}
}
