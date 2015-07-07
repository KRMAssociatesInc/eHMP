Feature: F73 Web Service API Enhancements
  As a client of the LEIPR API
  In order to achieve an interoperable patient record
  I want retrieve patient data through a FHIR transport model

Background:
  Given user logs in with valid credentials

@US510
Scenario: Find Patient Bundle by Subject ICN
  Given a patient with id "E1" has not been synced
  When I search for JSON "Patient" Resources with a "identifier" of "E1"
  Then the response is successful
  And the reponse contains JSON with
    | Path                                         | expected                                                  |
    | $.feed.totalResults                          | 1                                                         |
    | $.feed.resourceType                          | Bundle                                                    |
    | $..resourceType                              | Patient                                                   |
    | $..name[*].given[*]                          | JEROME                                                    |
    | $..name[*].family[*]                         | MORROW                                                    |
    | $..birthDate                                 | 1935-04-07                                                |
    | $..maritalStatus.coding[*].display           | Widowed                                                   |
    | $..extension[*].url                          | http://vistacore.us/fhir/profiles/@main#service-connected |
    | $..extension[*].url                          | http://vistacore.us/fhir/profiles/@main#service-connected-percent |
    | $..extension[*].url                          | http://vistacore.us/fhir/profiles/@main#sensitive         |
    | $..extension[*].url                          | http://vistacore.us/fhir/profiles/@main#religion          |
    | $..extension[*].url                          | http://vistacore.us/fhir/profiles/@main#service-connected |
    | $..identifier[*].label                       | ssn                                                       |
    | $..identifier[*].label                       | icn                                                       |
    | $..identifier[*].label                       | lrdfn                                                     |
    | $..identifier[*].label                       | dfn                                                       |
    | $..contact[*].relationship[*].coding[*].code | emergency                                                 |
    | $..contact[*].name.text                      | SALLY,SAFE HAVEN E                                        |

@US510
Scenario: Find Observations Bundle by Subject ICN
  Given a patient with id "E101" has not been synced
  When I search for JSON "Observation" Resources with a "subject.identifier" of "E101"
  Then the response is successful
  And the reponse contains JSON with
  | Path                                              | expected                                |
  | $.feed.totalResults                               | 16                                      |
  | $.feed.resourceType                               | Bundle                                  |
  | $.feed.entry[*].content.resourceType              | Observation                             |
  | $.feed.entry..content.valueString                 | 120/75                                  |
  | $.feed.entry..content.text.div                    | <div>BLOOD PRESSURE 120/75 mm[Hg]</div> |
  | $.feed.entry..content.valueQuantity.value         | 99                                      |
  | $.feed.entry..content.valueQuantity.units         | %                                       |


@US510
Scenario: Find DiagnosticReports Bundle by Subject ICN
  Given a patient with id "E101" has not been synced
  When I search for JSON "DiagnosticReport" Resources with a "subject.identifier" of "E101"
  Then the response is successful
  And the reponse contains JSON with
    | Path                                              | expected                                |
    | $.feed.totalResults                               | 6                                       |
    | $.feed.resourceType                               | Bundle                                  |
    | $.feed.entry[*].content.resourceType              | DiagnosticReport                        |
    | $.feed.entry..content.diagnosticDateTime          | 2007-05-29T15:12:00                     |


@US510
Scenario: Find AdverseReactions Bundle by Subject ICN
  Given a patient with id "E101" has not been synced
  When I search for JSON "AdverseReaction" Resources with a "subject.identifier" of "E101"
  Then the response is successful
  And the reponse contains JSON with
    | Path                                              | expected                                |
    | $.feed.totalResults                               | 10                                      |
    | $.feed.resourceType                               | Bundle                                  |
    | $.feed.entry[*].content.resourceType              | AdverseReaction                         |

@US611
Scenario: Update patient retriever to support synchronous retrieval
	Given a patient with id "E101" has not been synced
	When client requests patient data via the allergy fhir resource for patient "E101"
	Then the response is successful
	Then the endpoint responds back with a json object