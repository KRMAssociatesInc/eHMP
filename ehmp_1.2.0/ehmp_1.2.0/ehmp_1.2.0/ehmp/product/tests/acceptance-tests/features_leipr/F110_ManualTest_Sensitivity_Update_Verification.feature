@debug @manual
Feature: F110 Sensitivity Update Verification

#This feature requires that when a patient's sensitivity flag changes in VistA after the operational data sync, that change will propagate to JDS.

Scenario: Patient with data on only one VistA (sensitive to non-sensitive)
Given a sensitive patient with data on only one VistA
And the operational data sync has completed
When that patient's sensitivity flag changes in VistA to non-sensitive
Then the user can retrieve patient data without breaking the glass

Scenario: Patient with data on only one VistA (non-sensitive to sensitive)
Given a non-sensitive patient with data on only one VistA
And the operational data sync has completed
When that patient's sensitivity flag changes in VistA to sensitive
Then the user can retrieve patient data only by first breaking the glass

Scenario: Patient with data on multiple VistAs (sensitive to non-sensitive)
Given a sensitive patient with data on multiple VistAs
And the operational data sync has completed
When that patient's sensitivity flag changes in the primary VistA to non-sensitive
Then the user can retrieve patient data without breaking the glass

Scenario: Patient with data on multiple VistAs (non-sensitive to sensitive)
Given a non-sensitive patient with data on multiple VistAs
And the operational data sync has completed
When that patient's sensitivity flag changes in the primary VistA to sensitive
Then the user can retrieve patient data only by first breaking the glass


# Please follow the steps on the below wiki page to perform the manual test:

# List of sensitive patients that been used to change to non-sensitive is: 9E7A;1,  9E7A;167, 9E7A;35, and 5123456789V027402

# List of non-sensitive patients that been used to change to sensitive is: 9E7A;129, 9E7A;11

# https://wiki.vistacore.us/display/VACORE/Manual+Verification+of+Sensitive+Status+Update

# Notes
# There are two test scenarios. The first tests a patient with data on one VistA, while the second tests a patient with data # on multiple VistAs.
# The two tests can be run in parallel; steps 1-13 of the second test can be performed during the 10 minute wait required by # step 13 of the first test, 
# and steps 14-24 of the second test can be performed during the 10 minute wait required by step 24 of the first test.

# Patient with data on only one VistA

# After running acceptance tests:

# Sync the patient https://10.3.3.5/admin/sync/9E7A;1
# Verify that https://10.3.3.5/vpr/9E7A;1 results in a 307 (Temporary Redirect) response.
# Verify that https://10.3.3.5/vpr/9E7A;1?_ack=true results in a 200 (OK) response and that the JSON demographics data contains a field named "sensitive" with a value of true.
# cd ~/Projects/vistacore/ehmp/infrastructure/vagrant/virtualbox/vista-exchange
# vagrant ssh vista-panorama
# sudo csession cache
# ZNSPACE "VISTA"
# K FDA
# S FDA(1,38.1,"1,",2)=0  where "1," is localPatientId. Set the flag to false.
# S FDA(1,2,"1,",.361)=7  where "1," is localPatientId. Set the flag to false.
# D UPDATE^DIE(,"FDA(1)")
# h
# exit
# Wait at least 10 minutes.
# Verify that https://10.3.3.5/vpr/9E7A;1 results in a 200 (OK) response and that the JSON demographics data contains a field named "sensitive" with a value of false.
# vagrant ssh vista-panorama
# sudo csession cache
# ZNSPACE "VISTA"
# K FDA
# S FDA(1,38.1,"1,",2)=1  where "1," is localPatientId. Set the flag to true.
# S FDA(1,2,"1,",.361)=6  where "1," is localPatientId. Set the flag to true.
# D UPDATE^DIE(,"FDA(1)")
# h
# exit
# Wait at least 10 minutes.
# Verify that https://10.3.3.5/vpr/9E7A;1 results in a 307 (Temporary Redirect) response.
# Verify that https://10.3.3.5/vpr/9E7A;1?_ack=true results in a 200 (OK) response and that the JSON demographics data contains a field named "sensitive" with a value of true.

# Patient with data on multiple VistAs

# After running acceptance tests:

# Sync the patient https://10.3.3.5/admin/sync/5123456789V027402
# Verify that https://10.3.3.5/vpr/5123456789V027402 results in a 307 (Temporary Redirect) response.
# Verify that https://10.3.3.5/vpr/5123456789V027402?_ack=true results in a 200 (OK) response, that the JSON demographics data contains two records, that the first record has the fields "uid": "urn:va:patient:9E7A:18:18" and "sensitive": true, and that the second record has the fields "uid": "urn:va:patient:C877:18:18" and "sensitive": false.
# cd ~/Projects/vistacore/ehmp/infrastructure/vagrant/virtualbox/vista-exchange
# vagrant ssh vista-panorama
# sudo csession cache
# ZNSPACE "VISTA"
# K FDA
# S FDA(1,38.1,"18,",2)=0  where "18," is localPatientId.
# S FDA(1,2,"18,",.361)=7  where "18," is localPatientId.
# D UPDATE^DIE(,”FDA(1)”)
# h
# exit
# Wait at least 10 minutes.
# Verify that https://10.3.3.5/vpr/5123456789V027402 results in a 200 (OK) response, that the JSON demographics data contains two records, that the first record has the fields "uid": "urn:va:patient:9E7A:18:18" and "sensitive": false, and that the second record has the fields "uid": "urn:va:patient:C877:18:18" and "sensitive": false.
# vagrant ssh vista-panorama
# sudo csession cache
# ZNSPACE "VISTA"
# K FDA
# S FDA(1,38.1,"18,",2)=1  where "18," is localPatientId.
# S FDA(1,2,"18,",.361)=6  where "18," is localPatientId.
# D UPDATE^DIE(,"FDA(1)")
# h
# exit
# Wait at least 10 minutes.
# Verify that https://10.3.3.5/vpr/5123456789V027402 results in a 307 (Temporary Redirect) response.
# Verify that https://10.3.3.5/vpr/5123456789V027402?_ack=true results in a 200 (OK) response, that the JSON demographics data contains two records, that the first record has the fields "uid": "urn:va:patient:9E7A:18:18" and "sensitive": true, and that the second record has the fields "uid": "urn:va:patient:C877:18:18" and "sensitive": false.

# Starting with a non-sensitive patient

# The above commands will only work if the patient is originally "sensitive". If the patient starts out as non-sensitive, 
# the command S FDA(1,38.1,"localPatientId,",2)=1 will not work, because the patient needs to have an entry in a security 
# file within VistA, and the non-sensitive patients, by default, have no entry in that file (not an entry saying "non-sensitive"). 
# To properly change a non-sensitive patient (for example, localPatientId=11) to sensitive:

# Sync the patient https://10.3.3.5/admin/sync/9E7A;11
# Verify that https://10.3.3.5/vpr/9E7A;11 results in a 200 (OK) 
# cd ~/Projects/vistacore/ehmp/infrastructure/vagrant/virtualbox/vista-exchange
# vagrant ssh vista-panorama
# sudo csession cache
# ZNSPACE "VISTA"
# Open VA FileMan by typing D P^DI
# Enter bsl123 at the Access Code: prompt. (That's BSL123, but with lowercase letters.)
# At the Select OPTION: prompt, type ENTER (after pressing return, FileMan will auto-complete that as ENTER OR EDIT FILE ENTRIES
# At the INPUT TO WHAT FILE: prompt, enter 38.1
# At the EDIT WHICH FIELD: prompt, enter SEC, then enter 2 when it asks you to CHOOSE 1-3:
# Enter a blank line (i.e., just press return) at the THEN EDIT FIELD: prompt.
# At the Select DG SECURITY LOG PATIENT NAME: prompt, type `11 (The character before the numbers is the character you get by pressing the tilde key without holding Shift.)
# When it asks if you want to add a new DG SECURITY LOG? enter Yes
# At the SECURITY LEVEL: prompt, enter SENSITIVE
# Enter two blank lines (i.e., press return twice) to leave the FileMan session, skipping past the Select DG SECURITY LOG PATIENT NAME: and Select OPTION: prompts. This should put you back at a VISTA> prompt. You can then do the other half of the edit as follows:
# K FDA
# S FDA(1,2,"11,",.361)=6
# D UPDATE^DIE(,"FDA(1)")
# h
# exit
# Wait at least 10 minutes.
# Verify that https://10.3.3.5/vpr/9E7A;11 results in a 307 (Temporary Redirect) response.
