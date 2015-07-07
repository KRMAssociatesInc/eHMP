class Navigation < AccessBrowserV2
  include Singleton
  def initialize
    super
    initialize_immunizations
    add_action(CucumberLabel.new("Vaccine Name"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='immunizations-name']/a"))
    add_action(CucumberLabel.new("Appointments Expand Button"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=appointments] .applet-maximize-button"))
    add_action(CucumberLabel.new("Appointments Filter Button"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-appointments"))
    add_action(CucumberLabel.new("CoversheetDropdown Button"), ClickAction.new, AccessHtmlElement.new(:css, ".btn.btn-default.dropdown-toggle"))
    add_action(CucumberLabel.new("Appointments Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#grid-filter-appointments #input-filter-search"))
    add_action(CucumberLabel.new("Lab Results Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .form-search>input"))
    add_action(CucumberLabel.new("Problems Overlay Button"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-options-button-"))  
    add_action(CucumberLabel.new("Problems Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "#left .options-box-expanded "))  
    add_action(CucumberLabel.new("Allergies Overlay Button"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-options-button-"))
    add_action(CucumberLabel.new("Allergies Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "#right .options-box-expanded "))
    add_action(CucumberLabel.new("Allergies Gist View"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='grid-panel-']/ul/li[3]/span/a/div"))    
    add_action(CucumberLabel.new("Community Health Summaries Expand Button"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=ccd_grid] .applet-maximize-button"))
    add_action(CucumberLabel.new("Community Health Summaries Filter Button"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-ccd_grid"))
    add_action(CucumberLabel.new("Community Health Summaries Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#grid-filter-ccd_grid input"))   
    add_action(CucumberLabel.new("Back to Top Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='toc_ccd_Active Allergies and Adverse Reactions']/a/small"))
    add_action(CucumberLabel.new("Active Problems Hyperlink"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='modal-body']/div/div/div[1]/ul/li[4]/a"))
    add_action(CucumberLabel.new("Erythromycin Allergy"), ClickAction.new, AccessHtmlElement.new(:css, "div.allergyBubbleView div:nth-child(1) span"))
    add_action(CucumberLabel.new("CHOCOLATE"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-allergy-9E7A-3-874"))
    add_action(CucumberLabel.new("Diabetes Mellitus Type II or unspecified"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-problem-9E7A-3-183"))
    add_action(CucumberLabel.new("Modal Close Button"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button")) 
    add_action(CucumberLabel.new("Coversheet Modal Close Button"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-footer div div.pull-right"))   
    add_action(CucumberLabel.new("Allergies Expand Button"), ClickAction.new, AccessHtmlElement.new(:css, "#e543e81ca31a span.pull-right span.grid-resize button")) 
    add_action(CucumberLabel.new("Standardized Allergen"), ClickAction.new, AccessHtmlElement.new(:css, "#allergy_grid-standardizedName>a")) 
    add_action(CucumberLabel.new("Allergies Filter Button"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-allergy_grid"))
    add_action(CucumberLabel.new("Allergies Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#grid-filter-allergy_grid input"))
    add_action(CucumberLabel.new("Vitals Expand Button"), ClickAction.new, AccessHtmlElement.new(:css, "#dc49ad17e67c .applet-maximize-button.btn.btn-xs.btn-link")) 
    add_action(CucumberLabel.new("Vitals Filter Button"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-button-vitals"))
    add_action(CucumberLabel.new("Vitals Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#grid-filter-vitals #input-filter-search"))
    add_action(CucumberLabel.new("Dod Encounter"), ClickAction.new, AccessHtmlElement.new(:id, "urn-va-visit-DOD-0000000003-1000000382"))
    add_action(CucumberLabel.new("Continuity of Care Document"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-vlerdocument-VLER-10108V420871-e587bf82-bfae-4499-9ca8-6babf6eea630"))
    add_action(CucumberLabel.new("Iodine Containing Agents"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-allergy-DOD-0000000003-1000010342"))
    add_action(CucumberLabel.new("Summarization of episode note"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-vlerdocument-VLER-10108V420871-5a31395c-b245-4333-b62f-e94fb0c7ae5d"))
    add_action(CucumberLabel.new("Occasional, uncontrolled chest pain"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-problem-ABCD-17-58"))
    add_action(CucumberLabel.new("Info button"), ClickAction.new, AccessHtmlElement.new(:css, "#info-button-sidekick-detailView > i"))   
    add_action(CucumberLabel.new("Chronic Systolic Heart failure"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-problem-9E7A-3-323"))
    add_action(CucumberLabel.new("Problems Description"), ClickAction.new, AccessHtmlElement.new(:id, "problems-problemText"))
    add_action(CucumberLabel.new("Problems Acuity"), ClickAction.new, AccessHtmlElement.new(:id, "problems-acuityName"))
    add_action(CucumberLabel.new("Problems Filter Button"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-problems"))
    add_action(CucumberLabel.new("Problems Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#grid-filter-problems input"))
    add_action(CucumberLabel.new("Problems Expand Button"), ClickAction.new, AccessHtmlElement.new(:css, ".applet-maximize-button.btn.btn-xs.btn-link"))
    add_action(CucumberLabel.new("Immunization Date Header"), ClickAction.new, AccessHtmlElement.new(:id, "immunizations-administeredDateTime"))
    add_action(CucumberLabel.new("Immunizations Expand Button"), ClickAction.new, AccessHtmlElement.new(:css, "#a7dace4f6e1f .applet-maximize-button.btn.btn-xs.btn-link")) 
    add_action(CucumberLabel.new("all-range-vitals"), ClickAction.new, AccessHtmlElement.new(:id, "all-range-vitals"))
    add_action(CucumberLabel.new("1 yr Vitals Range"), ClickAction.new, AccessHtmlElement.new(:id, "1yr-range-vitals"))
    add_action(CucumberLabel.new("24 hr Vitals Range"), ClickAction.new, AccessHtmlElement.new(:id, "24hr-range-vitals"))
    add_action(CucumberLabel.new("24 hr Appointments Range"), ClickAction.new, AccessHtmlElement.new(:id, "24hr-range-appointments"))
    add_action(CucumberLabel.new("Modal X Button"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-header > div > div > div > div.labs-modal-nav-buttons.col-md-6.text-right > button.close > span:nth-child(1)"))   
    add_action(CucumberLabel.new("Workspace Manager"), ClickAction.new, AccessHtmlElement.new(:id, "workspace-manager-button"))  
  end

  def initialize_immunizations
    add_action(CucumberLabel.new("Immunizations Filter Button"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-immunizations"))
    add_action(CucumberLabel.new("Immunizations Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#a7dace4f6e1f .backgrid-filter.form-search input"))
    add_action(CucumberLabel.new("Immunizations Filter Field Expand"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, ".backgrid-filter.form-search>input"))
  end
end #Navigation

class CountElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    @@count_allergy_pills = AccessHtmlElement.new(:xpath, ".//*[@id='allergy_grid-PILL-gist-items']/div")
    add_verify(CucumberLabel.new("Allergy Coversheet"), VerifyXpathCount.new(@@count_allergy_pills), @@count_allergy_pills)
    @@count_modal_rows = AccessHtmlElement.new(:xpath, "//*[@id='modal-body']/descendant::div[contains(@class,'row')]")
    add_verify(CucumberLabel.new("Modal Body"), VerifyXpathCount.new(@@count_modal_rows), @@count_modal_rows)
    @@count_expanded_rows = AccessHtmlElement.new(:xpath, ".//*[@id='data-grid-allergy_grid']/tbody/tr")
    add_verify(CucumberLabel.new("Expanded Allergy Rows"), VerifyXpathCount.new(@@count_expanded_rows), @@count_expanded_rows)
    @@vitals_cover_count = AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-vitals']/div[3]/div/div/div[1]/div/table/tbody/tr")
    add_verify(CucumberLabel.new("Vitals Coversheet"), VerifyXpathCount.new(@@vitals_cover_count), @@vitals_cover_count)
    @@count_expanded_vitals_rows = AccessHtmlElement.new(:xpath, ".//*[@id='data-grid-vitals']/tbody/tr")
    add_verify(CucumberLabel.new("Expanded Vitals Rows"), VerifyXpathCount.new(@@count_expanded_vitals_rows), @@count_expanded_vitals_rows)
    @@count_action = AccessHtmlElement.new(:xpath, ".//*[@id='data-grid-problems']/tbody/tr")
    add_verify(CucumberLabel.new("Problems table"), VerifyXpathCount.new(@@count_action), @@count_action)
    @@count_immunization_modal_rows = AccessHtmlElement.new(:xpath, ".//*[@id='data-grid-immunizations']/tbody/tr")
    add_verify(CucumberLabel.new("Immunizations table"), VerifyXpathCount.new(@@count_immunization_modal_rows), @@count_immunization_modal_rows)
    @@count_appointment_rows = AccessHtmlElement.new(:xpath, ".//*[@id='data-grid-appointments']/tbody/tr")
    add_verify(CucumberLabel.new("Appointments table"), VerifyXpathCount.new(@@count_appointment_rows), @@count_appointment_rows)
    @@count_carousel_elements = AccessHtmlElement.new(:xpath, "//*[@id='applets-carousel']/div[1]/div[2]/div/div")
    add_verify(CucumberLabel.new("Editor's Carousel"), VerifyXpathCount.new(@@count_carousel_elements), @@count_carousel_elements)
  end
end #CountElements

#Validate and wait for the number of rows/pills in the applet 
When(/^the "(.*?)" contain (\d+) items$/) do |applet, num|
  aa = CountElements.instance
  TestSupport.wait_for_page_loaded
  expect(aa.wait_until_xpath_count(applet, num, 50)).to be_true
  TestSupport.wait_for_page_loaded
end

#Perform any selection or button click
When(/^the user clicks the "(.*?)"$/) do |html_action_element|
  driver = TestSupport.driver
  navigation = Navigation.instance
  navigation.wait_until_action_element_visible(html_action_element, 40)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
  if html_action_element == "Diabetes Mellitus Type II or unspecified" || html_action_element == "Iodine Containing Agents"
    driver.find_element(:id, "info-button-sidekick-detailView").click
  end
end

#Validate the headers of the modal table
Then(/^the modal view contains the headers$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#modal-header div")
  #Loop through rows in cucumber   
  table.rows.each do | row_defined_in_cucumber |
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#mainModalLabel")     
      if row_defined_in_cucumber.length != row_data.length
        matched = false
        p "The number of columns in the UI is #{row_data.length} but in cucumber it's #{row_defined_in_cucumber.length}"
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)            
      end         
      if matched
        break 
      end
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    driver.save_screenshot("incorrect_rows.png") unless matched
    expect(matched).to be_true
  end#do loop  
end

#Validate the rows of the modal view 
Then(/^the modal body contains the rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#modal-body div div")
  #Loop through rows in cucumber   
  table.rows.each do | row_defined_in_cucumber |
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#modal-body > div > div:nth-child(#{i}) > div")     
      if row_defined_in_cucumber.length != row_data.length
        matched = false
        p "The number of columns in the UI is #{row_data.length} but in cucumber it's #{row_defined_in_cucumber.length}"
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)            
      end         
      if matched
        break 
      end
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    driver.save_screenshot("incorrect_rows.png") unless matched
    expect(matched).to be_true
  end#do loop  
end

#Enter Search Term
When(/^the user enters "(.*?)" into the "(.*?)"$/) do |text, html_element|
  navigation = Navigation.instance
  navigation.wait_until_action_element_visible(html_element, DefaultLogin.wait_time)
  expect(navigation.perform_action(html_element, text)).to be_true, "Error when attempting to enter '#{text}' into #{html_element}"
end

Then(/^the modal closes$/) do
  driver = TestSupport.driver
  wait_until_modal_is_not_displayed
end

Then(/^user goes to bottom of screen$/) do
  driver = TestSupport.driver
  wait_until_modal_is_not_displayed
  navigation = Navigation.instance
  driver.execute_script("document.querySelector('#toc_ccd_Medications').scrollIntoView()")
  #driver.execute_script("$('#modal-body').scrollTop(500)")  
end

Then(/^user goes to top of screen$/) do
  driver = TestSupport.driver
  #wait_until_modal_is_not_displayed
  navigation = Navigation.instance
  driver.execute_script("$('#modal-body').scrollTop(0)")
end
