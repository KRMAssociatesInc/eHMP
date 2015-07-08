class StackedGraphGist < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Stacked Graph Applet Header"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#applet-1 > div > div > div.panel-heading.grid-applet-heading > span.panel-title.center-block.text-center > span"))
    add_action(CucumberLabel.new("Content Search Plus-Image"), ClickAction.new, AccessHtmlElement.new(:css, "#drop3 > i.fa.fa-plus"))
    add_action(CucumberLabel.new("Vitals_Search_Result"), ClickAction.new, AccessHtmlElement.new(:css, "#pickList > span > div > div > div > span.twitter-typeahead > span > div.tt-dataset-vitals > span > div > div > div:nth-child(2)"))
    add_action(CucumberLabel.new("Labs_Search_Result"), ClickAction.new, AccessHtmlElement.new(:css, "#pickList > span > div > div > div > span.twitter-typeahead > span > div.tt-dataset-labs > span > div:nth-child(1) > div > div:nth-child(2)"))
    add_verify(CucumberLabel.new("Row_1_Concept_detail_1"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[2]/div[2]"))
    add_verify(CucumberLabel.new("Row_1_Concept_detail_2"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[2]/div[3]"))
    add_verify(CucumberLabel.new("Row_1_Concept_detail_3"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[2]/div[4]"))
    add_verify(CucumberLabel.new("Row_1_graph"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[2]/div[5]"))
    add_verify(CucumberLabel.new("Row_2_Concept_detail_1"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[3]/div[2]"))
    add_verify(CucumberLabel.new("Row_2_Concept_detail_2"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[3]/div[3]"))
    add_verify(CucumberLabel.new("Row_2_Concept_detail_3"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[3]/div[4]"))
    add_verify(CucumberLabel.new("Row_2_graph"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[3]/div[5]"))
    add_verify(CucumberLabel.new("Row_3_Concept_detail_1"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[4]/div[2]"))
    add_verify(CucumberLabel.new("Row_3_Concept_detail_2"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[4]/div[3]"))
    add_verify(CucumberLabel.new("Row_3_Concept_detail_3"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[4]/div[4]"))
    add_verify(CucumberLabel.new("Row_3_graph"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-panel-stackedGraph']/div[2]/div/div/div/div[2]/div[4]/div[5]"))
  end
end

And(/^user verifies that "(.*?)" is present$/) do |html_element|
  sgg = StackedGraphGist.instance
  sgg.wait_until_action_element_visible(html_element, 40)
end

Then(/^user searches for "(.*?)" and clicks on the "(.*?)" search result$/) do |search_text, group|
  sgg = StackedGraphGist.instance
  driver = TestSupport.driver
  sgg.wait_until_action_element_visible("Content Search Plus-Image", 40)
  expect(sgg.perform_action("Content Search Plus-Image")).to be_true, "Error while clicking on content search plus sign"
  element = driver.find_element(:css, "#typeahead")
  driver.find_element(:css, "#drop3 > i.fa.fa-plus").click unless element.displayed?
  element = driver.find_element(:css, "#typeahead")
  element.send_keys(search_text)
  sgg.wait_until_action_element_visible(group+"_Search_Result", 40)
  expect(sgg.perform_action(group+"_Search_Result")).to be_true, "Error when attempting to click on the search result"
end

Then(/^user verifies row (\d+) concept details "(.*?)", "(.*?)", days and graph$/) do |n, arg1, arg2|
  sgg = StackedGraphGist.instance
  sgg.wait_until_action_element_visible("Row_#{n}_Concept_detail_1", 40)
  expect(sgg.perform_verification("Row_#{n}_Concept_detail_1", arg1)).to be_true, "Error while verifying the concept detail #{arg1}"
  sgg.wait_until_action_element_visible("Row_#{n}_Concept_detail_2", 40)
  expect(sgg.perform_verification("Row_#{n}_Concept_detail_2", arg2)).to be_true, "Error while verifying the concept detail #{arg2}"
  sgg.wait_until_action_element_visible("Row_#{n}_Concept_detail_3", 40)
  sgg.wait_until_action_element_visible("Row_#{n}_graph", 40)
end

Then(/^user clicks on info icon button for row (\d+) and info page is loaded$/) do |n|
  driver = TestSupport.driver
  # increment the row number to correctly identify row using xpath
  m= n.to_i
  m += 1
  element = driver.find_element(:css, "#grid-panel-stackedGraph > div.grid-container > div > div > div > div.collectionContainer > div:nth-child(#{m}) > div.capitalize.col-sm-2.border.no-left-border")
  element.click
  element = driver.find_element(:css, "#info-button-toolbar > i")
  element.click
  driver.switch_to.window(driver.window_handles.last) {
    wait = Selenium::WebDriver::Wait.new(:timeout => 120)
    wait.until {
      expect(driver.title == "CPRS OpenInfobutton").to be_true
    }
    driver.close
  }
end

Then(/^user clicks on quick view button for row (\d+)$/) do |n|
  driver = TestSupport.driver
  # increment the row number to correctly identify row using xpath
  m= n.to_i
  m += 1
  element = driver.find_element(:css, "#grid-panel-stackedGraph > div.grid-container > div > div > div > div.collectionContainer > div:nth-child(#{m}) > div.capitalize.col-sm-2.border.no-left-border")
  element.click
  element = driver.find_element(:css, "#quick-look-button-toolbar > i")
  element.click
end

Then(/^user deletes graph on row (\d+)$/) do |n|
  driver = TestSupport.driver
  # increment the row number to correctly identify row using xpath
  m= n.to_i
  m += 1
  element = driver.find_element(:css, "#grid-panel-stackedGraph > div.grid-container > div > div > div > div.collectionContainer > div:nth-child(#{m}) > div.capitalize.col-sm-2.border.no-left-border")
  element.click
  element = driver.find_element(:css, "#deleteView-button-toolbar > i")
  element.click
end

Then(/^user clicks on detail view button for row (\d+)$/) do |n|
  driver = TestSupport.driver
  # increment the row number to correctly identify row using xpath
  m= n.to_i
  m += 1
  element = driver.find_element(:css, "#grid-panel-stackedGraph > div.grid-container > div > div > div > div.collectionContainer > div:nth-child(#{m}) > div.capitalize.col-sm-2.border.no-left-border")
  element.click
  element = driver.find_element(:css, "#detailView-button-toolbar > i")
  element.click
end

Then(/^user scrolls the window to bring graph applet to view$/) do 
  driver = TestSupport.driver
  element = driver.find_element(:css, "#grid-options-button- > span")
  element.location_once_scrolled_into_view
end
