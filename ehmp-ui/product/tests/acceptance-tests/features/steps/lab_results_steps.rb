path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'
require 'date'

class LabResultsSpecificRows < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("HEMOGLOBIN A1C - BLOOD"), ClickAction.new, AccessHtmlElement.new(:id, 'urn-va-lab-9E7A-253-CH-6899693-9-462'))
    add_action(CucumberLabel.new('COAG PROFILE BLOOD PLASMA WC LB #2988'), ClickAction.new, AccessHtmlElement.new(:id, 'COAGPROFILEBLOODPLASMAWCLB2988_urn-va-accession-9E7A-3-CH-6939397-7644'))
    add_action(CucumberLabel.new('PROTIME - PLASMA'), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='details-COAGPROFILEBLOODPLASMAWCLB2988_urnvaaccession9E7A3CH69393977644']/descendant::td[contains(string(), 'PROTIME - PLASMA')]"))
    add_verify(CucumberLabel.new('No Records Found'), VerifyText.new, AccessHtmlElement.new(:css, '#data-grid-lab_results_grid td'))
    add_action(CucumberLabel.new("TRIGLYCERIDE - SERUM"), ClickAction.new, AccessHtmlElement.new(:id, 'urn-va-lab-9E7A-253-CH-6899693-88-47'))
  end
end

class LabResultsContainer < AccessBrowserV2
  include Singleton

  def initialize
    super
    add_verify(CucumberLabel.new("Lab Results single page"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".lab-results-grid-full"))

    ########################### Applet ###########################
    add_action(CucumberLabel.new("Control - applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .applet-maximize-button"))
    add_action(CucumberLabel.new("Control - applet - Minimize View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .applet-minimize-button"))
    add_action(CucumberLabel.new("Control - applet - Date Sort"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #lab_results_grid-observed a"))
    add_action(CucumberLabel.new("Control - applet - Apply"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #custom-range-apply-lab_results_grid"))
    add_action(CucumberLabel.new("Control - applet - From Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #filter-from-date-lab_results_grid"))
    add_action(CucumberLabel.new("Control - applet - To Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #filter-to-date-lab_results_grid"))
    add_action(CucumberLabel.new("Control - applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .form-search input"))
    add_action(CucumberLabel.new("Control - applet - Flag column"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #lab_results_grid-flag a"))
    add_action(CucumberLabel.new("Control - applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #grid-filter-button-lab_results_grid"))
    add_action(CucumberLabel.new("Control - applet - Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .backgrid-paginator [title=Next]"))
    add_action(CucumberLabel.new("Control - applet - First Lab In Panel Detail"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #lab-results-table-contents > tr"))
    add_action(CucumberLabel.new("Control - applet - Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .backgrid-paginator li a[title=\"Next\"]"))

    add_verify(CucumberLabel.new("applet - Table"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] tbody tr"))
    add_verify(CucumberLabel.new("applet - Table - xpath"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@data-appletid='lab_results_grid']/descendant::tbody/descendant::tr"))
    add_verify(CucumberLabel.new("applet - Date Filter"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .grid-filter-daterange"))
    add_verify(CucumberLabel.new("applet - Text Filter"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .grid-filter"))
    add_verify(CucumberLabel.new("applet - Date Time Pickers"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #date-range-pickers-lab_results_grid"))
    add_verify(CucumberLabel.new("applet - Panel Result Detail Row"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #data-grid-lab_results_grid .renderable.expanded-row"))
    add_verify(CucumberLabel.new("applet - Panel Result Detail Hidden Row"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] #data-grid-lab_results_grid .renderable.expanded-row.hide"))
    add_verify(CucumberLabel.new("applet - Complete Table"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] table"))
    add_action(CucumberLabel.new("applet - Disabled Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .backgrid-paginator .disabled a[title=\"Next\"]"))

    ########################### Modal ###########################
    add_action(CucumberLabel.new("Control - modal - From Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "#modal-body #filter-from-date"))
    add_action(CucumberLabel.new("Control - modal - To Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "#modal-body #filter-to-date"))
    add_action(CucumberLabel.new("Control - modal - Apply"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-body #custom-range-apply"))
    add_action(CucumberLabel.new("Control - modal - History - Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-body .backgrid-paginator li [title=\"Next\"]"))
    add_action(CucumberLabel.new("Control - modal - History - Previous Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-body .backgrid-paginator li [title=\"Previous\"]"))
    add_action(CucumberLabel.new("Control - modal - Next Button"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-header #labss-next"))
    add_action(CucumberLabel.new("Control - modal - Previous Button"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-header #labss-previous"))

    add_verify(CucumberLabel.new("modal - Date Range Text"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #date-range-filter label"))
    add_verify(CucumberLabel.new("modal - Title - Lab History table"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#mainModal .panel-primary .panel-title"))
    add_verify(CucumberLabel.new("modal - Title - Lab Graph"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body .panel-info .panel-title"))
    add_verify(CucumberLabel.new("modal - Lab Graph"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #chart-container"))
    add_verify(CucumberLabel.new("modal - Y-axis Label"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #chart-container .highcharts-axis text"))
    add_verify(CucumberLabel.new("modal - Chart Labels"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #chart-container .highcharts-data-labels g"))
    add_verify(CucumberLabel.new("modal - Header - Lab Test"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#lab-results-summary-typeName"))
    add_verify(CucumberLabel.new("modal - Header - Result"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#lab-results-summary-result"))
    add_verify(CucumberLabel.new("modal - Header - Flag"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#lab-results-summary-result"))
    add_verify(CucumberLabel.new("modal - Header - Unit"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#lab-results-summary-facilityCode"))
    add_verify(CucumberLabel.new("modal - Header - Ref Range"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#lab-results-summary-result"))
    add_verify(CucumberLabel.new("modal - Number Of Total Tests"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #total-tests"))
    add_verify(CucumberLabel.new("modal - Lab Results History Table Loading Indicator"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body .panel-primary h5"))
    add_verify(CucumberLabel.new("modal - Lab Results Graph Loading Indicator"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body .panel-info h5"))
    add_verify(CucumberLabel.new("modal - Graph Points"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body .highcharts-markers path"))
    add_verify(CucumberLabel.new("modal - Date Range labels"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #chart-container .highcharts-axis-labels text[text-anchor=middle]"))
  end # initialize
end # LabResultsDateFilterContainer

Before do
  @lr = LabResultsContainer.instance
end

# ######################## functions ########################

# clicks the first panel or non-panel row in the lab results applet based on the parameter
def click_lab_results_applet_row(is_panel)
  sleep 0.5

  attempts ||= 0
  driver = TestSupport.driver

  rows_key = "#data-grid-lab_results_grid tbody tr"

  wait = Selenium::WebDriver::Wait.new(:timeout => 30)
  wait.until { driver.find_elements(:css, rows_key).size > 1 }

  desired_element = nil

  loop do
    # without a small sleep, I was unable to avoid stale references
    sleep 0.2

    result_rows = driver.find_elements(:css, rows_key)

    result_rows.each do |row|
      table_elements = row.find_elements(:css, "td")

      if (is_panel && table_elements[1].text.include?("Panel")) || (!is_panel && !table_elements[1].text.include?("Panel"))
        desired_element = row
        break
      end
    end # result_rows.each
    break if desired_element != nil

    is_next_page_disabled = @lr.get_elements("applet - Disabled Next Page Arrow").size == 1

    if is_next_page_disabled
      fail "Failure clicking lab results applet row."
    end

    wait_and_perform(@lr, "Control - applet - Next Page Arrow")
  end # loop do

  desired_element.click
rescue StandardError => e
  attempts += 1

  if attempts < 3
    p "Attemping retry of action."
    sleep 2
    retry
  else
    p 'There was a error attemping to click the row.'
    raise e
  end # if/else
end

# ######################## When ########################

Then(/^the Lab Results Applet table displays No Records Found$/) do
  expect(LabResultsSpecificRows.instance.perform_verification('No Records Found', 'No Records Found')).to be_true, "The first cell of the first row did not say 'No Records Found'"
end

Given(/^the user has filtered the lab results on the term "(.*?)" down to (\d+) rows$/) do |term, num_expected_rows|
   #And the user clicks the control "Filter Toggle" in the "Lab Results applet"
  #And the user inputs "panel" in the "Text Filter" control in the "Lab Results applet"
  #Then the "Lab Results Applet" table contains 10 rows
  total_expected_rows = num_expected_rows.to_i + 1 # for header

  expect(LabResultsContainer.instance.perform_action('Control - applet - Filter Toggle')).to be_true, "Could not complete action for Control - applet - Filter Toggle"
  expect(LabResultsContainer.instance.perform_action('Control - applet - Text Filter', term)).to be_true, "Could not complete action for Control - applet - Text Filter"
  expect(LabResultsCoverSheet.instance.perform_verification('Num Lab Results', total_expected_rows)).to be_true
end

When(/^the user clicks the Panel "(.*?)" in the Lab Results applet$/) do |arg1|
  expect(LabResultsSpecificRows.instance.perform_action(arg1)).to be_true
end

When(/^the user clicks the Lab Test "(.*?)" in the Panel result details$/) do |arg1|
  driver = TestSupport.driver
  expect(LabResultsSpecificRows.instance.perform_action(arg1)).to be_true
  driver.find_element(:id, "info-button-sidekick-detailView").click
end

When(/^the user clicks the first Panel result in the Lab Results applet$/) do
  driver = TestSupport.driver
  click_lab_results_applet_row(true)
  driver.find_element(:id, "info-button-sidekick-detailView").click
end

When(/^the user clicks the first non\-Panel result in the Lab Results applet$/) do
  driver = TestSupport.driver
  click_lab_results_applet_row(false)
  driver.find_element(:id, "info-button-sidekick-detailView").click
end

When(/^the user clicks the "(.*?)" for the lab history$/) do |control_name|
  #sleep 2
  wait_and_perform(@lr, "modal - History - #{control_name}")
end

# ######################## Then ########################

# currently only supports Lab Results Container and the modal, but can easily be used later for further parents
Then(/^the "(.*?)" input should be set to "(\d+)" months in the "(.*?)" (?:on|in) the "(.*?)"$/) do |control_name, month_value, time_direction, parent_name|
  actual_date = @lr.get_element("Control - applet - #{control_name}").attribute("value")

  expected_date = nil

  date_format_template = "%m/%d/%Y"

  if time_direction.downcase == "past"
    expected_date = DateTime.now.prev_month(month_value.to_i).strftime(date_format_template)
  elsif time_direction.downcase == "future"
    expected_date = DateTime.now.next_month(month_value.to_i).strftime(date_format_template)
  else
    fail "You 'past' or 'future' or the direction of time wished to verify."
  end

  verify_elements_equal(expected_date, actual_date)
end

Then(/^the Lab Results single page is displayed$/) do
  verify_element_displayed(@lr, "Lab Results single page")
end

Then(/^the "(.*?)" title is "(.*?)"$/) do |element_name, expected_title|
  actual_title_element = @lr.get_element("modal - Title - #{element_name}")
  expect(actual_title_element.text).to eq(expected_title)
end

Then(/^the "(.*?)" row is$/) do |table_name, expected_table|
  verify_single_row(table_name, expected_table)
end

Then(/^the "(.*?)" is "(.*?)"$/) do |element_name, expected_value|
  # get rid of "number of " from the Gherkin if it exists
  element_name.sub!(/number of /, "")
  element_key = "modal - #{element_name}"
  @lr.wait_until_element_present(element_key, 30)
  element = @lr.get_element(element_key)

  actual_value = element.attribute("textContent").sub(/#{element_name}: /, "")

  verify_elements_equal(expected_value, actual_value)
end

Then(/^the "Total Tests" label has the value "(.*?)"$/) do |expected_total_tests|
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  wait.until { @lr.get_element("modal - Number Of Total Tests").text == expected_total_tests }
end

Then(/the loading indicators are "(.*?)" in the Lab Results modal/) do |displayed_or_hidden|
  history_table_key = "modal - Lab Results History Table Loading Indicator"
  graph_key = "modal - Lab Results Graph Loading Indicator"

  if displayed_or_hidden == "Displayed"
    # make sure "Loading..." string is present
    verify_elements_equal("Loading...", @lr.get_element(history_table_key))
    verify_elements_equal("Loading...", @lr.get_element(graph_key))
  elsif displayed_or_hidden == "Hidden"
    # make sure "Loading..." string is not present
    verify_elements_not_equal("Loading...", @lr.get_element(history_table_key))
    verify_elements_not_equal("Loading...", @lr.get_element(graph_key))
  end
end

Then(/^there is no brief display of data (?:on|in) the "(.*?)"$/) do |parent_name|
  wait = Selenium::WebDriver::Wait.new(:timeout => 5)

  # this test is interesting because I look for and expect an exception/error
  # if the exception doesn't occur, it means more than 1 row of data was found in the DOM
  begin
    wait.until {
      TestSupport.driver.find_elements(:css, "[data-appletid=lab_results_grid] table tbody tr").size > 1
    }
  rescue StandardError => e
    unless e.class == Selenium::WebDriver::Error::TimeOutError
      raise e
    end # unless
  else
    fail 'Indication of flickering: 2 or more rows of data were detected.'
  end # begin/rescue
end

Then(/the Lab Results should be sorted by "(.*?)"/) do |column_name|
  table_key = "applet - Complete Table"
  @lr.wait_until_element_present(table_key, 15)
  actual_table = @lr.get_element(table_key)

  headers = actual_table.find_elements(:css, "thead tr th")
  column_index = headers.index { |h| h.text == column_name }

  last_element_num = 0

  flag_hash = {
    "H*" => 1,
    "L*" => 2,
    "H" => 3,
    "L" => 4,
    "" => 5
   }

  @lr.wait_until_element_present(table_key, 15)
  actual_table = @lr.get_element(table_key)
  row_elements = actual_table.find_elements(:css, "tbody tr")

  row_elements.each do |row|
    cell_elements = row.find_elements(:css, "td")

    current_element_num = flag_hash[cell_elements[column_index].text]

    is_element_greater = current_element_num >= last_element_num
    expect(is_element_greater).to be_true

    last_element_num = current_element_num
  end # row_elements.each
end

# currently only supports Lab Results Container and the modal, but can easily be used later for further parents
Then(/^the number of "(.*?)" is "(\d*?)" (?:on|in) the "(.*?)"$/) do |element_name, expected_number, parent_name|
  map_key = "modal - #{element_name}"

  wait = Selenium::WebDriver::Wait.new(:timeout => 15)
  wait.until { @lr.get_elements(map_key).size > 0 }

  actual_number_of_elements = @lr.get_elements(map_key).size
  verify_elements_equal(expected_number.to_i, actual_number_of_elements)
end

# currently only supports Lab Results Container and the modal, but can easily be used later for further parents
Then(/^the "(.*?)" (?:on|in) the "(.*?)" are given as$/) do |element_name, parent_name, expected_value_table|
  expected_values = Array.new

  # push to new array with only a single field from each cucumber table
  expected_value_table.rows.each do |row|
    expected_values.push(row[0])
  end

  actual_elements = @lr.get_elements("modal - #{element_name}")

  actual_elements.each do |actual_element|
    # .text doesn't work for some reason with phantomjs and highcharts
    element_text = actual_element.attribute("textContent")

    # remove values if they are actually there
    expected_values.delete_if { |expected_value| expected_value == element_text }
  end

  expect(expected_values.empty?).to be_true
end

# Then(/^the following Reference Ranges are displayed in the graph$/) do |table|
#   p "Expected table:"
#   p table
#   ask("Are the correct reference ranges displayed?").chomp.should =~ /yes/i
# end

# Then(/^the dates on the X\-axis are clearly displayed to the user$/) do
#   ask("Are the dates displayed on the X-axis clearly displayed even when zoomed?").chomp.should =~ /yes/i
# end

Given(/^the user is viewing the expanded view of the Lab Results Applet$/) do
  expect(@lr.wait_until_element_present('Control - applet - Minimize View')).to be_true
  expect(@lr.wait_until_element_present('Lab Results single page')).to be_true
end
When(/^the user views the first non-panel lab result in a modal$/) do
  click_lab_results_applet_row(false)
  @uc.wait_until_action_element_visible("Modal", 15)
end

When(/^the user views the "(.*?)" lab result in a modal$/) do |arg1|
  counter = 0
  button_pushed = false
  modal_open = false
  loop do
    counter = counter+1
    button_pushed =LabResultsSpecificRows.instance.perform_action(arg1) 
    modal_open = @uc.wait_until_element_present("Modal", 15)
    break if counter > 3
    break if button_pushed && modal_open
    p 'Modal didnot open, try again'
  end # loop
  expect(modal_open).to be_true, "Modal did not open after #{counter-1} attempts"
end

Then(/^the Lab Results Applet table contains specific rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.compare_specific_row(table, '[data-appletid=lab_results_grid] #data-grid-lab_results_grid') }
end

def there_is_at_least_one_nonempty_labresult_row
  # wait until at least one row is displayed 
  # fail if that row is the empty row display
  return false unless @lr.wait_until_xpath_count_greater_than("applet - Table - xpath", 0)
  return false if TestSupport.driver.find_elements(:css, "[data-appletid=lab_results_grid] tbody .empty").length > 0 
  return true
rescue
  # Congratulations! if you are here, you found at least 1 row and it was not the empty row
  p 'found it!'
  return true
end

When(/^the applet displays lab results$/) do
  #[data-appletid=lab_results_grid] tbody tr
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { there_is_at_least_one_nonempty_labresult_row }
end

def infiniate_scroll(table_id)
  driver = TestSupport.driver
  found_bottom = false
  number_of_attempts = 0
  until found_bottom && number_of_attempts >2
    count1 = driver.find_elements(:css, "#{table_id} tr").length
    p "scroll row #{count1} into view"
    element = driver.find_element(:css, "#{table_id} tr:nth-child(#{count1})")
    element.location_once_scrolled_into_view
    count2 = driver.find_elements(:css, "#{table_id} tr").length
    found_bottom = (count1 == count2)
    number_of_attempts = found_bottom ? number_of_attempts + 1 : 0
    sleep 1 if found_bottom
  end
  return found_bottom
rescue Exception => e
  p "error thrown #{e}"
  return false
end

When(/^the user scrolls to the bottom of the Lab Results Applet$/) do 
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { infiniate_scroll('#data-grid-lab_results_grid tbody') }
end

def verify_lab_test_column(expected_text)
#  lab_tests = driver.find_elements(:css, '#data-grid-lab_results_grid tbody td:nth-child(2)')
  driver = TestSupport.driver
  lab_tests = driver.find_elements(:css, '#data-grid-lab_results_grid tbody td:nth-child(2)')
  lab_tests.each do | lab |
    #expect(lab.text.downcase.include? arg2.downcase).to be_true, "#{lab.text} did not contain #{arg2}"
    return false unless lab.text.downcase.include? expected_text.downcase
  end
  return true
rescue
  return false
end

Then(/^the Lab Test column in the Lab Results Applet contains "(.*?)"$/) do | arg2|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { verify_lab_test_column arg2 }
end

Then(/^the Lab History table contains rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  driver = TestSupport.driver
  con = VerifyTableValue.new 
  wait.until { 
    browser_elements_list = driver.find_elements(:css, "#data-grid-lab_results_grid-modalView tbody tr")  
    con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-lab_results_grid-modalView']", table)
  }
end

def perform_table_verification_exception_handling(table_id, table)
  driver = TestSupport.driver
  con = VerifyTableValue.new 
  browser_elements_list = driver.find_elements(:css, "##{table_id} tbody tr")  
  return con.perform_table_verification(browser_elements_list, "//table[@id='#{table_id}']", table)
rescue Exception => e 
  p "#{e}"
  return false
end

Then(/^the Lab Results Applet table contains rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultTiming.default_table_row_load_time)
  
  wait.until { 
    perform_table_verification_exception_handling('data-grid-lab_results_grid', table)
  }
end

Then(/^no results should be found in the Lab Results applet$/) do
  lab_rows = LabResultsSpecificRows.instance
  expect(lab_rows.wait_until_element_present('empty rows')).to be_true
end

Then(/^the Lab History table contains headers$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { verify_headers_with_exception_handling('Lab History', table) }
end

def verify_headers_with_exception_handling(table_name, expected_table)
  @tc = TableHeadersContainer.instance
  expected_headers = expected_table.headers

  browser_headers_key = "Headers - #{table_name}"

  print "headers key is = #{browser_headers_key}"

  begin
    wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
    wait.until { @tc.get_elements(browser_headers_key).size == expected_headers.size }
  rescue Exception => e
    p "Expected number of headers (#{expected_headers.size}) did not match app number of headers (#{@tc.get_elements(browser_headers_key).size})"
    return false
  end
  begin
    browser_headers = @tc.get_elements(browser_headers_key)

    for i in 0...expected_headers.size do
      verify_elements_equal(expected_headers[i], browser_headers[i].text)
    end
  rescue Exception => e
    p "Error: #{e}"
    return false
  end
  return true
end

