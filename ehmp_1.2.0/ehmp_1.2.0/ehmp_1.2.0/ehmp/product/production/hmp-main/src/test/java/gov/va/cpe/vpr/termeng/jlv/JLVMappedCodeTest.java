package gov.va.cpe.vpr.termeng.jlv;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

/**
 * This tests the JLVMappedCode class.
 * 
 * @author Les.Westberg
 *
 */
public class JLVMappedCodeTest {
	JLVMappedCode testSubject = null;

	@Before
	public void setUp() throws Exception {
		testSubject = new JLVMappedCode();
	}

	@Test
	public void testHappyPath() {
		testSubject.setCode("TheCode");
		testSubject.setCodeSystem("TheCodeSystem");
		testSubject.setDisplayText("TheDisplayText");
		assertEquals("Code was not correct.", "TheCode", testSubject.getCode());
		assertEquals("CodeSystem was not correct.", "TheCodeSystem", testSubject.getCodeSystem());
		assertEquals("DisplayText was not correct.", "TheDisplayText", testSubject.getDisplayText());
	}

}
