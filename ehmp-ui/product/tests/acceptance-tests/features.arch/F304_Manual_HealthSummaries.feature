#@manual
#Team Orion
# This test is being moved to archive.
# Manual test is defined in functional test UAT_1.2_VistA Health Summaries Applet
Feature: F304 - Health Summaries (VistA Web Health Exchange)

@US4748_kodak @manual
Scenario: Make a RDK endpoint request call when primary site Panorama is down
	Given running script "bundle exec cucumber -t @US4748"
	And stop virtual machine Panoram "gradle stoppanorama" EHMP VM
	Then the list of primary sites Kodak returned

@US4748_panorama @manual
Scenario: Make a RDK endpoint request call when primary site Kodak is down
	Given running script "bundle exec cucumber -t @US4748"
	And stop virtual machine Panoram "gradle stopkodak" in EHMP VM
	Then the list of primary sites Panorama returned

@US4750_panorama @manual
Scenario: Make a RDK endpoint request call when primary site Kodak is down
	Given running script "bundle exec cucumber -t @US4750"
	And stop virtual machine Panoram "gradle stopkodak" EHMP VM
	Then the list of primary sites Panorama returned

@US4750_kadak @manual
Scenario: Make a RDK endpoint request call when primary site Panorama is down
	Given running script "bundle exec cucumber -t @US4750"
	And stop virtual machine Panoram "gradle stoppanorama" EHMP VM
	Then the list of primary sites Kodak returned