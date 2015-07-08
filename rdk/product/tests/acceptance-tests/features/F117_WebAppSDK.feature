@US1123 @vxsync @enrich
Feature: create a web application to be used as point-of-care healthcare application

@US1123_oneresponse
Scenario: Search for existing patient by full name through RDK
	When the client performs a fullName search through RDK API with search term "Eight,Imagepatient"
	Then a successful response is returned
	And the client receives 1 RDK VistA result(s)
	And the RDK search results contain
	|field 			| value 			  |
	|displayName 	| Eight,Imagepatient  |
	|genderCode 	| urn:va:pat-gender:M |
	
@US1123_oneresponse_summary
Scenario: Search for existing patient by full name through RDK
	When the client performs a fullName summary search through RDK API with search term "Eight,Imagepatient"
	Then a successful response is returned
	And the client receives 1 RDK VistA result(s)
	And the RDK search results contain
	  | field       | value                             |
      | displayName | Eight,Imagepatient                |
      | birthDate   | 19530415                          |
      | familyName  | EIGHT                             |
      | genderName  | Male                              |
      | givenNames  | IMAGEPATIENT                      |
      | icn         | 5000000317V387446                 |
      | pid         | 9E7A;100816                       |
      | ssn         |  *****1008                         |
      | uid         | CONTAINS urn:va:pt-select:9E7A:100816 |


@US1123_zeroreponses
Scenario: Search for non-existing patient by name through RDK
	When the client performs a fullName search through RDK API with search term "Nonexist,Patient"
	Then a successful response is returned
	And the client receives 0 RDK VistA result(s)

@US1123_zeroreponses_summary
Scenario: Search for non-existing patient by name through RDK
	When the client performs a fullName summary search through RDK API with search term "Nonexist,Patient"
	Then a successful response is returned
	And the client receives 0 RDK VistA result(s)
	
@US1123_partialname
Scenario: Search for multiple patients by name through RDK
	When the client performs a fullName search through RDK API with search term "Seven"
	Then a successful response is returned
	And the client receives 38 RDK VistA result(s)
	And the RDK search results contain 
		|displayName|"Seven,Imagepatient"|
	And the RDK search results contain 
		|displayName|"Sevn,Patient"|
	
@US1123_partialname_summary
Scenario: Search for multiple patients by name through RDK
	When the client performs a fullName summary search through RDK API with search term "Seven"
	Then a successful response is returned
	And the client receives 38 RDK VistA result(s)
	And the RDK results contain the substring "Seven,Imagepatient"
	And the RDK results contain the substring "Seven,Patient"
	
@US1123_casecheck
Scenario: Search for multiple patients by name through RDK
	When the client performs a fullName search through RDK API with search term "SEVEN,PATIENT"
	Then a successful response is returned
	And the client receives 1 RDK VistA result(s)
	And the RDK results contain the substring "Seven,Patient"
	When the client performs a fullName search through RDK API with search term "seven,patient"
	Then a successful response is returned
	And the client receives 1 RDK VistA result(s)
	And the RDK results contain the substring "Seven,Patient"
	
@US1123_casecheck_summary
Scenario: Search for multiple patients by name through RDK
	When the client performs a fullName summary search through RDK API with search term "SEVEN,PATIENT"
	Then a successful response is returned
	And the client receives 1 RDK VistA result(s)
	And the RDK results contain the substring "Seven,Patient"
	When the client performs a fullName search through RDK API with search term "seven,patient"
	Then a successful response is returned
	And the client receives 1 RDK VistA result(s)
	And the RDK results contain the substring "Seven,Patient"
	
@US1123_startIndex
Scenario: Search for patients and set the start index
	When the client performs a fullName search through RDK API with search term "Seven" and the startIndex 10
	Then a successful response is returned
	And the client receives 38 RDK VistA result(s)
	#And the RDK results contain 10 items per page
	#And the RDS results contain 8 total pages

@US1123_startIndex_summary
Scenario: Search for patients and set the start index
	When the client performs a fullName summary search through RDK API with search term "Seven" and the startIndex 10
	Then a successful response is returned
	And the client receives 38 RDK VistA result(s)
	#And the RDK results contain 10 items per page
	#And the RDS results contain 8 total pages
	
@US1123_limit
Scenario: Search for patients and set the limit
	When the client performs a fullName search through RDK API with search term "Seven" and the limit 2
	Then a successful response is returned
	And the client receives 38 RDK VistA result(s)
	And the RDK results contain 2 items per page
	And the RDS results contain 19 total pages
	
@US1123_limit_summary
Scenario: Search for patients and set the limit
	When the client performs a fullName  summary search through RDK API with search term "Seven" and the limit 2
	Then a successful response is returned
	And the client receives 38 RDK VistA result(s)
	And the RDK results contain 2 items per page
	And the RDS results contain 19 total pages

	