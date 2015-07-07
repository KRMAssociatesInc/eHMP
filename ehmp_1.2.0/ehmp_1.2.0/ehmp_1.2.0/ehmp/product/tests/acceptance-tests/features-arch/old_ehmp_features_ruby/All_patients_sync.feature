@All_sync @future
Feature: sync all patients that have been used for test


@sync_all_list
Scenario: Check sync request is stable
	Given the patient(s) with pid
      | pid                |
	  | 1006184063V088473  |
	  | 10101V964144	   |
      | 10104V248233       |
      | 10105V001065       |
      | 10106V187557       |
      | 10107V395912       |
      | 10108V420871       |
      | 10110V004877       |
      | 10117V810068       |
      | 10118V572553       |
      | 10146V393772       |
      | 10180V273016       |
      | 10199V865898       |
      | 11016V630869       |
      | 5000000009V082878  |
      | 5000000116V912836  |
      | 5000000217V519385  |
      | 5123456789V027402  |
      | 9E7A;1             |
      | 9E7A;100022        |
      | 9E7A;100033        |
      | 9E7A;100084        |
      | 9E7A;100184        |
      | 9E7A;11            |
      | 9E7A;129           |
      | 9E7A;13            |
      | 9E7A;164           |
      | 9E7A;167           |
      | 9E7A;17            |
      | 9E7A;21            |
      | 9E7A;35            |
      | 9E7A;4             |
      | 9E7A;50            |
      | 9E7A;6             |
      | 9E7A;71            |
      | 9E7A;737           |
      | C877;1             |
      | C877;100022        |
      | 100031V310296      |
      | C877;100184        |
      | C877;129           |
      | C877;164           |
      | C877;167           |
      | C877;17            |
      | C877;21            |
      | C877;6             |
      | C877;737           |

      
	Given select patient(s) from above pid that have not been synced
	When the client requests sync for a patient with above pid every 20 second
	Then the patient(s) with above pid should sync within 10 minute

	  
