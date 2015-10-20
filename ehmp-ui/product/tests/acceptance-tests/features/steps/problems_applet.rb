#Team Neptune
#F144_ActiveProblems.feature

class ProblemsCoverHeader < AccessBrowserV2
  include Singleton
  def initialize
    super 
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-problems"))
    add_verify(CucumberLabel.new("Acuity"), VerifyText.new, AccessHtmlElement.new(:id, "problems-acuityName"))
    add_verify(CucumberLabel.new("Status"), VerifyText.new, AccessHtmlElement.new(:id, "problems-statusName"))
  end
end #ProblemsCoverHeader

class ProblemsSecondary < ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:id, "problems-problemText"))
    add_verify(CucumberLabel.new("Standardized Description"), VerifyText.new, AccessHtmlElement.new(:id, "problems-standardizedDescription"))
    add_verify(CucumberLabel.new("Acuity"), VerifyText.new, AccessHtmlElement.new(:id, "problems-acuityName"))
    add_verify(CucumberLabel.new("Status"), VerifyText.new, AccessHtmlElement.new(:id, "problems-statusName"))
    add_verify(CucumberLabel.new("Onset Date"), VerifyText.new, AccessHtmlElement.new(:id, "problems-onsetFormatted"))
    add_verify(CucumberLabel.new("Last Updated"), VerifyText.new, AccessHtmlElement.new(:id, "problems-updatedFormatted"))
    add_verify(CucumberLabel.new("Provider"), VerifyText.new, AccessHtmlElement.new(:id, "problems-providerDisplayName"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "problems-facilityMoniker"))
    add_verify(CucumberLabel.new("Comments"), VerifyText.new, AccessHtmlElement.new(:id, "problems-"))
  end
end #ProblemsSecondary

#Validate the headers in the problems coversheet view
Then(/^the Problems coversheet headers are$/) do |table|
  driver = TestSupport.driver
  headers = driver.find_elements(:css, "#data-grid-problems th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = ProblemsCoverHeader.instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #Problems Headers

#Validate the headers in the problems expanded view
Then(/^the Problems expanded headers are$/) do |table|
  ps = ProblemsSecondary.instance
  expect(ps.wait_until_action_element_visible("Description", DefaultLogin.wait_time)).to be_true
  verify_problems_headers(ProblemsSecondary.instance, table)
end #Problems Headers

def verify_problems_headers(access_browser_instance, table)
  driver = TestSupport.driver
  headers = driver.find_elements(:css, "#data-grid-problems th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

#Validate the Problems rows in the coversheet view
Then(/^the Problems table contains the rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-problems tbody tr")
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#data-grid-problems tbody tr:nth-child(#{i}) td")     
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
  end #do loop  
end #Problems Pills

def first_row_function(row_defined_in_cucumber)
  driver = TestSupport.driver
  matched = false
  begin
    row_data = driver.find_elements(:css, "#data-grid-problems tbody tr:nth-child(1) td")
    if row_defined_in_cucumber.length != row_data.length
      matched = false
      p "The number of columns in the UI is #{row_data.length} but in cucumber it's #{row_defined_in_cucumber.length}"
    else
      #wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
      matched = avoid_block_nesting_text(row_defined_in_cucumber, row_data)
      p "could not match data: #{row_defined_in_cucumber}" unless matched
      #wait.until { matched = avoid_block_nesting(row_defined_in_cucumber, row_data) }
    end
  rescue
    matched = false
  end
  return matched
end
#Validate the first Problems row in the table view
Then(/^the Problems table contains the first row$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-problems tbody tr")
  #Loop through rows in cucumber
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      wait.until {
        first_row_function row_defined_in_cucumber
      }
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    driver.save_screenshot("incorrect_rows.png") unless matched
    #expect(matched).to be_true
  end #do loop  
end #Problems Pills

#Check the number of pages in Problems 
Then(/^the Problems coversheet contains (\d+) pages$/) do |num_pages|
  driver = TestSupport.driver 
  pages_data = driver.find_elements(:css, "#left .backgrid-paginator ul li")
  pages = pages_data.length - 2
  matched = false   
  if pages == num_pages.to_i
    matched = true 
  else
    matched = false
  end  
  p "The UI has #{pages} pa when the test believes it should have #{num_pages} rows" unless matched
  p "#{matched}" unless matched
  expect(matched).to be_true
end 
