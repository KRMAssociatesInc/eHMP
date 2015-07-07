package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.clio.ClioTermChild;
import gov.va.cpe.clio.ClioTermQualifier;
import gov.va.cpe.clio.ClioTermUnit;
import gov.va.cpe.clio.ClioTerminology;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class ClioImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() {
        ClioTerminology a = (ClioTerminology) importer.convert(MockVistaDataChunks.createOperationalFromJson(getClass().getResourceAsStream("clioterm.json"), "clioterminology"));
        ClioTermQualifier[] quals = a.getQualifiers();
        ClioTermUnit[] units = a.getUnits();
        ClioTermChild[] kids = a.getChildTerms();
        assertThat(quals.length, is(equalTo(1)));
        assertThat(units.length, is(equalTo(2)));
        assertThat(kids.length, is(equalTo(0)));
//        assertThat(a.getPid(), is(equalTo(MOCK_PID)));
//
//        assertThat(a.uid, is(equalTo(UidUtils.getDocumentUid(MockVistaDataChunks.VISTA_ID, "229", "4329"))))
//        assertThat(a.localId, is(equalTo("3531")))
//		assertThat(a.text, not(null));
//		assertThat(a.text.size(), is(equalTo(1)));
//		assertThat(a.text[0], not(null));
//		
//		for(DocumentClinician dc: a.clinicians)
//		{
//			if(dc.role.equals("A"))
//			{
//				assertThat(dc.uid, is(equalTo(UidUtils.getUserUid(MockVistaDataChunks.VISTA_ID, "986"))))
//			}
//			else
//			{
//				assertThat(dc.role, is(equalTo("S")))
//				assertThat(dc.signedDateTime, is(new PointInTime(2006, 12, 8, 18, 27, 50)))
//				assertThat(dc.signature, is(equalTo("THREE PROVIDER PHYSICIAN")))
//				assertThat(dc.uid, is(equalTo(UidUtils.getUserUid(MockVistaDataChunks.VISTA_ID, "986"))))
//			}
//		}

//        assertThat(a.documentClass, is(equalTo("SURGICAL REPORTS")))
//        assertThat(a.encounterUid, is(equalTo(UidUtils.getVisitUid(MockVistaDataChunks.VISTA_ID, "8", "5554"))))
//        assertThat(a.encounterName, equalTo("OR4 Dec 08, 2006"))
//        assertThat(a.facilityName, is(equalTo("SLC-FO HMP DEV")))
//        assertThat(a.localId, is(equalTo("3531")))
//        assertThat(a.localTitle, is(equalTo("ANESTHESIA REPORT")))
//        assertThat(a.referenceDateTime, is(new PointInTime(2006, 12, 8, 7, 30)))
//		assertThat(a.documentTypeName, is(equalTo("Surgery Report")))
//		assertThat(a.documentTypeCode, is(equalTo("SR")))

    }

}
