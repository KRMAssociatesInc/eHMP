Here are all reporting relating stuff: 
1. reports - finished report templates
2. subreports - subreports 
3. templates - xml templates

Scope:
	1. GLOBAL
	2. PROJECT

SubReport Type     DataSource
---------------------------------------------
PROJECT	           
TESTSUITE          
TESTCASE           ModelItem Properties, Test Properties, Simple Properties, Report Properties, Test Steps, TestCase Requirements, Test Results, Failed Assertions
LOADTEST           ModelItem Properties, Test Properties, Simple Properties, Report Properties, LoadTest Statistics, LoadTest Log

DataSource         Properties         Type
-------------------------------------------------
LoadTestLog        targetStepName     java.lang.String
                   message            java.lang.String
                   timeStamp          java.lang.Long
                   type               java.lang.String

LoadTestStatistics COLUMN_0           java.lang.String
                   ...
                   COLUMN_10          java.lang.String
                   - exposing statistics table with columns:
                   0. color
                   1. TestStep Name
            	   2. min
		           3. max
		           4. avg
		           5. last
		           6. cnt
		           7. bytes
		           8. tps
		           9. bps
		           10. err
		           
TestProperties     property           java.lang.String
				   value			  java.lang.String
				   type				  java.lang.String
				   description		  java.lang.String
				   
TestCaseRequirements   id             java.lang.String
					   name           java.lang.String
					   description    java.lang.String
					   status         java.lang.String
					   details        java.lang.String
					   
TestCaseTestSteps  name				  java.lang.String
				   description        java.lang.String
				   
TestCaseTestStepResults    started    java.lang.String        
	                       timeTaken  java.lang.String        
	                       order      java.lang.String        
	                       name       java.lang.String        
	                       message    java.lang.String        