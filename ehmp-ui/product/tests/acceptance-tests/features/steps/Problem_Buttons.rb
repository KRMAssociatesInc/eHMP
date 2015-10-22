path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

class ProblemDOD < AccessBrowserV2
  include Singleton
  def initialize
    super
    
    #add_action(CucumberLabel.new("Problem Applet max"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='left']/div/div/div[1]/span[2]/span[4]/span/button"))
    add_action(CucumberLabel.new("Problem Applet max"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .applet-maximize-button"))
    add_action(CucumberLabel.new("Problem Applet min"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .applet-minimize-button"))

    add_action(CucumberLabel.new("Non DOD Record"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='urn-va-problem-9E7A-3-627']/td[7]"))
    #add_action(CucumberLabel.new("Close Applet"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='modal-header']/div/div/div/div[2]/button[3]"))
    add_action(CucumberLabel.new("DOD Record"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn-va-problem-DOD-0000000003-1000000523']/td[7]"))
    add_verify(CucumberLabel.new("Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='problems-acuityName']/a"))
    add_verify(CucumberLabel.new("Remove"), VerifyContainsText.new, AccessHtmlElement.new(:id, "deleteBtn"))
    add_verify(CucumberLabel.new("Edit"), VerifyContainsText.new, AccessHtmlElement.new(:id, "editBtn"))
    add_verify(CucumberLabel.new("Encounter Location"), VerifyContainsText.new, AccessHtmlElement.new(:id, "selectedInfo"))
    add_action(CucumberLabel.new("Hospital Admissions"), ClickAction.new, AccessHtmlElement.new(:id, "visit-tab-admits"))
    add_action(CucumberLabel.new("New Visit"), ClickAction.new, AccessHtmlElement.new(:id, "visit-tab-new"))
  end
end

Then(/^the Problem applet is expanded$/) do
  # we know the applet is expanded when there is a. a minimize button and b. there is no maximize button
  problem_accessor = ProblemDOD.instance
  expect(problem_accessor.wait_until_element_present('Problem Applet min')).to be_true
  expect(problem_accessor.static_dom_element_exists?('Problem Applet max')).to be_false
end

#//*[@id="left"]/div/div/div[1]/span[2]/span[4]/span/button
When(/^the user clicks on the expand view of Problem Applet$/) do
  #TestSupport.driver.manage.window.maximize
  con = ProblemDOD.instance
  driver = TestSupport.driver
  #con.wait_until_action_element_visible("Acuity", 120)
  #expect(con.static_dom_element_exists?("Problem Applet max")).to be_true
  expect(con.perform_action("Problem Applet max", "")).to be_true
end

When(/^the user clicks on DOD patients$/) do
  con = ProblemDOD.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("DOD Record", 120)
  expect(con.static_dom_element_exists?("DOD Record")).to be_true
  con.perform_action("DOD Record", "")
  
end

Then(/^Add\/Edit\/Remove buttons are not present$/) do
  con = ProblemDOD.instance
  expect(con.static_dom_element_exists?("Remove")).to be_false
  expect(con.static_dom_element_exists?("Edit")).to be_false
  #con.perform_action("Close Applet", "")
end

When(/^the user clicks on non DOD patient$/) do
  con = ProblemDOD.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Non DOD Record", 120)
  expect(con.static_dom_element_exists?("Non DOD Record")).to be_true
  con.perform_action("Non DOD Record", "")
end

Then(/^Add\/Edit\/Remove buttons are present$/) do
  con = ProblemDOD.instance
  expect(con.static_dom_element_exists?("Remove")).to be_true
  expect(con.static_dom_element_exists?("Edit")).to be_true
  #con.perform_action("Close Applet", "")
end
