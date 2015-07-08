#require 'singleton'
#path = File.expand_path '..', __FILE__
#$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
#path = File.expand_path '../../../../shared-test-ruby', __FILE__
#$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

# All the HTML Elements the tests need to access in order to conduct text search
class TextSearchContainer < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Text Search Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "searchtext"))
    add_action(CucumberLabel.new("Text Search"), SendKeysAction.new, AccessHtmlElement.new(:id, "searchtext"))
    add_action(CucumberLabel.new("submit"), ClickAction.new, AccessHtmlElement.new(:id, "submit")) 
    add_action(CucumberLabel.new("Text Search Suggestion"), SendKeysAction.new, AccessHtmlElement.new(:id, "searchtext")) 
    add_action(CucumberLabel.new("Suggestion List"), VerifyText.new, AccessHtmlElement.new(:id, "suggestList"))
    add_verify(CucumberLabel.new("Search Results"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "searchResults"))
    add_verify(CucumberLabel.new("No Results"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "noResults"))
    @@search_result_rows = AccessHtmlElement.new(:id, "searchResults")
    add_verify(CucumberLabel.new("Number of Search Result Rows"), VerifyXpathCount.new(@@search_result_rows), @@search_result_rows)         
    add_verify(CucumberLabel.new("SearchResultMsg"), VerifyText.new, AccessHtmlElement.new(:id, "search-results-message"))
    add_verify(CucumberLabel.new("Search Result Count"), VerifyText.new, AccessHtmlElement.new(:id, "numberOfResults"))
    add_verify(CucumberLabel.new("Result Count"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[starts-with(@id,'ResultCount')]"))
    @@count_action = AccessHtmlElement.new(:xpath, ".//*[@id='suggestList']/li")
    add_verify(CucumberLabel.new("suggestion count"), VerifyXpathCount.new(@@count_action), @@count_action)
    add_verify(CucumberLabel.new("Group Search Result"), VerifyText.new, AccessHtmlElement.new(:css, ".searchGroupTitle.panel-heading"))
    add_action(CucumberLabel.new("Control - Text Search - From Date"), SendKeysAction.new, AccessHtmlElement.new(:id, "fromDateText"))
    add_action(CucumberLabel.new("Control - Text Search - To Date"), SendKeysAction.new, AccessHtmlElement.new(:id, "toDateText"))
    add_action(CucumberLabel.new("Control - Text Search - Apply"), ClickAction.new, AccessHtmlElement.new(:id, "custom-range-apply"))
    ###### End of Date Control ## 
    
    add_action(CucumberLabel.new("Search Spinner"), ClickAction.new, AccessHtmlElement.new(:id, "searchSpinner"))
      
    ## Search result deatail ####
    add_verify(CucumberLabel.new("Medication - ascorbic acid tab"), VerifyText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("Vaccine - CHOLERA, ORAL (HISTORICAL)"), VerifyText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("Allergen - PENICILLIN"), VerifyText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("EYE DISORDERS"), VerifyText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("HDL"), VerifyText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("Headache"), VerifyText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("Snippest"), VerifyContainsText.new, AccessHtmlElement.new(:id, "ResultHighlightssubgroupItem0"))
    add_verify(CucumberLabel.new("Rad Order Status"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-body']/descendant::div/div[10]/div[2]"))
    add_verify(CucumberLabel.new("Lab Order Status"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-body']/descendant::div/div[9]/div[2]"))         
  end
end

class TextSearchContainerDrillDown < AccessBrowserV2
  include Singleton
  def initialize
    super
    
    ## search result drill down ###
    add_action(CucumberLabel.new("Medication, Outpatient"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-MedicationOutpatient"))
    add_action(CucumberLabel.new("Immunization"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-Immunization"))
    add_action(CucumberLabel.new("Allergy/Adverse Reaction"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-AllergyAdverseReaction"))
    add_action(CucumberLabel.new("Laboratory"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-Laboratory"))
    add_action(CucumberLabel.new("Problem"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-Problem"))
    add_action(CucumberLabel.new("Radiology Report"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-RadiologyReport"))
    add_action(CucumberLabel.new("Progress Note"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-ProgressNote"))
    add_action(CucumberLabel.new("Administrative Note"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-AdministrativeNote"))
    add_action(CucumberLabel.new("Advance Directive"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-AdvanceDirective"))
    add_action(CucumberLabel.new("Clinical Procedure"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-ClinicalProcedure"))
    add_action(CucumberLabel.new("Consult Report"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-ConsultReport"))
    add_action(CucumberLabel.new("Consultation Note"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-ConsultationNoteProviderDocument"))
    add_action(CucumberLabel.new("Crisis Note"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-CrisisNote"))
    add_action(CucumberLabel.new("Discharge Summary"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-DischargeSummary"))
    add_action(CucumberLabel.new("Laboratory Report"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-LaboratoryReport"))
    add_action(CucumberLabel.new("Radiology Report"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-RadiologyReport"))
    add_action(CucumberLabel.new("Surgery Report"), ClickAction.new, AccessHtmlElement.new(:id, "result-group-title-SurgeryReport"))
    add_action(CucumberLabel.new("General Medicine Note"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-GENERALMEDICINENOTE-1"))
    add_action(CucumberLabel.new("Diabetes"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-DIABETES-1"))
    add_action(CucumberLabel.new("Administrative Note2"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-AdministrativeNote-1"))
    add_action(CucumberLabel.new("Advance Directive2"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-ADVANCEDIRECTIVE-1"))
    add_action(CucumberLabel.new("Col"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-COL-1"))
    add_action(CucumberLabel.new("Audiology Hearing Loss Consult"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-AUDIOLOGYHEARINGLOSSCONSULT-1"))
    add_action(CucumberLabel.new("Consultation Note Document"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-ConsultationNoteProviderDocument-1"))
    add_action(CucumberLabel.new("Crisis Note subgroup"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-CRISISNOTE-1"))
    add_action(CucumberLabel.new("Discharge Summary subgroup"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-DischargeSummary-1"))
    add_action(CucumberLabel.new("LR ELECTRON MICROSCOPY REPORT"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-LRELECTRONMICROSCOPYREPORT-1"))
    add_action(CucumberLabel.new("ANKLE 2 VIEWS"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-ANKLE2VIEWS-1"))
    add_action(CucumberLabel.new("ANESTHESIA REPORT"), ClickAction.new, AccessHtmlElement.new(:id, "result-subGroup-title-ANESTHESIAREPORT-1"))
    add_action(CucumberLabel.new("Sub Group List"), ClickAction.new, AccessHtmlElement.new(:id, "ResultDatesubgroupItem0")) 
    add_action(CucumberLabel.new("Penicillin"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(text(),'PENICILLIN')]"))
    add_action(CucumberLabel.new("Headache"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(@class,'searchResultItem')]/descendant::div[contains(string(),'Headache')]"))
    add_action(CucumberLabel.new("Cholera"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(text(),'CHOLERA')]"))
    #add_action(CucumberLabel.new("Urinalysis"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(@class,'searchResultItem')]/descendant::div[contains(string(),'URINALYSIS')]"))
    add_action(CucumberLabel.new("Urinalysis"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@data-uid='urn:va:order:C877:229:8856'] "))
    add_action(CucumberLabel.new("Knee"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='result-group-RadiologyReport']/div/div[6]"))
    add_action(CucumberLabel.new("HDL"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(@class,'searchResultItem')]/descendant::div[contains(string(),'HDL')]"))
    add_action(CucumberLabel.new("Ascorbic Acid"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(@class,'searchResultItem')]/descendant::div[contains(string(),'ASCORBIC')]"))
    add_action(CucumberLabel.new("Allergies"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='result-subGroup-DIABETES-1']/div/div[2]"))
    add_action(CucumberLabel.new("bundle branch block"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='result-subGroup-DIABETES-1']/div/div[2]"))
    add_action(CucumberLabel.new("Chocolate"), ClickAction.new, AccessHtmlElement.new(:xpath, "//mark[contains(text(),'CHOCOLATE')]"))
  end
end

def group_search_results(grouped_list, table)
  matched = false
  table.rows.each do |item, k|
    grouped_list.each do |grouped_item| 
      #p "item is + #{grouped_item.text}, #{item}"
     
      if grouped_item.text == item.upcase
        matched = true
        break
      else 
        matched = false
      end #end of if
    end #end of grouped
    p "could not match cucumber_row: #{item}" unless matched
    #expect(matched).to be_true
  end #end of table
  return matched
end #end of def

def search_text_and_clicking(search_value)
  con = TextSearchContainer.instance
  driver = TestSupport.driver
  #con.add_action(CucumberLabel.new("Search Spinner"), ClickAction.new, AccessHtmlElement.new(:id, "searchSpinner"))

  
  expect(con.wait_until_element_present("Text Search Field", DefaultLogin.wait_time)).to be_true, "text search field did not display"
  expect(con.perform_action("Text Search Field", search_value)).to be_true, "text search field did not display"

  con.wait_until_element_present("Search Spinner")
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultTiming.default_table_row_load_time) # seconds # wait until list opens
  wait.until { driver.find_element(:id, "searchSpinner").attribute("style").strip =="display: none;" } # wait until specific list element is NOT 
  con.wait_until_action_element_visible("Search Results", 70)
end

def search_result_message(search_value, count)
  con = TextSearchContainer.instance
  driver = TestSupport.driver
  expected_msg = "#{count} results"
  expect(con.perform_verification("SearchResultMsg", expected_msg)).to be_true
end

def search_text(search_value)
  con = TextSearchContainer.instance
  con.perform_action("Text Search Suggestion", search_value)
end

def search_text_click_submit(search_value)
  con = TextSearchContainer.instance
  expect(con.perform_action("Text Search Suggestion", search_value)).to be_true, "Not able to enter text in the search field"
  expect(con.perform_action("submit", "")).to be_true, "was not able to click on the submit button"
end

def search_suggetions_count(search_value, expected_num)
  con = TextSearchContainer.instance
  driver = TestSupport.driver
  num_seconds = 30
  #p expected_num 

  p "suggestion count expected #{expected_num}"
  con.wait_until_xpath_count("suggestion count", expected_num, num_seconds)
  p "wait completed"
  expect(con.perform_verification("suggestion count", expected_num, 10)).to be_true, ""
end

Given(/^user type text term and the page contains total items and search results$/) do |table|
  table.rows.each do |text, total_items|
    search_text_and_clicking(text)
    search_result_message(text, total_items)
  end
end

Given(/^user searches for "(.*?)"$/) do |text_term|
  search_text_and_clicking(text_term)
end

def check_group_results(table)
  driver = TestSupport.driver
  browser_elements = driver.find_elements(:xpath, "//*[@id='searchResults']/descendant::h4")
  matched = group_search_results(browser_elements, table)
end

Then(/^text search result contains$/) do |table|
  driver = TestSupport.driver
  con = TextSearchContainer.instance
  
  matched =false
  con.wait_until_action_element_visible("Search Results", 70)

  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { check_group_results table }

end

Then(/^sub grouped search result for "(.*?)" contains$/) do |sub_group_category, table|
  con = TextSearchContainerDrillDown.instance
  driver = TestSupport.driver
  
  matched =false
  case sub_group_category
  when 'Headache'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-HeadacheICD9CM7840-1']/descendant::div")
  when 'General Medicine Note'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-GENERALMEDICINENOTE-1']/descendant::div")
  when 'Diabetes'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-DIABETES-1']/descendant::div")
  when 'Administrative Note2'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-AdministrativeNote-1']/descendant::div")
  when 'Advance Directive2'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-ADVANCEDIRECTIVE-1']/descendant::div")
  when 'Col'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-COL-1']/descendant::div")
  when 'Audiology Hearing Loss Consult'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-AUDIOLOGYHEARINGLOSSCONSULT-1']/descendant::div")
  when 'Consultation Note Document'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-ConsultationNoteProviderDocument-1']/descendant::div")
  when 'Crisis Note subgroup'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-CRISISNOTE-1']/descendant::div")
  when 'Discharge Summary subgroup'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-DischargeSummary-1']/descendant::div")
  when 'LR ELECTRON MICROSCOPY REPORT'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-LRELECTRONMICROSCOPYREPORT-1']/descendant::div")
  when 'ANKLE 2 VIEWS'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-ANKLE2VIEWS-1']/descendant::div")
  when 'ANESTHESIA REPORT'
    expect(con.wait_until_element_present("Sub Group List", 60)).to be_true, "Sub Group List did not display"
    browser_elements_list = driver.find_elements(:xpath, "//*[@id='result-subGroup-ANESTHESIAREPORT-1']/descendant::div")
  else
    fail "**** No function found! Check your script ****"
  end #end for case
  
  con = VerifyTableValue.new
  matched = con.verify_name_value(browser_elements_list, table)
  expect(matched).to be_true, "could not match"
end
  
When(/^from the coversheet the user clicks on "([^"]*)"$/) do |element|
  aa = TextSearchContainer.instance
  driver = TestSupport.driver
  aa.wait_until_action_element_visible(element, 60)
  expect(aa.static_dom_element_exists?(element)).to be_true, "Record Search Button did not display"
  expect(aa.perform_action(element, "")).to be_true, "was not able to click on the button"
end 

Given(/^user type text term "(.*?)" in the search text box$/) do |search_value|
  con = TextSearchContainer.instance
  con.perform_action("Text Search Field", search_value)
end

Then(/^search result displays "(.*?)" search results$/) do |total_no_search_results|
  con = TextSearchContainer.instance
  expect(con.static_dom_element_exists?("Search Result Count")).to be_true
  expect(con.perform_verification("Search Result Count", total_no_search_results)).to be_true  
end

Then(/^the user clicks one of the search result "([^"]*)"$/) do |element|
  driver = TestSupport.driver  
  aa = TextSearchContainerDrillDown.instance
  aa.wait_until_action_element_visible(element, 60)
  expect(aa.static_dom_element_exists?(element)).to be_true
  expect(aa.perform_action(element, "")).to be_true, "element did not display"
end

When(/^the user enters "(.*?)" in the "(.*?)" control$/) do |input_text, control_name|
  aa = TextSearchContainer.instance
  control = "Control - #{control_name}"
  p "control is #{control}"
  expect(aa.perform_action(control, input_text)).to be_true, "element did not display"
end

Then(/^user type <text> term and the page displays total no of suggestions "(.*?)"$/) do |arg1, table|
  table.rows.each do |text, total_items|
    p "search #{text}"
    search_text(text)
    search_suggetions_count(text, total_items)
  end
end

Then(/^the following date time filter option should be displayed$/) do |table|
  driver = TestSupport.driver
  matched =false
  browser_elements = driver.find_elements(:xpath, "//*[@id='globalDate-region']/descendant::button")
  p browser_elements.length
  #p browser_elements.text.strip
  matched =  group_search_results(browser_elements, table)
  expect(matched).to be_true   
end
   
Then(/^the "(.*?)" contains$/) do |name, table|
  driver = TestSupport.driver
  con = Documents.instance
  browser_elements_list = driver.find_elements(:xpath, "//*[@id='modal-body']/descendant::div")
  p browser_elements_list.length
  browser_elements_list.each do |label_in_browser| 
    p label_in_browser.text.strip  
  end
  matched = false
  con = VerifyTableValue.new
  matched = con.verify_name_value(browser_elements_list, table)
  expect(matched).to be_true 
end

def wait_until_numberofresults(number_of_results)
  web_driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  p "numberOfResults #{web_driver.execute_script("return window.document.getElementById('numberOfResults').innerHTML")}"
  wait.until { web_driver.execute_script("return window.document.getElementById('numberOfResults').innerHTML") == number_of_results }
  p "not hanging here"
end

Then(/^search result header displays (\d+) number of results$/) do |arg1|
  wait_until_numberofresults arg1
end

Then(/^the user sees the search text "(.*?)" in yellow$/) do |search_text|
  driver = TestSupport.driver
  matched = false
  text_color = ""
  browser_elements_list = driver.find_elements(:css, ".cpe-search-term-match")
  p browser_elements_list.length
  browser_elements_list.each do | element|
    text_color = element.css_value("background-color")

    #check only rgb value in string since alpha value is inconsistent across build environments
    if text_color[0, 20] == "rgba(255, 255, 0, 0."
      matched = true
    else
      matched = false
    end
  end
  expect(matched).to be_true, "color in browser: #{text_color} found in feature file yellow" 
end

Then(/^Current Status for "(.*?)" is "(.*?)"$/) do |order_type, order_status|
  aa = TextSearchContainer.instance
  
  order_type_status = order_type + " " + "Order Status"
  aa.wait_until_element_present(order_type_status, 60)
  expect(aa.static_dom_element_exists?(order_type_status)).to be_true, "element did not exists"
  expect(aa.perform_verification(order_type_status, order_status)).to be_true, "Order status is #{order_type_status}"
end

Then(/^the following subgroups data are not loaded$/) do |table|
  driver = TestSupport.driver
  
  table.rows.each do | rows_value |
    element_id = "result-subGroup-" + rows_value[0] + "-1"
    #element_id = "result-subGroup"
    matched = driver.find_element(:id , element_id).displayed?
    expect(!matched).to be_true , "#{element_id} is loaded"
  end
end

Then(/^user searches for "(.*?)" with no suggestion$/) do |text|
  driver = TestSupport.driver
  aa = TextSearchContainer.instance
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  search_text(text)
  element_id = "noResults"
  wait.until { (driver.find_element(:id, element_id).attribute("style").strip =="display: none; padding-left: 10px;" || driver.find_element(:id, element_id).attribute("style").strip =="padding-left: 10px; display: none;") }
  expect((driver.find_element(:id, element_id).attribute("style").strip =="display: none; padding-left: 10px;" || driver.find_element(:id, element_id).attribute("style").strip =="padding-left: 10px; display: none;")).to be_true
end

Then(/^user searches for "(.*?)" with no duplicates in the results dropdown$/) do |text|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  suggest = Array.new(16)
  search_text(text)
  wait.until { driver.find_element(:id, "suggestList").attribute("style").strip =="display: block;" }
  #Problems with <span> elements (ex: <span id>, <span id=""">). NOT FINNISHED!
  for i in 0..15
    #p "#{i}"
    word = ""
    driver.find_elements(:xpath, "//li[@id='SuggestItem#{i}']/a/span").each { |td| word = word + td.text }
    #p word
    suggest[i] = word
  end
  #p "#{suggest}"
  expect(suggest.uniq! == nil).to be_true
end

Then(/^the modal contains highlighted "(.*?)"$/) do |searchterm|
  driver = TestSupport.driver
  no_elem = Array.new
  expect(driver.find_element(:xpath, "//*[@id='modal-body']//mark[@class='cpe-search-term-match']").text == searchterm)
end

Then(/^user searches for "(.*?)" and verifies suggestions$/) do |text, table|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  suggest = Array.new

  search_text(text)

  wait.until { driver.find_element(:id, "suggestList").attribute("style").strip =="display: block;" }
  suggestions = driver.find_elements(:xpath, "//ul[@id='suggestList']/li")

  for i in 0..suggestions.length-1
    word = ""
    driver.find_elements(:xpath, "//li[@id='SuggestItem#{i}']/a/span").each { |td| word = word + td.text }
    suggest[i] = word
  end
  j = 1
  table.rows.each do | rows_value |
    #p rows_value[0]
    #p suggest[j]
    expect(rows_value[0] == suggest[j]).to be_true
    j += 1
  end
end
