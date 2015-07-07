
path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class ImmunizationAdd < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Add_Immunization"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='left3']/div/div/div[1]/span[2]/span[2]/span/button/span"))
    #add_action(CucumberLabel.new("Confirm"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
    add_verify(CucumberLabel.new("Facility"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='left3']/div/div/div[1]/span[2]/span[2]/span/button/span"))
    add_verify(CucumberLabel.new("Add_Immunization_Title"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
  end
end

When(/^Immunization user clicks on "(.*?)"$/) do |arg1|
  con = ImmunizationAdd.instance
  con.wait_until_action_element_visible("Facility", 40)
  expect(con.perform_action("Add_Immunization", arg1)).to be_true
end

Then(/^the immunization modal title is "(.*?)"$/) do |arg1|
  con = ImmunizationAdd.instance
  expect(con.perform_verification("Add_Immunization_Title", arg1)).to be_true
end


