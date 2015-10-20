@F333 @getCorrespondingId  @manual @future

Feature: F333 - Global search of patients outside local VistA

# POC: Team Saturn 

@F333-3.1_getCorrespondingId @US4771 @manual
Scenario: Call GetCorrespondingIDs after every search
#The only way to test this user story is by checking for corresponding IDs to be returned from MockMVI. 
#The IDs are DFN, ICN, and EDIPI. None of the patients in MockMVI have all three values.
#The IDs are logged in the RDK output log file. Please verify that the MockMVI patients return IDs when they are loaded to the coversheet.

Then Log into the RDK server by running command: ssh vagrant@10.4.4.105
And Password: vagrant
And Once you're in the RDK terminal execute the command: tail -f /tmp/rdk_output.log
Then Log into eHMP-UI
Then Click the "All Patients" tab at the search patient screen
Then Search for a MockMVI patient. A MockMVI patient can be found in the spreadsheet attach here: https://wiki.vistacore.us/display/VACORE/MVI. 
And Note that DoDOnly,Patient and ICNOnly,Patient will not load to coversheet until US5070 is complete
Then Click confirm selection and look for something like below in the logs. 
Then The DFN and ICN in the log should match the values in the spreadsheet.
Sample Log
[2015-03-03T19:27:39.573Z] DEBUG: res-server/5056 on localhost.localdomain: DFN retrieved: 9E7A;3 (logId=4cb312a8-6511-42d6-ab3b-762a421ff000)
[2015-03-03T19:27:39.573Z] DEBUG: res-server/5056 on localhost.localdomain: DFN retrieved: C877;3 (logId=4cb312a8-6511-42d6-ab3b-762a421ff000)
[2015-03-03T19:27:39.575Z] DEBUG: res-server/5056 on localhost.localdomain: ICN retrieved: 10108V420871 (logId=4cb312a8-6511-42d6-ab3b-762a421ff000)
