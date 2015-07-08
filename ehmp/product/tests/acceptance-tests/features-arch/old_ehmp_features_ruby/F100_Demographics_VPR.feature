@Demographics_vpr
Feature: F100 Return of Demographics in VPR format

#This feature item returns Demographics data in VPR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.



@f100_1_demographics_vpr1 @vpr
Scenario: Client can request demographics in VPR format (address, gender, etc.)
   	Given a patient with "demographics" in multiple VistAs
    Given a patient with pid "5000000217V519385" has been synced through Admin API   	
	When the client requests demographics for the patient "5000000217V519385" in VPR format
	Then the client receives 2 VPR "VistA" result(s)
	Then the client receives 1 VPR "panorama" result(s)
	And the VPR results contain:
      | field                           | panorama_value                                                                                   |
      | uid                             | urn:va:patient:9E7A:100716:100716                                                                |
      | displayName                     | Eight,Inpatient                                                                                  |
      | serviceConnected                | false                                                                                            |
      | scPercent                       | IS_NOT_SET                                                                                       |
      | sensitive                       | false                                                                                       |
      | religionCode                    | IS_NOT_SET                                                                                       |
      | religionName                    | IS_NOT_SET                                                                                       |
      | familyName                      | EIGHT                                                                                            |
      | ssn                             | 666000808                                                                                        |
      | address.line1                   | Any Street                                                                                       |
      | address.line2                   | IS_NOT_SET                                                                                       |
      | address.line3                   | IS_NOT_SET                                                                                       |
      | address.city                    | Any Town                                                                                         |
      | address.zip                     | IS_NOT_SET                                                                                       |
      | address.state                   | IS_NOT_SET                                                                                       |
      | birthDate                       | 19450309                                                                                         |
      | givenNames                      | INPATIENT                                                                                        |
      | genderCode                      | urn:va:pat-gender:M                                                                              |
      | genderName                      | Male                                                                                             |
      | icn                             | 5000000217V519385                                                                                |
      | localId                         | 100716                                                                                           |
      | lrdfn                           | IS_NOT_SET                                                                                       |
      | telecom.telecom                 | IS_NOT_SET                                                                                       |
      | telecom.usageCode               | IS_NOT_SET                                                                                       |
      | telecom.usageName               | IS_NOT_SET                                                                                       |
      | telecom.telecom                 | IS_NOT_SET                                                                                       |
      | telecom.usageCode               | IS_NOT_SET                                                                                       |
      | telecom.usageName               | IS_NOT_SET                                                                                       |
      # UNSURE WHAT VALUES SHOULD BE
      | briefId                         | E0808                                                                                            |
      | exposure.name                   | No                                                                                               |
      | exposure.uid                    | urn:va:sw-asia:N                                                                                 |
      | facility.localPatientId         | 100716                                                                                           |
      | fullName                        | EIGHT,INPATIENT                                                                                  |
      | last4                           | 0808                                                                                             |
      | last5                           | E0808                                                                                            |
      | pid                             | CONTAINS 100716                                                                                  |
      #| summary                        | gov.va.cpe.vpr.PatientDemographics{pids=[5000000217V519385, 500;100716, 666000808, 9E7A;100716]} |
      | syncErrorCount                  | IS_SET                                                                                           |
      #| domainUpdated                   | IS_SET                                                                                           |
#      | lastUpdated                     | IS_SET                                                                                           |   TODO: only one patient demographics entry has a lastUpdated
      | exposure.name                   | No                                                                                               |
      | exposure.uid                    | urn:va:sw-asia:N                                                                                 |
      # according to wiki, this value should be at location 27.02, but this patient did not have a 27.02 location, so not sure where these values are coming from
      | facility.code                   | 500                                                                                              |
      | facility.homeSite               | false                                                                                            |
      | facility.name                   | CAMP MASTER                                                                                      |
      | facility.systemId               | 9E7A                                                                                             |


@f100_2_demographics_vpr_mar @vpr  
Scenario: Client can request demographics in VPR format (marriage, religion, etc.)
   	Given a patient with "demographics" in multiple VistAs
      Given a patient with pid "10105V001065" has been synced through Admin API
	When the client requests demographics for the patient "10105V001065" in VPR format
	Then the client receives 2 VPR "VistA" result(s)
	Then the client receives 1 VPR "panorama" result(s)
    And the VPR results contain:                                             
      | field                            | panorama_value             |
      | uid                              | urn:va:patient:9E7A:231:231|
      | serviceConnected                 | true                       |
      | scPercent                        | 10                         |
      | religionCode                     | urn:va:pat-religion:99     |
      | religionName                     | ROMAN CATHOLIC CHURCH      |
      | familyName                       | FIVE                       |
      | fullName                         | FIVE,PATIENT               |
      | ssn                              | 666000005                  |
      | address.line1                    | Any Street                 |
      | address.line2                    | IS_NOT_SET                 |
      | address.line3                    | IS_NOT_SET                 |
 #     | address.zip                      | 99998-0071                 |
 	  | address.zip                      | 99998	                  |
      | address.city                     | Any Town                   |
      | address.state                    | WV                         |
      | birthDate                        | 19350407                   |
      | genderCode                       | urn:va:pat-gender:M        |
      | genderName                       | Male                       |
      | maritalStatusCode                | urn:va:pat-maritalStatus:S |
      | maritalStatusName                | Never Married              |
      | icn                              | 10105V001065               |
      | localId                          | 231                        |
      | lrdfn                            | 387                        |
      | telecom.value                    | (222)555-8235              |
      | telecom.use                      | H                          |
      | telecom.value                    | (222)555-7720              |
      | telecom.use                      | WP                         |
      | sensitive                        | false                      |
      | contact.typeCode                 | urn:va:pat-contact:NOK     |
      | contact.typeName                 | Next of Kin                |
      | contact.name                     | VETERAN,BROTHER            |
      # UNSURE WHAT VALUES SHOULD BE
      | alias.fullName                   | P5                         |
      | briefId                          | F0005                      |
      | displayName                      | Five,Patient               |
      #| domainUpdated                    | IS_SET                     |
      | exposure.name                    | No                         |
      | exposure.uid                     | urn:va:sw-asia:N           |
      | givenNames                       | PATIENT                    |
      | last4                            | 0005                       |
      | last5                            | F0005                      |
      #| lastUpdated                      | IS_SET                     |
      | pid                              | CONTAINS 231               |
      | summary                          | IS_SET                     |
      | syncErrorCount                   | IS_SET                     |
      # according to wiki, this value should be at location 27.02, but this patient did not have a 27.02 location, so not sure where these values are coming from
      | facility.code                    | 998                        |
      | facility.homeSite                | true                       |
      | facility.localPatientId          | 231                        |
      | facility.name                    | ABILENE (CAA)              |
      | facility.systemId                | 9E7A                       |
      | homeFacility.code                | 998                        |
      | homeFacility.homeSite            | true                       |
      | homeFacility.latestDate          | 20010101                   |
      | homeFacility.name                | ABILENE (CAA)              |

@f100_3_demographics_vpr_sen @vpr
Scenario: Client can request demographics in VPR format for a sensitive patient
   	Given a patient with "demographics" in multiple VistAs
      Given a patient with pid "9E7A;167" has been synced through Admin API
	When the client requests demographics for the patient "9E7A;167" in VPR format
	Then the client receives 1 VPR "VistA" result(s)
	Then the client receives 1 VPR "panorama" result(s)
	And the VPR results contain:                                                   
      | field         | panorama_value            |
      | pid           | CONTAINS 167              |
      | fullName      | ZZZRETIREDONEFIVE,PATIENT |
      | sensitive     | true                      |
      
@f100_4_demographics_vpr1 @vpr
Scenario: Client can request demographics in VPR format (address, gender, etc.)
   	Given a patient with "demographics" in multiple VistAs 
    Given a patient with pid "5000000217V519385" has been synced through Admin API  	
	When the client requests demographics for the patient "5000000217V519385" in VPR format
	Then the client receives 2 VPR "VistA" result(s)
	Then the client receives 1 VPR "kodak" result(s)
	And the VPR results contain:
      | field                           | kodak_value   |
      | uid                             | urn:va:patient:C877:100716:100716                                                                |                                                                                
      | displayName                     | Eight,Inpatient                                                                                  |
      | serviceConnected                | false                                                                                            |
      | scPercent                       | IS_NOT_SET                                                                                       |
      | sensitive                       | false                                                                                       |
      | religionCode                    | IS_NOT_SET                                                                                       |
      | religionName                    | IS_NOT_SET                                                                                       |
      | familyName                      | EIGHT                                                                                            |
      | ssn                             | 666000808                                                                                        |
      | address.line1                   | Any Street                                                                                       |
      | address.line2                   | IS_NOT_SET                                                                                       |
      | address.line3                   | IS_NOT_SET                                                                                       |
      | address.city                    | Any Town                                                                                         |
      | address.zip                     | IS_NOT_SET                                                                                       |
      | addresses.state                 | IS_NOT_SET                                                                                       |
      | birthDate                       | 19450309                                                                                         |
      | givenNames                      | INPATIENT                                                                                        |
      | genderCode                      | urn:va:pat-gender:M                                                                              |
      | genderName                      | Male                                                                                             |
      | icn                             | 5000000217V519385                                                                                |
      | localId                         | 100716                                                                                           |
      | lrdfn                           | IS_NOT_SET                                                                                       |
      | telecom.value                   | IS_NOT_SET                                                                                       |
      | telecom.use                     | IS_NOT_SET                                                                                       |
      | telecom.value                   | IS_NOT_SET                                                                                       |
      | telecom.use                     | IS_NOT_SET                                                                                       |
      # UNSURE WHAT VALUES SHOULD BE
      | briefId                         | E0808                                                                                            |
      | exposure.name                   | No                                                                                               |
      | exposure.uid                    | urn:va:sw-asia:N                                                                                 |
      | facility.localPatientId         | 100716                                                                                           |
      | fullName                        | EIGHT,INPATIENT                                                                                  |
      | last4                           | 0808                                                                                             |
      | last5                           | E0808                                                                                            |
#      | pid                             | C877;100716                                                                                       |   TODO: This is a known bug for multi-site pid handling in JDS (Owners: Les Westberg and Brian Lord)
      | pid                             | CONTAINS 100716                                                                                  |
      #| summary                         | gov.va.cpe.vpr.PatientDemographics{pids=[5000000217V519385, 500;100716, 666000808, 9E7A;100716]} |
      | syncErrorCount                  | IS_SET                                                                                           |
      #| domainUpdated                   | IS_SET                                                                                           |
      #| lastUpdated                     | IS_SET                                                                                           |
      # according to wiki, this value should be at location 27.02, but this patient did not have a 27.02 location, so not sure where these values are coming from
      | facility.code                   | 500                                                                                              |
      | facility.homeSite               | false                                                                                            |
      | facility.name                   | CAMP BEE                                                                                      |
      | facility.systemId               | C877                                                                                             |


@f100_5_demographics_vpr_mar @vpr
Scenario: Client can request demographics in VPR format (marriage, religion, etc.)
   	Given a patient with "demographics" in multiple VistAs
      Given a patient with pid "10105V001065" has been synced through Admin API
	When the client requests demographics for the patient "10105V001065" in VPR format
	Then the client receives 2 VPR "VistA" result(s)
	Then the client receives 1 VPR "kodak" result(s)
    And the VPR results contain:                                             
      | field                            | kodak_value                |
      | serviceConnected                 | true                       |
      | uid								 | urn:va:patient:C877:231:231|
      | scPercent                        | 10                         |
      | sensitive                        | false                      |
      | religionCode                     | urn:va:pat-religion:99     |
      | religionName                     | ROMAN CATHOLIC CHURCH      |
      | familyName                       | FIVE                       |
      | fullName                         | FIVE,PATIENT               |
      | ssn                              | 666000005                  |
      | address.line1                    | Any Street                 |
      | address.line2                    | IS_NOT_SET                 |
      | address.line3                    | IS_NOT_SET                 |
      | address.zip                      | 99998                      |
      | address.city                     | Any Town                   |
      | address.state                    | WV                         |
      | birthDate                        | 19350407                   |
      | genderCode                       | urn:va:pat-gender:M        |
      | genderName                       | Male                       |
      | maritalStatusCode                | urn:va:pat-maritalStatus:S |
      | maritalStatusName                | Never Married              |
      | icn                              | 10105V001065               |
      | localId                          | 231                        |
      | lrdfn                            | 387                        |
      | telecom.value                    | (222)555-8235              |
      | telecom.use                      | H                          |
      | telecom.value                    | (222)555-7720              |
      | telecom.use                      | WP                         |
      | sensitive                        | false                 |
      | contact.typeCode                 | urn:va:pat-contact:NOK     |
      | contact.typeName                 | Next of Kin                |
      | contact.name                     | VETERAN,BROTHER            |
      # UNSURE WHAT VALUES SHOULD BE
      | alias.fullName                   | P5                         |
      | briefId                          | F0005                      |
      | displayName                      | Five,Patient               |
      #| domainUpdated                   | IS_SET                     |
      | exposure.name                    | No                         |
      | exposure.uid                     | urn:va:sw-asia:N           |
      | givenNames                       | PATIENT                    |
      | last4                            | 0005                       |
      | last5                            | F0005                      |
#      | lastUpdated                      | IS_SET                     |
#      | pid                              | C877;231                   |  TODO: This is a known bug for multi-site pid handling in JDS (Owners: Les Westberg and Brian Lord)
      | pid                              | CONTAINS 231               |
      | summary                          | IS_SET                     |
      | syncErrorCount                   | IS_SET                     |
      # according to wiki, this value should be at location 27.02, but this patient did not have a 27.02 location, so not sure where these values are coming from
      | facility.code                    | 998                        |
      | facility.homeSite                | true                       |
      | facility.localPatientId          | 231                        |
      | facility.name                    | ABILENE (CAA)              |
      | facility.systemId                | C877                       |
      | homeFacility.code                | 998                        |
      | homeFacility.homeSite            | true                       |
      | homeFacility.latestDate          | 20010101                   |
      | homeFacility.name                | ABILENE (CAA)              |

# no corresponding sensitive patient in the kodak system.
