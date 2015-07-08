@debug @manual
Feature: F108 Appointment Trigger

#This feature synchs patient data at the time an appointment is created.

Scenario: Patient's data is synched at the time an appointment is created in VistA
Given a patient with data in VistA
When an appointment is created for that patient in VistA
Then the patient's data will be synched


# Please follow the steps on the below wiki page to perform the manual test:

# https://wiki.vistacore.us/display/VACORE/VistA+Appointment+Trigger+Testing

# 1.	Un-sync a patient.
# 2.	Insert an appointment as per the instructions for the patient.
# 3.	Verify that the patient has synchronized automatically (Note that this can take 3-5 minutes).


# Appointment instructions

# cd ~/Projects/vistacore/ehmp/infrastructure/vagrant/virtualbox/vista-exchange/

# $vagrant ssh vista-panorama

# $ sudo csession cache


# USER>zn "vista"

# VISTA>S DUZ=1 D ^XUP

# Select OPTION NAME: SDM 
# 1.	1  SDM Make Appointment 
# 2.	2  SDMGR Scheduling Manager's Menu 
# 3.	3  SDMULTIBOOK 
# 4.	4  SDMULTICLINIC 
# CHOOSE 1-4: 1

# Select CLINIC: AUDIOLOGY

# Select PATIENT NAME: BC
# CHOOSE 1-4:1
# APPOINTMENT TYPE: REGULAR//     <click on enter>
# Select ETHNICITY:		<click on enter>
# Select RACE:					<click on enter>
# COUNTRY: UNITED STATES//			<click on enter>
# STREET ADDRESS [LINE 1]:	<click on enter>
# ZIP+4:						<click on enter>
# PHONE NUMBER [RESIDENCE]: 	<click on enter>
# PHONE NUMBER [WORK]: 			<click on enter>
# BAD ADDRESS INDICATOR:		<click on enter>
# Are you sure that you want to save the above changes? Y
# Press ENTER to continue:	<click on enter>
# IS THIS A 'NEXT AVAILABLE' APPOINTMENT REQUEST? YES 
# This will be Display 
# AUDIOLOGY
#                                     Sep 2014

#  TIME  |8      |9      |10     |11     |12     |1      |2      |3      |4      
#  DATE  |       |       |       |       |       |       |       |       |
# TH 04  [1] [1] [1] [1] [1] [1] [1] [1] |       [1] [1] [1] 
# FR 05  [1] [1] [1] [1] [0] [1] [1] [1] [1] [1] [1] [1] 
# WE 10  [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] 
# TH 11  [1] [1] [1] [1] [1] [1] [1] [1] |       [1] [1] [1] 
# FR 12  [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] 
# WE 17  [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] 
# TH 18  [1] [1] [1] [1] [1] [1] [1] [1] |       [1] [1] [1] 
# FR 19  [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] 
# WE 24  [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] 
# TH 25  [1] [1] [1] [1] [1] [1] [1] [1] |       [1] [1] [1] 
# FR 26  [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] 
#                                     Oct 2014
# WE 01  [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] [1] 
# TH 02  [1] [1] [1] [1] [1] [1] [1] [1] |       [1] [1] [1] 

# 30 MINUTE APPOINTMENTS 
# [1] free time

# DATE/TIME: T+1@08 (AUG 21, 2014@08:00) 
# 30-MINUTE APPOINTMENT MADE 
# THIS APPOINTMENT IS MARKED AS 'NEXT AVAILABLE', IS THIS CORRECT? YES// 
# WANT PATIENT NOTIFIED OF LAB,X-RAY, OR EKG STOPS? No// (No) OTHER INFO: TEST HM TRIGGER APPOINTMENT 
# WANT PREVIOUS X-RAY RESULTS SENT TO CLINIC? No// (No) 
# Control+C
# VISTA 6d2>h
# [vagrant@localhost ~]$ exit
