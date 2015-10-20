Then(/^the table contains (\d+) rows$/) do |num_rows|
  driver = TestSupport.driver
  for i in 0..30
    #rows = driver.find_elements(:css, "#appletContent tr")
    rows = driver.find_elements(:css, ".grid-container tr")
    #rows = driver.find_elements(:css, "#grid-panel-lab_results_grid tr")
    break unless rows.length != num_rows.to_i
    p "table rows: #{rows.length}"
    sleep 1

  end
  expect(rows.length).to eq(num_rows.to_i)
end

Then(/^the modal contains (\d+) rows$/) do |num_rows|
  driver = TestSupport.driver
  for i in 0..30
    rows = driver.find_elements(:css, "#mainModal tr")
    break unless rows.length != num_rows.to_i
    p "table rows: #{rows.length}"
    sleep 1

  end
  expect(rows.length).to eq(num_rows.to_i)
end

def verify_table_headers(access_browser_instance, table)
  driver = TestSupport.driver
  #headers = driver.find_elements(:css, "#appletContent th")
  headers = driver.find_elements(:css, "#data-grid-lab_results_grid th")
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)

  elements = access_browser_instance

  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

def verify_modal_headers(access_browser_instance, table)
  driver = TestSupport.driver
  headers = driver.find_elements(:css, "#mainModal th")
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)

  elements = access_browser_instance

  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_modal_headers

def avoid_block_nesting(row_defined_in_cucumber, cols_displayed_in_browser)
  for col_index in 0..row_defined_in_cucumber.length - 1
    #p "comparing #{row_defined_in_cucumber[col_index]} to #{cols_displayed_in_browser[col_index].attribute("innerHTML").strip}"
    if row_defined_in_cucumber[col_index] == cols_displayed_in_browser[col_index].attribute("innerHTML").strip
      matched = true
    else
      matched = false
      break
    end #if
  end #for col_index
  return matched
end

def avoid_block_nesting_text(row_defined_in_cucumber, cols_displayed_in_browser)
  error_message = []
  for col_index in 0..row_defined_in_cucumber.length - 1
    #    p "comparing #{row_defined_in_cucumber[col_index]} to #{cols_displayed_in_browser[col_index].text}"
    error_message.push("comparing #{row_defined_in_cucumber[col_index]} to #{cols_displayed_in_browser[col_index].text}")
    cols_displayed_in_browser[col_index].location_once_scrolled_into_view
    if row_defined_in_cucumber[col_index] == cols_displayed_in_browser[col_index].text
      matched = true
    else
      matched = false
      break
    end #if
  end #for col_index
  p error_message unless matched
  return matched
end

Then(/^the table contains rows$/) do |table|
  p "in function"
  driver = TestSupport.driver
  #rows_displayed_in_browser = driver.find_elements(:css, "#appletContent tr")
  #rows_displayed_in_browser = driver.find_elements(:css, "#data-grid-lab_results_grid tr")
  rows_displayed_in_browser = driver.find_elements(:css, "#data-grid-lab_results_grid tr")
  p "rows displayed: #{rows_displayed_in_browser.length}"

  table.rows.each do |row_defined_in_cucumber|
    matched = false
    for i in 1..rows_displayed_in_browser.length - 1
      #p "row: #{i}"
      #cols_displayed_in_browser = driver.find_elements(:xpath, "//div[@id='appletContent']/descendant::tr[#{i}]/descendant::td")
      cols_displayed_in_browser = driver.find_elements(:xpath, "//table[@id='data-grid-lab_results_grid']/descendant::tr[#{i}]/descendant::td")
      #p "cols displayed: #{cols_displayed_in_browser.length}"
      if row_defined_in_cucumber.length != cols_displayed_in_browser.length
        matched = false
      else
        matched = avoid_block_nesting(row_defined_in_cucumber, cols_displayed_in_browser)
        p "matched index: #{i}" if matched
        break if matched
      end # if - else
    end # for i
    p "could not match data: #{row_defined_in_cucumber}" unless matched
    expect(matched).to be_true
  end # table.rows.each
end

Then(/^the modal contains rows$/) do |table|
  driver = TestSupport.driver
  #driver.manage.timeouts.implicit_wait = 30
  #p "beginning of finding elements"
  #rows_displayed_in_browser = driver.find_elements(:css, "#modal-region tbody tr")
  sleep 3
  #rows_displayed_in_browser = driver.find_elements(:css, "#modal-region > div > div > tbody > tr")
  rows_displayed_in_browser = driver.find_elements(:xpath, "//div[@id='modal-region']/descendant::tr")
  #p "after rows are found"
  #unless rows_displayed_in_browser.nil?
  #  p "row not found"
  #else
  #  p "row found"
  #end
  p "rows displayed #{rows_displayed_in_browser.length}"
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    for i in 1..rows_displayed_in_browser.length - 1
      cols_displayed_in_browser = driver.find_elements(:xpath, "//div[@id='modal-region']/descendant::tr[#{i}]/descendant::td")
      if row_defined_in_cucumber.length != cols_displayed_in_browser.length
        matched = false
      else
        matched = avoid_block_nesting(row_defined_in_cucumber, cols_displayed_in_browser)
        break if matched
      end # if - else
    end # for i
    p "could not match data: #{row_defined_in_cucumber}" unless matched
    expect(matched).to be_true
  end # table.rows.each
end

class TableHeadersContainer < AccessBrowserV2
  include Singleton
  def initialize
    super
    #Care team
    add_verify(CucumberLabel.new("Headers - Care Team Details"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#patientDemographic-providerInfo .table th"))

    #Care Team Quicklook
    add_verify(CucumberLabel.new("Headers - Care Team Quicklook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#patientDemographic-providerInfo .popover-content .table th"))

    # Orders
    add_verify(CucumberLabel.new("Headers - Orders Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-orders th"))

    # Lab Results
    add_verify(CucumberLabel.new("Headers - Lab Detail"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body > div > .table-responsive > table th"))
    add_verify(CucumberLabel.new("Headers - Lab History"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-lab_results_grid-modalView th"))
    add_verify(CucumberLabel.new("Headers - Panel"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#lab-results-header th"))
    add_verify(CucumberLabel.new("Headers - Lab Results Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .backgrid th"))

    #Active Medications
    add_verify(CucumberLabel.new("Headers - Active Medications Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-activeMeds th"))

    #Immunization Gist
    add_verify(CucumberLabel.new("Headers - Immunization Gist Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-immunizations th"))

    #Immunization Gist hover table
    add_verify(CucumberLabel.new("Headers - Immunization Gist Hover Table"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='urn:va:immunization:ABCD:229:44']/descendant::th"))

    #Documents Gist
    add_verify(CucumberLabel.new("Headers - Documents Gist Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-documents th"))

    #Allery Gist
    add_verify(CucumberLabel.new("Headers - Allergy Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-allergy_grid th"))

    #Problems Gist Quick View table
    add_verify(CucumberLabel.new("Headers - Problems Gist Quick View Table"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='urn_va_problem_9E7A_711_141']/thead/descendant::th"))

    #Stacked Graph Quick View Table
    add_verify(CucumberLabel.new("Headers - Stacked Graph Quick View Table"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:vital:DOD:0000000003:1000000582']/thead/tr"))

    #Encounters Gist Quick View table - Visits
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Visits"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Visits']/thead/descendant::th"))
    #Encounters Gist Quick View table - Visit Type
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Visit Type"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Visit-GENERALINTERNALMEDICINE']/thead/descendant::th"))

    #Encounters Gist Quick View table - Procedure
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Procedures"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Procedures']/thead/descendant::th"))
    #Encounters Gist Quick View table - Procedure Name
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Procedure Name"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Procedure-PULMONARYFUNCTIONINTERPRET']/thead/descendant::th"))

    #Encounters Gist Quick View table - Appointment
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Appointments"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Appointments']/thead/descendant::th"))
    #Encounters Gist Quick View table - Appointment Type
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Appointment Type"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Appointment-GENERALINTERNALMEDICINE']/thead/descendant::th"))

    #Encounters Gist Quick View table - Appointment
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Admissions"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Admissions']/thead/descendant::th"))
    #Encounters Gist Quick View table - Appointment Type
    add_verify(CucumberLabel.new("Headers - Encounters Gist Quick View - Diagnosis"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Admission-OBSERVATION']/thead/descendant::th"))

    #Patient Header Phone Group Quick Look table
    add_verify(CucumberLabel.new("Headers - Phone Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#ql-phone-table-container table thead tr th"))
    add_verify(CucumberLabel.new("Headers - Address Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#ql-pt-address-table-container table thead tr th"))
    add_verify(CucumberLabel.new("Headers - Next Of Kin Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-nok-contact > div:nth-child(2) > div:nth-child(2) > div > div > table > thead > tr > th"))
    add_verify(CucumberLabel.new("Headers - Email Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#ql-email-table-container > table > thead > tr > th"))
    add_verify(CucumberLabel.new("Headers - Emergency Contact Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-em-contact > div:nth-child(2) > div:nth-child(2) > div > div > table > thead > tr > th"))
  end # initialize
end

class TableContainer < AccessBrowserV2
  include Singleton
  def initialize
    super
    #Care team
    add_verify(CucumberLabel.new("Rows - Care Team Details"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#patientDemographic-providerInfo .table tbody tr"))

    # Orders
    add_verify(CucumberLabel.new("Rows - Orders Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-orders tbody tr"))

    # Lab Results
    add_verify(CucumberLabel.new("Rows - Lab Detail"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body > div > .table-responsive > table tbody"))
    add_verify(CucumberLabel.new("Rows - Lab History"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-lab_results_grid-modalView tbody tr"))
    add_verify(CucumberLabel.new("Rows - Lab Results Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .backgrid tbody tr"))

    add_verify(CucumberLabel.new("Complete Table - Lab Results applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] table"))

    add_action(CucumberLabel.new("Lab Results Applet - Disabled Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .backgrid-paginator .disabled a[title=\"Next\"]"))
    add_action(CucumberLabel.new("Control - Lab Results Applet - Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .backgrid-paginator li a[title=\"Next\"]"))

    #Active Medications
    add_verify(CucumberLabel.new("Rows - Active Medications Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-activeMeds tbody tr"))

    #Immunization Gist
    add_verify(CucumberLabel.new("Rows - Immunization Gist Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-immunizations tbody tr"))

    #Immunization Gist hover table
    add_verify(CucumberLabel.new("Rows - Immunization Gist Hover Table"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='urn:va:immunization:ABCD:229:44']/tbody/descendant::tr"))

    #Documents Gist
    add_verify(CucumberLabel.new("Rows - Documents Gist Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-documents tbody tr"))

    #Allery Gist
    add_verify(CucumberLabel.new("Rows - Allergy Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-allergy_grid tbody tr"))

    #Problems Gist Quick View table
    add_verify(CucumberLabel.new("Rows - Problems Gist Quick View Table"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='urn_va_problem_9E7A_711_141']/tbody/descendant::tr"))

    #Stacked Graph Quick View Table
    add_verify(CucumberLabel.new("Rows - Stacked Graph Quick View Table"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:vital:DOD:0000000003:1000000582']/tbody/tr"))

    #Encounters Gist Quick View table - Visits
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Visits"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Visits']/tbody/descendant::tr"))
    #Encounters Gist Quick View table - Visit Type
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Visit Type"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Visit-GENERALINTERNALMEDICINE']/tbody/descendant::tr"))

    #Encounters Gist Quick View table - Procedure
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Procedures"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Procedures']/tbody/descendant::tr"))
    #Encounters Gist Quick View table - Procedure Name
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Procedure Name"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Procedure-PULMONARYFUNCTIONINTERPRET']/tbody/descendant::tr"))

    #Encounters Gist Quick View table - Appointment
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Appointments"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Appointments']/tbody/descendant::tr"))
    #Encounters Gist Quick View table - Appointment Type
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Appointment Type"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Appointment-GENERALINTERNALMEDICINE']/tbody/descendant::tr"))

    #Encounters Gist Quick View table - Appointment
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Admissions"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters_tooltip_Admissions']/tbody/descendant::tr"))
    #Encounters Gist Quick View table - Appointment Type
    add_verify(CucumberLabel.new("Rows - Encounters Gist Quick View - Diagnosis"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//table[@id='encounters-Admission-OBSERVATION']/tbody/descendant::tr"))

    #Active Problems expand view table
    add_verify(CucumberLabel.new("Rows - Active Problems Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-problems tbody tr"))

    #Patient Header Phone Group Quick Look table
    add_verify(CucumberLabel.new("Rows - Phone Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#ql-phone-table-container table tbody tr"))
    add_verify(CucumberLabel.new("Rows - Address Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-address-row-container tr"))
    add_verify(CucumberLabel.new("Rows - Next Of Kin Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#nok-contact-row-container tr"))
    add_verify(CucumberLabel.new("Rows - Email Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-email-row-container tr"))
    add_verify(CucumberLabel.new("Rows - Emergency Contact Group QuickLook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#em-contact-row-container tr"))
    add_verify(CucumberLabel.new("Rows - Care Team Quicklook"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#patientDemographic-providerInfo .popover-content .table tbody tr"))
  end # initialize
end

# ######################## functions ########################

def verify_single_row(table_name, expected_row)
  @tc = TableContainer.instance

  expected_first_row = expected_row.rows[0]

  rows_key = "Rows - #{table_name}"
  @tc.wait_until_action_element_visible(rows_key, 15)

  actual_first_row = @tc.get_elements(rows_key)[0]
  actual_first_row_cells = actual_first_row.find_elements(:css, "td")

  for i in 0...expected_first_row.size do
    verify_elements_equal(expected_first_row[i], actual_first_row_cells[i].text)
  end
end

# ######################## When ########################

When(/^clicks the first result in the "(.*?)"$/) do |applet_name|
  @tc = TableContainer.instance
  rows_key = "Rows - #{applet_name}"

  attempts = 0

  # sleep 0.5

  begin
    wait = Selenium::WebDriver::Wait.new(:timeout => 5)
    wait.until { @tc.get_elements(rows_key).size > 1 }
    wait.until { @tc.get_element(rows_key) }
    wait.until { @tc.get_element(rows_key).displayed? }
    # wait.until { @tc.get_element(rows_key).click }
    @tc.get_element(rows_key).click
  rescue => e
    p "There was an error clicking the row; attempting re-click."

    attempts += 1
    raise e if attempts > 5
    if e.class == Selenium::WebDriver::Error::StaleElementReferenceError && attempts < 3
      sleep 2
      retry
    elsif e.class == Selenium::WebDriver::Error::TimeOutError
      # I don't like doing this, but phantomjs is the only 'browser' where this seems to be necessary
      # I can't duplicate the need to occasionally refresh in chrome or manually
      refresh_applet(applet_name)
      retry
    else
      raise e
    end # if/else
  end # begin/rescue
end

# ######################## Then ########################

Then(/^the "(.*?)" table contains (\d+) rows$/) do |table_name, expected_num_rows|
  begin
    row_count = 0
    wait = Selenium::WebDriver::Wait.new(:timeout => DefaultTiming.default_table_row_load_time)
    wait.until { 
      row_count = TableContainer.instance.get_elements("Rows - #{table_name}").size 
      row_count == expected_num_rows.to_i 
    }
  rescue Exception => e 
    p "Error #{e}, received #{row_count} rows"
    raise e
  end
end # Then()

Then(/^the "(.*?)" table contains headers$/) do |table_name, expected_table|
  @tc = TableHeadersContainer.instance
  expected_headers = expected_table.headers

  browser_headers_key = "Headers - #{table_name}"

  print "headers key is = #{browser_headers_key}"

  begin
    wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
    wait.until { @tc.get_elements(browser_headers_key).size == expected_headers.size }
  rescue Exception => e
    p "Expected number of headers (#{expected_headers.size}) did not match app number of headers (#{@tc.get_elements(browser_headers_key).size})"
    raise e
  end

  browser_headers = @tc.get_elements(browser_headers_key)

  for i in 0...expected_headers.size do
    verify_elements_equal(expected_headers[i], browser_headers[i].text)
  end
end

Then(/^the "(.*?)" first row contains$/) do |table_name, expected_row|
  verify_single_row(table_name, expected_row)
end

Then(/^the "(.*?)" table contains rows$/) do |table_name, expected_table|
  @tc = TableContainer.instance
  element_key = "Rows - #{table_name}"

  p "table name = #{element_key}"

  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultTiming.default_table_row_load_time)

  wait.until { @tc.get_elements(element_key).size >= expected_table.rows.size }

  if expected_table.rows.size == 1
    attempts = 0
    begin
      # this code shouldn to used when you are expecting "No Records Found" (dones't match up with the expected headers either)
      wait.until { @tc.get_elements(element_key)[0].text != "No Records Found" }
    rescue StandardError => e
      attempts += 1
      if (e.class == Selenium::WebDriver::Error::StaleElementReferenceError) && (attempts < 3)
        retry
      else
        raise e
      end # if/else
    end # begin/rescue
  end

  attempts = 0
  begin
    actual_rows = @tc.get_elements(element_key)

    expected_rows = expected_table.rows

    for i in 0...expected_rows.size do
      expected_row = expected_rows[i]
      actual_row = actual_rows[i]

      actual_elements = actual_row.find_elements(:css, "td")

      for j in 0...expected_row.size do
        verify_elements_equal(expected_row[j], actual_elements[j].text.rstrip)
      end # j for
    end # i for
  rescue StandardError => e
    attempts += 1

    if (e.class == Selenium::WebDriver::Error::StaleElementReferenceError) && (attempts < 3)
      p "Attemping retry of table verification."
      retry
    else
      p "!! Error verifying table !!"
      raise
    end # if/else
  end # begin/rescue
end
