class AllergiesApplet < AccessBrowserV2
  include Singleton
  def initialize
    super   
    add_verify(CucumberLabel.new("Allergy Applet Title"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid=allergy_grid] .panel-title"))
    add_verify(CucumberLabel.new("AllergiesGridVisible"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-pill-gist-items"))
    add_verify(CucumberLabel.new("Allergy Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'allergy_grid-pill-gist-items'))
    add_action(CucumberLabel.new("ERYTHROMYCIN"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(),'ERYTHROMYCIN')]/parent::div"))
    add_action(CucumberLabel.new("Tetracyclines"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(),'Tetracyclines')]/parent::div"))
    @@allergies_applet_data_grid_rows = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-allergy_grid']/descendant::tr")
    add_verify(CucumberLabel.new("Number of Allergies Applet Rows"), VerifyXpathCount.new(@@allergies_applet_data_grid_rows), @@allergies_applet_data_grid_rows)
    add_action(CucumberLabel.new("Standardized Allergen"), ClickAction.new, AccessHtmlElement.new(:link_text, "Standardized Allergen"))
    add_verify(CucumberLabel.new("Allergy Modal Details"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body > div"))
  end
end 

Then(/^user sees the allergy applet on the coversheet page$/) do
  aa = AllergiesApplet.instance
  expect(aa.wait_until_action_element_visible("Allergy Applet Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("Allergy Applet Title", "ALLERGIES")).to be_true
end

Then(/^the Allergies Applet view contains$/) do |table|
  aa = AllergiesApplet.instance 
  expect(aa.wait_until_action_element_visible("AllergiesGridVisible", DefaultLogin.wait_time)).to be_true    
  table.rows.each do | row |
    expect(aa.perform_verification('Allergy Details', row[0])).to be_true, "The value #{row[0]} is not present in the allergy details"
  end
end

When(/^the user clicks on the allergy pill "(.*?)"$/) do | vaccine_name |
  driver = TestSupport.driver
  aa = AllergiesApplet.instance
  expect(aa.wait_until_action_element_visible("AllergiesGridVisible", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(vaccine_name, "")).to be_true
  driver.find_element(:id, "info-button-sidekick-detailView").click
  expect(aa.wait_until_action_element_visible("Allergy Modal Details", DefaultLogin.wait_time)).to be_true
  TestSupport.wait_for_page_loaded
end

class AllergiesDetails < AccessBrowserV2
  include Singleton
  def initialize
    super   
    add_verify(CucumberLabel.new("Symptoms"), VerifyContainsText.new, AccessHtmlElement.new(:id, "modal-body"))
    add_verify(CucumberLabel.new("Entered By"), VerifyText.new, AccessHtmlElement.new(:id, "originatorName"))
    add_verify(CucumberLabel.new("Nature of Reaction"), VerifyText.new, AccessHtmlElement.new(:id, "natureofreaction"))
    add_verify(CucumberLabel.new("Drug Classes"), VerifyText.new, AccessHtmlElement.new(:id, "modal-drugClasses"))
    add_verify(CucumberLabel.new("Originated"), VerifyText.new, AccessHtmlElement.new(:id, "modal-originatedFormatted"))
    add_verify(CucumberLabel.new("Observed/Historical"), VerifyText.new, AccessHtmlElement.new(:id, "modal-observedorhistorical"))
    add_verify(CucumberLabel.new("Observed Date"), VerifyContainsText.new, AccessHtmlElement.new(:id, "modal-observedDate"))
    add_verify(CucumberLabel.new("Verified"), VerifyText.new, AccessHtmlElement.new(:id, "modal-verifierName"))
    add_verify(CucumberLabel.new("Obs dates/severity"), VerifyText.new, AccessHtmlElement.new(:css, "#modal-body button.btn-warning"))
    add_verify(CucumberLabel.new("Site"), VerifyContainsText.new, AccessHtmlElement.new(:id, "facilityName"))
    add_verify(CucumberLabel.new("Allergy Modal Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, "modal-body"))
    add_verify(CucumberLabel.new("Comments"), VerifyContainsText.new, AccessHtmlElement.new(:id, "modal-body"))
  end
end 

Then(/^the allergy applet modal detail contains$/) do |table|
  aa = AllergiesDetails.instance
  
  table.rows.each do | row |
    #expect(aa.perform_verification('Allergy Modal Details', row[0])).to be_true, "The value #{row[0]} is not present in the allergy modal details"
    expect(aa.perform_verification(row[0], row[1])).to be_true, "The value #{row[1]} for field #{row[0]} is not present in the allergy modal details"
  end
end

Then(/^Allergy Applet table first row is$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.compare_specific_row(table, '#data-grid-allergy_grid') }
end

When(/^user sorts by the Standardized Allergen$/) do
  aa = AllergiesApplet.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Allergies Applet Rows", 5)).to be_true
  expect(aa.perform_action("Standardized Allergen", "")).to be_true
end

Then(/^the Allergies Applet is sorted in alphabetic order based on Standardized Allergen$/) do
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.verify_alphabetic_sort_caseinsensitive('data-grid-allergy_grid', 2, true) }
end
