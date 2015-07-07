path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class LoginContainer < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("North Region"), VerifyText.new, AccessHtmlElement.new(:id, "top-region"))
    add_verify(CucumberLabel.new("Bottom Region"), VerifyText.new, AccessHtmlElement.new(:id, "bottom-region"))
    add_verify(CucumberLabel.new("Applet Header Region"), VerifyContainsText.new, AccessHtmlElement.new(:id, "applet-header-region"))
  end
end # LoginContainer

Then(/^the main page displays$/) do
  con= PatientDetailsHTMLElements.instance
  TestSupport.wait_for_page_loaded
  con.add_verify(CucumberLabel.new("Panel Title"), VerifyContainsText.new, AccessHtmlElement.new(:class, "navbar-brand"))
  expect(con.static_dom_element_exists?("Panel Title")).to eq(true)
  TestSupport.successfully_loggedin=true 
end
  
Then(/^the user attempts signout$/) do
  TestSupport.successfully_loggedin=true
  con= LoginHTMLElements.instance
  con.perform_action('Signout')
  TestSupport.wait_for_page_loaded
  expect(con.static_dom_element_exists?("Signout")).to eq(false)
  TestSupport.successful_logout=true
  #sleep 100
end

Given(/^user login with incorrect credentials$/) do
  con= LoginHTMLElements.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('Facility', 'Panorama')
  con.perform_action('AccessCode', '9E7a;lu1234')
  con.perform_action('VerifyCode', 'lU1234!!')
  con.perform_action('SignIn')
  #sleep 10
end

Then(/^the page displays "(.*?)"$/) do |errorMessage|
  con= LoginHTMLElements.instance
  begin
    con.wait_until_element_present(errorMessage, 60)
  rescue Exception => e
    p "exception while waiting for #{errorMessage}: #{e}"
    p TestSupport.driver.page_source
  end
  con.add_verify(CucumberLabel.new(errorMessage), VerifyText.new, AccessHtmlElement.new(:id, "errorMessage"))
  expect(con.static_dom_element_exists?(errorMessage)).to eq(true)
  TestSupport.successfully_loggedin=false
  #TestSupport.close_browser
  #sleep 10
end

Given(/^user views ADK123 in the browser$/) do
  con= LoginHTMLElements.instance
  p DefaultLogin.adk_url
  p 'start'
  TestSupport.navigate_to_url(DefaultLogin.adk_url)
  p 'end'
  TestSupport.wait_for_page_loaded
  #sleep 100
  TestSupport.driver.manage.window.maximize
  con.wait_until_element_present("AccessCode", 50)
  #sleep 10
end

Given(/^user attempts login$/) do |table|
  con = LoginHTMLElements.instance
  p "Page Source: "
  p TestSupport.driver.page_source
  table.rows.each do |field, value |
    begin
    con.wait_until_element_present(field, 60)
    con.perform_action(field, value)
  rescue Exception => e
    p "exception while waiting for #{field}: #{e}"
    p TestSupport.driver.page_source
  end
    
    #sleep 10
  end
end

Given(/^user attempt to go directly to applet without login$/) do
  con= LoginHTMLElements.instance
  base_url= DefaultLogin.adk_url
  TestSupport.wait_for_page_loaded
  path = "#{base_url}/#allergy-list"
  TestSupport.navigate_to_url(path)
  TestSupport.wait_for_page_loaded
  TestSupport.driver.manage.window.maximize
  #sleep 10
end

Given(/^user attempt to go directly to applet with incorrect subpage$/) do
  con= LoginHTMLElements.instance
  base_url= DefaultLogin.adk_url
  TestSupport.wait_for_page_loaded
  path = "#{base_url}/#aaaaaccc"
  TestSupport.navigate_to_url(path)
  TestSupport.wait_for_page_loaded
  TestSupport.driver.manage.window.maximize
  #sleep 10
end

Then(/^user is redirected to "(.*?)" page$/) do |name|
  con= LoginHTMLElements.instance
  TestSupport.wait_for_page_loaded
  begin
    con.wait_until_element_present(name, 60)
  rescue Exception => e
    p "exception while waiting for #{name}: #{e}"
    p TestSupport.driver.page_source
  end
  con.add_verify(CucumberLabel.new("SignIn"), VerifyText.new, AccessHtmlElement.new(:id, "login"))
  expect(con.static_dom_element_exists?("SignIn")).to eq(true)
end

at_exit do
  puts "calling close Browser"
  TestSupport.close_browser
end
