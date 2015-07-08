@F129 @US1956 @US2786 @onc @unstable

Feature: F129 – Vitals (Writeback)

Scenario: Adding a single Vitals record and marking it EIE.
  Given a patient with pid "10113V428140" has been synced through the RDK API
  When the client requests all vitals for patient DFN: "228" from FileMan dates "3131028" to "3131030"
  Then a successful response is returned
  Then the JSON response "meta.ssn4" field is "0013"
  Then the JSON response "readings.data.items[0].readingDate.reading" field is "NO DATA"

  When the client saves an vital for "10113V428140" with the paramters
  | dfn        | 228           |
  | dateTime   | 201310291212  |
  | locIEN     | 9             |
  | vitals     | [{"fileIEN":"1","reading":"70/20","qualifiers":["1","64","100"]}] |

  Then a successful response is returned

  When the client requests all vitals for patient DFN: "228" from FileMan dates "3131028" to "3131030"
  Then a successful response is returned
  Then the JSON response "readings.data.items[0].readingDate.reading" field is "10-29-13"
  And the JSON response "readings.data.items[0].readingTime.reading" field is "12:12:00"
  And the JSON response "readings.data.items[0].readingTime.reading" field is "12:12:00"
  And the JSON response "readings.data.items[0].BP.reading" field is "70/20"
  And the JSON response "readings.data.items[0].location.reading" field is "GEN MED"
  And the JSON response "readings.data.items[0].recorder.reading" field is "USER,PANORAMA"

  And the new vital is stored in the patientrecord for "10113V428140" with "observed" field "201310291212"
  And the new vital can be marked in error

  When the client requests all vitals for patient DFN: "228" from FileMan dates "3131028" to "3131030"
  Then a successful response is returned
  Then the JSON response "meta.ssn4" field is "0013"
  Then the JSON response "readings.data.items[0].readingDate.reading" field is "NO DATA"
