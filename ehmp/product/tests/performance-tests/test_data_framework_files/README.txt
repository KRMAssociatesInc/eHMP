These files make up the Test Data Framework
Date: July 14, 2014 

NOTE:  They are not part of a build and require the Forgery gem.  Forgery related files must be placed in the correct folders after the gem is installed. Run using "ruby main_testdataframework.rb"

A description for each file in this folder follows:

This file creates a new object with dynamically generated methods that can be used to create test data (json files).  
- framework_obj.rb 

These files create new json files by reading an existing json file and parsing it.  They use Forgery to randomly populate the json elements.  The type of JSON file created (e.g., Allergies or Vitals) is determined by the value of the domain_type parameter. 
- create_vitals_json.rb
- create_allergies_json.rb

Existing json files parsed by create json 
- 100022_Allergy_20140108_1611.json
- 100022_Vitals_20131105_0801.json

Forgery Dictionary files.  Forgery randomly pulls data elements from these files to populate the JSON. They contain data from mump, except patientIEN. PatientIENs are test patients.  
- allergies
- vitals
- patientIEN

Custom forgery class 
- patientrecord.rb 
*******************************************************************************************************************************
Update: July 28, 2014
import_panorama_allergymultisymp_fw.rb - should be run separately to create a new allergy record in a VistA Instance (panorama)


