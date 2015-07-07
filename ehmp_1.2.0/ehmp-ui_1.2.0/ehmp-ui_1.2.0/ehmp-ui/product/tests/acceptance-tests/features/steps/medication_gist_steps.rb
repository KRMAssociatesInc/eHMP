class MedicationGistContainer <  AccessBrowserV2
  include Singleton
  def initialize
    super

    add_verify(CucumberLabel.new("MedicationGistVisible"), VerifyText.new, AccessHtmlElement.new(:id, "activeMeds-interventions-gist-items"))
    add_verify(CucumberLabel.new("Medication Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'activeMeds-interventions-gist-items'))
    add_action(CucumberLabel.new("Control - applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=activeMeds] #grid-filter-button-activeMeds"))
    add_action(CucumberLabel.new("Control - applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=activeMeds] .form-search input"))
    add_action(CucumberLabel.new("Amoxapine Tablet"), ClickAction.new, AccessHtmlElement.new(:id, "name"))
    add_action(CucumberLabel.new("Medication Header"), ClickAction.new, AccessHtmlElement.new(:id, "Name-header"))
    add_action(CucumberLabel.new("Last Header"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@data-appletid='activeMeds']/descendant::*[@id='Age-header']"))
    add_action(CucumberLabel.new("Refills Header"), ClickAction.new, AccessHtmlElement.new(:id, "Severity-header"))
    add_action(CucumberLabel.new("Control - applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=activeMeds] .applet-maximize-button"))
    add_verify(CucumberLabel.new("Medication Gist Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=activeMeds] .panel-title")) 
    
    add_verify(CucumberLabel.new("Name"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'name'))  
    add_verify(CucumberLabel.new("Description"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'description'))
    add_verify(CucumberLabel.new("Count"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'count'))
    add_verify(CucumberLabel.new("Graphic"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'graphic'))
    add_verify(CucumberLabel.new("Age"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'ageAdjust'))
     
    add_verify(CucumberLabel.new("Medication Gist Items"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'activeMeds-interventions-gist-items'))
      
    gist_view_count = AccessHtmlElement.new(:xpath, "//*[@id='activeMeds-interventions-gist-items']/descendant::div[contains(@name, 'name')]")
    add_verify(CucumberLabel.new('medication gist view count'), VerifyXpathCount.new(gist_view_count), gist_view_count)
    add_action(CucumberLabel.new("Amoxapine Tablet Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='activeMeds-interventions-gist-items']/descendant::a[@id='detailView-button-toolbar']"))
  end
end 

Before do
  @mg = MedicationGistContainer.instance
end

Then(/^the "(.*?)" gist is displayed$/) do |expected_gist_title|
  @mg.wait_until_action_element_visible("Medication Gist Title")
  expect(@mg.perform_verification("Medication Gist Title", expected_gist_title)).to be_true
end

Then(/^the Medication Gist overview table contains headers$/) do |table|
  verify_table_headers(MedicationGistContainer.instance, table)
end

Then(/^the medication gist view has the following information$/) do |table|

  expect(@mg.wait_until_action_element_visible("MedicationGistVisible", DefaultLogin.wait_time)).to be_true
    
#  table.rows.each do | row |
#    expect(@mg.perform_verification('Name', row[0])).to be_true, "The value #{row[0]} is not present in the medication details"
#    expect(@mg.perform_verification('Description', row[1])).to be_true, "The value #{row[1]} is not present in the medication details"
#    expect(@mg.perform_verification('Count', row[2])).to be_true, "The value #{row[2]} is not present in the medication details"
#    expect(@mg.perform_verification('Graphic', row[3])).to be_true, "The value #{row[3]} is not present in the medication details"
#    expect(@mg.perform_verification('Age', row[4])).to be_true, "The value #{row[4]} is not present in the medication details"
#  end
  
  table.rows.each do | row |
    expect(@mg.perform_verification('Medication Gist Items', row[0])).to be_true, "The value #{row[0]} is not present in the medication details"
    expect(@mg.perform_verification('Medication Gist Items', row[1])).to be_true, "The value #{row[1]} is not present in the medication details"
    expect(@mg.perform_verification('Medication Gist Items', row[2])).to be_true, "The value #{row[2]} is not present in the medication details"
    expect(@mg.perform_verification('Medication Gist Items', row[3])).to be_true, "The value #{row[3]} is not present in the medication details"
#    expect(@mg.perform_verification('Medication Gist Items', row[4])).to be_true, "The value #{row[4]} is not present in the medication details"
  end
end

Then(/^the medication gist view is filtered to (\d+) item$/) do |number_of_items|
  expect(@mg.perform_verification('medication gist view count', number_of_items)).to be_true
end

When(/^user clicks on "(.*?)" medication name$/) do |medication_name|
  expect(@mg.wait_until_action_element_visible("MedicationGistVisible", DefaultLogin.wait_time)).to be_true
  expect(@mg.perform_action(medication_name, "")).to be_true
end

When(/^user clicks on the column header "(.*?)"$/) do | name_column_header |
  expect(@mg.wait_until_action_element_visible("MedicationGistVisible", DefaultLogin.wait_time)).to be_true
  expect(@mg.perform_action(name_column_header + " Header", "")).to be_true
end

Then(/^"(.*?)" column is sorted in ascending order$/) do |column_name|
  driver = TestSupport.driver
  expect(@mg.wait_until_action_element_visible("MedicationGistVisible", DefaultLogin.wait_time)).to be_true
  column_values_array = []

  case column_name
  when 'Medication'
    element_column_values = driver.find_elements(id: 'name')
  when 'Refills'
    element_column_values = driver.find_elements(id: 'count')
  else
    fail "**** No function found! Check your script ****"
  end
        
  element_column_values.each do | row |
    p row.text
    column_values_array << row.text.downcase
  end

  (column_values_array == column_values_array.sort).should == true

end

Then(/^"(.*?)" column is sorted in descending order$/) do |column_name|
  driver = TestSupport.driver
  expect(@mg.wait_until_action_element_visible("MedicationGistVisible", DefaultLogin.wait_time)).to be_true
  column_values_array = []

  case column_name
  when 'Medication'
    element_column_values = driver.find_elements(id: 'name')
  when 'Refills'
    element_column_values = driver.find_elements(id: 'count')
  else
    fail "**** No function found! Check your script ****"
  end
     
  element_column_values.each do | row |
    column_values_array << row.text.downcase
  end
  
  (column_values_array == column_values_array.sort { |x, y| y <=> x }).should == true
end

Then(/^user selects the "(.*?)" detail icon in Medications Gist$/) do |arg1|
  label = "#{arg1} Detail View Icon"
  expect(@mg.perform_action(label)).to be_true
end







