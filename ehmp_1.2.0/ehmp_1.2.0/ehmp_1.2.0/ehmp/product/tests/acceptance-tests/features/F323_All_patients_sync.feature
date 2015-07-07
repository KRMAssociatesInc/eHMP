@All_sync @future
Feature: sync all patients that have been used for test
#This is just onetime test and it should not be run in CI pipeline  

@sync_all_list
Scenario: Check sync request is stable
	Given the patient(s) with pid
      | pid                | site_name 			|
	  | 1006184063V088473  | 9E7A;C877;VLER;HDR	|
	  | 10101V964144	   | 9E7A;C877;VLER;HDR	|
      | 10104V248233       | 9E7A;C877;VLER;HDR	|
      | 10105V001065       | 9E7A;C877;VLER;HDR	|
      | 10106V187557       | 9E7A;C877;VLER;HDR	|
      | 10107V395912       | 9E7A;C877;VLER;HDR	|
      | 10108V420871       | 9E7A;C877;DoD;VLER;HDR	|
      | 10110V004877       | 9E7A;C877;DoD;VLER;HDR	|
      | 10117V810068       | 9E7A;C877;VLER;HDR	|
      | 10118V572553       | 9E7A;C877;VLER;HDR	|
      | 10146V393772       | 9E7A;C877;VLER;HDR	|
      | 10180V273016       | 9E7A;C877;VLER;HDR	|
      | 10199V865898       | 9E7A;C877;VLER;HDR	|
      | 11016V630869       | 9E7A;C877;DoD;VLER;HDR	|
      | 5000000009V082878  | 9E7A;C877;VLER;HDR	|
      | 5000000116V912836  | 9E7A;C877;DoD;VLER;HDR	|
      | 5000000217V519385  | 9E7A;C877;DoD;VLER;HDR	|
      | 5000000341V359724  | 9E7A;C877;DoD;VLER;HDR	|
      | 5123456789V027402  | 9E7A;C877;VLER;HDR	|
      | 100031V310296      | C877;VLER;HDR	|
      | 9E7A;1             | 9E7A |
      | 9E7A;100033        | 9E7A |
      | 9E7A;100084        | 9E7A |
      | 9E7A;100184        | 9E7A |
      | 9E7A;11            | 9E7A |
      | 9E7A;129           | 9E7A |
      | 9E7A;13            | 9E7A |
      | 9E7A;164           | 9E7A |
      | 9E7A;167           | 9E7A |
      | 9E7A;17            | 9E7A |
      | 9E7A;21            | 9E7A |
      | 9E7A;35            | 9E7A |
      | 9E7A;4             | 9E7A |
      | 9E7A;50            | 9E7A |
      | 9E7A;6             | 9E7A |
      | 9E7A;71            | 9E7A |
      | 9E7A;737           | 9E7A |
      | C877;1             | C877 |
      | C877;100184        | C877 |
      | C877;129           | C877 |
      | C877;164           | C877 |
      | C877;167           | C877 |
      | C877;17            | C877 |
      | C877;21            | C877 |
      | C877;6             | C877 |
      | C877;737           | C877 |

      
	Given select patient(s) from above pid that have not been synced
	When the client requests sync for a patient with above pid every 2 second
	Then the patient(s) with above pid should sync

#it will take 35 min to synnc all patients
@sync_all_list1
Scenario: Check sync request is stable
	Given the patient(s) with pid
      | pid               | site_name 			   |
     #| 10104V248233      | 9E7A;C877;VLER;HDR 	   |
     #| 10108V420871      | 9E7A;C877;DoD;VLER;HDR |
      | 10101V964144      | 9E7A;C877;VLER;HDR     |
      | 10102V813496      | 9E7A;C877;VLER;HDR     |
      | 10105V001065      | 9E7A;C877;VLER;HDR     |
      | 10107V395912      | 9E7A;C877;VLER;HDR     |
      | 10110V004877      | 9E7A;C877;DoD;VLER;HDR |
      | 10112V399621      | 9E7A;C877;VLER;HDR     |
      | 10113V428140      | 9E7A;C877;VLER;HDR     |
      | 10114V651499      | 9E7A;C877;VLER;HDR     |
      | 10117V810068      | 9E7A;C877;VLER;HDR     |
      | 10118V572553      | 9E7A;C877;VLER;HDR     |
      | 10119V246915      | 9E7A;C877;VLER;HDR     |
      | 10123V057919      | 9E7A;C877;VLER;HDR     |
      | 10146V393772      | 9E7A;C877;VLER;HDR     |
      | 10181V049578      | 9E7A;C877;VLER;HDR     |
      | 10132V467385      | 9E7A;C877;VLER;HDR     |
      | 10199V865898      | 9E7A;C877;VLER;HDR     |
      | 11000V221996      | 9E7A;C877;VLER;HDR     |
      | 11010V543403      | 9E7A;C877;VLER;HDR     |
      | 11016V630869      | 9E7A;C877;DoD;VLER;HDR |
      | 5000000318V495398 | 9E7A;C877;VLER;HDR     |
      | 5000000009V082878 | 9E7A;C877;VLER;HDR     |
      | 5000000116V912836 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000217V519385 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000317V387446 | 9E7A;C877;VLER;HDR     |
      | 5000000341V359724 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000339V988748 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000327V828570 | 9E7A;C877;VLER;HDR 	   |
      | 5000000232V962263 | 9E7A;C877;VLER;HDR 	   |
      | 9E7A;1            | 9E7A                   |
      | 9E7A;9            | 9E7A                   |
      | 9E7A;20           | 9E7A                   |
      | 9E7A;100184       | 9E7A                   |
      | 9E7A;230          | 9E7A                   |
      | 9E7A;287          | 9E7A                   |
      | 9E7A;737          | 9E7A                   |
      | 9E7A;100599       | 9E7A                   |
      | 9E7A;164          | 9E7A                   |
      | 9E7A;167          | 9E7A                   |
      | 9E7A;71           | 9E7A                   |
      | 9E7A;631          | 9E7A                   |
      | C877;1            | C877                   |
      | C877;9            | C877                   |
      | C877;164          | C877                   |
      | C877;287          | C877                   |
      | C877;631          | C877                   |
      | C877;737          | C877                   |
      | C877;100184       | C877                   |
      | C877;100599       | C877                   |
      
	Given select patient(s) from above pid that have not been synced
	When the client requests sync for a patient with above pid every 2 second
	Then the patient(s) with above pid should sync
	
	
@sync_all_list2
Scenario: Check sync request is stable
	Given the patient(s) with pid
      | pid               | site_name 			   |
      | 9E7A;1            | 9E7A                   |
      | 9E7A;9            | 9E7A                   |
      | 9E7A;20           | 9E7A                   |
      | 9E7A;100184       | 9E7A                   |
      | 9E7A;230          | 9E7A                   |
      | 9E7A;287          | 9E7A                   |
      | 9E7A;737          | 9E7A                   |
      | 9E7A;100599       | 9E7A                   |
      | 9E7A;164          | 9E7A                   |
      | 9E7A;167          | 9E7A                   |
      | 9E7A;71           | 9E7A                   |
      | 9E7A;631          | 9E7A                   |
      | C877;1            | C877                   |
      | C877;9            | C877                   |
      | C877;164          | C877                   |
      | C877;287          | C877                   |
      | C877;631          | C877                   |
      | C877;737          | C877                   |
      | C877;100184       | C877                   |
      | C877;100599       | C877                   |
      
	Given select patient(s) from above pid that have not been synced
	When the client requests sync for a patient with above pid every 10 second
	Then the patient(s) with above pid should sync	
	
	
	
@sync_all_list3
Scenario: Check sync request is stable
	Given the patient(s) with pid
      | pid               | site_name 			   |
     #| 10104V248233      | 9E7A;C877;VLER;HDR 	   |
     #| 10108V420871      | 9E7A;C877;DoD;VLER;HDR |
      | 10101V964144      | 9E7A;C877;VLER;HDR     |
      | 10102V813496      | 9E7A;C877;VLER;HDR     |
      | 10105V001065      | 9E7A;C877;VLER;HDR     |
      | 10107V395912      | 9E7A;C877;VLER;HDR     |
      | 10110V004877      | 9E7A;C877;DoD;VLER;HDR |
      | 10112V399621      | 9E7A;C877;VLER;HDR     |
      | 10113V428140      | 9E7A;C877;VLER;HDR     |
      | 10114V651499      | 9E7A;C877;VLER;HDR     |
      | 10117V810068      | 9E7A;C877;VLER;HDR     |
      | 10118V572553      | 9E7A;C877;VLER;HDR     |
      | 10119V246915      | 9E7A;C877;VLER;HDR     |
      | 10123V057919      | 9E7A;C877;VLER;HDR     |
      | 10146V393772      | 9E7A;C877;VLER;HDR     |
      | 10181V049578      | 9E7A;C877;VLER;HDR     |
      | 10132V467385      | 9E7A;C877;VLER;HDR     |
      | 10199V865898      | 9E7A;C877;VLER;HDR     |
      | 11000V221996      | 9E7A;C877;VLER;HDR     |
      | 11010V543403      | 9E7A;C877;VLER;HDR     |
      | 11016V630869      | 9E7A;C877;DoD;VLER;HDR |
      | 5000000318V495398 | 9E7A;C877;VLER;HDR     |
      | 5000000009V082878 | 9E7A;C877;VLER;HDR     |
      | 5000000116V912836 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000217V519385 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000317V387446 | 9E7A;C877;VLER;HDR     |
      | 5000000341V359724 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000339V988748 | 9E7A;C877;DoD;VLER;HDR |
      | 5000000327V828570 | 9E7A;C877;VLER;HDR 	   |
      | 5000000232V962263 | 9E7A;C877;VLER;HDR 	   |
      
	Given select patient(s) from above pid that have not been synced
	When the client requests sync for a patient with above pid every 10 second
	Then the patient(s) with above pid should sync  
