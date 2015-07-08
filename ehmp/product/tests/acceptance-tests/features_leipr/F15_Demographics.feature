@Demographics
Feature: F15 Demographics
   the need for a longitudinal enterprise patient record that contains Demographics data from all VistA instances where the patient record exists
   Demographics data is requested or a change to Demographics data is detected
   it will be retrieved and stored in the LEIPR
   and displayed in the JLV

@US501 
Scenario: VistA Exchange supports request, retrieval, storage, and display of Demographics data from multiple VistA instances for a patient
  Given a patient with id "E1" has not been synced
  When a client requests "patient" for patient with id "E1"
  Then a successful response is returned within "60" seconds
  And that patient has Demographics read from the stub
    | demographics_supplemental_list                		    | demographics_values                                                   | Required_fields |
    | extension[service-connected].url                          | "http://vistacore.us/fhir/profiles/@main#service-connected"           | No |
    | extension[service-connected].valueBoolean                 | true                                                                  | No |
    | extension[service-connected-percent].url                  | "http://vistacore.us/fhir/profiles/@main#service-connected-percent"   | No |
    | extension[service-connected-percent].valueQuantity.value  | 10                                                                    | No |
    | extension[service-connected-percent].valueQuantity.units  | %                                                                     | No |
    | extension[sensitive].url                                  | "http://vistacore.us/fhir/profiles/@main#sensitive"                   | No |
    | extension[sensitive].valueBoolean                         | true                                                                  | No |
    | extension[religion].url                                   | "http://vistacore.us/fhir/profiles/@main#religion"                    | No |
    | extension[religion].valueCode                             | 29                                                                    | No |
    | extension[veteran].url                                    | "http://vistacore.us/fhir/profiles/@main#veteran"                     | No |
    | extension[veteran].valueBoolean                           | true                                                                  | No |
    | contained[Organization][x]._id                            | 7baafdf0-8e6d-11e3-baa8-0800200c9a66                                  | No |
    | contained[Organization][x].identifier[xx].label           | domain                                                                | No |
    | contained[Organization][x].identifier[xx].value           | CCC.DOMAIN.GOV                                                        | No |
    | contained[Organization][x].identifier[yy].label           | facility-code                                                         | No |
    | contained[Organization][x].identifier[yy].value           | 995                                                   | No |
    | contained[Organization][y]._id                            | 550e8400-e29b-41d4-a716-446655440000                  | No |
    | contained[Organization][y].identifier[xx].label           | domain                                                | No |
    | contained[Organization][y].identifier[xx].value           | GOLD.VAINNOVATION.US                                  | No |
    | contained[Organization][y].identifier[yy].label           | facility-code                                         | No |
    | contained[Organization][y].identifier[yy].value           | 500                                                   | No |
    | text.status                                               | generated                                             | No |
    | text.div                                                  | <div>MORROW,JEROME. SSN:666000046<div/></div>         | No |
    | address[0].line[0]                                        | 2222 Home Street                                      | No |
    | address[0].line[1]                                        | APT. 3                                                | No |
    | address[0].line[2]                                        | SubUnit A                                             | No |                             
    | address[0].city                                           | SCHENECTADY                                           | No |                              
    | address[0].zip                                            | 12345-6789                                            | No |                                
    | address[0].state                                          | NEW YORK                                              | No |                             
    | birthDate                                                 | 1935-04-07                                            | No |                                     
    | name.use                                                  | official                                              | No |                                       
    | name.family                                               | MORROW                                                | No |                                    
    | name.given                                                | JEROME                                                | No |                                  
    | gender.coding.code                                        | M                                                     | No |                      
    | gender.coding.system                                      | http://hl7.org/fhir/v3/AdministrativeGender           | No |                          
    | maritalStatus.coding.system                               | http://hl7.org/fhir/v3/MaritalStatus                  | No |                        
    | maritalStatus.coding.code                                 | W                                                     | No |                        
    | maritalStatus.coding.display                              | Widowed                                               | No |                
    | identifier[x].use                                         | official                                              | No |                                 
    | identifier[x].system                                      | http://hl7.org/fhir/sid/us-ssn                        | No |                              
    | identifier[x].label                                       | ssn                                                   | No |                      
    | identifier[x].value                                       | 666000046                                             | No |                              
    | identifier[y].system                                      | http://vistacore.us/fhir/id/icn                       | No |                              
    | identifier[y].label                                       | icn                                                   | No |                      
    | identifier[y].value                                       | 10146                                                 | No |                          
    | identifier[z].system                                      | http://vistacore.us/fhir/id/dfn                       | No |                              
    | identifier[z].label                                       | dfn                                                   | No |                              
    | identifier[z].value                                       | 301                                                   | No |                              
    | identifier[z].assigner.reference                          | "#550e8400-e29b-41d4-a716-446655440000"               | No |                     
    | identifier[zz].system                                     | http://vistacore.us/fhir/id/lrdfn                     | No |                            
    | identifier[zz].label                                      | lrdfn                                                 | No |                        
    | identifier[zz].value                                      | 281                                                   | No |                            
    | identifier[zz].assigner.reference                         | "#550e8400-e29b-41d4-a716-446655440000"               | No |                     
    | contact[x].relationship.coding.system                     | http://hl7.org/fhir/patient-contact-relationship      | No |                 
    | contact[x].relationship.coding.code                       | family                                                | No |        
    | contact[x].name.use                                       | usual                                                 | No |                               
    | contact[x].name.text                                      | VETERAN,BROTHER                                       | No |                              
    | contact[y].relationship.coding.system                     | http://hl7.org/fhir/patient-contact-relationship      | No |                
    | contact[y].relationship.coding.code                       | emergency                                             | No |           
    | contact[y].name.use                                       | usual                                                 | No |                             
    | contact[y].name.text                                      | SALLY,SAFE HAVEN E                                    | No |                            
    | telecom[x].system                                         | phone                                                 | No |                            
    | telecom[x].use                                            | home                                                  | No |                                 
    | telecom[x].value                                          | (222)555-8235                                         | No |                                 
    | telecom[y].system                                         | phone                                                 | No |                            
    | telecom[y].use                                            | work                                                  | No |                                
    | telecom[y].value                                          | (222)555-7720                                         | No |                                 
    | managingOrganization.reference                            | "#7baafdf0-8e6d-11e3-baa8-0800200c9a66"               | No | 

#  Running these steps depend on the future discussion. 
#  And that patient has Demographics data at multiple VistA instances
#   | field                               | panorama_value              | kodak_value                 |
#  Then a response is returned with Demographics data from multiple VistA instances for that patient from LEIPR
#   And the results can be viewed in JLV