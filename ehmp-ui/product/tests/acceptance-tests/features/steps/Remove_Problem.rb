path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

class ProblemRemove < AccessBrowserV2
  include Singleton
  def initialize
    super
    #add_action(CucumberLabel.new("Chestpain_problem"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn-va-problem-ABCD-17-58']/td[1]"))
    add_action(CucumberLabel.new("Chronic Systolic Heart failure"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn-va-problem-9E7A-3-323']/td[2]"))
    add_action(CucumberLabel.new("Remove"), ClickAction.new, AccessHtmlElement.new(:id, "deleteBtn"))
    add_action(CucumberLabel.new("comments"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "reason"))
    add_action(CucumberLabel.new("Audiology"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:appointment:9E7A:3:A;3000525.113;64']"))
  end
end

When(/^user clicks on Chronic Systolic Heart failure$/) do
  con = ProblemRemove.instance
  con.wait_until_action_element_visible("Chronic Systolic Heart failure", 120)
  con.perform_action("Chronic Systolic Heart failure")
end

Then(/^the user selects "(.*?)" for location$/) do |_arg1|
  con = ProblemRemove.instance
  con.wait_until_action_element_visible("Audiology", 120)
  con.perform_action("Audiology")
end

Then(/^user enters comments "(.*?)"$/) do |arg1|
  con = ProblemRemove.instance
  con.wait_until_action_element_visible("comments", 120)
  con.perform_action("comments", arg1)
end

Then(/^problem is removed from problem list$/) do
  con = ProblemRemove.instance
  driver = TestSupport.driver
  plist = driver.find_element(:xpath, "//*[@id='data-grid-problems']").text
  #puts plist
  a = plist.include? "Chronic Systolic Heart failure"
  expect(a).to eq(false)
end

Then(/^problem is NOT removed from problem list$/) do
  con = ProblemRemove.instance
  driver = TestSupport.driver
  plist = driver.find_element(:xpath, "//*[@id='data-grid-problems']").text
  a = plist.include? "Chronic Systolic Heart failure"
  expect(a).to eq(true)
end
