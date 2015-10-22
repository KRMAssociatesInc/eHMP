class ConditionsGist <  ADKContainer
  include Singleton
  def initialize
    super   
    add_verify(CucumberLabel.new("Conditions Gist Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .panel-title"))
    add_verify(CucumberLabel.new("ConditionsGridVisible"), VerifyText.new, AccessHtmlElement.new(:id, "problems-event-gist-items"))
    add_verify(CucumberLabel.new("conditions details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'problems-event-gist-items'))
    add_verify(CucumberLabel.new("conditions column header"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'eventGistGrid'))
    add_action(CucumberLabel.new("Control - applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] #grid-filter-button-problems"))
    add_action(CucumberLabel.new("Control - applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .form-search input"))
    add_action(CucumberLabel.new("Control - applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .applet-maximize-button"))
    add_verify(CucumberLabel.new("Conditons Gist Applet Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .panel-title"))
    add_action(CucumberLabel.new("quick view"), ClickAction.new, AccessHtmlElement.new(:id, "quickLook_urn_va_problem_9E7A_711_141"))
    add_verify(CucumberLabel.new("Main Modal Label"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("Problem Header"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] #problems-event-gist #name-header"))
    add_action(CucumberLabel.new("Acuity Header"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] #problems-event-gist #comment-header"))
    add_action(CucumberLabel.new("Hx Occurrence Header"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] #problems-event-gist #count-header1"))
    add_action(CucumberLabel.new("Last Header"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] #problems-event-gist #count-header2"))
    add_action(CucumberLabel.new("Manic Disorder"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .gistItem:nth-child(3) .col-sm-6.quickDraw.selectable.info-display.noPadding"))
    add_verify(CucumberLabel.new("No Records Found"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .emptyGistList"))

    #Chronic sinusitiscol-sm-6 quickDraw selectable info-display noPadding
    add_action(CucumberLabel.new("Chronic sinusitis"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .gistItem:nth-child(2) .col-sm-6.quickDraw.selectable.border-vertical.info-display.noPadding"))
    add_action(CucumberLabel.new("Essential Hypertension"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .gistItem:nth-child(5) .col-sm-6.quickDraw.selectable.info-display.noPadding"))
    
    
    #menu  
    add_action(CucumberLabel.new("Quick View Icon"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] div.toolbarActive [button-type=quick-look-button-toolbar]"))
    add_action(CucumberLabel.new("Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] div.toolbarActive [button-type=detailView-button-toolbar]"))
    
    # START COMMENT
    # originally these buttons were found through css selectors.
    # the selectors worked locally but were failing when run on jenkins
    # when I say locally
    #     a. laptop terminal against laptop vms with browser phantomjs
    #     b. laptop terminal against jenkins acc test job url with browser phantomjs
    manic_disorder_xpath = "//*[@id='event_urn_va_problem_9E7A_711_141']"
    applet_toolbar_xpath = "/preceding-sibling::div[@class='toolbarContainer']/div[@class='appletToolbar']"
    add_action(CucumberLabel.new("Mainic Disorder Quick View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{manic_disorder_xpath}/#{applet_toolbar_xpath}/descendant::*[@button-type='quick-look-button-toolbar']"))
    add_action(CucumberLabel.new("Mainic Disorder Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{manic_disorder_xpath}/#{applet_toolbar_xpath}/descendant::*[@button-type='detailView-button-toolbar']"))
    # END COMMENT
  end
end 

class ConditionsGistHeaders < ADKContainer
  include Singleton
  def initialize
    super   

    add_verify(CucumberLabel.new('Description'), VerifyContainsText.new, AccessHtmlElement.new(:css, '#problems-problemText a'))
    add_verify(CucumberLabel.new('Standardized Description'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'problems-standardizedDescription'))
    add_verify(CucumberLabel.new('Acuity'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'problems-acuityName'))
    add_verify(CucumberLabel.new('Onset Date'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'problems-onsetFormatted'))
    add_verify(CucumberLabel.new('Last Updated'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'problems-updatedFormatted'))
    add_verify(CucumberLabel.new('Provider'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'problems-providerDisplayName'))
    add_verify(CucumberLabel.new('Facility'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'problems-facilityMoniker'))
  end
end

class ProblemList <  ADKContainer
  include Singleton
  def initialize
    super   
    add_verify(CucumberLabel.new("MANIC DISORDER-MILD - Problem"), VerifyContainsText.new, AccessHtmlElement.new(:id, "event_name_urn_va_problem_9E7A_711_141"))
    add_verify(CucumberLabel.new("UPPER EXTREMITY - Problem"), VerifyText.new, AccessHtmlElement.new(:id, "event_name_urn_va_problem_9E7A_711_139"))
    add_verify(CucumberLabel.new("Essential Hypertension - Problem"), VerifyContainsText.new, AccessHtmlElement.new(:id, "event_name_urn_va_problem_9E7A_711_79"))
    add_verify(CucumberLabel.new("ALCOH DEP NEC/NOS-REMISS - Problem"), VerifyContainsText.new, AccessHtmlElement.new(:id, "event_name_urn_va_problem_9E7A_711_69"))
    add_verify(CucumberLabel.new("Adjustment Reaction With Physical Symptoms - Problem"), VerifyContainsText.new, AccessHtmlElement.new(:id, "event_name_urn_va_problem_9E7A_711_70"))
    add_verify(CucumberLabel.new("Chronic Sinusitis - Problem"), VerifyContainsText.new, AccessHtmlElement.new(:id, "event_name_urn_va_problem_9E7A_711_72"))
      
    add_verify(CucumberLabel.new("MANIC DISORDER-MILD - Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "acuity_urn_va_problem_9E7A_711_141"))
    add_verify(CucumberLabel.new("UPPER EXTREMITY - Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "acuity_urn_va_problem_9E7A_711_139"))
    add_verify(CucumberLabel.new("Essential Hypertension - Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "acuity_urn_va_problem_9E7A_711_79"))
    add_verify(CucumberLabel.new("ALCOH DEP NEC/NOS-REMISS - Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "acuity_urn_va_problem_9E7A_711_69"))
    add_verify(CucumberLabel.new("Adjustment Reaction With Physical Symptoms - Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "acuity_urn_va_problem_9E7A_711_70"))
    add_verify(CucumberLabel.new("Chronic Sinusitis - Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "acuity_urn_va_problem_9E7A_711_72"))
      
    add_verify(CucumberLabel.new("MANIC DISORDER-MILD - Occurrence"), VerifyContainsText.new, AccessHtmlElement.new(:id, "encounter_count_urn_va_problem_9E7A_711_141"))
    add_verify(CucumberLabel.new("UPPER EXTREMITY - Occurrence"), VerifyContainsText.new, AccessHtmlElement.new(:id, "encounter_count_urn_va_problem_9E7A_711_139"))
    add_verify(CucumberLabel.new("Essential Hypertension - Occurrence"), VerifyContainsText.new, AccessHtmlElement.new(:id, "encounter_count_urn_va_problem_9E7A_711_79"))
    add_verify(CucumberLabel.new("ALCOH DEP NEC/NOS-REMISS - Occurrence"), VerifyContainsText.new, AccessHtmlElement.new(:id, "encounter_count_urn_va_problem_9E7A_711_69"))
    add_verify(CucumberLabel.new("Adjustment Reaction With Physical Symptoms - Occurrence"), VerifyContainsText.new, AccessHtmlElement.new(:id, "encounter_count_urn_va_problem_9E7A_711_70"))
    add_verify(CucumberLabel.new("Chronic Sinusitis - Occurrence"), VerifyContainsText.new, AccessHtmlElement.new(:id, "encounter_count_urn_va_problem_9E7A_711_72"))
      
    add_verify(CucumberLabel.new("MANIC DISORDER-MILD - Last"), VerifyContainsText.new, AccessHtmlElement.new(:id, "time_since_urn_va_problem_9E7A_711_141"))
    add_verify(CucumberLabel.new("UPPER EXTREMITY - Last"), VerifyContainsText.new, AccessHtmlElement.new(:id, "time_since_urn_va_problem_9E7A_711_139"))
    add_verify(CucumberLabel.new("Essential Hypertension - Last"), VerifyContainsText.new, AccessHtmlElement.new(:id, "time_since_urn_va_problem_9E7A_711_79"))
    add_verify(CucumberLabel.new("ALCOH DEP NEC/NOS-REMISS - Last"), VerifyContainsText.new, AccessHtmlElement.new(:id, "time_since_urn_va_problem_9E7A_711_69"))
    add_verify(CucumberLabel.new("Adjustment Reaction With Physical Symptoms - Last"), VerifyContainsText.new, AccessHtmlElement.new(:id, "time_since_urn_va_problem_9E7A_711_70"))
    add_verify(CucumberLabel.new("Chronic Sinusitis - Last"), VerifyContainsText.new, AccessHtmlElement.new(:id, "time_since_urn_va_problem_9E7A_711_72"))
  end
end 

Before do
  @cg = ConditionsGist.instance
end

Then(/^user sees Conditions Gist$/) do  
  expect(@cg.wait_until_action_element_visible("Conditions Gist Title", DefaultLogin.wait_time)).to be_true
  expect(@cg.perform_verification("Conditions Gist Title", "CONDITIONS")).to be_true
end

Then(/^the conditions gist detail view contains$/) do |table|
  
  aa = ProblemList.instance
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
    
  table.rows.each do |row|
    expect(aa.perform_verification(row[0] + " - Problem", row[0])).to be_true, "The value #{row[0]} is not present in the conditions gist"
    expect(aa.perform_verification(row[0] + " - Acuity", row[1])).to be_true, "The value #{row[1]} is not present in the conditions gist"
    expect(aa.perform_verification(row[0] + " - Occurrence", row[2])).to be_true, "The value #{row[2]} is not present in the conditions gist"
    expect(aa.perform_verification(row[0] + " - Last", row[3])).to be_true, "The value #{row[3]} is not present in the conditions gist"
  end
end

Then(/^the conditions gist detail view has headers$/) do |table|
  
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
    
  table.rows.each do |row|
    expect(@cg.perform_verification('conditions column header', row[0])).to be_true, "The value #{row[0]} is not present in the conditions detail headers"
  end
end

Then(/^the Conditions Gist applet title is "(.*?)"$/) do |title|
  expect(@cg.wait_until_action_element_visible("Conditons Gist Applet Title", DefaultLogin.wait_time)).to be_true
  expect(@cg.perform_verification("Conditons Gist Applet Title", title)).to be_true
end

Then(/^hovering over the histogram of a problem and selecting the "(.*?)" pop\-up link$/) do |quick_view| 
  driver = TestSupport.driver
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  hover = wait.until { driver.find_element(:id, "quickDraw_urn_va_problem_9E7A_711_141") }
  driver.action.move_to(hover).perform       
  expect(@cg.perform_action(quick_view, "")).to be_true
end

Then(/^clicking a second time on the "(.*?)" hover button will result in the closure of the quick draw data box$/) do |quick_view|
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true      
  expect(@cg.perform_action(quick_view, "")).to be_true
end

When(/^user clicks on the left hand side of the item "(.*?)"$/) do |problem_text|
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true      
  expect(@cg.perform_action(problem_text, "")).to be_true, "cannot click on the problem text"
end

Then(/^it should show the detail modal of the most recent for this problem$/) do
  expect(@cg.wait_until_action_element_visible("Main Modal Label", DefaultLogin.wait_time)).to be_true
end

When(/^user clicks on the column header "(.*?)" in Conditions Gist$/) do |name_column_header|
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  expect(@cg.perform_action(name_column_header + " Header", "")).to be_true
end

Then(/^"(.*?)" column is sorted in ascending order in Conditions Gist$/) do |column_name|
  driver = TestSupport.driver
  column_values_array = []
    
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  
  case column_name
  when 'Problem'
    element_column_values = driver.find_elements(css: '#problems-event-gist-items div.col-sm-8.problem-name')
  when 'Acuity'
    element_column_values = driver.find_elements(css: '#problems-event-gist-items div.col-sm-4')
  when 'Hx Occurrence'
    element_column_values = driver.find_elements(css: '#problems-event-gist-items div.eventsCount.col-sm-2.counter2.text-center')
  else
    fail "**** No function found! Check your script ****"
  end
  
  element_column_values.each do |row|
    #    print "selenium data ----"
    #    p row.text   
    if column_name == "Hx Occurrence"
      column_values_array << row.text.downcase.to_i
    else
      column_values_array << row.text.downcase
    end
    
  end
  #  print "sorted data -----"
  #  p column_values_array.sort { |x, y| x <=> y }    
  (column_values_array == column_values_array.sort { |x, y| x <=> y }).should == true
end

Then(/^"(.*?)" column is sorted in descending order in Conditons Gist$/) do |column_name|
  driver = TestSupport.driver
  column_values_array = []
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true   
 
  case column_name
  when 'Problem'
    element_column_values = driver.find_elements(css: '#problems-event-gist-items div.col-sm-8.problem-name')
  when 'Acuity'
    element_column_values = driver.find_elements(css: '#problems-event-gist-items div.col-sm-4')
  when 'Hx Occurrence'
    element_column_values = driver.find_elements(css: '#problems-event-gist-items div.eventsCount.col-sm-2.counter2.text-center')
  else
    fail "**** No function found! Check your script ****"
  end
     
  element_column_values.each do |row|
    #    print "selenium data ----"
    #    p row.text
    if column_name == "Hx Occurrence"
      column_values_array << row.text.downcase.to_i
    else
      column_values_array << row.text.downcase
    end
  end
  
  (column_values_array == column_values_array.sort { |x, y| y <=> x }).should == true
end

Then(/^Last column is sorted in "(.*?)" order in Conditions Gist$/) do |_arg1|
  driver = TestSupport.driver
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  element_column_values = driver.find_elements(css: '#problems-event-gist-items div.eventsTimeSince.counter2.text-center')
  column_values_array = []
  element_column_values.each do |row|
    #column_values_array << row.text.downcase
    column_values_array << (/\d+/.match(row.text.downcase)).to_s
  end
  p column_values_array
  
  if _arg1.eql?('descending')
    p 'check ascending'
    higher_placement = column_values_array[0].to_i
    column_values_array.each do |year|
      lower_placement = year.to_i
      expect(higher_placement).to be >= lower_placement, "#{higher_placement} is not >= #{lower_placement}"
    end
  else
    p 'check descending'
    higher_placement = column_values_array[0].to_i
    column_values_array.each do |year|
      lower_placement = year.to_i
      expect(higher_placement).to be <= lower_placement, "#{higher_placement} is not <= #{lower_placement}"
    end
  end
  #cucumber_array = table.headers  
  #(column_values_array == cucumber_array).should == true
end

Then(/^a Menu appears on the Conditions Gist$/) do
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  expect(@cg.wait_until_action_element_visible("Detail View Icon", DefaultLogin.wait_time)).to be_true, "Detail view icon is not displayed"
  expect(@cg.wait_until_action_element_visible("Quick View Icon", DefaultLogin.wait_time)).to be_true, "Quick view icon is not displayed"    
end

Then(/^a Menu appears on the Conditions Gist for item "(.*?)"$/) do |arg1|
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  expect(@cg.wait_until_action_element_visible("#{arg1} Detail View Icon", DefaultLogin.wait_time)).to be_true, "Detail view icon is not displayed"
  expect(@cg.wait_until_action_element_visible("#{arg1} Quick View Icon", DefaultLogin.wait_time)).to be_true, "Quick view icon is not displayed"    
end

When(/^user select the menu "(.*?)" in Conditions Gist$/) do |icon|
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  expect(@cg.perform_action(icon, "")).to be_true, "#{icon} can't be clicked"
end

Then(/^the Conditions Gist Applet table contains headers$/) do |table|
  headers = ConditionsGistHeaders.instance
  table.rows.each do |row|
    expect(headers.perform_verification(row[0], row[0])).to be_true
  end
end

Then(/^the Conditions Gist contains specific rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.compare_specific_row(table, '#data-grid-problems') }
end

Then(/^the Conditions Gist contains rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  con = VerifyTableValue.new 
  driver = TestSupport.driver
  wait.until {  
    browser_elements_list = driver.find_elements(:css, "#data-grid-problems tbody tr")  
    con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-problems']", table)
  }
end

Then(/^user selects the "(.*?)" detail icon in Conditions Gist$/) do |arg1|
  label = "#{arg1} Detail View Icon"
  expect(@cg.perform_action(label)).to be_true
end

Then(/^user selects the "(.*?)" quick view icon in Conditions Gist$/) do |arg1|
  label = "#{arg1} Quick View Icon"
  p label
  expect(@cg.perform_action(label)).to be_true
end

Then(/^"(.*?)" message is displayed in Conditions Gist$/) do |no_records_message|
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  expect(@cg.perform_verification(no_records_message, no_records_message))
end

When(/^hovering over the "(.*?)" side of the tile "(.*?)"$/) do |direction, _problem_text|
  
  driver = TestSupport.driver
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
       
  case direction
  when 'right'
    hover = wait.until { driver.find_element(:css, "#quickLook_urn_va_problem_9E7A_711_139") }
    driver.action.move_to(hover).perform 
    p hover.css_value("background-color")    
  when 'left'
    hover = wait.until { driver.find_element(:css, "[data-appletid=problems] #event_urn_va_problem_9E7A_711_139 .col-sm-6.quickDraw.selectable.info-display.noPadding") }
    driver.action.move_to(hover).perform 
    p hover.css_value("background-color")  
  else
    fail "**** No function found! Check your script ****"
  end
end

Then(/^right half of the tile "(.*?)" changes color to indicate that there are more records that can be review$/) do |_arg1|
  driver = TestSupport.driver
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  element = driver.find_element(:css, "#quickLook_urn_va_problem_9E7A_711_139")
  p element.css_value("background-color")
end

Then(/^left half of the tile "(.*?)" changes color to indicate that the user can go to the detailed view$/) do |_arg1|
  driver = TestSupport.driver
  expect(@cg.wait_until_action_element_visible("ConditionsGridVisible", DefaultLogin.wait_time)).to be_true
  element = driver.find_element(:css, "[data-appletid=problems] #event_urn_va_problem_9E7A_711_139 .col-sm-6.quickDraw.selectable.info-display.noPadding")
  p element.css_value("background-color")
end


