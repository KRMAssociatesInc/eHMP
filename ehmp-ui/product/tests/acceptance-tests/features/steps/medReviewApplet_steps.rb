class MedReviewApplet2 < ADKContainer
  include Singleton
  def initialize
    super
    
    add_action(CucumberLabel.new("Coversheet Dropdown"), ClickAction.new, AccessHtmlElement.new(:id, "screenName"))
    add_verify(CucumberLabel.new("Drop Down Menu"), VerifyText.new, AccessHtmlElement.new(:class, "dropdown-menu"))
    add_action(CucumberLabel.new("Meds Review"), ClickAction.new, AccessHtmlElement.new(:link_text, "Meds Review")) 
    add_action(CucumberLabel.new("inpatient"), ClickAction.new, AccessHtmlElement.new(:id, "InpatientGroup"))
    add_action(CucumberLabel.new("outpatient"), ClickAction.new, AccessHtmlElement.new(:id, "OutpatientGroup"))
    add_action(CucumberLabel.new("clinic order"), ClickAction.new, AccessHtmlElement.new(:id, "Clinic_OrdersGroup"))
    add_action(CucumberLabel.new("Non Va"), ClickAction.new, AccessHtmlElement.new(:id, "Non-VAGroup"))
    add_action(CucumberLabel.new("supplies"), ClickAction.new, AccessHtmlElement.new(:id, "SuppliesGroup"))      
    add_action(CucumberLabel.new("DIGOXIN TAB"), ClickAction.new, AccessHtmlElement.new(:id, "summary_urn_va_med_9E7A_164_9583"))
    add_action(CucumberLabel.new("CIMETIDINE TAB"), ClickAction.new, AccessHtmlElement.new(:id, "summary_urn_va_med_9E7A_164_9088"))
    add_action(CucumberLabel.new("TERAZOSIN CAP,ORAL"), ClickAction.new, AccessHtmlElement.new(:id, "summary_urn_va_med_9E7A_100840_33294"))
    add_action(CucumberLabel.new("Order Hx date 5"), ClickAction.new, AccessHtmlElement.new(:id, "order-urn_va_med_9E7A_100840_33294"))    
      
    add_verify(CucumberLabel.new("inpatient count"), VerifyText.new, AccessHtmlElement.new(:id, "InpatientCount"))
    add_verify(CucumberLabel.new("outpatient count"), VerifyText.new, AccessHtmlElement.new(:id, "OutpatientCount"))
    add_verify(CucumberLabel.new("clinic order count"), VerifyText.new, AccessHtmlElement.new(:id, "Clinic_OrdersCount"))
    add_verify(CucumberLabel.new("Non Va count"), VerifyText.new, AccessHtmlElement.new(:id, "Non-VACount"))
    add_verify(CucumberLabel.new("supplies count"), VerifyText.new, AccessHtmlElement.new(:id, "SuppliesCount"))
      
    @@count_action = AccessHtmlElement.new(:css, "div.row.medSubcategory.IV")
    add_verify(CucumberLabel.new("Num IV Results"), VerifyXpathCount.new(@@count_action), @@count_action)    
        
    add_verify(CucumberLabel.new("Digoxin Tab"), VerifyText.new, AccessHtmlElement.new(:id, "qualifiedName-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Links"), VerifyContainsText.new, AccessHtmlElement.new(:id, "info-button-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Patient Education"), VerifyContainsText.new, AccessHtmlElement.new(:id, "info-button-patient-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Fill History"), VerifyText.new, AccessHtmlElement.new(:id, "fills-label-urn_va_med_9E7A_164_9583"))  
    add_verify(CucumberLabel.new("Order Hx"), VerifyText.new, AccessHtmlElement.new(:id, "order-history-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Prescription No."), VerifyText.new, AccessHtmlElement.new(:id, "prescription-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Supply"), VerifyText.new, AccessHtmlElement.new(:id, "supply-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Dose/Schedule"), VerifyText.new, AccessHtmlElement.new(:id, "dose-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Provider"), VerifyText.new, AccessHtmlElement.new(:id, "provider-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Pharmacist"), VerifyText.new, AccessHtmlElement.new(:id, "pharmacist-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Location"), VerifyText.new, AccessHtmlElement.new(:id, "location-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "facility-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Order Hx Date"), VerifyText.new, AccessHtmlElement.new(:id, "order-urn_va_med_9E7A_164_9088"))
    add_verify(CucumberLabel.new("DIGOXINPRESCRIPTION"), VerifyText.new, AccessHtmlElement.new(:id, "prescription-label-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("CIMETIDINEPRESCRIPTION"), VerifyText.new, AccessHtmlElement.new(:id, "prescription-label-urn_va_med_9E7A_164_9088"))
    add_verify(CucumberLabel.new("TERAZOSINPRESCRIPTION"), VerifyText.new, AccessHtmlElement.new(:id, "prescription-label-urn_va_med_9E7A_100840_33294"))
    add_verify(CucumberLabel.new("CIMETIDINEFILLHISTORY"), VerifyText.new, AccessHtmlElement.new(:id, "fills-label-urn_va_med_9E7A_164_9088"))          
    add_verify(CucumberLabel.new("No Records Found"), VerifyText.new, AccessHtmlElement.new(:xpath, "//div[@id='medicationsAccordion']/div/span/strong"))
    add_action(CucumberLabel.new("Clinical Pharmacology"), ClickAction.new, AccessHtmlElement.new(:partial_link_text, "Clinical Pharmacology"))  
    add_action(CucumberLabel.new("MDConsult"), ClickAction.new, AccessHtmlElement.new(:partial_link_text, "MDConsult")) 
    add_action(CucumberLabel.new("UpToDate"), ClickAction.new, AccessHtmlElement.new(:partial_link_text, "UpToDate")) 
    add_action(CucumberLabel.new("VisualDx"), ClickAction.new, AccessHtmlElement.new(:partial_link_text, "VisualDx")) 
    add_action(CucumberLabel.new("Krames StayWell"), ClickAction.new, AccessHtmlElement.new(:partial_link_text, "Krames StayWell")) 
    add_verify(CucumberLabel.new("Clinical Pharmacology"), VerifyContainsText.new, AccessHtmlElement.new(:partial_link_text, "Clinical Pharmacology"))  
    add_verify(CucumberLabel.new("MDConsult"), VerifyContainsText.new, AccessHtmlElement.new(:partial_link_text, "MDConsult")) 
    add_verify(CucumberLabel.new("UpToDate"), VerifyContainsText.new, AccessHtmlElement.new(:partial_link_text, "UpToDate")) 
    add_verify(CucumberLabel.new("VisualDx"), VerifyContainsText.new, AccessHtmlElement.new(:partial_link_text, "VisualDx"))
    add_verify(CucumberLabel.new("Krames StayWell"), VerifyContainsText.new, AccessHtmlElement.new(:partial_link_text, "Krames StayWell"))                    
  end
end

class MedReviewOrderHxGroup < ADKContainer
  include Singleton
  def initialize
    super 
    add_verify(CucumberLabel.new("startstoppanorama1"), VerifyText.new, AccessHtmlElement.new(:id, "order-urn_va_med_9E7A_100840_33292")) 
    add_verify(CucumberLabel.new("startstopkodak1"), VerifyText.new, AccessHtmlElement.new(:id, "order-urn_va_med_C877_100840_33292"))
    add_verify(CucumberLabel.new("startstopanorama2"), VerifyText.new, AccessHtmlElement.new(:id, "order-urn_va_med_9E7A_100840_33293"))
    add_verify(CucumberLabel.new("startstopkodak2"), VerifyText.new, AccessHtmlElement.new(:id, "order-urn_va_med_C877_100840_33293"))
    add_verify(CucumberLabel.new("startstoppanorama3"), VerifyText.new, AccessHtmlElement.new(:id, "order-urn_va_med_9E7A_100840_33294"))
    add_verify(CucumberLabel.new("startstoppkodak3"), VerifyText.new, AccessHtmlElement.new(:id, "order-urn_va_med_C877_100840_33294"))
  end
end

#class MedReviewDateFilter < ADKContainer
#  include Singleton
#  def initialize
#    super     
#    add_action(CucumberLabel.new("Control - Applet - Date Filter"), ClickAction.new, AccessHtmlElement.new(:css, "#navigation-date #date-region-minimized"))
#    add_action(CucumberLabel.new("Control - Applet - From Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "#globalDate-region #filter-from-date-global"))
#    add_action(CucumberLabel.new("Control - Applet - To Date"), SendKeysAction.new, AccessHtmlElement.new(:id, "filter-to-date-global"))
#    add_action(CucumberLabel.new("Control - Applet - Apply"), ClickAction.new, AccessHtmlElement.new(:id, "custom-range-apply-global"))
#  end
#end

When(/^user selects Meds Review from Coversheet dropdown$/) do
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible("Coversheet Dropdown", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Coversheet Dropdown", "")).to be_true, "Could not click on Drop down menu"
  expect(aa.wait_until_element_present("Drop Down Menu", 60)).to be_true, "Could not see the drop down menu"
  expect(aa.perform_action("Meds Review", "")).to be_true, "Could not click on Med Review link"
end

# step moved to med_review_steps.rb file.
#When(/^user navigates to Meds Review Applet$/) do
#  navigate_in_ehmp '#medication-review'
#end

Then(/^user sees "(.*?)" "(.*?)" search results$/) do |expected_num, med_type|
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible(med_type, DefaultLogin.wait_time)).to be_true
  count_element = med_type + " count"
  expect(aa.perform_verification(count_element, expected_num)).to be_true
end

Then(/^user sees "(.*?)" IV search results$/) do |num_rows|
  aa = MedReviewApplet2.instance
  aa.wait_until_xpath_count("Num IV Results", num_rows.to_i)
  expect(aa.perform_verification("Num IV Results", num_rows.to_i)).to be_true, "expected #{num_rows}"
end

Then(/^medication applet summary results contain "(.*?)" with the details$/) do |med_name, table|
  aa = MedReviewApplet2.instance
  lowercase_item = med_name.downcase
  #  expect(aa.wait_until_action_element_visible("inpatient count", DefaultLogin.wait_time)).to be_true
  aa.add_verify(CucumberLabel.new("Med Details"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '#{lowercase_item}')]/ancestor::div[@id='medGroupItem']"))
  table.rows.each do |row|
    expect(aa.perform_verification("Med Details", row[1])).to be_true, "The value #{row[1]} is not present in the med details"
  end
end

Then(/^medication applet non-VA summary results contain$/) do |table|  
  driver = TestSupport.driver 
  browser_elements_list = driver.find_elements(:xpath, "//*[@id='Non-VA-med-panel-body']/descendant::*[@id='medGroupItem']/descendant::span[@class='capitalize']")
  p browser_elements_list.length
  matched = false
  con = VerifyTableValue.new
  matched = con.verify_name_value(browser_elements_list, table)
  expect(matched).to be_true 
end

Then(/^medication applet non-VA summary results do not contain$/) do |table|  
  driver = TestSupport.driver
  browser_elements_list = driver.find_elements(:xpath, "//*[@id='Non-VA-med-panel-body']/descendant::*[@id='medGroupItem']/descendant::span[@class='capitalize']")
  p browser_elements_list.length
  matched = false
  con = VerifyTableValue.new
  matched = con.verify_name_value(browser_elements_list, table)
  expect(matched).to be_false
end

Then(/^the user clicks on link "([^"]*)"$/) do |element|
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible(element, 90)).to be_true
  expect(aa.perform_action(element, "")).to be_true
end

Then(/^the user sees the heading "(.*?)"$/) do |header_name|
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible(header_name, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification(header_name, header_name)).to be_true  
end

Then(/^the user sees following links under "(.*?)" heading$/) do |_not_used, table|
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible("Clinical Pharmacology", DefaultLogin.wait_time)).to be_true
  table.rows.each do |row|
    expect(aa.perform_verification(row[0], " "+row[0]+" ")).to be_true
  end 
end

Then(/^"(.*?)" medication details results contain$/) do |med_name, table|
  aa = MedReviewApplet2.instance
  
  case med_name
  when 'DIGOXIN TAB'
    expect(aa.wait_until_action_element_visible("DIGOXINPRESCRIPTION", DefaultLogin.wait_time)).to be_true
    aa.add_verify(CucumberLabel.new("Med Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'order-detail-urn_va_med_9E7A_164_9583'))
  when 'CIMETIDINE TAB'
    expect(aa.wait_until_action_element_visible("CIMETIDINEPRESCRIPTION", DefaultLogin.wait_time)).to be_true
    aa.add_verify(CucumberLabel.new("Med Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'order-detail-urn_va_med_9E7A_164_9088'))
  when 'TERAZOSIN CAP,ORAL'
    expect(aa.wait_until_action_element_visible("TERAZOSINPRESCRIPTION", DefaultLogin.wait_time)).to be_true
    aa.add_verify(CucumberLabel.new("Med Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'order-detail-urn_va_med_9E7A_100840_33294'))
  else
    fail "**** No function found! Check your script ****"
  end
  
  table.rows.each do |row|
    expect(aa.perform_verification("Med Details", row[1])).to be_true, "The value #{row[1]} is not present in the med details"
  end
end

Then(/^the user sees "(.*?)" as "(.*?)"$/) do |date_field, date_value|
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible(date_field, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification(date_field, date_value)).to be_true
end

Then(/^the fill history table contains rows$/) do |table|
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible("CIMETIDINEFILLHISTORY", DefaultLogin.wait_time)).to be_true
  verify_table_rows_med(table) 
end

Then(/^the user sees the text "(.*?)" and "(.*?)" in red$/) do |_expired_text, _date_text|
  driver = TestSupport.driver
  matched = false
  text_color = ""
  #  browser_elements_list = driver.find_elements(:class, "Expired")
  browser_elements_list = driver.find_elements(:xpath, "//*[@class='Expired']/descendant::span")
  p browser_elements_list.length
  browser_elements_list.each do |element|
    text_color = element.css_value("color") 
    #    p text_color
    if text_color == "rgba(255, 59, 48, 1)"
      matched = true
    else
      matched = false
    end
  end
  expect(matched).to be_true, "color in browser: #{text_color} found in feature file red" 
end

Then(/^the Order Hx Date are grouped as below$/) do |table|
  aa = MedReviewOrderHxGroup.instance
  expect(aa.wait_until_action_element_visible("startstoppanorama1", DefaultLogin.wait_time)).to be_true
  
  table.rows.each do |key, value|
    expect(aa.perform_verification(key, value)).to be_true
  end #table  
end

Then(/^the user sees a "(.*?)" dot for "(.*?)" medication "(.*?)"$/) do |color, _medStatus, _medName|
  driver = TestSupport.driver
  matched = false
  text_color = ""
  browser_elements_list = driver.find_elements(:css, "div.row.statusBadge.activeStatus")
  #p browser_elements_list.length
  browser_elements_list.each do |element|
    #text_color = element.css_value("color") 
    text_color = element.css_value("background-color")  
    if text_color == "rgba(76, 217, 100, 1)"
      matched = true
    else
      matched = false
    end
  end
  expect(matched).to be_true, "color in browser: #{text_color} found in feature file #{color}" 
end

Then(/^the search results say "(.*?)" in Med Review Applet$/) do |search_result_text|
  aa = MedReviewApplet2.instance
  expect(aa.wait_until_action_element_visible("No Records Found", DefaultTiming.default_table_row_load_time)).to be_true      
  expect(aa.perform_verification("No Records Found", search_result_text)).to be_true
end

def verify_table_rows_med(table)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.compare_specific_row(table, '#history-table-urn_va_med_9E7A_164_9088') }
end

def print_debug(css_string)
  driver = TestSupport.driver
  begin
    outpatient_grid = driver.find_element(:css, css_string)
    p "found #{css_string}"
  rescue Exception => e 
    p "error #{css_string}: #{e}"
  end
end

def print_innerhtml(css_string)
  driver = TestSupport.driver
  begin
    outpatient_grid = driver.find_element(:css, css_string)
    p outpatient_grid.attribute("innerHTML")
  rescue Exception => e 
    p "error #{css_string}: #{e}"
  end
end

Then(/^print debug information$/) do
  sleep 5
  print_debug("[data-appletid=medication_review_v2]")
  print_debug("div.toolbarActive")
  print_debug("[data-appletid=medication_review_v2] div.toolbarActive")
  print_debug("#detailView-button-toolbar")
  print_debug("[data-appletid=medication_review_v2] div.toolbarActive #detailView-button-toolbar")

  print_innerhtml("[data-appletid=medication_review_v2] div.toolbarActive")
end
