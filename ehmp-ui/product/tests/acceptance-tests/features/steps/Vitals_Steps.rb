#Team Neptune
#F144_VitalsApplet.feature

class VitalsExpandedHeader < AccessBrowserV2
  include Singleton
  def initialize
    super 
    add_verify(CucumberLabel.new("Date Observed"), VerifyText.new, AccessHtmlElement.new(:id, "vitals-observedFormatted"))
    add_verify(CucumberLabel.new("Type"), VerifyText.new, AccessHtmlElement.new(:id, "vitals-typeName"))
    add_verify(CucumberLabel.new("Result"), VerifyText.new, AccessHtmlElement.new(:id, "vitals-resultUnitsMetricResultUnits"))
    #add_verify(CucumberLabel.new("Reference Range"), VerifyText.new, AccessHtmlElement.new(:id, "vitals-referenceRange"))
    add_verify(CucumberLabel.new("Qualifiers"), VerifyText.new, AccessHtmlElement.new(:id, "vitals-qualifiers"))
    add_verify(CucumberLabel.new("Date Entered"), VerifyText.new, AccessHtmlElement.new(:id, "vitals-resulted"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "vitals-facilityMoniker"))
  end
end #VitalsExpandedHeader

#Validate the headers in the Allergies expanded view
Then(/^the Vitals expanded headers are$/) do |table|
  driver = TestSupport.driver
  elements = VitalsExpandedHeader.instance
  expect(elements.wait_until_action_element_visible("Date Observed", DefaultLogin.wait_time)).to be_true
  headers = driver.find_elements(:css, "#data-grid-vitals th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  table.rows.each do | header_text |
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #Vitals Headers

#Verify the coloumn contains of the Vitals Coversheet view
Then(/^the first coloumn of the Vitals table contains the rows$/) do |table|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  num_of_rows = driver.find_elements(:css, "#grid-panel-vitals > div.grid-container > div > div > div.a-table > div > table > tbody > tr")
  #Loop through rows in cucumber   
  table.rows.each do | row_defined_in_cucumber |
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#grid-panel-vitals > div.grid-container > div > div > div.a-table > div > table > tbody > tr:nth-child(#{i}) > td")     
      if row_defined_in_cucumber.length != row_data.length
        matched = false
        p "The number of columns in the UI is #{row_data.length} but in cucumber it's #{row_defined_in_cucumber.length}"
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data) 
        p "#{matched}"           
      end         
      if matched
        break 
      end
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    expect(matched).to be_true
  end#do loop  
end #Vitals Coversheet rows
  
#Verify the second coloumn of the Vitals Coversheet view
Then(/^the second coloumn of the Vitals table contains the rows$/) do |table|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  num_of_rows = driver.find_elements(:css, "#grid-panel-vitals > div.grid-container > div > div > div.b-table > div > table > tbody > tr")
  #Loop through rows in cucumber   
  table.rows.each do | row_defined_in_cucumber |
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#grid-panel-vitals > div.grid-container > div > div > div.b-table > div > table > tbody > tr:nth-child(#{i}) > td")     
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
    expect(matched).to be_true
  end#do loop  
end #Vitals Coversheet rows

#Validate the Problems rows in the coversheet view
Then(/^the Vitals table contains the rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-vitals tbody tr")
  #Loop through rows in cucumber   
  table.rows.each do | row_defined_in_cucumber |
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#data-grid-vitals tbody tr:nth-child(#{i}) td")     
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
end #Problems Pills
