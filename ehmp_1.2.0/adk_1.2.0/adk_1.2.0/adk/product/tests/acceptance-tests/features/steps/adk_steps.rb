path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class ADKContainer < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("App Name"), VerifyText.new, AccessHtmlElement.new(:css, "#app-name > h1"))

    add_verify(CucumberLabel.new("North Region"), VerifyText.new, AccessHtmlElement.new(:id, "top-region"))
    add_verify(CucumberLabel.new("Bottom Region"), VerifyText.new, AccessHtmlElement.new(:id, "bottom-region"))
    add_verify(CucumberLabel.new("Applet Header Region"), VerifyContainsText.new, AccessHtmlElement.new(:id, "applet-header-region"))
  end
end # ADKContainer

Given(/^user views ADK in the browser$/) do
  p DefaultLogin.adk_url
  TestSupport.navigate_to_url(DefaultLogin.adk_url)
  TestSupport.wait_for_page_loaded
  
  TestSupport.driver.manage.window.maximize
  con = ADKContainer.instance
end

Then(/^the region "(.*?)" is displayed$/) do |region_name|
  con = ADKContainer.instance
  begin
    con.wait_until_element_present(region_name, 60)
  rescue Exception => e
    p "exception while waiting for #{region_name}: #{e}"
    p TestSupport.driver.page_source
  end
  expect(con.static_dom_element_exists?(region_name)).to eq(true)
end

at_exit do
  puts "calling close Browser"
  TestSupport.close_browser
end
