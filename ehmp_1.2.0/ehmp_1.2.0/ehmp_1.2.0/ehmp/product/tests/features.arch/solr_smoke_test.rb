path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require "rspec/expectations"
require 'FindElementFactory.rb'
require 'WebDriverFactory.rb'
require 'CommonDriver.rb'
require 'SeleniumCommand.rb'

When(/^user lunch Apache Solr$/) do
  @base_url = 'http://10.3.3.10:8983/solr/#/'
  SeleniumCommand.navigate_to_url(@base_url)
end

Then(/^the main page title displays "(.*?)"$/) do |expect_title|
  runtime_title = SeleniumCommand.getback_page_title
  expect(runtime_title).to eq expect_title
end

Then(/^the main page dispaly below side menu$/) do |table|
  table.rows.each do |menu|
    if SeleniumCommand.find_element(menu[0]) == nil
      fail "There is no such element '#{menu[0]}' found in side menu"
    end
  end
end

When(/^user search for "(.*?)" in Core Selector$/) do |core_selector|
  @base_url = @base_url + core_selector
  temp_xpath = "//li[contains(string(), '#{core_selector}')]"

  if SeleniumCommand.driver.find_elements(:xpath, temp_xpath).any?
    SeleniumCommand.navigate_to_url(@base_url)
  else
    fail 'There is no such Core Selector found'
  end
end

Then(/^the Number Docs under Statistics display "(.*?)"$/) do |expect_num_docs|
  xpath = "//*[@id='statistics']/div[2]/dl/dd[2]"
  runtime_num_docs = SeleniumCommand.getback_element_text('xpath', xpath)
  expect(runtime_num_docs).to eq expect_num_docs
end

Then(/^the below side menu dispaly under search bar$/) do |table|
  table.rows.each do |menu|
    if SeleniumCommand.find_element(menu[0]) == nil
      fail "There is no such element '#{menu[0]}' found in side menu"
    end
  end
end
