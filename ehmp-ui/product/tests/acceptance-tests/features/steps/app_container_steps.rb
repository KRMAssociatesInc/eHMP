path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class AppContainer < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Current User Menu"), ClickAction.new, AccessHtmlElement.new(:id, "eHMP-CurrentUser"))
    add_action(CucumberLabel.new("Help Menu"), ClickAction.new, AccessHtmlElement.new(:id, "eHMP-Help"))
    
    add_verify(CucumberLabel.new("Current User Menu Text"), VerifyContainsText.new, AccessHtmlElement.new(:id, "eHMP-CurrentUser"))
  end
end # 

Then(/^the navigation bar displays "(.*?)"$/) do |app_container_html_element|
  expect(AppContainer.instance.wait_until_element_present(app_container_html_element)).to be_true
end

#Can delete this once all acc tests have been reviewed 
=begin
Then(/^the "(.*?)" displays "(.*?)"$/) do |arg1, arg2|
  expect(AppContainer.instance.perform_verification(arg1, arg2)).to be_true
end
=end

When(/^the user clicks "(.*?)" in the navigation bar$/) do |app_container_html_element|
  expect(AppContainer.instance.perform_action(app_container_html_element)).to be_true
end

Then(/^the Current User Menu Text displays "(.*?)"$/) do |user_name|
  expect(AppContainer.instance.perform_verification("Current User Menu Text", user_name)).to be_true
end
