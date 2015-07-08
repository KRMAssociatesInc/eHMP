package us.vistacore.vxsync.vler;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.Ignore;
import org.w3c.dom.Document;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.List;

import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertTrue;

public class VlerDocumentUtilTest
{
    /** The Constant VLER_DATA_FOLDER. */
    private static final String VLER_DATA_FOLDER = "vler/";

    private String C32;
    private String CCDA;

    @Before
    public void setup() {
        try {
            C32 = readFile(VLER_DATA_FOLDER, "c32.xml");
            CCDA = readFile(VLER_DATA_FOLDER, "ccda.xml");
        } catch (IOException e) {
            fail(e.getMessage());
        }
    }

    @Test
    @Ignore
    public void testC32ExtractSectionNarrativesFromCCD() {

        Document c32Doc = VlerDocumentUtil.parseXMLDocument(C32.getBytes());

        assertNotNull(c32Doc);

        List<Section> c32NarrativeSections = VlerDocumentUtil.extractSectionNarrativesFromCCD(c32Doc);

        assertThat(c32NarrativeSections.size(), is(12));

        testC32SectionList(c32NarrativeSections);
    }

    @Test
    @Ignore
    public void testCCDAExtractSectionNarrativesFromCCD() {

        Document ccdaDoc = VlerDocumentUtil.parseXMLDocument(CCDA.getBytes());

        assertNotNull(ccdaDoc);

        List<Section> ccdaNarrativeSections = VlerDocumentUtil.extractSectionNarrativesFromCCD(ccdaDoc);

        assertThat(ccdaNarrativeSections.size(), is(13));

        testCCDASectionList(ccdaNarrativeSections);
    }

    private void testC32SectionList(List<Section> sectionList) {
        final int SECTION_COMMENTS = 0;
        final int SECTION_ALLERGIES = 1;
        final int SECTION_MEDICATIONS = 2;
        final int SECTION_ACTIVE_PROBLEMS = 3;
        final int SECTION_RESOLVED_PROBLEMS = 4;
        final int SECTION_ENCOUNTERS = 5;
        final int SECTION_PLAN_OF_CARE = 6;
        final int SECTION_IMMUNIZATIONS = 7;
        final int SECTION_SOCIAL_HISTORY = 8;
        final int SECTION_PROCEDURES = 9;
        final int SECTION_STUDIES_SUMMARY = 10;
        final int SECTION_VITALS = 11;

        for(int i = 0; i < sectionList.size(); i++) {
            Section section = sectionList.get(i);

            switch (i) {
                case SECTION_COMMENTS:
                    testSection(section,
                            new String[]{},
                            "X-DOCCMT",
                            "Source Comments");
                    break;
                case SECTION_ALLERGIES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.2",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.13",
                                    "2.16.840.1.113883.3.88.11.83.102"},
                            "48765-2",
                            "Active Allergies and Adverse Reactions");
                    break;
                case SECTION_MEDICATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.8",
                                    "2.16.840.1.113883.3.88.11.83.112",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.19"},
                            "10160-0",
                            "Medications");
                    break;
                case SECTION_ACTIVE_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.11",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.6",
                                    "2.16.840.1.113883.3.88.11.83.103"},
                            "11450-4",
                            "Active Problems");
                    break;
                case SECTION_RESOLVED_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.2.9",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.8",
                                    "2.16.840.1.113883.3.88.11.83.104"},
                            "11348-0",
                            "Resolved Problems");
                    break;
                case SECTION_ENCOUNTERS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.3",
                                    "2.16.840.1.113883.3.88.11.83.127",
                                    "1.3.6.1.4.1.19376.1.5.3.1.1.5.3.3"},
                            "46240-8",
                            "Encounters from 05/08/2014 to 08/08/2014");
                    break;
                case SECTION_PLAN_OF_CARE:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.10",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.31",
                                    "2.16.840.1.113883.3.88.11.83.124",
                                    "2.16.840.1.113883.10.20.2.7"},
                            "18776-5",
                            "Plan of Care");
                    break;
                case SECTION_IMMUNIZATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.6",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.23",
                                    "2.16.840.1.113883.3.88.11.83.117"},
                            "11369-6",
                            "Immunizations");
                    break;
                case SECTION_SOCIAL_HISTORY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.15",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.16"},
                            "29762-2",
                            "Social History");
                    break;
                case SECTION_PROCEDURES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.12",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.11",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.12",
                                    "2.16.840.1.113883.3.88.11.83.108"},
                            "47519-4",
                            "Procedures from 05/08/2014 to 08/08/2014");
                    break;
                case SECTION_STUDIES_SUMMARY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.14",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.27",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.28",
                                    "2.16.840.1.113883.3.88.11.83.122"},
                            "30954-2",
                            "Results from 05/08/2014 to 08/08/2014");
                    break;
                case SECTION_VITALS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.16",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.25",
                                    "1.3.6.1.4.1.19376.1.5.3.1.1.5.3.2",
                                    "2.16.840.1.113883.3.88.11.83.119"},
                            "8716-3",
                            "Last Filed Vitals");
                    break;
                default:
                    fail("Section unaccounted for");
                    break;
            }
        }
    }

    private void testCCDASectionList(List<Section> sectionList) {
        final int SECTION_COMMENTS = 0;
        final int SECTION_ALLERGIES = 1;
        final int SECTION_MEDICATIONS = 2;
        final int SECTION_ACTIVE_PROBLEMS = 3;
        final int SECTION_RESOLVED_PROBLEMS = 4;
        final int SECTION_ENCOUNTERS = 5;
        final int SECTION_IMMUNIZATIONS = 6;
        final int SECTION_SOCIAL_HISTORY = 7;
        final int SECTION_VITALS = 8;
        final int SECTION_PLAN_OF_CARE = 9;
        final int SECTION_PROCEDURES = 10;
        final int SECTION_STUDIES_SUMMARY = 11;
        final int SECTION_ADDITIONAL_COMMENTS = 12;

        for(int i = 0; i < sectionList.size(); i++) {
            Section section = sectionList.get(i);

            switch (i) {
                case SECTION_COMMENTS:
                    testSection(section,
                            new String[]{},
                            "X-DOCCMT",
                            "Source Comments");
                    break;
                case SECTION_ALLERGIES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.6.1"},
                            "48765-2",
                            "Active Allergies and Adverse Reactions");
                    break;
                case SECTION_MEDICATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.1.1"},
                            "10160-0",
                            "Current Medications");
                    break;
                case SECTION_ACTIVE_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.5.1"},
                            "11450-4",
                            "Active Problems");
                    break;
                case SECTION_RESOLVED_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.20"},
                            "11348-0",
                            "Resolved Problems");
                    break;
                case SECTION_ENCOUNTERS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.3",
                                    "2.16.840.1.113883.3.88.11.83.127",
                                    "1.3.6.1.4.1.19376.1.5.3.1.1.5.3.3",
                                    "2.16.840.1.113883.10.20.22.2.22"},
                            "46240-8",
                            "Most Recent Encounters");
                    break;
                case SECTION_PLAN_OF_CARE:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.10"},
                            "18776-5",
                            "Plan of Care");
                    break;
                case SECTION_IMMUNIZATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.2.1"},
                            "11369-6",
                            "Immunizations");
                    break;
                case SECTION_SOCIAL_HISTORY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.15",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.16",
                                    "2.16.840.1.113883.10.20.22.2.17"},
                            "29762-2",
                            "Social History");
                    break;
                case SECTION_PROCEDURES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.7.1"},
                            "47519-4",
                            "Procedures from 09/14/2014 to 12/14/2014");
                    break;
                case SECTION_STUDIES_SUMMARY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.3.1"},
                            "30954-2",
                            "Results from 09/14/2014 to 12/14/2014");
                    break;
                case SECTION_VITALS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.4.1"},
                            "8716-3",
                            "Last Filed Vital Signs");
                    break;
                case SECTION_ADDITIONAL_COMMENTS:
                    testSection(section,
                            new String[]{},
                            "X-DOCCMT",
                            "Additional Source Comments");
                    break;
                default:
                    fail("Section unaccounted for");
                    break;
            }
        }
    }

    private void testSection(Section section, String[] templateIdRootValues, String codeValue, String titleValue) {
        List<TemplateId> templateIds = section.getTemplateIds();
        assertNotNull(templateIds);
        assertThat(templateIds.size(), is(templateIdRootValues.length));
        if (templateIds.size() > 0) {
            List<String> ids = Arrays.asList(templateIdRootValues);
            for(int i = 0; i < templateIds.size(); i++) {
                assertNotNull(templateIds.get(i));
                assertNotNull(templateIds.get(i).getRoot());
            }
        }
        Code code = section.getCode();
        assertNotNull(code);
        assertThat(code.getCode(), is(codeValue));
        String title = section.getTitle();
        assertThat(title, is(titleValue));
        String text = section.getText();
        assertNotNull(text);
        assertTrue(text.length() > 0);
        assertTrue(text.startsWith("<text"));
        assertTrue(text.endsWith("</text>"));
    }


    /**
     * Read file.
     *
     * @param testDataFolder the test data folder
     * @param sFile the s file
     * @return the string
     * @throws java.io.IOException Signals that an I/O exception has occurred.
     */
    private String readFile(final String testDataFolder, final String sFile) throws IOException {
        final InputStream isFileData = VlerDocumentUtilTest.class.getClassLoader().getResourceAsStream(testDataFolder + sFile);
        final StringWriter swFileData = new StringWriter();
        String sFileData;
        IOUtils.copy(isFileData, swFileData);
        sFileData = swFileData.toString();

        return sFileData;
    }

}
