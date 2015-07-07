path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class DiscrepantDataHeaders < AccessBrowserV2
  include Singleton
  def initialize
    super
    #drop down heading
    add_verify(CucumberLabel.new("Home Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-home-phone > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Cell Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-cell-phone > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Work Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-work-phone > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Home Address"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-home-address > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Temp Address"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-temp-address > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Email_1"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-email > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Emergency Name"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-name > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Emergency Home Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-hphone > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Emergency Work Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-wphone > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("Emergency Address"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-address > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("NOK Name"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-name > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("NOK Home Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-hphone > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("NOK Work Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-wphone > span:nth-child(2) > i"))
    add_verify(CucumberLabel.new("NOK Address"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-address > span:nth-child(2) > i"))
  end
end
And(/^the Discrepant Data indicator icon displays for "(.*?)"$/) do |element|
  con = DiscrepantDataHeaders.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  expect(con.perform_verification(element, "")).to be_true
end

And(/^the Discrepant Data indicator icon does not displays for "(.*?)"$/) do |element|
  con = DiscrepantDataHeaders.instance
  con.wait_until_action_element_invisible(element)
  expect(con.static_dom_element_exists?(element)).to be_false 
end

class DemographicQuickLook < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Phone Group"), ClickAction.new, AccessHtmlElement.new(:id, "pt-demo-phone-group"))
    add_action(CucumberLabel.new("Address Group"), ClickAction.new, AccessHtmlElement.new(:id, "pt-demo-address-group"))
    add_action(CucumberLabel.new("Email Group"), ClickAction.new, AccessHtmlElement.new(:id, "pt-demo-email-group"))
    add_action(CucumberLabel.new("Next Of Kin Group"), ClickAction.new, AccessHtmlElement.new(:id, "pt-demo-nok-contact-group"))
    add_action(CucumberLabel.new("Emergency Contact Group"), ClickAction.new, AccessHtmlElement.new(:id, "pt-demo-em-contact-group"))

    add_action(CucumberLabel.new("Phone Group QuickLook"), ClickAction.new, AccessHtmlElement.new(:id, "ql-phone-table-container"))
    add_action(CucumberLabel.new("Address Group QuickLook"), ClickAction.new, AccessHtmlElement.new(:id, "ql-pt-address-table-container"))
    add_action(CucumberLabel.new("Email Group QuickLook"), ClickAction.new, AccessHtmlElement.new(:id, "ql-email-table-container"))
    add_action(CucumberLabel.new("Next Of Kin Group QuickLook"), ClickAction.new, AccessHtmlElement.new(:css, "#pt-header-nok-contact > div:nth-child(2)"))
    add_action(CucumberLabel.new("Emergency Contact Group QuickLook"), ClickAction.new, AccessHtmlElement.new(:css, "#pt-header-em-contact > div:nth-child(2)"))

    add_verify(CucumberLabel.new("Home Phone QuickLook Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-home-phone-val"))
    add_verify(CucumberLabel.new("Cell Phone QuickLook Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-cell-phone-val"))
    add_verify(CucumberLabel.new("Work Phone QuickLook Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-work-phone-val"))
    add_verify(CucumberLabel.new("Email QuickLook Value"), VerifyContainsClass.new, AccessHtmlElement.new(:css, "#pt-email-row-container > tr > td:nth-child(2) > div"))
    add_verify(CucumberLabel.new("Home Address QuickLook Value Line 1"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-pt-haddr-line1"))
    add_verify(CucumberLabel.new("Home Address QuickLook Value Line 4"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-pt-haddr-line4"))
    add_verify(CucumberLabel.new("Temporary Address QuickLook Value Line 1"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-pt-tddr-line1"))
    add_verify(CucumberLabel.new("Temporary Address QuickLook Value Line 4"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-pt-tddr-line4"))
    add_verify(CucumberLabel.new("Next Of Kin QuickLook Relationship Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-nok-rel"))
    add_verify(CucumberLabel.new("Emergency Contact QuickLook Name Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-em-name"))
    add_verify(CucumberLabel.new("Emergency Contact QuickLook Relationship Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-em-rel"))
    add_verify(CucumberLabel.new("Emergency Contact QuickLook Home Phone Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-em-hphone"))
    add_verify(CucumberLabel.new("Emergency Contact QuickLook Work Phone Value"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-em-wphone"))
    add_verify(CucumberLabel.new("Emergency Contact QuickLook Address Value Line 1"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-em-addr-line1"))
    add_verify(CucumberLabel.new("Emergency Contact QuickLook Address Value Line 4"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "ql-em-addr-lin4"))
  end
end

Then(/^the Demographics user clicks on the "(.*?)"$/) do |arg|
  con = DemographicQuickLook.instance
  element = nil
  con.wait_until_action_element_visible(arg)
  expect(con.static_dom_element_exists?(arg)).to be_true
  con.perform_action(arg, element)
end

Then(/^the "(.*?)" popup is displayed$/) do |arg|
  con = DemographicQuickLook.instance
  expect(con.wait_until_action_element_visible(arg)).to be_true
end

Then(/^the "(.*?)" popup is hidden$/) do |arg|
  con = DemographicQuickLook.instance
  con.wait_until_action_element_invisible(arg)
  expect(con.static_dom_element_exists?(arg)).to be_false
end

And(/^the discrepant "(.*?)" is highlighted$/) do |arg|
  con = DemographicQuickLook.instance
  expect(con.wait_until_element_present(arg)).to be_true
  expect(con.perform_verification(arg, "demographic-group-diff-text")).to be_true
end
