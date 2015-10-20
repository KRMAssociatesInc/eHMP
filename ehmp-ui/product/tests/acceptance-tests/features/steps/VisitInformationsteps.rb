path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

class VisitInformation < AccessBrowserV2
  include Singleton
  def initialize
    super      
    add_action(CucumberLabel.new("Comp and Pen"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:0CD5:159:A;2940616.1415;137")) 
    add_verify(CucumberLabel.new("VisitInformationDetail"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".col-xs-12>h5"))
    add_verify(CucumberLabel.new("HistoricalVisitText"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".col-sm-10>p"))
    add_verify(CucumberLabel.new("DateText"), VerifyContainsText.new, AccessHtmlElement.new(:id, "dp-visit"))
    add_verify(CucumberLabel.new("Change Visit"), VerifyContainsText.new, AccessHtmlElement.new(:id, "setVisitContextBtn"))
    add_verify(CucumberLabel.new("Clinic Appointments"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#visitModal ul.nav-tabs a[href='#appts']"))
    add_verify(CucumberLabel.new("Comp and Pen"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#urn\3a va\3a appointment\3a 0CD5\3a 159\3a A\3b 2940616\2e 1415\3b 137"))
    #add_verify(CucumberLabel.new("General Medicine"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:appointment:9E7A:3:A;3000522.09;23']/span[1]"))
    add_action(CucumberLabel.new("General Medicine"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:appointment:9E7A:3:A;3000522.09;23']/span[1]")) 
    add_verify(CucumberLabel.new("Visit Information Location"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='setVisitContextBtn']/div/div[1]"))
    #add_action(CucumberLabel.new("Visit Location"), ClickAction.new, AccessHtmlElement.new(:id, "location"))
    #add_action(CucumberLabel.new("Visit Location"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "location"))
    #add_verify(CucumberLabel.new("Visit Location"), VerifyText.new, AccessHtmlElement.new(:id, "location"))
    #add_verify(CucumberLabel.new("Modal Title"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("ProviderInfo"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='patientDemographic-providerInfo']/div[2]/div/div[2]/table/tbody/tr[1]/td[2]"))
  end
end

Then(/^the "(.*?)" button appears$/) do |selected_item|
  con = VisitInformation.instance
  #con.wait_until_action_element_visible("Change Visit", 20)
  #con.perform_verification("Change Visit", selected_item)
  expect(con.wait_until_action_element_visible("Change Visit", 50)).to be_true
  expect(con.perform_verification("Change Visit", selected_item)).to be_true 
end

Then(/^the user selects first row "(.*?)"$/) do |_arg1|
  con = VisitInformation.instance
  expect(con.wait_until_action_element_visible("General Medicine", 30)).to be_true
  expect(con.perform_action("General Medicine")).to be_true
end

Then(/^location for Visit Information tab is populated with "(.*?)"$/) do |arg1|
  con = VisitInformation.instance
  expect(con.wait_until_action_element_visible("Visit Information Location", 30)).to be_true
  expect(con.perform_verification("Visit Information Location", arg1)).to be_true #expect(con.perform_verification("Comp and Pen", arg1)).to be_true
  #con.perform_verification("Visit Information Location', arg1)
end

Then(/^the Provider should be polpulated with the provider name$/) do
  con = VisitInformation.instance
  con.wait_until_action_element_visible("ProviderInfo", 60)
  expect(con.perform_verification("ProviderInfo", "USER PANORAMA")).to be_true
end
