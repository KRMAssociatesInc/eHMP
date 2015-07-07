@F138_Orders_FHIR @vxsync @patient
Feature: F138 - Return of Orders in FHIR format

#This feature item returns an order in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 5000000341V359724, 10104V248233, 9E7A;230, 9E7A;167, 10105V001065, 10110V004877

@F138_1_fhir_orders @fhir @5000000341V359724
Scenario: Client can request orders results in FHIR format
      Given a patient with "orders" in multiple VistAs
      And a patient with pid "5000000341V359724" has been synced through the RDK API
      When the client requests orders for the patient "5000000341V359724" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 50    |
      And the FHIR results contain "orders"
      | name                              | value                                                  |
      | content._id                       | CONTAINS urn:va:order:9E7A                             |
      | content.text.status               | generated                                              |
      | content.text.div                  | CONTAINS <div>Request for Laboratory                   |
      | content.subject.reference         | Patient/9E7A;100022                                    |
      | content.when.schedule.event.start | 2007-05-29T15:16:00                                    |
      | content.when.schedule.event.end   | 2007-05-29T15:16:00                                    |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
      | content.extension.valueString     | Laboratory                                             |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
      | content.extension.valueString     | LR                                                     |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
      | content.extension.valueString     | 21142                                                  |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
      | content.extension.valueString     | CH                                                     |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#result       |
      | content.extension.valueString     | urn:va:lab:9E7A:100022:CH;6929469.848386;500009        |
      #Practitioner
      | content.contained.resourceType     | Practitioner              |
      | content.contained.text.status      | generated                 |
      | content.contained.text.div         | <div>Provider,Eight</div> |
      | content.contained.name.text        | PROVIDER,EIGHT            |
      | content.contained.identifier.label | provider-uid              |
      | content.contained.identifier.value | urn:va:user:9E7A:991      |
      #Location
      | content.contained.resourceType     | Location                |
      | content.contained.text.status      | generated               |
      | content.contained.text.div         | <div>CAMP MASTER</div>  |
      | content.contained.name             | CAMP MASTER             |
      | content.contained.identifier.label | location-uid            |
      | content.contained.identifier.value | urn:va:location:9E7A:11 |
      #Organization
      | content.contained.resourceType     | Organization    |
      | content.contained.text.status      | generated       |
      | content.contained.text.div         | <div>BCMA</div> |
      | content.contained.name             | BCMA            |
      | content.contained.identifier.label | facility-code   |
      | content.contained.identifier.value | 500             |
      #DiagnosticOrder
      | content.contained.resourceType                           | DiagnosticOrder                                        |
      | content.contained.subject.reference                      | Patient/9E7A;100022                                    |
      | content.contained.status                                 | completed                                              |
      | content.contained.item.code.text                         | HEPATITIS C ANTIBODY                                   |
      | content.contained.item.code.coding.system                | oi-code                                                |
      | content.contained.item.code.coding.code                  | urn:va:oi:1335                                         |
      | content.contained.item.code.coding.display               | HEPATITIS C ANTIBODY                                   |
      | content.contained.item.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
      | content.contained.item.code.coding.extension.valueString | 5079;99LRT                                             |
      | content.contained.text.status                            | generated                                              |
      | content.contained.text.div                               | <div>HEPATITIS C ANTIBODY</div>                        |
      | content.contained.identifier.label                       | uid                                                    |
      | content.contained.identifier.value                       | urn:va:order:9E7A:100022:21142                         |
      | content.detail.display                                   | HEPATITIS C ANTIBODY                                   |



@F138_2_fhir_orders @fhir @10104V248233
Scenario: Client can request orders results in FHIR format
      Given a patient with "orders" in multiple VistAs
      And a patient with pid "10104V248233" has been synced through the RDK API
      When the client requests orders for the patient "10104V248233" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 407   |
      And the FHIR results contain "orders"
      | name                              | value                                                  |
      | content._id                       | CONTAINS urn:va:order:9E7A                             |
      | content.text.status               | generated                                              |
      | content.text.div                  | CONTAINS CAPTOPRIL 25MG TABS                           |
      | content.subject.reference         | Patient/9E7A;229                                       |
      | content.when.schedule.event.start | 1999-09-02                                             |
      | content.when.schedule.event.end   | 2000-09-02                                             |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
      | content.extension.valueString     | Medication, Outpatient                                 |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
      | content.extension.valueString     | PSO                                                    |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
      | content.extension.valueString     | 10552                                                  |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
      | content.extension.valueString     | O RX                                                   |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#result       |
      | content.extension.valueString     | urn:va:med:9E7A:229:10552                              |
      #Practitioner
      | content.contained.resourceType     | Practitioner                            |
      | content.contained.text.status      | generated                               |
      | content.contained.text.div         | <div>Provider,Onehundredninetyone</div> |
      | content.contained.name.text        | PROVIDER,ONEHUNDREDNINETYONE            |
      | content.contained.identifier.label | provider-uid                            |
      | content.contained.identifier.value | urn:va:user:9E7A:11531                  |
      #Location
      | content.contained.resourceType     | Location                 |
      | content.contained.text.status      | generated                |
      | content.contained.text.div         | <div>FUNNY</div>         |
      | content.contained.name             | FUNNY                    |
      | content.contained.identifier.label | location-uid             |
      | content.contained.identifier.value | urn:va:location:9E7A:230 |
      #Organization
      | content.contained.resourceType     | Organization           |
      | content.contained.text.status      | generated              |
      | content.contained.text.div         | <div>CAMP MASTER</div> |
      | content.contained.name             | CAMP MASTER            |
      | content.contained.identifier.label | facility-code          |
      | content.contained.identifier.value | 500                    |
      #Medication
      | content.contained.resourceType                      | Medication                                             |
      | content.contained.name                              | CONTAINS CAPTOPRIL TAB                                 |
      | content.contained.code.text                         | CONTAINS CAPTOPRIL TAB                                 |
      | content.contained.code.coding.system                | oi-code                                                |
      | content.contained.code.coding.code                  | urn:va:oi:1441                                         |
      | content.contained.code.coding.display               | CONTAINS CAPTOPRIL TAB                                 |
      | content.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
      | content.contained.code.coding.extension.valueString | 98;99PSP                                               |
      #MedicationPrescription
      | content.contained.resourceType       | MedicationPrescription      |
      | content.contained.patient.reference  | Patient/9E7A;229            |
      | content.contained.status             | stopped                     |
      | content.contained.text.status        | generated                   |
      | content.contained.text.div           | <div>CAPTOPRIL TAB </div>   |
      | content.contained.identifier.label   | uid                         |
      | content.contained.identifier.value   | urn:va:order:9E7A:229:10552 |
      | content.contained.medication.display | CONTAINS CAPTOPRIL TAB      |

@F138_3_fhir_orders @fhir @10105V001065
Scenario: Client can request orders results in FHIR format
      Given a patient with "orders" in multiple VistAs
      And a patient with pid "10105V001065" has been synced through the RDK API
      When the client requests orders for the patient "10105V001065" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 377   |
      And the FHIR results contain "orders"
      | name                              | value                                                  |
      | content._id                       | CONTAINS urn:va:order:9E7A                             |
      | content.text.status               | generated                                              |
      | content.text.div                  | CONTAINS Request for Radiology                         |
      | content.subject.reference         | Patient/9E7A;231                                       |
      | content.when.schedule.event.start | 2003-04-17                                             |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
      | content.extension.valueString     | Radiology                                              |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
      | content.extension.valueString     | RA                                                     |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
      | content.extension.valueString     | 13740                                                  |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
      | content.extension.valueString     | RAD                                                    |
      #DiagnosticOrder
      | content.contained.resourceType                           | DiagnosticOrder                                        |
      | content.contained.subject.reference                      | Patient/9E7A;231                                       |
      | content.contained.status                                 | requested                                              |
      | content.contained.orderer.display                        | VEHU,ONE                                               |
      | content.contained.item.code.text                         | CHEST 2 VIEWS PA&LAT                                   |
      | content.contained.item.code.coding.system                | oi-code                                                |
      | content.contained.item.code.coding.code                  | urn:va:oi:2652                                         |
      | content.contained.item.code.coding.display               | CHEST 2 VIEWS PA&LAT                                   |
      | content.contained.item.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
      | content.contained.item.code.coding.extension.valueString | 58;99RAP                                               |
      | content.contained.text.status                            | generated                                              |
      | content.contained.text.div                               | <div>CHEST 2 VIEWS PA&LAT</div>                        |
      | content.contained.identifier.label                       | uid                                                    |
      | content.contained.identifier.value                       | urn:va:order:9E7A:231:13740                            |
      | content.detail.display                                   | CHEST 2 VIEWS PA&LAT                                   |
      And the FHIR results contain "orders"
      | name                          | value                                                  |
      | content._id                   | CONTAINS urn:va:order:9E7A                             |
      | content.text.status           | generated                                              |
      | content.text.div              | CONTAINS Request for Medication, Non-VA                |
      | content.subject.reference     | Patient/9E7A;231                                       |
      | content.extension.url         | http://vistacore.us/fhir/extensions/order#kind         |
      | content.extension.valueString | Medication, Non-VA                                     |
      | content.extension.url         | http://vistacore.us/fhir/extensions/order#service      |
      | content.extension.valueString | PSH                                                    |
      | content.extension.url         | http://vistacore.us/fhir/extensions/order#localId      |
      | content.extension.valueString | 18079                                                  |
      | content.extension.url         | http://vistacore.us/fhir/extensions/order#displayGroup |
      | content.extension.valueString | NV RX                                                  |
      | content.extension.url         | http://vistacore.us/fhir/extensions/order#result       |
      | content.extension.valueString | urn:va:med:9E7A:231:18079                              |
      #Medication
      | content.contained.resourceType                      | Medication                                             |
      | content.contained.name                              | CONTAINS ASPIRIN TAB,EC                                |
      | content.contained.code.text                         | CONTAINS ASPIRIN TAB,EC                                |
      | content.contained.code.coding.system                | oi-code                                                |
      | content.contained.code.coding.code                  | urn:va:oi:3855                                         |
      | content.contained.code.coding.display               | CONTAINS ASPIRIN TAB,EC                                |
      | content.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
      | content.contained.code.coding.extension.valueString | 1667;99PSP                                             |
      #MedicationPrescription
      | content.contained.resourceType       | MedicationPrescription      |
      | content.contained.patient.reference  | Patient/9E7A;231            |
      | content.contained.status             | active                      |
      | content.contained.text.status        | generated                   |
      | content.contained.text.div           | CONTAINS ASPIRIN TAB,EC     |
      | content.contained.identifier.label   | uid                         |
      | content.contained.identifier.value   | urn:va:order:9E7A:231:18079 |
      | content.contained.medication.display | CONTAINS ASPIRIN TAB,EC     |

@F138_4_fhir_orders @fhir @10110V004877
Scenario: Client can request orders results in FHIR format
      Given a patient with "orders" in multiple VistAs
      And a patient with pid "10110V004877" has been synced through the RDK API
      When the client requests orders for the patient "10110V004877" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 1600  |
      And the FHIR results contain "orders"
      | name                                      | value                                                  |
      | content._id                               | CONTAINS urn:va:order:9E7A:8:10835                     |
      | content.text.status                       | generated                                              |
      | content.text.div                          | CONTAINS <div>Request for Medication, Infusion         |
      | content.subject.reference                 | Patient/9E7A;8                                         |
      | content.when.schedule.event.start         | 1999-11-05T15:00:00                                    |
      | content.when.schedule.event.end           | 1999-11-08T23:59:00                                    |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/order#kind         |
      | content.extension.valueString             | Medication, Infusion                                   |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/order#service      |
      | content.extension.valueString             | PSIV                                                   |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/order#localId      |
      | content.extension.valueString             | 10835                                                  |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/order#displayGroup |
      | content.extension.valueString             | IV RX                                                  |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/order#result       |
      | content.extension.valueString             | urn:va:med:9E7A:8:10835                                |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/order#predecessor  |
      | content.extension.valueResource.reference | Order/urn:va:order:9E7A:8:10831                        |
      #Medication
      | content.contained.resourceType                      | Medication                                             |
      | content.contained.name                              | 5% DEXTROSE INJ,SOLN IV                                |
      | content.contained.code.text                         | 5% DEXTROSE INJ,SOLN IV                                |
      | content.contained.code.coding.system                | oi-code                                                |
      | content.contained.code.coding.code                  | urn:va:oi:2033                                         |
      | content.contained.code.coding.display               | 5% DEXTROSE INJ,SOLN IV                                |
      | content.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
      | content.contained.code.coding.extension.valueString | 690;99PSP                                              |
      #MedicationPrescription
      | content.contained.resourceType       | MedicationPrescription             |
      | content.contained.patient.reference  | Patient/9E7A;8                     |
      | content.contained.status             | stopped                            |
      | content.contained.text.status        | generated                          |
      | content.contained.text.div           | <div>5% DEXTROSE INJ,SOLN IV</div> |
      | content.contained.identifier.label   | uid                                |
      | content.contained.identifier.value   | urn:va:order:9E7A:8:10835          |
      | content.contained.medication.display | 5% DEXTROSE INJ,SOLN IV            |
      And the FHIR results contain "orders"
      | name                              | value                                                  |
      | content._id                       | CONTAINS urn:va:order:9E7A                             |
      | content.text.status               | generated                                              |
      | content.text.div                  | CONTAINS <div>Request for Medication, Inpatient        |
      | content.subject.reference         | Patient/9E7A;8                                         |
      | content.when.schedule.event.start | 2000-01-12T09:00:00                                    |
      | content.when.schedule.event.end   | 2000-01-24T23:00:00                                    |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
      | content.extension.valueString     | Medication, Inpatient                                  |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
      | content.extension.valueString     | PSJ                                                    |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
      | content.extension.valueString     | 11708                                                  |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
      | content.extension.valueString     | UD RX                                                  |
      | content.extension.url             | http://vistacore.us/fhir/extensions/order#result       |
      | content.extension.valueString     | urn:va:med:9E7A:8:11708                                |
      #Medication
      | content.contained.resourceType                      | Medication                                             |
      | content.contained.name                              | CONTAINS AMITRIPTYLINE TAB                             |
      | content.contained.code.text                         | CONTAINS AMITRIPTYLINE TAB                             |
      | content.contained.code.coding.system                | oi-code                                                |
      | content.contained.code.coding.code                  | urn:va:oi:1378                                         |
      | content.contained.code.coding.display               | CONTAINS AMITRIPTYLINE TAB                             |
      | content.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
      | content.contained.code.coding.extension.valueString | 35;99PSP                                               |
      #MedicationPrescription
      | content.contained.resourceType       | MedicationPrescription     |
      | content.contained.patient.reference  | Patient/9E7A;8             |
      | content.contained.status             | stopped                    |
      | content.contained.text.status        | generated                  |
      | content.contained.text.div           | CONTAINS AMITRIPTYLINE TAB |
      | content.contained.identifier.label   | uid                        |
      | content.contained.identifier.value   | urn:va:order:9E7A:8:11708  |
      | content.contained.medication.display | CONTAINS AMITRIPTYLINE TAB |

@F138_5_fhir_orders @fhir @9E7A167
Scenario: Client can break the glass when requesting orders in FHIR format for a sensitive patient
      Given a patient with "orders" in multiple VistAs
      And a patient with pid "9E7A;167" has been synced through the RDK API
      When the client requests orders for that sensitive patient "9E7A;167"
      Then a permanent redirect response is returned
      When the client breaks glass and repeats a request for orders for that patient "9E7A;167"
      Then a successful response is returned
      And the results contain
      | name         | value                                    |
      | resourceType | Bundle                                   |
      | title        | Order with subject.identifier '9E7A;167' |
      | totalResults | 3                                        |

@F138_6_fhir_orders @fhir @9E7A230
Scenario: Negativ scenario. Client can request orders results in FHIR format
      Given a patient with "no orders" in multiple VistAs
      When the client requests orders for the patient "9E7A;230" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 0     |

@F138_7_fhir_orders @fhir @10110V004877 @DE974
Scenario: Client can request orders results in FHIR format
      Given a patient with "orders" in multiple VistAs
      And a patient with pid "10110V004877" has been synced through the RDK API
      When the client requests "10" orders for the patient "10110V004877" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 10    |
