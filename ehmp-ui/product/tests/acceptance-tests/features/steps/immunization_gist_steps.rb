class ImmunizationGist <  ADKContainer
  include Singleton
  def initialize
    super
   
    add_action(CucumberLabel.new("PNEUMOCOCCAL"), ClickAction.new, AccessHtmlElement.new(:id, "pill-gist-popover-urn:va:immunization:9E7A:301:37"))
    add_verify(CucumberLabel.new("ImmunizationGridVisible"), VerifyText.new, AccessHtmlElement.new(:id, "immunizations-pill-gist-items"))
    add_verify(CucumberLabel.new("Immunization Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'immunizations-pill-gist-items'))
    add_action(CucumberLabel.new("Control - applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=immunizations] .applet-maximize-button"))
    add_action(CucumberLabel.new("Control - applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=immunizations] #grid-filter-button-immunizations"))
    add_action(CucumberLabel.new("Control - applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=immunizations] .form-search input"))
    add_verify(CucumberLabel.new("Immunization Gist Applet Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=immunizations] .panel-title"))
    add_verify(CucumberLabel.new("Immunization Gist Tooltip"), VerifyContainsText.new, AccessHtmlElement.new(:id, "urn:va:immunization:9E7A:301:37"))
    gist_view_count = AccessHtmlElement.new(:xpath, "//*[@id='immunizations-pill-gist-items']/descendant::div[contains(@class, 'immunGist')]")
    #add_verify(CucumberLabel.new("Immunization Gist Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=immunizations] .panel-title"))
    add_verify(CucumberLabel.new('Immunization gist view count'), VerifyXpathCount.new(gist_view_count), gist_view_count)
  end
end 

Then(/^user sees Immunizations Gist$/) do
  aa = ImmunizationGist.instance
  expect(aa.wait_until_action_element_visible("Immunization Gist Applet Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("Immunization Gist Applet Title", "IMMUNIZATIONS")).to be_true
end

Then(/^the immunization gist view has the following information$/) do |table|
  aa = ImmunizationGist.instance
  expect(aa.wait_until_action_element_visible("ImmunizationGridVisible", DefaultLogin.wait_time)).to be_true    
  table.rows.each do |row|
    expect(aa.perform_verification('Immunization Details', row[0])).to be_true, "The value #{row[0]} is not present in the immunization details"
    expect(aa.perform_verification('Immunization Details', row[1])).to be_true, "The value #{row[1]} is not present in the immunization details"
  end
end

When(/^user clicks on "(.*?)" pill$/) do |vaccine_name|
  aa = ImmunizationGist.instance
  driver = TestSupport.driver
  expect(aa.wait_until_action_element_visible("ImmunizationGridVisible", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(vaccine_name, "")).to be_true
  driver.find_element(:id, "info-button-sidekick-detailView").click
end

Then(/^the immunization gist applet title is "(.*?)"$/)  do |title|
  aa = ImmunizationGist.instance
  aa.wait_until_action_element_visible("Immunization Gist Applet Title")
  expect(aa.perform_verification("Immunization Gist Applet Title", title)).to be_true
end

When(/^user hover over "(.*?)" pill$/) do |_arg1|
  aa = ImmunizationGist.instance
  driver = TestSupport.driver
  expect(aa.wait_until_action_element_visible("ImmunizationGridVisible", DefaultLogin.wait_time)).to be_true
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  #  hover = wait.until { driver.find_element(:xpath, "//span[contains(string(),'PNEUMOCOCCAL')]") }
  hover = wait.until { driver.find_element(:id, "pill-gist-popover-urn:va:immunization:ABCD:229:44") }
  driver.action.move_to(hover).perform
end

Then(/^the immunizaiton gist view is filtered to (\d+) item$/) do |number_of_items|
  aa = ImmunizationGist.instance
  expect(aa.perform_verification('Immunization gist view count', number_of_items)).to be_true
end

#def verify_immunization_gist_item(browser_labels_list, table)
#      
#  matched = false
#   
#  table.rows.each do | row |
#    row0 = false
#    row1 = false
#    browser_labels_list.each do | label_in_browser | 
##      p " *******looping thro' borwser elements again*************"
##      p label_in_browser.text.strip   
##      p row[0]
##      p row[1]
##      p "********************"
#      if label_in_browser.text.strip == row[0] 
#        row0 = true
#      elsif label_in_browser.text.strip == row[1]
#        row1 = true
#      else
##        p "in the false else clause"
#        row0 = false
#        row1 = false
#        matched = false
#      end # end if...else
#      
#      if row0 && row1
#        matched = true
#        break
#      end
#      
#    end # end browserLabelsList
#    
#    unless matched
#      p "Expected : #{row} but could not find in the application"
#      break
#    end # end if      
#  end # end table 
#   #  p matched 
#  return matched
#end
