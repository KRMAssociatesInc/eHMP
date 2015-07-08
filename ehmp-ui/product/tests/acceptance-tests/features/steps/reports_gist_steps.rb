class ReportsGistContainer <  ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Reports Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=reports] .panel-title"))
    add_action(CucumberLabel.new("Procedure"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-procedure-9E7A-65-5-MCAR(699,']/td[1]"))
    add_action(CucumberLabel.new("Control - applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=reports] .applet-maximize-button"))
    add_verify(CucumberLabel.new("ReportsGridVisible"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-reports"))
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:link_text, "Date"))
    add_verify(CucumberLabel.new("Type"), VerifyText.new, AccessHtmlElement.new(:link_text, "Type")) 
    add_verify(CucumberLabel.new("Entered By"), VerifyText.new, AccessHtmlElement.new(:link_text, "Entered By"))
    add_action(CucumberLabel.new("Control - applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=reports] #grid-filter-button-reports"))
    add_action(CucumberLabel.new("Control - applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=reports] .form-search input"))
    @@reports_applet_data_grid_rows = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-reports']/descendant::tr")
    add_verify(CucumberLabel.new("Number of Report Applet Rows"), VerifyXpathCount.new(@@reports_applet_data_grid_rows), @@reports_applet_data_grid_rows)                 
  end
end 

Then(/^user sees Reports Gist$/) do  
  aa = ReportsGistContainer.instance  
  expect(aa.wait_until_action_element_visible("Reports Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("Reports Title", "REPORTS")).to be_true
end

Then(/^the user selects the "(.*?)" row in Reports Gist$/) do |kind|
  aa = ReportsGistContainer.instance 
  expect(aa.wait_until_action_element_visible("Procedure", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(kind, "")).to be_true
end

When(/^the Reports Gist Applet table contains headers$/) do |table|
  aa = ReportsGistContainer.instance 
  expect(aa.wait_until_action_element_visible("ReportsGridVisible", DefaultLogin.wait_time)).to be_true
    
  table.rows.each do | row |
    expect(aa.perform_verification('Date', row[0])).to be_true, "The header #{row[0]} is not present in the reports gist"
    expect(aa.perform_verification('Type', row[1])).to be_true, "The header #{row[1]} is not present in the reports gist"
    expect(aa.perform_verification('Entered By', row[2])).to be_true, "The header #{row[2]} is not present in the reports gist"
  end
end

Then(/^the Reports Gist table contains specific rows$/) do |table|
  verify_table_rows_reports(table)
end

Then(/^title of the Reports Applet says "(.*?)"$/) do |arg1|
  aa = ReportsGistContainer.instance  
  expect(aa.wait_until_action_element_visible("Reports Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("Reports Title", "REPORTS")).to be_true
end

Then(/^the reports gist view is filtered to (\d+) items$/) do |num_items|
  aa = ReportsGistContainer.instance 
  expect(aa.wait_until_xpath_count_greater_than("Number of Reports Applet Rows", num_items)).to be_true, "Expected #{num_items} but didn't find that in the application"
end

def verify_table_rows_reports(table)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.compare_specific_row(table, '#data-grid-reports') }
end
