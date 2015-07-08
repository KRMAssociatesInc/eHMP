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

    add_verify(CucumberLabel.new("North Region"), VerifyContainsText.new, AccessHtmlElement.new(:id, "top-region"))
    add_verify(CucumberLabel.new("Bottom Region"), VerifyContainsText.new, AccessHtmlElement.new(:id, "appVersion"))
    add_verify(CucumberLabel.new("Applet Header Region"), VerifyContainsText.new, AccessHtmlElement.new(:id, "applet-header-region"))
  end
end # ADKContainer

Then(/^the region "(.*?)" is displayed$/) do |region_name|
  adk_container = ADKContainer.instance
  expect(adk_container.wait_until_element_present(region_name)).to be_true
  expect(adk_container.static_dom_element_exists?(region_name)).to be_true
end

