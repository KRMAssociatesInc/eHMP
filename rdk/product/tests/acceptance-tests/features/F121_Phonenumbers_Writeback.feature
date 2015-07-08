@US1984 @future @onc
Feature: F121 - Demographics (write-back)

#The Demographics capability for this feature will allow all exposed phone numbers to be edited and saved.  All other changes to demographic data 
#will take place via the VA's registration software OR via a patient portal functionality as determined by the VA.  

@US1984_save_All_valid_pid
Scenario: Updating the phone numbers in VPR format from RDK for a vlaid pid
        Given a patient with pid "9E7A;3" has been synced through the RDK API
        When the client saves homephone | CellPhone | WorkPhone | EmergencyPhone | KinPhone  "8586050836|8581111234|3453453456|8788786789|6783451234" for the patient "9E7A;20" in RDK format 
        Then a  temporary Not implemented response is returned
    

@US1984_save_All_Invalid_pid
Scenario: Updating the phone numbers in VPR format from RDK for a invlaid pid
        When the client saves homephone | CellPhone | WorkPhone | EmergencyPhone | KinPhone  "8586050836|8581111234|3453453456|8788786789|6783451234" for the patient "BADPID" in RDK format 
        Then a Not found response is returned
