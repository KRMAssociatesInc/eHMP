@Notes_Writeback  @F226

Feature: F226 - Notes (write-back)

@create_Retrieve_and_delete_unsigned_notes @US7264
Scenario: Retrieving and deleting unsinged notes from eCrud
  #Given a patient with pid "5000000232V962263" has been synced through the RDK API
  When the client adds a notes for patient "9E7A;204" with content "{"author":"USER,PANORAMA","authorDisplayName":"User,Panorama","authorUid":"urn:va:user:9E7A:10000000255","documentClass":"PROGRESS NOTES","documentDefUid":"urn:va:doc-def:9E7A:1341","documentTypeName":"ProgressNote","encounterName":"7AGENMEDAug14,2014","encounterUid":"urn:va:visit:9E7A:3:11420","entered":"20150527142231","facilityCode":"998","facilityName":"ABILENE(CAA)","isInterdisciplinary":"false","lastUpdateTime":"20150527142231","localId":"","localTitle":"C&PACROMEGALY","patientIcn":"5000000232V962263","pid":"9E7A;204","referenceDateTime":"201505271422","status":"UNSIGNED","statusDisplayName":"Unsigned","summary":"C & P ACROMEGALY","text":[{"author":"USER,PANORAMA","authorDisplayName":"User,Panorama","authorUid":"urn:va:user:9E7A:10000000255","content":"Thisisanew C&A CROMEGLY note\r created by yamini\r","dateTime":"201505271422","status":"UNSIGNED","uid":"urn:va:note:9E7A:3:114551"}],"uid":"urn:va:note:9E7A:3:114551","facilityDisplay":"BayPinesCIOTest","facilityMoniker":"BAY"}"
  Then a successful response is returned
  When the client requests unsigned notes for the patient "9E7A;204"
  Then a successful response is returned
  And the results contain

      | name                | value              |
      | notes.encounterName | 7AGENMEDAug14,2014 |
      | notes.text.status   | UNSIGNED           |
  When the client requests to delete an unsigned notes for the patient "9E7A;204"
  Then a successful response is returned
  