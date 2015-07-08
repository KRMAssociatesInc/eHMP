package gov.va.jmeadows.util.document.convert;

import org.junit.Before;
import org.junit.Test;

import javax.xml.transform.stream.StreamSource;

import java.io.*;
import java.util.concurrent.Future;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ConvertCdaDocumentCommandTest {

    private String CDA_NOTE = "<?xml version='1.0' encoding='UTF-8'?><ClinicalDocument xsi:schemaLocation=\"xmlns='urn:hl7-org:v3' xmlns:crs='urn:hl7-org:crs' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'\" xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n   <typeId extension=\"POCD_HD000040\" root=\"2.16.840.1.113883.1.3\"/>\n   <id extension=\"50402157_20110502113900_125\" root=\"2.16.840.1.113883.3.42.144.100001.17\"/>\n   <code codeSystem=\"2.16.840.1.113883.6.1\" codeSystemName=\"LOINC\" code=\"28636-9\" displayName=\"&quot;Initial Evaluation Note&quot;\"/>\n   <title>Pulmonary Nursing Follow-Up</title>\n   <effectiveTime value=\"20120829151904\"/>\n   <confidentialityCode code=\"N\" codeSystem=\"2.16.840.1.113883.5.25\"/>\n   <versionNumber value=\"8\"/>\n   <recordTarget>\n      <patientRole>\n         <id extension=\"786724\" root=\"2.16.840.1.113883.3.42.127.125.2\"/>\n         <id extension=\"000-00-1102\" root=\"2.16.840.1.113883.4.1\"/>\n         <addr>\n            <streetAddressLine>1234 Cherry Blossom Lane</streetAddressLine>\n            <city/>\n            <state/>\n            <postalCode/>\n            <country/>\n         </addr>\n         <telecom use=\"HP\" value=\"tel:\"/>\n         <patient>\n            <name>\n               <delimiter/>\n               <prefix/>\n               <suffix/>\n               <given>BOB</given>\n               <family>BTEST</family>\n            </name>\n            <administrativeGenderCode codeSystem=\"2.16.840.1.113883.5.1\" code=\"F\"/>\n            <birthTime value=\"19450101\"/>\n         </patient>\n      </patientRole>\n   </recordTarget>\n   <author>\n      <time value=\"20110502114150\"/>\n      <assignedAuthor>\n         <id extension=\"\" root=\"2.16.840.1.113883.3.42.127.125.3\"/>\n         <addr>\n            <streetAddressLine>9040 Fitzsimmons Ave</streetAddressLine>\n            <city>Tacoma</city>\n            <state>WA</state>\n            <postalCode>98431</postalCode>\n            <country>USA</country>\n         </addr>\n         <telecom use=\"WP\" value=\"tel:(253) 968-1110\"/>\n         <assignedPerson>\n            <name>\n               <delimiter/>\n               <prefix/>\n               <suffix/>\n               <given/>\n               <family>DEMO USER</family>\n            </name>\n         </assignedPerson>\n      </assignedAuthor>\n   </author>\n   <custodian>\n      <assignedCustodian>\n         <representedCustodianOrganization>\n            <id root=\"2.16.840.1.113883.3.42.127.125.13\"/>\n         </representedCustodianOrganization>\n      </assignedCustodian>\n   </custodian>\n   <component>\n      <structuredBody>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" align=\"center\" width=\"1050\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">PULMONARY NURSING FOLLOW-UP NOTE</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"390\"/>\n                     <col valign=\"top\" width=\"139\"/>\n                     <col valign=\"top\" width=\"521\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">- POST OPERATIVE FOLLOW UP PHONE CALL -</td>\n                           <td>Phone number</td>\n                           <td>800-555-4444</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"49\"/>\n                     <col valign=\"top\" width=\"138\"/>\n                     <col valign=\"top\" width=\"124\"/>\n                     <col valign=\"top\" width=\"498\"/>\n                     <col valign=\"top\" width=\"241\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>Date</td>\n                           <td>Time</td>\n                           <td>Results</td>\n                           <td>Initials</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"103\"/>\n                     <col valign=\"top\" width=\"134\"/>\n                     <col valign=\"top\" width=\"536\"/>\n                     <col valign=\"top\" width=\"238\"/>\n                     <tbody>\n                        <tr>\n                           <td>02May</td>\n                           <td>0600</td>\n                           <td>Left message</td>\n                           <td>DEMO</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1050\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">- ATTEMPTS TO CONTACT PATIENT -</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"91\"/>\n                     <col valign=\"top\" width=\"96\"/>\n                     <col valign=\"top\" width=\"124\"/>\n                     <col valign=\"top\" width=\"498\"/>\n                     <col valign=\"top\" width=\"241\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>Date</td>\n                           <td>Time</td>\n                           <td>Results</td>\n                           <td>Initials</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"40\"/>\n                     <col valign=\"top\" width=\"107\"/>\n                     <col valign=\"top\" width=\"108\"/>\n                     <col valign=\"top\" width=\"521\"/>\n                     <col valign=\"top\" width=\"238\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>#1</td>\n                           <td>02May</td>\n                           <td>0900</td>\n                           <td>Reached patient and discussed.</td>\n                           <td>DEMO</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"33\"/>\n                     <col valign=\"top\" width=\"195\"/>\n                     <col valign=\"top\" width=\"822\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>PATIENT RESPONSE</td>\n                           <td>* Additional Comments Required For All Yes Responses *</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[X]</td>\n                           <td>YES</td>\n                           <td>[ ]</td>\n                           <td>Color and amount  of sputum produced with cough</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[X]</td>\n                           <td>YES</td>\n                           <td>[ ]</td>\n                           <td>Unusual Pain</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[X]</td>\n                           <td>YES</td>\n                           <td>[ ]</td>\n                           <td>Fever</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[ ]</td>\n                           <td>YES</td>\n                           <td>[X]</td>\n                           <td>Other Problems:</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1014\"/>\n                     <tbody>\n                        <tr>\n                           <td>A little tired today.</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1014\"/>\n                     <tbody>\n                        <tr>\n                           <td>Patient / Significant Other communicates knowledge of and understands follow-up instructions.</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"251\"/>\n                     <col valign=\"top\" width=\"799\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">Patient's condition:</td>\n                           <td>Good</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"251\"/>\n                     <col valign=\"top\" width=\"799\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">Additional information</td>\n                           <td/>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1050\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">Signature of Nurse/Physician: See above electronic signature.</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"1\"/>\n                     <col valign=\"top\" width=\"1049\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>SF 509 - E - Progress Notes</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n      </structuredBody>\n   </component>\n</ClinicalDocument>";

    private ConvertCDA2HTMLCommand testConvertCda2HtmlCmd;

    private static final String OUTPUT_FILEPATH = "/home/myaccount/convert";
    private static final String OUTPUT_FILENAME = "testFile.";

    private static final Integer MAX_THREADS = 2;
    private static final Integer TIMEOUT_MS = 30 * 1000;

    private File mockOutputDir;
    private File mockOutputFileHtml;

    private String eventId;


    @Before
    public void setup() {

        mockOutputDir = mock(File.class);
        mockOutputFileHtml = mock(File.class);

        when(mockOutputDir.getAbsolutePath()).thenReturn(OUTPUT_FILEPATH);

        when(mockOutputFileHtml.getAbsolutePath()).thenReturn(OUTPUT_FILEPATH + "/" + OUTPUT_FILENAME + DocumentType.HTML.getFileExtension());
        when(mockOutputFileHtml.getName()).thenReturn(OUTPUT_FILENAME + DocumentType.HTML.getFileExtension());
        when(mockOutputFileHtml.exists()).thenReturn(true);

        eventId = "123456789";

        StreamSource streamSource = new StreamSource("src/main/resources/gov/va/jmeadows/xsl/CIS_IMPL_CDAR2.xsl");

        testConvertCda2HtmlCmd = new ConvertCDA2HTMLCommand(eventId, CDA_NOTE, streamSource, mockOutputDir, MAX_THREADS, TIMEOUT_MS) {
            protected OutputStream createFileOutputStream(String filepath) throws FileNotFoundException {
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                try {
                    bos.write(CDA_NOTE.getBytes());
                } catch (IOException e) {
                    fail(e.getMessage());
                }

                return new BufferedOutputStream(bos);
            }

            protected File createFile(String filepath) {
                return mockOutputFileHtml;
            }
        };

    }

    /**
     * This test will fail if running from IDE due to CDA XLS path issue
     */
    @Test
    public void testConvertCDA() {
        File output = null;
        try {
            output = testConvertCda2HtmlCmd.run();
        } catch (Exception e) {
            fail(e.getMessage());
        }
        assertNotNull(output);
        assertThat(output.getAbsolutePath(), is(mockOutputFileHtml.getAbsolutePath()));
    }

    @Test
    public void testBadParams() {

        try {
            testConvertCda2HtmlCmd = new ConvertCDA2HTMLCommand(null, "", null, null, 0, 0);
            fail("Exception should have been thrown");
        } catch (Exception e) {
            assertTrue(e instanceof IllegalArgumentException);
        }
    }

    /**
     * This test will fail if running from IDE due to CDA XLS path issue
     */

    @Test
    public void testHystrixThreadPool() {
        try {
            Future<File> futureHtml = testConvertCda2HtmlCmd.queue();

            assertThat(futureHtml.get().getAbsolutePath(), is(mockOutputFileHtml.getAbsolutePath()));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }
}
