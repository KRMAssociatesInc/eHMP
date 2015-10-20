class ProgressNotes < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Date"), VerifyContainsText.new, AccessHtmlElement.new(:id, "progress-notes-summary-referenceDateTime"))
    add_verify(CucumberLabel.new("Document Type/Title"), VerifyText.new, AccessHtmlElement.new(:id, "progress-notes-summary-documentTypeName"))
    add_verify(CucumberLabel.new("Provider"), VerifyText.new, AccessHtmlElement.new(:id, "progress-notes-summary-author"))
    add_verify(CucumberLabel.new("Source System"), VerifyContainsText.new, AccessHtmlElement.new(:id, "progress-notes-summary-facilityName"))
  end
end # ProgressNotes

class ProgressNotesDetails < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Date"), VerifyContainsText.new, AccessHtmlElement.new(:id, "progress-notes-details-referenceDateTime"))
    add_verify(CucumberLabel.new("Document Type/Title"), VerifyText.new, AccessHtmlElement.new(:id, "progress-notes-details-documentTypeName"))
    add_verify(CucumberLabel.new("Standardized Document Type"), VerifyText.new, AccessHtmlElement.new(:id, "progress-notes-details-documentClass"))
    add_verify(CucumberLabel.new("Provider"), VerifyText.new, AccessHtmlElement.new(:id, "progress-notes-details-author"))
    add_verify(CucumberLabel.new("Source System"), VerifyContainsText.new, AccessHtmlElement.new(:id, "progress-notes-details-facilityName"))
  end
end # ProgressNotesDetails

Then(/^the Progress Notes table contains headers$/) do |table|
  progress_notes = ProgressNotes.instance
  table.rows.each do |header_text|
    expect(progress_notes.perform_verification(header_text[0], header_text[0])).to be_true
  end #table
end

Then(/^the Progress Notes Details modal contains headers$/) do |table|
  verify_modal_headers(ProgressNotesDetails.instance, table)
end

def check_progress_notes_tables(xpath_to_table, expected_row_count, table)
  p "in function"
  driver = TestSupport.driver
  #xpath_to_table = "//*[@data-appletid='progress_notes']/descendant::table"
  xpath_to_table_rows = "#{xpath_to_table}/descendant::tr"
  begin
    wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
    wait.until { 
      driver.find_elements(:xpath, xpath_to_table_rows).length == expected_row_count.to_i
    }
  rescue Exception => e 
    p "Error #{e}"
    length = driver.find_elements(:xpath, xpath_to_table_rows).length
    expect(length).to eq(expected_row_count), "Expected #{expected_row_count} rows but there were #{length}"
  end 
  
  rows_displayed_in_browser = driver.find_elements(:xpath, xpath_to_table_rows)
  p "rows displayed: #{rows_displayed_in_browser.length}"
  
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    for i in 1..rows_displayed_in_browser.length - 1
      cols_displayed_in_browser = driver.find_elements(:xpath, "#{xpath_to_table}/descendant::tr[#{i}]/descendant::td")
      
      if row_defined_in_cucumber.length != cols_displayed_in_browser.length
        p "cols displayed: #{cols_displayed_in_browser.length}"
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

Then(/^the Progress Notes table contains (\d+) rows with the data$/) do |expected_row_count, table|
  xpath_to_table = "//*[@data-appletid='progress_notes']/descendant::table"
  check_progress_notes_tables(xpath_to_table, expected_row_count, table)
  
end

Then(/^the Progress Notes modal contains (\d+) rows with the data$/) do |expected_row_count, table|
  xpath_to_table = "//*[@id='modal-lg-region']/descendant::table"
  check_progress_notes_tables(xpath_to_table, expected_row_count, table)
end
