 @F138_Orders_FHIR @vxsync @patient
 Feature: F138 - Return of Orders in FHIR format

 #This feature item returns an order in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
 #Patients used: 5000000341V359724, 10104V248233, 9E7A;230, 9E7A;167, 10105V001065, 10110V004877

 @F138_1_fhir_orders @fhir @5000000341V359724
 Scenario: Client can request orders results in FHIR format
       Given a patient with "orders" in multiple VistAs
      # And a patient with pid "5000000341V359724" has been synced through the RDK API
       When the client requests orders for the patient "5000000341V359724" in FHIR format
       Then a successful response is returned
#       And the results contain
#       | name         | value |
#       | total | 50    |
       And the FHIR results contain "orders"
       | name                              | value                                                  |
       | resource._id                       | CONTAINS urn:va:order:9E7A                             |
       | resource.text.status               | generated                                              |
       | resource.text.div                  | CONTAINS <div>Request for Laboratory                   |
       | resource.subject.reference         | Patient/9E7A;100022                                    |
       | resource.when.schedule.event.start | 2007-05-29T15:16:00                                    |
       | resource.when.schedule.event.end   | 2007-05-29T15:16:00                                    |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
       | resource.extension.valueString     | Laboratory                                             |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
       | resource.extension.valueString     | LR                                                     |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
       | resource.extension.valueString     | 21142                                                  |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
       | resource.extension.valueString     | CH                                                     |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#result       |
       | resource.extension.valueString     | urn:va:lab:9E7A:100022:CH;6929469.848386;500009        |
       #Practitioner
       | resource.contained.resourceType     | Practitioner              |
       | resource.contained.text.status      | generated                 |
       | resource.contained.text.div         | <div>Provider,Eight</div> |
       | resource.contained.name.text        | PROVIDER,EIGHT            |
       | resource.contained.identifier.label | provider-uid              |
       | resource.contained.identifier.value | urn:va:user:9E7A:991      |
       #Location
       | resource.contained.resourceType     | Location                |
       | resource.contained.text.status      | generated               |
       | resource.contained.text.div         | <div>CAMP MASTER</div>  |
       | resource.contained.name             | CAMP MASTER             |
       | resource.contained.identifier.label | location-uid            |
       | resource.contained.identifier.value | urn:va:location:9E7A:11 |
       #Organization
       | resource.contained.resourceType     | Organization    |
       | resource.contained.text.status      | generated       |
       | resource.contained.text.div         | <div>BCMA</div> |
       | resource.contained.name             | BCMA            |
       | resource.contained.identifier.label | facility-code   |
       | resource.contained.identifier.value | 500             |
       #DiagnosticOrder
       | resource.contained.resourceType                           | DiagnosticOrder                                        |
       | resource.contained.subject.reference                      | Patient/9E7A;100022                                    |
       | resource.contained.status                                 | completed                                              |
       | resource.contained.item.code.text                         | HEPATITIS C ANTIBODY                                   |
       | resource.contained.item.code.coding.system                | oi-code                                                |
       | resource.contained.item.code.coding.code                  | urn:va:oi:1335                                         |
       | resource.contained.item.code.coding.display               | HEPATITIS C ANTIBODY                                   |
       | resource.contained.item.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
       | resource.contained.item.code.coding.extension.valueString | 5079;99LRT                                             |
       | resource.contained.text.status                            | generated                                              |
       | resource.contained.text.div                               | <div>HEPATITIS C ANTIBODY</div>                        |
       | resource.contained.identifier.label                   | uid                                                    |
       | resource.contained.identifier.value                       | urn:va:order:9E7A:100022:21142                         |
       | resource.detail.display                                   | HEPATITIS C ANTIBODY                                   |



 @F138_2_fhir_orders @fhir @10104V248233
 Scenario: Client can request orders results in FHIR format
       Given a patient with "orders" in multiple VistAs
      # And a patient with pid "10104V248233" has been synced through the RDK API
       When the client requests orders for the patient "10104V248233" in FHIR format
       Then a successful response is returned
#       And the results contain
#       | name         | value |
#       | total   | 407   |
       And the FHIR results contain "orders"
       | name                              | value                                                  |
       | resource._id                       | CONTAINS urn:va:order:9E7A                             |
       | resource.text.status               | generated                                              |
       | resource.text.div                  | CONTAINS CAPTOPRIL 25MG TABS                           |
       | resource.subject.reference         | Patient/9E7A;229                                       |
       | resource.when.schedule.event.start | 1999-09-02                                             |
       | resource.when.schedule.event.end   | 2000-09-02                                             |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
       | resource.extension.valueString     | Medication, Outpatient                                 |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
       | resource.extension.valueString     | PSO                                                    |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
       | resource.extension.valueString     | 10552                                                  |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
       | resource.extension.valueString     | O RX                                                   |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#result       |
       | resource.extension.valueString     | urn:va:med:9E7A:229:10552                              |
       #Practitioner
       | resource.contained.resourceType     | Practitioner                            |
       | resource.contained.text.status      | generated                               |
       | resource.contained.text.div         | <div>Provider,Onehundredninetyone</div> |
       | resource.contained.name.text        | PROVIDER,ONEHUNDREDNINETYONE            |
       | resource.contained.identifier.label | provider-uid                            |
       | resource.contained.identifier.value | urn:va:user:9E7A:11531                  |
       #Location
       | resource.contained.resourceType     | Location                 |
       | resource.contained.text.status      | generated                |
       | resource.contained.text.div         | <div>FUNNY</div>         |
       | resource.contained.name             | FUNNY                    |
       | resource.contained.identifier.label | location-uid             |
       | resource.contained.identifier.value | urn:va:location:9E7A:230 |
       #Organization
       | resource.contained.resourceType     | Organization           |
       | resource.contained.text.status      | generated              |
       | resource.contained.text.div         | <div>CAMP MASTER</div> |
       | resource.contained.name             | CAMP MASTER            |
       | resource.contained.identifier.label | facility-code          |
       | resource.contained.identifier.value | 500                    |
       #Medication
       | resource.contained.resourceType                      | Medication                                             |
       | resource.contained.name                              | CONTAINS CAPTOPRIL TAB                                 |
       | resource.contained.code.text                         | CONTAINS CAPTOPRIL TAB                                 |
       | resource.contained.code.coding.system                | oi-code                                                |
       | resource.contained.code.coding.code                  | urn:va:oi:1441                                         |
       | resource.contained.code.coding.display               | CONTAINS CAPTOPRIL TAB                                 |
       | resource.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
       | resource.contained.code.coding.extension.valueString | 98;99PSP                                               |
       #MedicationPrescription
       | resource.contained.resourceType       | MedicationPrescription      |
       | resource.contained.patient.reference  | Patient/9E7A;229            |
       | resource.contained.status             | stopped                     |
       | resource.contained.text.status        | generated                   |
       | resource.contained.text.div           | <div>CAPTOPRIL TAB </div>   |
       | resource.contained.identifier.label   | uid                         |
       | resource.contained.identifier.value   | urn:va:order:9E7A:229:10552 |
       | resource.contained.medication.display | CONTAINS CAPTOPRIL TAB      |

 @F138_3_fhir_orders @fhir @10105V001065
 Scenario: Client can request orders results in FHIR format
       Given a patient with "orders" in multiple VistAs
       #And a patient with pid "10105V001065" has been synced through the RDK API
       When the client requests orders for the patient "10105V001065" in FHIR format
       Then a successful response is returned
#       And the results contain
#       | name         | value |
#       | total | 377   |
       And the FHIR results contain "orders"
       | name                              | value                                                  |
       | resource._id                       | CONTAINS urn:va:order:9E7A                             |
       | resource.text.status               | generated                                              |
       | resource.text.div                  | CONTAINS Request for Radiology                         |
       | resource.subject.reference         | Patient/9E7A;231                                       |
       | resource.when.schedule.event.start | 2003-04-17                                             |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
       | resource.extension.valueString     | Radiology                                              |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
       | resource.extension.valueString     | RA                                                     |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
       | resource.extension.valueString     | 13740                                                  |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
       | resource.extension.valueString     | RAD                                                    |
       #DiagnosticOrder
       | resource.contained.resourceType                           | DiagnosticOrder                                        |
       | resource.contained.subject.reference                      | Patient/9E7A;231                                       |
       | resource.contained.status                                 | requested                                              |
       | resource.contained.orderer.display                        | VEHU,ONE                                               |
       | resource.contained.item.code.text                         | CHEST 2 VIEWS PA&LAT                                   |
       | resource.contained.item.code.coding.system                | oi-code                                                |
       | resource.contained.item.code.coding.code                  | urn:va:oi:2652                                         |
       | resource.contained.item.code.coding.display               | CHEST 2 VIEWS PA&LAT                                   |
       | resource.contained.item.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
       | resource.contained.item.code.coding.extension.valueString | 58;99RAP                                               |
       | resource.contained.text.status                            | generated                                              |
       | resource.contained.text.div                               | <div>CHEST 2 VIEWS PA&LAT</div>                        |
       | resource.contained.identifier.label                       | uid                                                    |
       | resource.contained.identifier.value                       | urn:va:order:9E7A:231:13740                            |
       | resource.detail.display                                   | CHEST 2 VIEWS PA&LAT                                   |
       And the FHIR results contain "orders"
       | name                          | value                                                  |
       | resource._id                   | CONTAINS urn:va:order:9E7A                             |
       | resource.text.status           | generated                                              |
       | resource.text.div              | CONTAINS Request for Medication, Non-VA                |
       | resource.subject.reference     | Patient/9E7A;231                                       |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/order#kind         |
       | resource.extension.valueString | Medication, Non-VA                                     |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/order#service      |
       | resource.extension.valueString | PSH                                                    |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/order#localId      |
       | resource.extension.valueString | 18079                                                  |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/order#displayGroup |
       | resource.extension.valueString | NV RX                                                  |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/order#result       |
       | resource.extension.valueString | urn:va:med:9E7A:231:18079                              |
       #Medication
       | resource.contained.resourceType                      | Medication                                             |
       | resource.contained.name                              | CONTAINS ASPIRIN TAB,EC                                |
       | resource.contained.code.text                         | CONTAINS ASPIRIN TAB,EC                                |
       | resource.contained.code.coding.system                | oi-code                                                |
       | resource.contained.code.coding.code                  | urn:va:oi:3855                                         |
       | resource.contained.code.coding.display               | CONTAINS ASPIRIN TAB,EC                                |
       | resource.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
       | resource.contained.code.coding.extension.valueString | 1667;99PSP                                             |
       #MedicationPrescription
       | resource.contained.resourceType       | MedicationPrescription      |
       | resource.contained.patient.reference  | Patient/9E7A;231            |
       | resource.contained.status             | active                      |
       | resource.contained.text.status        | generated                   |
       | resource.contained.text.div           | CONTAINS ASPIRIN TAB,EC     |
       | resource.contained.identifier.label   | uid                         |
       | resource.contained.identifier.value   | urn:va:order:9E7A:231:18079 |
       | resource.contained.medication.display | CONTAINS ASPIRIN TAB,EC     |

 @F138_4_fhir_orders @fhir @10110V004877
 Scenario: Client can request orders results in FHIR format
       Given a patient with "orders" in multiple VistAs
       #And a patient with pid "10110V004877" has been synced through the RDK API
       When the client requests orders for the patient "10110V004877" in FHIR format
       Then a successful response is returned
#       And the results contain
#       | name         | value |
#       | total | 1600  |
       And the FHIR results contain "orders"
       | name                                      | value                                                  |
       | resource._id                               | CONTAINS urn:va:order:9E7A:8:10835                     |
       | resource.text.status                       | generated                                              |
       | resource.text.div                          | CONTAINS <div>Request for Medication, Infusion         |
       | resource.subject.reference                 | Patient/9E7A;8                                         |
       | resource.when.schedule.event.start         | 1999-11-05T15:00:00                                    |
       | resource.when.schedule.event.end           | 1999-11-08T23:59:00                                    |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/order#kind         |
       | resource.extension.valueString             | Medication, Infusion                                   |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/order#service      |
       | resource.extension.valueString             | PSIV                                                   |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/order#localId      |
       | resource.extension.valueString             | 10835                                                  |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/order#displayGroup |
       | resource.extension.valueString             | IV RX                                                  |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/order#result       |
       | resource.extension.valueString             | urn:va:med:9E7A:8:10835                                |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/order#predecessor  |
       | resource.extension.valueResource.reference | Order/urn:va:order:9E7A:8:10831                        |
       #Medication
       | resource.contained.resourceType                      | Medication                                             |
       | resource.contained.name                              | 5% DEXTROSE INJ,SOLN IV                                |
       | resource.contained.code.text                         | 5% DEXTROSE INJ,SOLN IV                                |
       | resource.contained.code.coding.system                | oi-code                                                |
       | resource.contained.code.coding.code                  | urn:va:oi:2033                                         |
       | resource.contained.code.coding.display               | 5% DEXTROSE INJ,SOLN IV                                |
       | resource.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
       | resource.contained.code.coding.extension.valueString | 690;99PSP                                              |
       #MedicationPrescription
       | resource.contained.resourceType       | MedicationPrescription             |
       | resource.contained.patient.reference  | Patient/9E7A;8                     |
       | resource.contained.status             | stopped                            |
       | resource.contained.text.status        | generated                          |
       | resource.contained.text.div           | <div>5% DEXTROSE INJ,SOLN IV</div> |
       | resource.contained.identifier.label   | uid                                |
       | resource.contained.identifier.value   | urn:va:order:9E7A:8:10835          |
       | resource.contained.medication.display | 5% DEXTROSE INJ,SOLN IV            |
       And the FHIR results contain "orders"
       | name                              | value                                                  |
       | resource._id                       | CONTAINS urn:va:order:9E7A                             |
       | resource.text.status               | generated                                              |
       | resource.text.div                  | CONTAINS <div>Request for Medication, Inpatient        |
       | resource.subject.reference         | Patient/9E7A;8                                         |
       | resource.when.schedule.event.start | 2000-01-12T09:00:00                                    |
       | resource.when.schedule.event.end   | 2000-01-24T23:00:00                                    |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#kind         |
       | resource.extension.valueString     | Medication, Inpatient                                  |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#service      |
       | resource.extension.valueString     | PSJ                                                    |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#localId      |
       | resource.extension.valueString     | 11708                                                  |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#displayGroup |
       | resource.extension.valueString     | UD RX                                                  |
       | resource.extension.url             | http://vistacore.us/fhir/extensions/order#result       |
       | resource.extension.valueString     | urn:va:med:9E7A:8:11708                                |
       #Medication
       | resource.contained.resourceType                      | Medication                                             |
       | resource.contained.name                              | CONTAINS AMITRIPTYLINE TAB                             |
       | resource.contained.code.text                         | CONTAINS AMITRIPTYLINE TAB                             |
       | resource.contained.code.coding.system                | oi-code                                                |
       | resource.contained.code.coding.code                  | urn:va:oi:1378                                         |
       | resource.contained.code.coding.display               | CONTAINS AMITRIPTYLINE TAB                             |
       | resource.contained.code.coding.extension.url         | http://vistacore.us/fhir/extensions/order#oiPackageRef |
       | resource.contained.code.coding.extension.valueString | 35;99PSP                                               |
       #MedicationPrescription
       | resource.contained.resourceType       | MedicationPrescription     |
       | resource.contained.patient.reference  | Patient/9E7A;8             |
       | resource.contained.status             | stopped                    |
       | resource.contained.text.status        | generated                  |
       | resource.contained.text.div           | CONTAINS AMITRIPTYLINE TAB |
       | resource.contained.identifier.label   | uid                        |
       | resource.contained.identifier.value   | urn:va:order:9E7A:8:11708  |
       | resource.contained.medication.display | CONTAINS AMITRIPTYLINE TAB |

 @F138_5_fhir_orders @fhir @9E7A167
 Scenario: Client can break the glass when requesting orders in FHIR format for a sensitive patient
       Given a patient with "orders" in multiple VistAs
       #And a patient with pid "9E7A;167" has been synced through the RDK API
       When the client requests orders for that sensitive patient "9E7A;167"
       Then a permanent redirect response is returned
       When the client breaks glass and repeats a request for orders for that patient "9E7A;167"
       Then a successful response is returned
       And the results contain
       | name         | value                                    |
       | resourceType | Bundle                                   |
       | title        | Order with subject.identifier '9E7A;167' |
       #| total        | 3                                        |

# @F138_6_fhir_orders @fhir @9E7A230
# Scenario: Negative scenario. Client can request orders results in FHIR format
#       Given a patient with "no orders" in multiple VistAs
#       When the client requests orders for the patient "9E7A;230" in FHIR format
#       Then a successful response is returned
#       And the results contain
#       | name         | value |
#       | total | 0     |
#
# @F138_7_fhir_orders @fhir @10110V004877 @DE974
# Scenario: Client can request orders results in FHIR format
#       Given a patient with "orders" in multiple VistAs
#       #And a patient with pid "10110V004877" has been synced through the RDK API
#       When the client requests "10" orders for the patient "10110V004877" in FHIR format
#       Then a successful response is returned
#       And the results contain
#       | name         | value |
#       | total        | 10    |
