#F144_ImmunizationsApplet.feature 
#Team Neptune 

class ImmunizationsCoverSheet < ADKContainer
  include Singleton
  def initialize
    super 
    add_verify(CucumberLabel.new("ImmunizationGridVisible"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-immunizations"))
    add_verify(CucumberLabel.new("Vaccine Name"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-name"))
    add_verify(CucumberLabel.new("Reaction"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-reactionName"))
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-administeredFormatted"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-facilityMoniker"))
  end
end #ImmunizationsCoverSheet

class Immunizationsexpanded < AccessBrowserV2
  include Singleton
  def initialize
    super 
    add_verify(CucumberLabel.new("Vaccine Name"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-name"))
    add_verify(CucumberLabel.new("Standardized Name"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-standardizedName"))
    add_verify(CucumberLabel.new("Reaction"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-reactionName"))
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-administeredFormatted"))
    add_verify(CucumberLabel.new("Series"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-seriesName"))
    add_verify(CucumberLabel.new("Repeat Contraindicated"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-contraindicatedDisplay"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-facilityMoniker"))
    add_verify(CucumberLabel.new("Comments"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-"))
  end
end #Immunizationsexpanded

#Find Immunizations Coversheet Headers 
Then(/^the immunizations coversheet table contains headers$/) do |table|
  verify_immunizations_primary_table_headers(ImmunizationsCoverSheet.instance, table)
end

#Find Immunizations expanded Headers 
Then(/^the immunizations expanded table contains headers$/) do |table|
  verify_immunizations_primary_table_headers(Immunizationsexpanded.instance, table)
end

#Find rows in the Immunizations Coversheet
Then(/^the immunizations table contains rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-immunizations>tbody>tr")
  #Loop through rows in cucumber   
  table.rows.each do | row_defined_in_cucumber |
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:xpath, ".//*[@id='data-grid-immunizations']/tbody/tr[#{i}]/td")     
      
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
    p "#{matched}"
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    driver.save_screenshot("incorrect_rows.png") unless matched
    expect(matched).to be_true
  end#do loop  
end #Problems coversheet

#Check the number of pages
Then(/^the Immunizations coversheet contains (\d+) pages$/) do |num_pages|
  driver = TestSupport.driver 
  pages_data = driver.find_elements(:css, "#left3 .backgrid-paginator ul li")
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

def verify_immunizations_primary_table_headers(access_browser_instance, table)
  driver = TestSupport.driver
  aa = ImmunizationsCoverSheet.instance
  aa.wait_until_action_element_visible("ImmunizationGridVisible")
  headers = driver.find_elements(:css, "#data-grid-immunizations th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do | header_text |
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers2
