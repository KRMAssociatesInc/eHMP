@future
Feature: Create a web application to be used as point-of-care healthcare application. Auditing is performed for resource server use as per VA standards.

Background:
	Given the rdk audit logs are cleared

@future
Scenario: An authorized client request for patient search is audited
    Given an authorized client "9E7A;lu1234" has requested patient search for patient "Eight,Patient"
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field                                  | value                                                         |
      | audit.authuser                         | 9E7A;lu1234                                                   |
      | audit.status                           | 200                                                           |
      | audit.patientId                        | -                                                             |
      | audit.dataDomain                       | -                                                             |
      | audit.logCategory                      | SEARCH                                                        |
      | audit.date                             | IS_FORMATTED_DATE                                             |
      | audit.request                          | GET /patient-search/full-name?fullName=Eight,Patient HTTP/1.1 |
      | audit.additionalMessage.searchCriteriaFullName | Eight,Patient                                        |

@future
Scenario: An unauthorized client request for patient search is audited
    Given an authorized client "UNAUTH" has requested patient search for patient "Eight,Patient"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field             | value                                                         |
      | audit.authuser    | UNAUTH                                                        |
      | audit.status      | 401                                                           |
      | audit.patientId   | -                                                             |
      | audit.dataDomain  | -                                                             |
      | audit.date        | IS_FORMATTED_DATE                                             |
      | audit.logCategory | -                                                             |
      | audit.request     | GET /patient-search/full-name?fullName=Eight,Patient HTTP/1.1 |

@future
Scenario: An authorized client request for recsource directory is audited
    Given an authorized client "9E7A;lu1234" has requested resource directory
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field      | value             |
      | audit.authuser   | 9E7A;lu1234       |
      | audit.status     | 200               |
      | audit.patientId  | -                 |
      | audit.dataDomain | -                 |
      | audit.date       | IS_FORMATTED_DATE |
      | audit.logCategory| RESOURCEDIRECTORY |

@future
Scenario: An unauthorized client request for resource directory is audited
    Given an authorized client "UNAUTH" has requested resource directory
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field      | value             |
      | audit.authuser   | UNAUTH            |
      | audit.status     | 200               |
      | audit.patientId  | -                 |
      | audit.dataDomain | -                 |
      | audit.date       | IS_FORMATTED_DATE |
      | audit.logCategory| RESOURCEDIRECTORY |

@future
Scenario: An authorized client request for clinical notes is audited
    Given an authorized client "9E7A;lu1234" has requested clinical notes for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field             | value                                                 |
      | audit.authuser    | 9E7A;lu1234                                           |
      | audit.status      | 200                                                   |
      | audit.patientId   | 10108V420871                                          |
      | audit.dataDomain  | document                                              |
      | audit.date        | IS_FORMATTED_DATE                                     |
      | audit.logCategory | RETRIEVE                                              |
      | audit.request     | GET /patientrecord/domain/document?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field             | value                                                 |
      | audit.authuser    | 9E7A;lu1234                                           |
      | audit.status      | 200                                                   |
      | audit.patientId   | 10108V420871                                          |
      | audit.dataDomain  | document                                              |
      | audit.date        | IS_FORMATTED_DATE                                     |
      | audit.logCategory | RETRIEVE                                              |
      | audit.request     | GET /patientrecord/domain/document?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An unauthorized client request for clinical notes is audited
    Given an authorized client "UNAUTH" has requested clinical notes for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field            | value                                                 |
      | audit.authuser   | UNAUTH                                                |
      | audit.status     | 401                                                   |
      | audit.patientId  | -                                                     |
      | audit.dataDomain | -                                                     |
      | audit.date       | IS_FORMATTED_DATE                                     |
      | audit.request    | GET /patientrecord/domain/document?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An authorized client request for problem list is audited
    Given an authorized client "9E7A;lu1234" has requested problem list for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field             | value                                                |
      | audit.authuser    | 9E7A;lu1234                                          |
      | audit.status      | 200                                                  |
      | audit.patientId   | 10108V420871                                         |
      | audit.dataDomain  | problem                                              |
      | audit.date        | IS_FORMATTED_DATE                                    |
      | audit.logCategory | RETRIEVE                                             |
      | audit.request     | GET /patientrecord/domain/problem?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field             | value                                                |
      | audit.authuser    | 9E7A;lu1234                                          |
      | audit.status      | 200                                                  |
      | audit.patientId   | 10108V420871                                         |
      | audit.dataDomain  | problem                                              |
      | audit.date        | IS_FORMATTED_DATE                                    |
      | audit.logCategory | RETRIEVE                                             |
      | audit.request     | GET /patientrecord/domain/problem?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An unauthorized client request for problem list is audited
    Given an authorized client "UNAUTH" has requested problem list for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field            | value                                                |
      | audit.authuser   | UNAUTH                                               |
      | audit.status     | 401                                                  |
      | audit.patientId  | -                                                    |
      | audit.dataDomain | -                                                    |
      | audit.date       | IS_FORMATTED_DATE                                    |
      | audit.request    | GET /patientrecord/domain/problem?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An authorized client request for lab is audited
    Given an authorized client "9E7A;lu1234" has requested lab for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field             | value                                            |
      | audit.authuser    | 9E7A;lu1234                                      |
      | audit.status      | 200                                              |
      | audit.patientId   | 10108V420871                                     |
      | audit.dataDomain  | laboratory                                       |
      | audit.date        | IS_FORMATTED_DATE                                |
      | audit.logCategory | RETRIEVE                                         |
      | audit.request     | GET /patientrecord/domain/lab?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field             | value                                            |
      | audit.authuser    | 9E7A;lu1234                                      |
      | audit.status      | 200                                              |
      | audit.patientId   | 10108V420871                                     |
      | audit.dataDomain  | laboratory                                       |
      | audit.date        | IS_FORMATTED_DATE                                |
      | audit.logCategory | RETRIEVE                                         |
      | audit.request     | GET /patientrecord/domain/lab?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An unauthorized client request for lab is audited
    Given an authorized client "UNAUTH" has requested lab for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field            | value                                            |
      | audit.authuser   | UNAUTH                                           |
      | audit.status     | 401                                              |
      | audit.patientId  | -                                                |
      | audit.dataDomain | -                                                |
      | audit.date       | IS_FORMATTED_DATE                                |
      | audit.request    | GET /patientrecord/domain/lab?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An authorized client request for radiology is audited
    Given an authorized client "9E7A;lu1234" has requested radiology for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field            | value                                            |
      | audit.authuser   | 9E7A;lu1234                                      |
      | audit.status     | 200                                              |
      | audit.patientId  | 10108V420871                                     |
      | audit.dataDomain | imaging                                          |
      | audit.date       | IS_FORMATTED_DATE                                |
      | audit.request    | GET /patientrecord/domain/rad?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field            | value                                            |
      | audit.authuser   | 9E7A;lu1234                                      |
      | audit.status     | 200                                              |
      | audit.patientId  | 10108V420871                                     |
      | audit.dataDomain | imaging                                          |
      | audit.date       | IS_FORMATTED_DATE                                |
      | audit.request    | GET /patientrecord/domain/rad?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An unauthorized client request for radiology is audited
    Given an authorized client "UNAUTH" has requested radiology for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field            | value                                            |
      | audit.authuser   | UNAUTH                                           |
      | audit.status     | 401                                              |
      | audit.patientId  | -                                                |
      | audit.dataDomain | -                                                |
      | audit.date       | IS_FORMATTED_DATE                                |
      | audit.request    | GET /patientrecord/domain/rad?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An authorized client request for medications (inpatient or outpatient) is audited
    Given an authorized client "9E7A;lu1234" has requested medications for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field             | value                                            |
      | audit.authuser    | 9E7A;lu1234                                      |
      | audit.status      | 200                                              |
      | audit.patientId   | 10108V420871                                     |
      | audit.dataDomain  | medication                                       |
      | audit.date        | IS_FORMATTED_DATE                                |
      | audit.logCategory | RETRIEVE                                         |
      | audit.request     | GET /patientrecord/domain/med?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field             | value                                            |
      | audit.authuser    | 9E7A;lu1234                                      |
      | audit.status      | 200                                              |
      | audit.patientId   | 10108V420871                                     |
      | audit.dataDomain  | medication                                       |
      | audit.date        | IS_FORMATTED_DATE                                |
      | audit.logCategory | RETRIEVE                                         |
      | audit.request     | GET /patientrecord/domain/med?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An unauthorized client request for medications (inpatint or outpatient) is audited
    Given an authorized client "UNAUTH" has requested medications for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field            | value                                            |
      | audit.authuser   | UNAUTH                                           |
      | audit.status     | 401                                              |
      | audit.patientId  | -                                                |
      | audit.dataDomain | -                                                |
      | audit.date       | IS_FORMATTED_DATE                                |
      | audit.request    | GET /patientrecord/domain/med?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An authorized client request for demographics is audited
    Given an authorized client "9E7A;lu1234" has requested demographics for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field             | value                                                |
      | audit.authuser    | 9E7A;lu1234                                          |
      | audit.status      | 200                                                  |
      | audit.patientId   | 10108V420871                                         |
      | audit.dataDomain  | patient                                              |
      | audit.date        | IS_FORMATTED_DATE                                    |
      | audit.logCategory | RETRIEVE                                             |
      | audit.request     | GET /patientrecord/domain/patient?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field             | value                                                |
      | audit.authuser    | 9E7A;lu1234                                          |
      | audit.status      | 200                                                  |
      | audit.patientId   | 10108V420871                                         |
      | audit.dataDomain  | patient                                              |
      | audit.date        | IS_FORMATTED_DATE                                    |
      | audit.logCategory | RETRIEVE                                             |
      | audit.request     | GET /patientrecord/domain/patient?pid=10108V420871 HTTP/1.1 |


@future
Scenario: An unauthorized client request for demographics is audited
    Given an authorized client "UNAUTH" has requested demographics for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field            | value                                                |
      | audit.authuser   | UNAUTH                                               |
      | audit.status     | 401                                                  |
      | audit.patientId  | -                                                    |
      | audit.dataDomain | -                                                    |
      | audit.date       | IS_FORMATTED_DATE                                    |
      | audit.request    | GET /patientrecord/domain/patient?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An authorized client request for allergies is audited
    Given an authorized client "9E7A;lu1234" has requested allergies for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field             | value                                                |
      | audit.authuser    | 9E7A;lu1234                                          |
      | audit.status      | 200                                                  |
      | audit.patientId   | 10108V420871                                         |
      | audit.dataDomain  | allergy                                              |
      | audit.date        | IS_FORMATTED_DATE                                    |
      | audit.logCategory | RETRIEVE                                             |
      | audit.request     | GET /patientrecord/domain/allergy?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | audit.field       | value                                                |
      | audit.authuser    | 9E7A;lu1234                                          |
      | audit.status      | 200                                                  |
      | audit.patientId   | 10108V420871                                         |
      | audit.dataDomain  | allergy                                              |
      | audit.date        | IS_FORMATTED_DATE                                    |
      | audit.logCategory | RETRIEVE                                             |
      | audit.request     | GET /patientrecord/domain/allergy?pid=10108V420871 HTTP/1.1 |


@future
Scenario: An unauthorized client request for allergies is audited
    Given an authorized client "UNAUTH" has requested allergies for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field            | value                                                |
      | audit.authuser   | UNAUTH                                               |
      | audit.status     | 401                                                  |
      | audit.patientId  | -                                                    |
      | audit.dataDomain | -                                                    |
      | audit.date       | IS_FORMATTED_DATE                                    |
      | audit.request    | GET /patientrecord/domain/allergy?pid=10108V420871 HTTP/1.1 |

@future
Scenario: An authorized client request for vitals for sensitive pateint is audited
    Given an authorized client "9E7A;pu1234" has requested vitals for patient "9E7A;1"
    When audit logs for user "9E7A;pu1234" are requested
    Then the audit log entry contains
      | field             | value                                               |
      | audit.authuser    | 9E7A;pu1234                                         |
      | audit.status      | 307                                                 |
      | audit.patientId   | 9E7A;1                                              |
      | audit.dataDomain  | -                                                   |
      | audit.date        | IS_FORMATTED_DATE                                   |
      | audit.logCategory | -                                                   |
      | audit.request     | GET /patientrecord/domain/vital?pid=9E7A;1 HTTP/1.1 |

@future
Scenario: An authorized client request for vitals is audited
    Given an authorized client "9E7A;lu1234" has requested vitals for patient "10108V420871"
    When audit logs for patient "10108V420871" are requested
    Then the audit log entry contains
      | field             | value                                              |
      | audit.authuser    | 9E7A;lu1234                                        |
      | audit.status      | 200                                                |
      | audit.patientId   | 10108V420871                                       |
      | audit.dataDomain  | vitalsign                                          |
      | audit.date        | IS_FORMATTED_DATE                                  |
      | audit.logCategory | RETRIEVE                                           |
      | audit.request     | GET /patientrecord/domain/vital?pid=10108V420871 HTTP/1.1 |
    When audit logs for user "9E7A;lu1234" are requested
    Then the audit log entry contains
      | field             | value                                              |
      | audit.authuser    | 9E7A;lu1234                                        |
      | audit.status      | 200                                                |
      | audit.patientId   | 10108V420871                                       |
      | audit.dataDomain  | vitalsign                                          |
      | audit.date        | IS_FORMATTED_DATE                                  |
      | audit.logCategory | RETRIEVE                                           |
      | audit.request     | GET /patientrecord/domain/vital?pid=10108V420871 HTTP/1.1 |


@future
Scenario: An unauthorized client request for vitals is audited
    Given an authorized client "UNAUTH" has requested vitals for patient "10108V420871"
    When audit logs for user "UNAUTH" are requested
    Then the audit log entry contains
      | field             | value                                              |
      | audit.authuser    | UNAUTH                                             |
      | audit.status      | 401                                                |
      | audit.patientId   | -                                                  |
      | audit.dataDomain  | -                                                  |
      | audit.date        | IS_FORMATTED_DATE                                  |
      | audit.logCategory | -                                                  |
      | audit.request     | GET /patientrecord/domain/vital?pid=10108V420871 HTTP/1.1 |
