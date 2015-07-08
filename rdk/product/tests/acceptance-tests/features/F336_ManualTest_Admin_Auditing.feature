Feature: F336 -  Admin Auditing Console

#US4692
@manual
Scenario: Manually check that accessed records are flagged as sensitive for certain sites - ensure sensitivity and site code are in each audit entry
    Given a user is logged into EHMP-UI and searches for patient Threehundredeighty,Patient, who has a patient ID of 100379
    Then to manually confirm the entry is there ssh vagrant@10.4.4.105
    And the password is vagrant
    Then cd /tmp
    Then tail audit.log
    Then confirm that last entry was on the time of the patient search and that the patient ID in the log is 100379

#US4694
@manual
Scenario: Manually check that special accounts are denoted with XUPROG and/or XUPROGMODE keys
    Given a user is logged into EHMP-UI as NURSE,EIGHT (access code nur1234, verify code nur1234!!) and searches for patient Threehundredeighty,Patient, who has a patient ID of 100379
    Then to manually confirm the a GET request entry is there and that the keys are present by doing ssh vagrant@10.4.4.105
    And the password is vagrant
    Then cd /tmp
    Then tail audit.log
    Then confirm that last entry has an additionalMessages field with XUPROG and/or XUPROGMODE keys

########All of the tests from this poin in the file down are associated with US5167############

@manual
Scenario: A request for resource directory is audited
    Given a postman request of http://10.4.4.105:8888/resourcedirectory as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resourcedirectory HTTP/1.1                               |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | RESOURCEDIRECTORY                                             |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/patient?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/patient?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | patient                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's meds record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/med?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/med?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | medication                                                       |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's consults record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/consult?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/consult?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | consult                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's vitals record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/vital?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/vital?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | vitalsign                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's problems record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/problem?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/problem?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | problem                                                         |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's allergies record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/allergy?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/allergy?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | allergy                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's orders record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/order?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/order?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | order                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's treament record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/treatment?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/treatment?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | treatment                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's procedures record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/procedure?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/procedure?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | procedure                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's lab record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/lab?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/lab?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | laboratory                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's images record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/image?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/image?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | procedure                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for a patient's surgeries record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/surgery?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/surgery?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | procedure                                                         |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's documents is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/document?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/document?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | document                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's mh is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/mh?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/mh?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | mentalhealth                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's immunization's is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/immunization?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/immunization?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | immunization                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for a patient's pov is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/pov?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/pov?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | purposeofvisit                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for a patient's dermatology record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/skin?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/skin?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | skintest                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's exams is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/exam?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/exam?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | exam                                                        |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's cpt is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/cpt?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/cpt?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | visitcptcode                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's education record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/education?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/education?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | educationtopic                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's factor is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/factor?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/factor?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | healthfactor                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's appointments is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/appointment?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/appointment?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | encounter                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's visits is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/visit?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/visit?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | encounter                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's ptf record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/ptf?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/ptf?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | visittreatment                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's radiology record is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/factor?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/factor?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | imaging                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's newsfeed is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/newsfeed?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/newsfeed?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | news-feed                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's document view is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/document-view?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/document-view?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | docs-view                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's vlerdoc view is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/vlerdocument?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/vlerdocument?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | vlerdocument                                                         |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's parent documents is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/domain/parent-documents?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/domain/parent-documents?pid=9E7A;100022        |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | parent-documents                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient record suggested search is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/search/suggest?pid=9E7A;100022&query=true as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/search/suggest?pid=9E7A;100022&query=true HTTP/1.1       |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient labs by order search is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/labsbyorder?pid=9E7A;100022&orderUid=urn:va:order:9E7A:253:15477 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/search/suggest?pid=9E7A;100022&query=true HTTP/1.1       |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient cwad search is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/cwad?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/cwad?pid=9E7A;100022 HTTP/1.1      |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient's timeline is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/timeline?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /resource/patientrecord/timeline?pid=9E7A;100022 HTTP/1.1      |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | labratory                                                         |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient complex note is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/complexnote?pid=9E7A;100022&uid=urn:va:combat-vet:N as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | http://10.4.4.105:8888/resource/patientrecord/complexnote?pid=9E7A;100022&uid=urn:va:combat-vet:N     |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a patient full name search is audited
    Given a postman request of http://10.4.4.105:8888/resource/patient-search/full-name?fullName=p0008 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patient-search/full-name?fullName=p0008    |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | SEARCH                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a synch of expired patient data is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/expire?pid=9E7A;3&vistaId="DOD" as a POST is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST /resource/sync/expire?pid=9E7A;3&vistaId=%22DOD%22 HTTP/1.1   |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | EXPIRE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for user info is audited
    Given a postman request of http://10.4.4.105:8888/resource/user/userinfo as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/user/userinfo   |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a global search is audited
    Given a postman request of http://10.4.4.105:8888/resource/search/globalsearch?lname=EIght&fname=Patient as a POST is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/search/globalsearch?lname=EIght&fname=Patient   |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a CPRS list search is audited
    Given a postman request of http://10.4.4.105:8888/resource/search/my-cprs-list as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/search/my-cprs-list  |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a MVI patient sync is audited
    Given a postman request of http://10.4.4.105:8888/resource/search/patientSync?id=705025174 as a POST is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/search/patientSync?id=705025174 |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a UID is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/uid?pid=9E7A;100022&uid=urn:va:mst:U as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patientrecord/uid?pid=9E7A;100022&uid=urn:va:mst:U  |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                          |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a allergy op data search is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/allergy/search?searchParam=alc as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/allergy/search?searchParam=alc |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a allergy symptoms search is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/allergy/symptoms?param={"ien":477} as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/allergy/symptoms?param={"ien":477} |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for labs by order is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/labsbytype?pid=9E7A;100022&typeName=HOSPITALIZATION as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patientrecord/labsbytype?pid=9E7A;100022&typeName=HOSPITALIZATION |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for labs by panel is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/labpanels?pid=9E7A;100022 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patientrecord/labpanels?pid=9E7A;100022 |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a meds data search is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/search?searchParam=aspirin as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/search?searchParam=aspirin |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a meds data schedule search is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/schedule?dfn=3 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/schedule?dfn=3 |
      | patientID                        | 3                                                             |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for a meds data schedule search is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/schedule?dfn=3 as a GET is made
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/schedule?dfn=3 |
      | patientID                        | 3                                                             |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a meds defaults is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/defaults?param={"oi":"1348","pstype":"X","orvp": 100695,"needpi":"Y", "pkiactiv":"Y"}
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/defaults?param={"oi":"1348","pstype":"X","orvp": 100695,"needpi":"Y", "pkiactiv":"Y"} |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a meds search is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/searchlist?filter=name("aspirin")
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/searchlist?filter=name("aspirin")|
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a med data dialog is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/dialogformat?dlg="PSH OERR"
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/dialogformat?dlg="PSH OERR" |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a meds discontinued data is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/discontinuereason
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/discontinuereason|
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a meds data day to quanity is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/daytoquantity?param={"supply":30,"dose":"1mg","schedule":"M","duration":"no","patientIEN":3,"drugIEN":3}
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/daytoquantity?param={"supply":30,"dose":"1mg","schedule":"M","duration":"no","patientIEN":3,"drugIEN":3}   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for a meds days supply is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/dayssupply?param={"patientIEN":3,"drugIEN":3,"medIEN":3}
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/dayssupply?param={"patientIEN":3,"drugIEN":3,"medIEN":3}   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a problems is audited
    Given a postman request of http://10.4.4.105:8888/resource/problems?searchfor=back
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/problems?searchfor=back   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | PROBLEMS                                                         |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a lab search is audited
    Given a postman request of http://10.4.4.105:8888/resource/searchbytype/domain/lab?pid=9E7A;100022&type=influenza
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/searchbytype/domain/lab?pid=9E7A;100022&type=influenza       |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | lab                                                         |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for an immunization search is audited
    Given a postman request of http://10.4.4.105:8888/resource/searchbytype/domain/immunization?pid=9E7A;100022&type=influenza
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/searchbytype/domain/immunization?pid=9E7A;100022&type=influenza       |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | immunization                                                        |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a vital search is audited
    Given a postman request of http://10.4.4.105:8888/resource/searchbytype/domain/vital?pid=9E7A;100022&type=pulse
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/searchbytype/domain/vital?pid=9E7A;100022&type=pulse       |
      | sensitive                        | false                                                         |
      | patientID                        | 9E7A;100022                                                   |
      | sitecode                         | 9E7A                                                          |
      | dataDomain                       | vital                                                         |
      | logCategory                      | RETRIEVE                                                      |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for user resources get is audited
    Given a postman request of http://10.4.4.105:8888/resource/user/get
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/user/get      |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for user resources set is audited
    Given a postman request of http://10.4.4.105:8888/resource/user/set/this
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/user/set/this     |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for resource global timeline is audited
    Given a postman request of http://10.4.4.105:8888/resource/globaltimeline?pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/globaltimeline?pid=9E7A;100022     |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for resource global timeline is audited
    Given a postman request of http://10.4.4.105:8888/resource/globaltimeline?pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/globaltimeline?pid=9E7A;100022     |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for closest vitals is audited
    Given a postman request of http://10.4.4.105:8888/resource/vitals/closest?pid=9E7A;100022&dfn=3&type=SBP
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/vitals/closest?pid=9E7A;100022&dfn=3&type=SBP    |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for vitals qualifiers is audited
    Given a postman request of http://10.4.4.105:8888/resource/vitals/qualifiers?pid=9E7A;100022&dfn=3&type=WT,HT,,T
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/vitals/qualifiers?pid=9E7A;100022&dfn=3&type=WT,HT,,T   |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for all vitals is audited
    Given a postman request of http://10.4.4.105:8888/resource/vitals/all?pid=9E7A;100022&dfn=3&start=3010101&end=3141030
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/vitals/all?pid=9E7A;100022&dfn=3&start=3010101&end=3141030   |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for writeback vitals error is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/vitals/error?ien=30&reason=1
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/vitals/error?ien=30&reason=1030   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for visits and providers is audited
    Given a postman request of http://10.4.4.105:8888/resource/visits/providers?fcode=1
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/visits/providers?fcode=1   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | VISIT - PROVIDERS                                             |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for visits locations is audited
    Given a postman request of http://10.4.4.105:8888/resource/visits/locations
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/visits/locations   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | VISIT - LOCATIONS                                             |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for visits appointments is audited
    Given a postman request of http://10.4.4.105:8888/resource/visits/appointments?pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/admissions?pid=9E7A;100022  |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | VISIT - APPOINTMENTS                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for visits admissions is audited
    Given a postman request of http://10.4.4.105:8888/resource/visits/appointments?pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/admissions?pid=9E7A;100022  |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | VISIT - ADMISSIONS                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for locations wards is audited
    Given a postman request of http://10.4.4.105:8888/resource/locations/wards
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/locations/wards           |
      | dataDomain                       | wards                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | SUPPORT                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for locations clinics is audited
    Given a postman request of http://10.4.4.105:8888/resource/locations/clinics
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/locations/clinics           |
      | dataDomain                       | clinics                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | SUPPORT                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for wards search is audited
    Given a postman request of http://10.4.4.105:8888/resource/locations/wards/search?locationUid=232&refId=4
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/locations/wards/search?locationUid=232&refId=4         |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                          |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for clinics search is audited
    Given a postman request of http://10.4.4.105:8888/resource/locations/clinics/search?locationUid=232&refId=4
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/locations/clinics/search?locationUid=232&refId=4         |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                          |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for clinical reminders detail is audited
    Given a postman request of http://10.4.4.105:8888/resource/clinicalreminders/detail?dfn=247&reminderId=33
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/clinicalreminders/detail?dfn=247&reminderId=33    |
      | patientID                        | 247                                                   |
      | dataDomain                       | clinics                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | SUPPORT                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for clinical reminders list is audited
    Given a postman request of http://10.4.4.105:8888/resource/clinicalreminders/list?dfn=247&reminderId=33
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/clinicalreminders/list?dfn=247&reminderId=33    |
      | patientID                        | 247                                                           |
      | dataDomain                       | clinics                                                       |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | logCategory                      | SUPPORT                                                       |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for authentication is audited
    Given a postman request of http://10.4.4.105:8888/resource/auth/authentication
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/auth/authentication   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for to destroy authenticated session is audited
    Given a postman request of http://10.4.4.105:8888/resource/auth/destroy
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/auth/destroy  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request to list auth resources is audited
    Given a postman request of http://10.4.4.105:8888/resource/auth/list
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/auth/list  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir patient demographics is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/patient?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/patient?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                                  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for fhir patient adverse reaction is audited
    Given a postman request of /fhir/adversereaction?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET /fhir/adversereaction?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                                  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                          |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir patient diagnostic report is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/diagnosticreport?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/diagnosticreport?subject.identifier=5000000217V519385 |
      | patientID                        | 5000000217V519385                                                 |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                          |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for patient fhir order is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/order?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/order?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                                |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                          |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request to get fhir problems is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/condition?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/condition?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                                  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir immunizations is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/immunization?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/immunization?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                                 |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir composition is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/composition?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/composition?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                                 |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir referral request is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/referralrequest?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/referralrequest?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                                 |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir medication dispense is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/medicationdispense?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/medicationdispense?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                             |
      | sensitive                        | false                                                         |
      | dataDomain                       | Medication Dispense                                           |
      | logCategory                      | MEDICATION_DISPENSE                                           |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir medication administration is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/medicationadministration?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/medicationadministration?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                             |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir medication administration is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/medicationadministration?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/medicationadministration?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                             |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for fhir medication statement is audited
    Given a postman request of http://10.4.4.105:8888/resource/fhir/medicationstatement?subject.identifier=5000000217V519385
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/fhir/medicationstatement?subject.identifier=5000000217V519385  |
      | patientID                        | 5000000217V519385                                             |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for CDS advice list is audited
    Given a postman request of http://10.4.4.105:8888/resource/cds_advice/list?use=FamilyMedicine&pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/cds_advice/list?use=FamilyMedicine&pid=9E7A;100022  |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | dataDomain                       | CDS                                                           |
      | logCategory                      | ADVICE                                                        |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for CDS advice detail is audited
    Given a postman request of http://10.4.4.105:8888/resource/cds_advice/detail?use=FamilyMedicine&pid=9E7A;100022&adviceid=500074
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/cds_advice/detail?use=FamilyMedicine&pid=9E7A;100022&adviceid=500074  |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | dataDomain                       | CDS                                                           |
      | logCategory                      | ADVICE                                                        |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for crud immunizations operational data is audited
    Given a postman request of http://10.4.4.105:8888/resource/immunizations/operational_data
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/immunizations/operational_data  |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | dataDomain                       | Immunization                                                  |
      | logCategory                      | GET_IMMUNIZATION_OPERATIONAL_DATA                             |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request to get crud immunizations is audited
    Given a postman request of http://10.4.4.105:8888/resource/immunizations
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/immunizations             |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | dataDomain                       | Immunization                                                  |
      | logCategory                      | GET_IMMUNIZATION                                              |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request to add crud immunizations is audited
    Given a postman request of http://10.4.4.105:8888/resource/immunizations
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | PUT http://10.4.4.105:8888/resource/immunizations             |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | dataDomain                       | Immunization                                                  |
      | logCategory                      | GET_IMMUNIZATION                                              |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request to get crud immunizations is audited
    Given a postman request of http://10.4.4.105:8888/resource/immunizations
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/immunizations             |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | dataDomain                       | Immunization                                                  |
      | logCategory                      | GET_IMMUNIZATION                                              |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for orders detail is audited
    Given a postman request of http://10.4.4.105:8888/resource/order/detail?orderId=2157546463&dfn=3&pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/order/detail?orderId=2157546463&dfn=3&pid=9E7A;100022            |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for patient record text search is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/search/text?pid=9E7A;100022&query="Text searching for"
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patientrecord/search/text?pid=9E7A;100022&query="something here"            |
      | patientPidList                   | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | logCategory                      | SEARCH                                                        |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for patient record detail document search is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/search/detail/document?pid=9E7A;100022&query="Text searching for"&group_value=4&group_field=5
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patientrecord/search/detail/document?pid=9E7A;100022&query="Something something"&group_value=4&group_field=5            |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A patient search using their last 5 is audited
    Given a postman request of http://10.4.4.105:8888/resource/patient-search/last5?last5=E0008
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patient-search/last5?last5=E0008            |
      | logCategory                      | RETRIEVE                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A patient sync load is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/load?pid=9E7A:100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/sync/load?pid=9E7A:100022            |
      | patientID                        | 9E7A;100022                                                   |
      | logCategory                      | SYNC                                                          |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A patient sync load is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/load?pid=9E7A:100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/sync/load?pid=9E7A:100022            |
      | patientID                        | 9E7A;100022                                                   |
      | logCategory                      | SYNC                                                          |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A vitals writeback save is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/vitals/save?dfn=9E7A;3&duz=10000000224&locIEN=67&vitals=[{"fileIEN":"19","reading":"45"}]&pid=9E7A;3
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/writeback/vitals/save?dfn=9E7A;3&duz=10000000224&locIEN=67&vitals=[{"fileIEN":"19","reading":"45"}]&pid=9E7A;3           |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: An allergy writeback save is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/allergy/save?dfn=9E7A;3&duz=10000000224&locIEN=67&allergy=[{"fileIEN":"19","reading":"45"}]&pid=9E7A;3
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/writeback/allergy/save?dfn=9E7A;3&duz=10000000224&locIEN=67&vitals=[{"fileIEN":"19","reading":"45"}]&pid=9E7A;3           |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: An allergy writeback error permission is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/allergy/error
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/writeback/allergy/error   |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: An allergy writeback error permission is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/allergy/error
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/writeback/allergy/error   |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for med op data order presets is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/med/orderpresets
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/writeback/med/orderpresets   |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a sync load prioritized is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/loadPrioritized
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/sync/loadPrioritized     |
      | logCategory                      | SYNC                                                          |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a sync clear is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/loadPrioritized
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/sync/loadPrioritized     |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for a sync status is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/status?pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/sync/status?pid=9E7A;100022     |
      | patientID                        | 9E7A;100022                                                   |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for datasync status is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/datastatus?pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/sync/datastatus?pid=9E7A;100022     |
      | logCategory                      | SYNC                                                          |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for operational status sync is audited
    Given a postman request of http://10.4.4.105:8888/resource/sync/operationalstatus?pid=9E7A;100022
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/sync/operationalstatus?pid=9E7A;100022    |
      | logCategory                      | SYNC                                                          |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                           |
      | time                             | IS_FORMATTED_TIME                                             |


@manual
Scenario: A request for writeback meds save is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/medication/save/nonVA
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/writeback/medication/save/nonVA  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for writeback op meds save is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/opmed/save
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/writeback/opmed/save  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for writeback op meds sign is audited
    Given a postman request of http://10.4.4.105:8888/resource/writeback/opmed/sign
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/writeback/opmed/sign  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: A request for patient record search trend is audited
    Given a postman request of http://10.4.4.105:8888/resource/patientrecord/search/detail/trend
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/patientrecord/search/detail/trend  |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 403                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-stopContext is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/stopContext
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/stopContext |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-setContext is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/setContext
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/setContext |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-contextparticipant is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/contextparticipant
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/vergencevaultproxy/contextparticipant|
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-getNewContext is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/getNewContext
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/vergencevaultproxy/getNewContext |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-addNewPatient is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/addNewPatient
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/vergencevaultproxy/addNewPatient |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 404                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-commitContextChange is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/commitContextChange
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/commitContextChange |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-preventContextChange is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/preventContextChange
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/preventContextChange |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-acceptAllContextChange is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/acceptAllContextChange
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | GET http://10.4.4.105:8888/resource/vergencevaultproxy/acceptAllContextChange |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-suspend is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/suspend
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/suspend |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-resume is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/resume
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/resume |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-breakContext is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/breakContext
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/breakContext |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 500                                                           |
      | time                             | IS_FORMATTED_TIME                                             |

@manual
Scenario: vergencevaultproxy-ssoprocess is audited
    Given a postman request of http://10.4.4.105:8888/resource/vergencevaultproxy/ssoprocess
    When user performs ssh vagrant@10.4.4.105
    And user enters "vagrant" as the password
    And user cd traverses to the /tmp directory by performing "cd /tmp"
    And user views the audit log by performing the action "tail audit.log"
    Then the last entry in the audit log contains
      | field                            | value                                                         |
      | authuser                         | 9E7A:10000000227                                              |
      | date                             | IS_FORMATTED_DATE                                             |
      | request                          | POST http://10.4.4.105:8888/resource/vergencevaultproxy/ssoprocess |
      | sensitive                        | false                                                         |
      | sitecode                         | 9E7A                                                          |
      | status                           | 200                                                           |
      | time                             | IS_FORMATTED_TIME                                             |
