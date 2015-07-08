#require 'AccessBrowserV2.rb'
path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

class GTDate < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("From Date"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#filter-from-date-global"))
    add_action(CucumberLabel.new("RemoveDateFrom"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#filter-from-date-global"))
    add_action(CucumberLabel.new("To Date"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#filter-to-date-global"))
    add_action(CucumberLabel.new("RemoveDateTo"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#filter-to-date-global"))
    add_verify(CucumberLabel.new("FromTooltip"), VerifyContainsText.new, AccessHtmlElement.new(:css, '#filter-from-date-global'))
    add_verify(CucumberLabel.new("ToTooltip"), VerifyContainsText.new, AccessHtmlElement.new(:css, '#filter-from-date-global'))
    add_verify(CucumberLabel.new("TimelineDateFilter "), VerifyContainsText.new, AccessHtmlElement.new(:id, 'globalDate-region'))
    add_verify(CucumberLabel.new("From Date"), VerifyValue.new, AccessHtmlElement.new(:css, "#filter-from-date-global"))
    add_verify(CucumberLabel.new("To Date"), VerifyValue.new, AccessHtmlElement.new(:css, "#filter-to-date-global"))
    add_action(CucumberLabel.new("Outside"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "eHMP-CurrentUser"))
  end

  def verify(id, value)
    driver = TestSupport.driver
    ctext = driver.find_element(:id, id).attribute('value') # for input tag
    p ctext
    #expect(ctext).to eq(value)
    return (ctext == value)
  end
end

def attempt_unacceptable_global_date_entry(element_name, input_text)
  # if the date is considered unacceptable, then the value of the html input is removed
  attempts ||= 0
  con = GTDate.instance
  driver = TestSupport.driver
  input_element = con.get_element(element_name)

  # need to clear what is currently in the input
  # clear() seems to not work correctly with placeholders
  for i in 0...input_element.attribute("value").size
    input_element.send_keys(:backspace)
  end

  # if you just want to clear the input (empty input text)
  unless input_text.strip.empty?
    p "sending #{input_text}"
    input_element.send_keys(input_text)

    wait = Selenium::WebDriver::Wait.new(:timeout => 5)
    wait.until { input_element.attribute("value").strip.empty? }
  end #unless
rescue Exception => e
  attempts += 1

  if attempts < 3
    sleep 2
    retry
  else
    p "!! Error attempting input on - #{element_name} !!"
    raise e
  end # if/else
end

When(/^user enters "(.*?)" in the from field$/) do |input_text|
  attempt_unacceptable_global_date_entry("From Date", input_text)
end

When(/^user enters "(.*?)" in the to field$/) do |input_text|
  attempt_unacceptable_global_date_entry("To Date", input_text)
end

Given(/^user enters today's date in from field$/) do
  con = GTDate.instance
  currentdt = Time.now 
  dt = currentdt.strftime('%m/%d/%Y')
  con.perform_action("From Date", dt)
  puts "This is the date: #{dt}"
end

Given(/^user enters yesterday's date in to field$/) do 
  con = GTDate.instance
  currentdt = (Time.now - 864_00)
  dt = currentdt.strftime('%m/%d/%Y')
  con.perform_action("To Date", dt)
  puts "This is the date: #{dt}"
end

Then(/^the from tooltip contains text "(.*?)"$/) do |arg1|
  con = GTDate.instance
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) 
  wait.until { con.get_element("FromTooltip") }
  expect(driver.find_element(:css, "#filter-from-date-global").attribute("data-original-title")).to include(arg1)
end

Then(/^the to tooltip contains text "(.*?)"$/) do |arg1|
  con = GTDate.instance
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) 
  wait.until { con.get_element("ToTooltip") }
  expect(driver.find_element(:css, "#filter-to-date-global").attribute("data-original-title")).to include(arg1)
end

def wait_until_date_filter_closes
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  driver = TestSupport.driver
  wait.until { driver.find_element(:id, 'trendHistoryChartContainer').displayed? == false }
end

Then(/^the date filter closes$/) do
  wait_until_date_filter_closes
end

Then(/^the to date displays today's date$/) do 
  con = GTDate.instance
  currentdt = Time.now 
  dt = currentdt.strftime('%m/%d/%Y')
  expect(con.perform_verification("To Date", dt)).to be_true
  puts "This is the date: #{dt}"
end

Then(/^the user clicks on the outside of GDT$/) do
  con = GTDate.instance
  expect(con.wait_until_action_element_visible("Outside", DefaultLogin.wait_time)).to be_true
  expect(con.perform_action("Outside", "")).to be_true
end

Then(/^the user waits for 5 seconds$/) do
  sleep 5
end

Then(/^the Date Filter displays "(.*?)" months in the past and "(.*?)" months in the future$/) do |months_past, months_future|
  con = GTDate.instance
  date_format_template = "%m/%d/%Y"

  expected_to_date = DateTime.now.next_month(months_future.to_i).strftime(date_format_template)
  expected_from_date = DateTime.now.prev_month(months_past.to_i).strftime(date_format_template)
  
  expect(con.perform_verification("To Date", expected_to_date)).to be_true
  expect(con.perform_verification("From Date", expected_from_date)).to be_true
end


