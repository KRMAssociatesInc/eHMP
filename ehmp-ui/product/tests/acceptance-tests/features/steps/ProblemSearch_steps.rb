#require 'AccessBrowserV2.rb'
path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

class Problem < AccessBrowserV2
  include Singleton
  def initialize
    super

    add_action(CucumberLabel.new("Search Modal"), ClickAction.new, AccessHtmlElement.new(:id, "searchBtn"))
    #add_verify(CucumberLabel.new("Problem"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='problem']"))
    add_verify(CucumberLabel.new("Cancel"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problemCancelBtn"))
    add_verify(CucumberLabel.new("Next"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problemNextBtn"))
    add_verify(CucumberLabel.new("OnsetDate"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='problems-onsetFormatted']/a"))
    add_action(CucumberLabel.new("Problem"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "problem"))
    #add_verify(CucumberLabel.new("Add Problem"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("Hypertension (ICD-9-CM 401.9)"), ClickAction.new, AccessHtmlElement.new(:css, '#problem-typeahead-list li[data-name="Hypertension (ICD-9-CM 401.9)"]'))
    add_action(CucumberLabel.new("Next"), ClickAction.new, AccessHtmlElement.new(:id, "problemNextBtn"))
    add_action(CucumberLabel.new("Add_Problem"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='center']/div/div/div[1]/span[2]/span[2]/span/button/span"))
    add_action(CucumberLabel.new("Family Practice Clinic"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:appointment:DOD:0000000003:1000010345']"))
    add_verify(CucumberLabel.new("Search_Modal_Title"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_verify(CucumberLabel.new("ProblemSearchList"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='problem-select']/div"))
    add_verify(CucumberLabel.new("Load_Icon"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='c98624']"))
  end
  
  def verify(id, value)
    driver = TestSupport.driver
    text = driver.find_element(:id, id).text
    p driver.find_element(:id, id)
    p ctext
    #expect(ctext).to eq(value)
    return (ctext == value)
  end
end

When(/^the user clicks on "(.*?)" button$/) do |button|
  con = Problem.instance
  con.wait_until_action_element_visible(button, 60)
  expect(con.static_dom_element_exists?(button)).to be_true
  con.perform_action(button)
end

Then(/^the problem modal contains button "(.*?)"$/) do |button_name|
  con = Problem.instance
  driver = TestSupport.driver
  con.perform_verification("Cancel", button_name)
end

Then(/^the problem modal contains two buttons "(.*?)" and "(.*?)"$/) do |btn1, btn2|
  con = Problem.instance
  driver = TestSupport.driver
  con.perform_verification("Cancel", btn1)
  con.perform_verification("Next", btn2)
  #con.perform_verification("Next",button_name)
end

Then(/^the user type search problem text term and the page contains total items and search results$/) do |table|
  p table.rows.length
  table.rows.each do |tablevalue|
    p tablevalue[0]
    con = Problem.instance
    driver = TestSupport.driver
    #con.wait_until_action_element_visible("Visit Location", 60)
    #expect(con.static_dom_element_exists?("Visit Location")).to be_true
    con.perform_action("Problem", tablevalue[0])
    sleep 10
    expect(con.wait_until_element_present("ProblemSearchList", 60)).to be_true
    resultnum = driver.find_elements(:css, "#problem-typeahead-list .list-group-item")
    p resultnum.length
    expect(resultnum.length.to_s).to eq(tablevalue[1])
  end
end

When(/^the user selects "(.*?)" in the Problem search box$/) do |searchtext|
  con = Problem.instance
  driver = TestSupport.driver
  con.perform_action("Problem", "hypertension")
  con.wait_until_action_element_visible(searchtext, 20)
  expect(con.static_dom_element_exists?(searchtext)).to be_true
  con.perform_action(searchtext, "")
end

When(/^the user clicks on plus sign of the problem applet$/) do
  con = Problem.instance
  con.wait_until_action_element_visible("OnsetDate", 50)
  expect(con.static_dom_element_exists?("OnsetDate")).to be_true
  con.perform_action("Add_Problem")
  sleep 5
  puts "clicked"
end

Then(/^the problem search modal title is "(.*?)"$/) do |arg1|
  p "in"
  con = Problem.instance
  #expect(con.verify("mainModalLabel", arg1)).to be_true
  con.wait_until_action_element_visible("Search_Modal_Title", 60)
  expect(con.perform_verification("Search_Modal_Title", arg1)).to be_true
end
