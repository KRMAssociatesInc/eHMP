class ActiveScreen < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Active Screen"), VerifyText.new, AccessHtmlElement.new(:id, "screenName"))
  end
end # 

def user_views_screen(url, screen_name)
  screen_url = "#{url}##{screen_name}"
  p screen_url
  TestSupport.navigate_to_url(screen_url)
  TestSupport.wait_for_page_loaded
end

Given(/^user views screen "(.*?)"$/) do |screen_name|
  user_views_screen(DefaultLogin.ehmpui_url, screen_name)
end

Given(/^user views screen "(.*?)" in the eHMP\-UI$/) do |screen_name|
  user_views_screen(DefaultLogin.ehmpui_url, screen_name)
end

Given(/^user views screen "(.*?)" in the ADK$/) do |screen_name|
  user_views_screen(DefaultLogin.adk_url, screen_name)
end

Then(/^"(.*?)" is active$/) do | screen_name |
  browser_access = ActiveScreen.instance
  expect(browser_access.wait_until_element_present("Active Screen", DefaultLogin.wait_time)).to be_true
  expect(browser_access.perform_verification("Active Screen", screen_name)).to be_true
end
