#Team Neptune 
#F144_AllergiesApplet.feature

class AllergiesExpandedHeader < AccessBrowserV2
  include Singleton
  def initialize
    super 
    add_verify(CucumberLabel.new("Allergen Name"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-summary"))
    add_verify(CucumberLabel.new("Standardized Allergen"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-standardizedName"))
    add_verify(CucumberLabel.new("Reaction"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-reaction"))
    add_verify(CucumberLabel.new("Severity"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-acuityName"))
    add_verify(CucumberLabel.new("Drug Class"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-drugClassesNames"))
    add_verify(CucumberLabel.new("Entered By"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-originatorName"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-facilityName"))
    add_verify(CucumberLabel.new(""), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-"))
  end
end #AllergiesExpandedHeader

#Validate the headers in the Allergies expanded view
Then(/^the Allergies expanded headers are$/) do |table|
  driver = TestSupport.driver
  headers = driver.find_elements(:css, "#data-grid-allergy_grid th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = AllergiesExpandedHeader.instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #Allergies Headers

#Validate the first row of Alleriges expanded
Then(/^the first row of the expanded Allergies applet is$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-allergy_grid tbody tr")
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#data-grid-allergy_grid tbody tr:nth-child(1) td") 
      if row_defined_in_cucumber.length != row_data.length
        matched = false
        p "The number of columns in the UI is #{row_data.length} but in cucumber it's #{row_defined_in_cucumber.length}"
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)            
      end    
      p "The rows were #{matched}."     
      if matched
        break 
      end
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    driver.save_screenshot("incorrect_rows.png") unless matched
    expect(matched).to be_true
  end #do loop  
end #Allergies First Row

#Validate the Allergies Expanded rows
Then(/^the Allergies expanded contains the rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-allergy_grid tbody tr")
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#data-grid-allergy_grid tbody tr:nth-child(#{i}) td") 
      if row_defined_in_cucumber.length != row_data.length
        matched = false
        p "The number of columns in the UI is #{row_data.length} but in cucumber it's #{row_defined_in_cucumber.length}"
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)            
      end    
      p "The rows were #{matched}."     
      if matched
        break 
      end
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    driver.save_screenshot("incorrect_rows.png") unless matched
    expect(matched).to be_true
  end #do loop  
end #Allergies Expanded

#Validate the Allergies pills in the coversheet view
Then(/^the Allergies Coversheet contains$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#grid-panel-allergy_grid > div.grid-container > div > div > div.allergyBubbleView > div")
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:css, "#grid-panel-allergy_grid > div.grid-container > div > div > div.allergyBubbleView > div:nth-child(#{i}) > span")     
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
    driver.save_screenshot("incorrect_rows.png") unless matched
    expect(matched).to be_true
  end #do loop  
end #Allergies Pills

Given(/^user selects patient "(.*?)" to view$/) do |search_value|
  con = Ehmpui.instance
  con.perform_action("Search Field", search_value)
  #Then the search results display 2 results
  num_seconds = 5
  expected_num = 2
  con.wait_until_xpath_count("Patient List Length", expected_num, num_seconds)
  con.perform_verification("Patient List Length", expected_num)
  #Given user selects patient 0 in the list
  con.select_patient_in_list(0)
end

def word_sorter(unsorted, sorted)
  if unsorted[1] == nil
    sorted.push unsorted[0]
    words_put(sorted)
  elsif unsorted[0] <= unsorted[1]
    sorted.push unsorted[0]
    unsorted.shift
    word_sorter(unsorted, sorted)
  else
    unsorted.push unsorted[0]
    unsorted.shift
    word_sorter(unsorted, sorted)
  end
end
