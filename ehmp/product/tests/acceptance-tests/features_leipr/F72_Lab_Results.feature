@Labs
Feature: F72 Lab Results
  the need for a longitudinal enterprise patient record that contains Laboratory Results data from all VistA instances where the patient record exists
  Laboratory Results data is requested or a change to Laboratory Results data is detected
  it will be retrieved and stored in the LEIPR
  and displayed in the JLV

@US402 @DE6
Scenario: VistA Exchange supports request, retrieval, storage, and display of Lab Results (Chem/Hem) data from multiple VistA instances for a patient
  Given a patient with id "E102" has not been synced
  When a client requests "lab" for patient with id "E102"
  Then a successful response is returned within "30" seconds
  And that patient has Lab Results (Chem/Hem) data at multiple VistA instances
    | field                                                 | panorama_value        | kodak_value           |
    | contained[Observation].valueQuantity.value            | 17.5                  | 15.9                  |
    | issued                                                | 2005-03-17T03:36:00   | 2005-03-18T04:37:00   |
    | results.name.text                                     | PROTIME               | PROTIME               |
    
    
  Then a response is returned with Lab Results (Chem/Hem) data from multiple VistA instances for that patient from LEIPR
    | lab_fields_list                                       | lab_values                                                    | Required_fields |
    | status                                                | final                                                         | Yes | 
    | issued                                                | 2004-03-28T23:49:00                                           | Yes |
    | subject.reference                                     | Patient/E102                                                   | Yes |
    | identifier.system                                     | urn:oid:2.16.840.1.113883.6.233                               | Yes |
    | identifier.value                                      | urn:va:9E7A:227:lab:CH;6959670.765095;1.2                     | Yes |
    | text.status                                           | generated                                                     | Yes |
    | contained[Organization]._id                           |                                                               | Yes |
    | contained[Organization].text.status                   | generated                                                     | Yes |
    | contained[Organization].text.div                      | "<div>ALBANY VA MEDICAL CENTER&lt;br&gt;                VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097</div>" | Yes |
    | contained[Organization].name                          | ALBANY VA MEDICAL CENTER | Yes |
    | contained[Organization].address[].text                | VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097             | No  |
    | contained[Organization].address[].line[x]             | VA MEDICAL CENTER 1 3RD sT.                                   | No  |
    | contained[Organization].address[].city                | ALBANY                                                        | No  |
    | contained[Organization].address[].state               | NY                                                            | No  |
    | contained[Organization].address[].zip                 | 12180-0097                                                    | No  |
    | performer.display                                     | ALBANY VA MEDICAL CENTER                                      | Yes |
    | performer.reference                                   |                                                               | Yes |
    | diagnosticDateTime                                    | 2004-03-28T23:49:00                                           | Yes |
    | results.name.coding[].code                            | urn:vuid:4671867                                              | Yes |
    | results.name.coding[].display                         | SODIUM                                                        | Yes |
    | results.name.text                                     | SODIUM                                                        | Yes |
    | contained[Observation].name.coding.system             | urn:oid:2.16.840.1.113883.6.233                               | No  |
    | contained[Observation].name.coding[].code             | urn:vuid:4671867                                              | No  |
    | contained[Observation].name.coding[].display          | SODIUM                                                        | No  |
    | contained[Observation].name.text                      | SODIUM                                                        | No  |
    | contained[Observation].referenceRange[].high.value    | 145                                                           | No  |
    | contained[Observation].referenceRange[].high.units    | meq/L                                                         | No  |
    | contained[Observation].referenceRange[].low.value     | 135                                                           | No  |
    | contained[Observation].referenceRange[].low.units     | meq/L                                                         | No  |
    | contained[Observation].status                         | final                                                         | No  |
    | contained[Observation].valueQuantity.value            | 135                                                           | No  |
    | contained[Observation].valueQuantity.units            | meq/L                                                         | No  |
    | extension[externalAccession].url                      | "http://vistacore.us/fhir/profiles/@main#external-accession"  | No  |
    | extension[externalAccession].valueString              | CH 0328 117                                                   | No  |
    | contained[Specimen].type.text                         | SERUM                                                         | No  |
    | contained[Specimen].subject.reference                 | Patient/227                                                   | No  |
    | contained[Specimen].collection.collectedDateTime      | 2004-03-28T23:49:00                                           | No  |
 
  #And the results can be viewed in JLV
  
  
@US402
Scenario: Checking 'contained._id' for Lab Results (Chem/Hem) that having same value with 'reference'
  Given a patient with id "E102" has not been synced
  When a client requests "lab" for patient with id "E102"
  Then a successful response is returned within "60" seconds
  And the lab field "contained[Organization]._id" has same value as "performer[].reference"
  And the lab field "contained[Observation]._id" has same value as "result.reference"
  And the lab field "contained[Specimen]._id" has same value as "results.specimen.reference"
    

@US548 @future
Scenario: VistA Exchange supports request, retrieval, storage, and display of Lab Results (Cyto)  data from multiple VistA instances for a patient
  Given a patient with id "E103" has not been synced
  When a client requests "lab" for patient with id "E103"
  Then a successful response is returned within "30" seconds
  And that patient has Lab Results (Cyto)  data at multiple VistA instances
    | field                                                 | panorama_value        | kodak_value           |

  Then a response is returned with Lab Results (Cyto)  data from multiple VistA instances for that patient from LEIPR
    | lab_fields_list                              | lab_values   | Required_fields |
    | status                                       | | Yes |
    | issued                                       | | Yes |
    | subject.reference                            | | Yes |
    | identifier.system                            | | Yes |
    | identifier.value[String]                     | | Yes |
    | text.status                                  | | Yes |
    | text.div                                     | | Yes |
    | contained[Organization].id                   | | Yes |
    | contained[Organization].text.status          | | Yes |
    | contained[Organization].text.div             | | Yes |
    | contained[Organization].name                 | | Yes |
    | performer[0].display                         | | Yes |
    | performer[0].reference                       | | Yes |
    | diagnosticDateTime                           | | Yes |
    | extension[externalAccession].url             | | No  |
    | extension[externalAccession].value           | | No  |
    | contained[Specimen].id                       | | No  |
    | contained[Specimen].type.text                | | No  |
    | contained[Specimen].subject.reference        | | No  |
    | contained[Specimen].collection.collectedTime | | No  |
    | specimen.reference                           | | No  |
    | serviceCategory.coding[0].code               | | No  |
    | serviceCategory.coding[0].system             | | No  |
    | serviceCategory.coding[0].display            | | No  |
    | serviceCategory.text                         | | No  |
    | extension[externalDocuments].extension[externalDocument[x]].extension[externalDocument[x].id].url             | | No  |
    | extension[externalDocuments].extension[externalDocument[x]].extension[externalDocument[x].id].value           | | No  |
    | extension[externalDocuments].extension[externalDocument[x]].extension[externalDocument[x].localTitle].url     | | No  |
    | extension[externalDocuments].extension[externalDocument[x]].extension[externalDocument[x].localTitle].value   | | No  |
    | extension[externalDocuments].extension[externalDocument[x]].extension[externalDocument[x].nationalTitle].url  | | No  |
    | extension[externalDocuments].extension[externalDocument[x]].extension[externalDocument[x].nationalTitle].url  | | No  |

    
  #And the results can be viewed in JLV 

@US548 @future
Scenario: VistA Exchange supports request, retrieval, storage, and display of Lab Results (SurgPath)  data from multiple VistA instances for a patient
  Given a patient with id "E103" has not been synced
  When a client requests "lab" for patient with id "E103"
  Then a successful response is returned within "30" seconds
  And that patient has Lab Results (SurgPath)  data at multiple VistA instances
    | field                                                 | panorama_value        | kodak_value           |

  Then a response is returned with Lab Results (SurgPath)  data from multiple VistA instances for that patient from LEIPR
    | lab_fields_list                              | lab_values   | Required_fields |
    | status                                       | | Yes |
    | issued                                       | | Yes |
    | subject.reference                            | | Yes |
    | identifier.system                            | | Yes |
    | identifier.value[String]                     | | Yes |
    | text.status                                  | | Yes |
    | text.div                                     | | Yes |
    | contained[Organization].id                   | | Yes |
    | contained[Organization].text.status          | | Yes |
    | contained[Organization].text.div             | | Yes |
    | contained[Organization].name                 | | Yes |
    | performer[0].display                         | | Yes |
    | performer[0].reference                       | | Yes |
    | diagnosticDateTime                           | | Yes |
    | contained[Specimen].id                       | | No  |
    | contained[Specimen].type.text                | | No  |
    | contained[Specimen].subject.reference        | | No  |
    | contained[Specimen].collection.collectedTime | | No  |
    | results.specimen.reference                   | | No  |
    | serviceCategory                              | | No  |
    | extension[externalAccession].url             | | No  |
    | extension[externalAccession].value           | | No  |
  #And the results can be viewed in JLV 

@US548 @future
Scenario: VistA Exchange supports request, retrieval, storage, and display of Lab Results (EM)  data from multiple VistA instances for a patient
  Given a patient with id "E103" has not been synced
  When a client requests "lab" for patient with id "E103"
  Then a successful response is returned within "30" seconds
  And that patient has Lab Results (EM)  data at multiple VistA instances
    | field                                                 | panorama_value        | kodak_value           |

  Then a response is returned with Lab Results (EM)  data from multiple VistA instances for that patient from LEIPR
    | lab_fields_list                              | lab_values   | Required_fields |
    | status                                       | | Yes |
    | issued                                       | | Yes |
    | subject.reference                            | | Yes |
    | identifier.system                            | | Yes |
    | identifier.value[String]                     | | Yes |
    | text.status                                  | | Yes |
    | text.div                                     | | Yes |
    | contained[Organization].id                   | | Yes |
    | contained[Organization].text.status          | | Yes |
    | contained[Organization].text.div             | | Yes |
    | contained[Organization].name                 | | Yes |
    | performer[0].display                         | | Yes |
    | performer[0].reference                       | | Yes |
    | diagnosticDateTime                           | | Yes |
    | contained[Specimen].id                       | | No  |
    | contained[Specimen].type.text                | | No  |
    | contained[Specimen].subject.reference        | | No  |
    | contained[Specimen].collection.collectedTime | | No  |
    | results.specimen.reference                   | | No  |
    | serviceCategory                              | | No  |
    | extension[externalAccession].url             | | No  |
    | extension[externalAccession].value           | | No  |
  #And the results can be viewed in JLV 


@future
Scenario: VistA Exchange supports request, retrieval, storage, and display of Lab Results (Microbiology) data from multiple VistA instances for a patient
  Given a patient with id "" has not been synced
  When a client requests "lab" for patient with id ""
  Then a successful response is returned within "30" seconds
  And that patient has Lab Results (Microbiology) data at multiple VistA instances
    | field                                                 | panorama_value        | kodak_value           |

  Then a response is returned with Lab Results (Microbiology) data from multiple VistA instances for that patient from LEIPR
    | lab_fields_list                                  | lab_values   | Required_fields |
    | status                                           | | Yes |
	| issued                                           | | Yes |
	| subject.reference                                | | Yes |
	| identifier.system                                | urn:oid:2.16.840.1.113883.6.233 | Yes |
	| identifier.value[String]                         | urn:va:9E7A:3:lab:CH;6899693.879999;3.9 | Yes |
	| text.status                                      | generated | Yes |
	| text.div                                         | | Yes |
	| contained[Organization].id                       | | Yes |
	| contained[Organization].text.status              | generated | Yes |
	| contained[Organization].text.div                 | | Yes |
	| contained[Organization].name                     | | Yes |
	| performer[0].display                             | | Yes |
	| performer[0].reference                           | | Yes |
	| diagnostic[DateTime]                             | | Yes |
	| results.name.coding.system                       | urn:oid:2.16.840.1.113883.6.233 | Yes |
	| results.name.coding.code                         | | Yes |
	| results.name.coding.display                      | | Yes |
	| results.name.text                                | | Yes |
	| contained[Observation].id                        | | No |
	| contained[Observation].name.coding.system        | urn:oid:2.16.840.1.113883.6.233 | No |
	| contained[Observation].name.coding.code          | | No |
	| contained[Observation].name.coding.system        | | No |
	| contained[Observation].status                    | | No |
	| conatained[Observation][0].name.text             | | No |
	| contained[Observation][0].indentifier.value      | | No |
	| contaained[Observation][x+1].value[String].value | | No |
	| contained[Observation][x].name.text              | | No |
	| contained[Observation][x].identifier.value       | | No |
	| containted[Observation].identifier.system        | urn:oid:2.16.840.1.113883.6.233 | No |
	| results.result.reference                         | | No |
	| extension[externalAccession].url                 | "http://vistacore.us/fhir/profiles/@main#externalAccession" | No |
	| extension[externalAccession].value               | | No |
	| contained[Specimen].id                           | | No |
	| contained[Specimen].type.text                    | | No |
	| contained[Specimen].subject.reference            | | No |
	| contained[Specimen].collection.collectedTime     | | No |
	| results.specimen.reference                       | | No |
	| serviceCategory                                  | MI | No |
  
  
  
  
  #And the results can be viewed in JLV

@future
Scenario: VistA Exchange supports request, retrieval, storage, and display of Lab Results (Blood Bank) data from multiple VistA instances for a patient
  Given a patient has not been synced
  And that patient has Lab Results (Blood Bank) data at multiple VistA instances
  When a client requests "lab" for that patient 
  Then a response is returned with Lab Results (Blood Bank) data from multiple VistA instances for that patient from LEIPR
  And the data is stored in the LEIPR
  #And the results can be viewed in JLV    
    



