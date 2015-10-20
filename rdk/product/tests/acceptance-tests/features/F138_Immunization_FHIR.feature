@debug
@F138_Immunization_FCIR @vxsync @patient
Feature: F138 - Return of immunization in FHIR format

#This feature item returns Immunization in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 5000000116V912836, 5000000217V519385, 10107V395912, 5123456789V027402, 10117V810068, 10108V420871

@F138_1_fhir_immunzation @fhir @10107V395912
Scenario: Client can request immunization results in FHIR format
      Given a patient with "immunization" in multiple VistAs
      And a patient with pid "10107V395912" has been synced through the RDK API
      When the client requests immunization for the patient "10107V395912" in FHIR format
      Then a successful response is returned
      And the FHIR results contain "immunization"
      | name                      | value                                            |
      | content.text.div          | <div>PNEUMOCOCCAL, UNSPECIFIED FORMULATION</div> |
      | content.text.status       | generated                                        |
      | content.subject.reference | Patient/9E7A;253                                 |
      #Organization
      | content.contained.resourceType     | Organization         |
      | content.contained.identifier.label | facility-code        |
      | content.contained.identifier.value | 888                  |
      | content.contained.name             | FT. LOGAN            |
      | content.contained.text.div         | <div>FT. LOGAN</div> |
      | content.contained.text.status      | generated            |
      #Practitioner
      | content.contained.resourceType     | Practitioner             |
      | content.contained.identifier.label | uid                      |
      | content.contained.identifier.value | urn:va:user:9E7A:11623   |
      | content.contained.name             | STUDENT,SEVEN            |
      | content.contained.text.div         | <div>STUDENT,SEVEN</div> |
      | content.contained.text.status      | generated                |
      #Location
      | content.contained.resourceType     | Location                |
      | content.contained.identifier.label | uid                     |
      | content.contained.identifier.value | urn:va:location:9E7A:32 |
      | content.contained.name             | PRIMARY CARE            |
      | content.contained.text.div         | <div>PRIMARY CARE</div> |
      | content.contained.text.status      | generated               |
      #Extensions
      | content.extension.url          | http://vistacore.us/fhir/extensions/immunization#contraindicated |
      | content.extension.valueBoolean | false                                                            |
      | content.extension.url          | http://vistacore.us/fhir/extensions/immunization#encounterUid    |
      | content.extension.valueString  | urn:va:visit:9E7A:253:2035                                       |
      | content.extension.url          | http://vistacore.us/fhir/extensions/immunization#encounterName   |
      | content.extension.valueString  | PRIMARY CARE Apr 06, 2000                                        |
      | content.extension.url          | http://vistacore.us/fhir/extensions/immunization#seriesName      |
      | content.extension.valueString  | BOOSTER                                                          |
      #Vaccin no1
      | content.date                       | 2000-04-06T12:00:00  |
      | content.vaccineType.coding.code    | urn:cpt:90732        |
      | content.vaccineType.coding.display | PNEUMOCOCCAL VACCINE |
      | content.performer.display          | STUDENT,SEVEN        |
      | content.location.display           | PRIMARY CARE         |
      | content.reported                   | false                |
      | content.refusedIndicator           | false                |
      #Vaccin no2
      And the FHIR results contain "immunization"
      | name                               | value                |
      | content.date                       | 2000-04-06T12:00:00  |
      | content.vaccineType.coding.code    | urn:cpt:90732        |
      | content.vaccineType.coding.display | PNEUMOCOCCAL VACCINE |
      | content.performer.display          | STUDENT,SEVEN        |
      | content.location.display           | PRIMARY CARE         |
      | content.reported                   | false                |
      | content.refusedIndicator           | false                |

@F138_2_fhir_immunzation @fhir @5000000116V912836
Scenario: Client can request immunization results in FHIR format
      Given a patient with "immunization" in multiple VistAs
      And a patient with pid "5000000116V912836" has been synced through the RDK API
      When the client requests immunization for the patient "5000000116V912836" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 16    |
      And the FHIR results contain "immunization"
      | name                      | value                         |
      | content.text.div          | <div>PNEUMOCOCCAL</div>       |
      | content.text.status       | generated                     |
      | content.subject.reference | Patient/HDR;5000000116V912836 |
      #Organization
      | content.contained.resourceType     | Organization              |
      | content.contained.identifier.label | facility-code             |
      | content.contained.identifier.value | 561                       |
      | content.contained.name             | New Jersey HCS            |
      | content.contained.text.div         | <div>New Jersey HCS</div> |
      | content.contained.text.status      | generated                 |
      #Practitioner
      | content.contained.resourceType     | Practitioner                    |
      | content.contained.identifier.label | uid                             |
      | content.contained.identifier.value | urn:va:user:ABCD:11278          |
      | content.contained.name             | WARDCLERK,SIXTYEIGHT            |
      | content.contained.text.div         | <div>WARDCLERK,SIXTYEIGHT</div> |
      | content.contained.text.status      | generated                       |
      #Location
      | content.contained.resourceType     | Location                |
      | content.contained.identifier.label | uid                     |
      | content.contained.identifier.value | urn:va:location:ABCD:64 |
      | content.contained.name             | AUDIOLOGY               |
      | content.contained.text.div         | <div>AUDIOLOGY</div>    |
      | content.contained.text.status      | generated               |
      #Extensions
      | content.extension.url          | http://vistacore.us/fhir/extensions/immunization#contraindicated |
      | content.extension.valueBoolean | false                                                            |
      | content.extension.url          | http://vistacore.us/fhir/extensions/immunization#encounterUid    |
      | content.extension.valueString  | urn:va:visit:ABCD:229:1975                                       |
      | content.extension.url          | http://vistacore.us/fhir/extensions/immunization#encounterName   |
      | content.extension.valueString  | AUDIOLOGY Apr 04, 2000                                           |
      #Vaccin no1
      | content.date                       | 2000-04-04T10:55:06  |
      | content.vaccineType.coding.code    | urn:cpt:90732        |
      | content.vaccineType.coding.display | PNEUMOCOCCAL VACCINE |
      | content.performer.display          | WARDCLERK,SIXTYEIGHT |
      | content.location.display           | AUDIOLOGY            |
      | content.reported                   | false                |
      | content.refusedIndicator           | false                |
      #Vaccin no2
      And the FHIR results contain "immunization"
      | name                               | value          |
      | content.text.div                   | <div>BCG</div> |
      | content.contained.identifier.value | DOD            |
      | content.contained.name             | DOD            |
      # Due to timezone issue comment out the date check
      #| content.date                                   | 2013-11-18T21:00:00                  |
      | content.vaccineType.coding.code    | 19                               |
      | content.vaccineType.coding.display | Bacillus Calmette-Guerin vaccine |
      | content.reported                   | false                            |
      | content.refusedIndicator           | false                            |
      And the FHIR results contain "immunization"
      | name                               | value          |
      | content.text.div                   | <div>MMR</div> |
      | content.contained.identifier.value | DOD            |
      | content.contained.name             | DOD            |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-11-14T21:00:00                  |
      | content.vaccineType.coding.code | 3     |
      | content.reported                | false |
      | content.refusedIndicator        | false |
      And the FHIR results contain "immunization"
      | name                               | value         |
      | content.text.div                   | <div>Td</div> |
      | content.contained.identifier.value | DOD           |
      | content.contained.name             | DOD           |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-11-14T21:00:00                  |
      | content.vaccineType.coding.code | 9     |
      | content.reported                | false |
      | content.refusedIndicator        | false |
      And the FHIR results contain "immunization"
      | name                               | value          |
      | content.text.div                   | <div>IPV</div> |
      | content.contained.identifier.value | DOD            |
      | content.contained.name             | DOD            |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-11-14T21:00:00                  |
      | content.vaccineType.coding.code    | 10                              |
      | content.vaccineType.coding.display | poliovirus vaccine, inactivated |
      | content.reported                   | false                           |
      | content.refusedIndicator           | false                           |

@F138_3_fhir_immunzation @fhir @5000000217V519385
Scenario: Client can request immunization results in FHIR format
      Given a patient with "immunization" in multiple VistAs
      And a patient with pid "5000000217V519385" has been synced through the RDK API
      When the client requests immunization for the patient "5000000217V519385" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 11    |
      And the FHIR results contain "immunization"
      #Vaccin no1
      | name                               | value                   |
      | content.text.div                   | <div>PNEUMOCOCCAL</div> |
      | content.contained.identifier.value | 561                     |
      | content.contained.name             | New Jersey HCS          |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2000-04-04T10:55:06                  |
      | content.vaccineType.coding.code    | urn:cpt:90732        |
      | content.vaccineType.coding.display | PNEUMOCOCCAL VACCINE |
      | content.performer.display          | WARDCLERK,SIXTYEIGHT |
      | content.location.display           | AUDIOLOGY            |
      | content.reported                   | false                |
      | content.refusedIndicator           | false                |
      And the FHIR results contain "immunization"
      #Vaccin no2
      | name                               | value         |
      | content.text.div                   | <div>Td</div> |
      | content.contained.identifier.value | DOD           |
      | content.contained.name             | DOD           |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2014-01-12T21:00:00                  |
      | content.vaccineType.coding.code   | 9                                |
      | content.vaccineType.coding.system | urn:oid:2.16.840.1.113883.12.292 |
      | content.reported                  | false                            |
      | content.refusedIndicator          | false                            |
      And the FHIR results contain "immunization"
      #Vaccin no3, no5, no11
      | name                               | value                    |
      | content.text.div                   | <div>Hep B - Adult</div> |
      | content.contained.identifier.value | DOD                      |
      | content.contained.name             | DOD                      |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2014-01-12T21:00:00                  |
      | content.vaccineType.coding.code    | 43                                |
      | content.vaccineType.coding.system  | urn:oid:2.16.840.1.113883.12.292  |
      | content.vaccineType.coding.display | hepatitis B vaccine, adult dosage |
      | content.reported                   | false                             |
      | content.refusedIndicator           | false                             |
      And the FHIR results contain "immunization"
      #Vaccin no4
      | name                               | value          |
      | content.text.div                   | <div>MMR</div> |
      | content.contained.identifier.value | DOD            |
      | content.contained.name             | DOD            |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-12-05T21:00:00                  |
      | content.vaccineType.coding.code   | 3                                |
      | content.vaccineType.coding.system | urn:oid:2.16.840.1.113883.12.292 |
      | content.reported                  | false                            |
      | content.refusedIndicator          | false                            |
      And the FHIR results contain "immunization"
      #Vaccin no6
      | name                               | value           |
      | content.text.div                   | <div>IPPD</div> |
      | content.contained.identifier.value | DOD             |
      | content.contained.name             | DOD             |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-12-05T21:00:00  |
      | content.vaccineType.coding.code | 96    |
      | content.reported                | false |
      | content.refusedIndicator        | false |
      And the FHIR results contain "immunization"
      #Vaccin no7
      | name                               | value                           |
      | content.text.div                   | <div>Rabies - Intradermal</div> |
      | content.contained.identifier.value | DOD                             |
      | content.contained.name             | DOD                             |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-10-16T21:00:00                       |
      | content.vaccineType.coding.code    | 40                                        |
      | content.vaccineType.coding.display | rabies vaccine, for intradermal injection |
      | content.reported                   | false                                     |
      | content.refusedIndicator           | false                                     |
      And the FHIR results contain "immunization"
      #Vaccin no8
      | name                               | value                 |
      | content.text.div                   | <div>Rabies NOS</div> |
      | content.contained.identifier.value | DOD                   |
      | content.contained.name             | DOD                   |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-10-16T21:00:00                       |
      | content.vaccineType.coding.code    | 90                                      |
      | content.vaccineType.coding.display | rabies vaccine, unspecified formulation |
      | content.reported                   | false                                   |
      | content.refusedIndicator           | false                                   |
      And the FHIR results contain "immunization"
      #Vaccin no9
      | name                               | value              |
      | content.text.div                   | <div>Anthrax</div> |
      | content.contained.identifier.value | DOD                |
      | content.contained.name             | DOD                |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2012-10-08T21:00:00   |
      | content.vaccineType.coding.code    | 24              |
      | content.vaccineType.coding.display | anthrax vaccine |
      | content.reported                   | false           |
      | content.refusedIndicator           | false           |
      And the FHIR results contain "immunization"
      #Vaccin no10
      | name                               | value                |
      | content.text.div                   | <div>Influenza</div> |
      | content.contained.identifier.value | DOD                  |
      | content.contained.name             | DOD                  |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2009-10-08T21:00:00                       |
      | content.vaccineType.coding.code    | 16                                   |
      | content.vaccineType.coding.display | influenza virus vaccine, whole virus |
      | content.reported                   | false                                |
      | content.refusedIndicator           | false                                |

@F138_4_fhir_immunzation @fhir @enrich
Scenario: Client can request immunization results in FHIR format
      Given a patient with "immunization" in multiple VistAs
      And a patient with pid "10108V420871" has been synced through the RDK API
      When the client requests immunization for the patient "10108V420871" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 22    |
      And the FHIR results contain "immunization"
      #Vaccin no1
      | name                               | value          |
      | content.text.div                   | <div>MMR</div> |
      | content.contained.identifier.value | DOD            |
      | content.contained.name             | DOD            |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2013-12-01T21:00:00                       |
      | content.vaccineType.coding.code | 3     |
      | content.reported                | false |
      | content.refusedIndicator        | false |
      And the FHIR results contain "immunization"
      #Vaccin no2
      | name                               | value                   |
      | content.text.div                   | <div>Yellow Fever</div> |
      | content.contained.identifier.value | DOD                     |
      | content.contained.name             | DOD                     |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2011-10-02T21:00:00        |
      | content.vaccineType.coding.code    | 37                   |
      | content.vaccineType.coding.display | yellow fever vaccine |
      | content.reported                   | false                |
      | content.refusedIndicator           | false                |
      And the FHIR results contain "immunization"
      #Vaccin no3
      | name                               | value           |
      | content.text.div                   | <div>Tdap</div> |
      | content.contained.identifier.value | DOD             |
      | content.contained.name             | DOD             |
      # @TODO comment out the date checking due to time zone issue
      #| content.date                                   | 2014-01-12T21:00:00                   |
      | content.vaccineType.coding.code    | 115                                                                                  |
      | content.vaccineType.coding.display | tetanus toxoid, reduced diphtheria toxoid, and acellular pertussis vaccine, adsorbed |
      | content.reported                   | false                                                                                |
      | content.refusedIndicator           | false                                                                                |



@F138_5_fhir_immunzation @fhir @5123456789V027402
Scenario: Client can break the glass when requesting immunization in FHIR format for a sensitive patient
      Given a patient with "immunization" in multiple VistAs
      And a patient with pid "5123456789V027402" has been synced through the RDK API
      When the client requests immunization for that sensitive patient "5123456789V027402"
      Then a permanent redirect response is returned
      When the client breaks glass and repeats a request for immunization for that patient "5123456789V027402"
      Then a successful response is returned
      And the results contain
      | name | value |
      # @TODO, we now have one CDS immunization record for this patient
      | totalResults | 1 |

@F138_6_fhir_immunzation @fhir @10117V810068
Scenario: Negativ scenario. Client can request immunization results in FHIR format
      Given a patient with "no immunization" in multiple VistAs
      When the client requests immunization for the patient "10117V810068" in FHIR format
      Then a successful response is returned
      And the results contain
      | name | value |
      # @TODO, we now have one CDS immunization record for this patient
      | totalResults | 1 |

@F138_7_fhir_immunzation @fhir @5000000116V912836 @DE974
Scenario: Client can request immunization results in FHIR format
      Given a patient with "immunization" in multiple VistAs
      And a patient with pid "5000000116V912836" has been synced through the RDK API
      When the client requests "10" immunization for the patient "5000000116V912836" in FHIR format
      Then a successful response is returned
      And total returned resources are "10"
      And the results contain
      | name         | value |
      | totalResults | 16    |
