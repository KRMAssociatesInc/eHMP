package us.vistacore.vxsync.id;

import static org.junit.Assert.*;

import org.junit.Test;

public class PatientIdentifierTest {
	
	@Test
	public void testEdipi() {
		String inputId = "DOD;000000003";
		PatientIdentifier id = PatientIdentifier.getPatientId(inputId);
		assertTrue(id instanceof Edipi);
		assertEquals(inputId, id.toString());
		MviEdipi edipi = new MviEdipi((Edipi)id);
		assertNotNull(edipi);
		assertEquals("000000003^NI^200DOD^USDOD", edipi.toString());
	}
	
	@Test
	public void testIcn() {
		String inputId = "7349340275V934823";
		PatientIdentifier id = PatientIdentifier.getPatientId(inputId);
		assertTrue(id instanceof Icn);
		assertEquals(inputId, id.toString());
		MviIcn icn = new MviIcn((Icn)id);
		assertNotNull(icn);
		assertEquals("7349340275V934823^NI^200M^USVHA", icn.toString());
	}

	@Test
	public void testDfn() {
		String inputId = "9E7A;3";
		PatientIdentifier id = PatientIdentifier.getPatientId(inputId);
		assertTrue(id instanceof Dfn);
		assertEquals(inputId, id.toString());
		MviDfn dfn = new MviDfn((Dfn)id);
		assertNotNull(dfn);
		assertEquals("3^PI^9E7A^USVHA", dfn.toString());
	}

	@Test
	public void testMviIcn() {
		String inputId = "5000000126V406128^NI^200M^USVHA";
		PatientIdentifier id = PatientIdentifier.getPatientId(inputId);
		assertTrue(id instanceof MviIcn);
		assertEquals(inputId, id.toString());
		assertEquals("5000000126V406128", id.getPrefixedId());
	}

	@Test
	public void testMviEdipi() {
		String inputId = "5000000126V406128^NI^200DOD^USDOD";
		PatientIdentifier id = PatientIdentifier.getPatientId(inputId);
		assertTrue(id instanceof MviEdipi);
		assertEquals(inputId, id.toString());
		assertEquals("DOD;5000000126V406128", id.getPrefixedId());
	}

	@Test
	public void testMviDfn() {
		String inputId = "100625^PI^9E7A^USVHA";
		PatientIdentifier id = PatientIdentifier.getPatientId(inputId);
		assertTrue(id instanceof MviDfn);
		assertEquals(inputId, id.toString());
		assertEquals("9E7A;100625", id.getPrefixedId());
	}

	@Test
	public void testInvalidId() {
		PatientIdentifier id = PatientIdentifier.getPatientId("1");
		assertTrue(id == null);
	}

}
