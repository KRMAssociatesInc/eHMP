class SyncStatus < AccessBrowserV2
  include Singleton
  def initialize
    super
  #  add_action(CucumberLabel.new("refresh"), ClickAction.new, AccessHtmlElement.new(:xpath, ".fa.fa-refresh"))
    add_verify(CucumberLabel.new("patientstatusicon"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='refresh-patient-data']/following-sibling::span"))
      
  end
end 

Then(/^the user looks for patientstatus icon site,All VA ,DOD and Externals$/) do |table|
  Sync =SyncStatus.instance  
  table.rows.each do |field_name|
    field_value= field_name[0]
    table_xpath= "//*[@id='refresh-patient-data']/following-sibling::span[contains(string(), '#{field_value}')]"
    element_found = Sync.dynamic_dom_element_exists?("xpath", table_xpath)
    expect(element_found).to be_true
  end
end

class PatientFlag < AccessBrowserV2
  include Singleton
  def initialize
    super
  #  add_verify(CucumberLabel.new("patientname"), VerifyText.new, AccessHtmlElement.new(:css, ".patientName"))
    add_verify(CucumberLabel.new("patientflags"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@class='fixedHeightZone']/following-sibling::span"))
    add_action(CucumberLabel.new("confirmButton"), ClickAction.new, AccessHtmlElement.new(:id, "confirmFlaggedPatinetButton"))
  end
end 

Then(/^the results for PATIENT contain$/) do |table|
  Flag =PatientFlag.instance  
  Flag.wait_until_element_present("confirmButton", 10)
  TestSupport.wait_for_page_loaded
  table.rows.each do |field_name|
    field_value= field_name[0]
    table_xpath= "//*[@class= 'fixedHeightZone']/div/div/div[contains(string(), '#{field_value}')]"
    element_found = Flag.dynamic_dom_element_exists?("xpath", table_xpath)
    expect(element_found).to be_true
  end
end

Then(/^the user click on Confirm$/) do
  wait_until_present_and_perform_action(Flag, 'confirmButton')
end

