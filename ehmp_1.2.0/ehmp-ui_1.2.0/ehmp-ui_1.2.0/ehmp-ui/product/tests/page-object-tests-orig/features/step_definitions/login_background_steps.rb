require 'rspec/expectations'
require 'selenium-webdriver'
#require_relative './helpers/driver'
require_relative './pages/login_page'
require_relative './pages/patient_search'

World(RSpec::Matchers)
World(PageObject::PageFactory)

Given(/^I have a browser available$/) do
  expect(@browser).to be_truthy
end

And(/^I am logged into EHMP\-UI "(.*?)" as "(.*?)" with password "(.*?)"$/) \
do |facility, user, pwd|
  page = LoginPage.new @browser, true
 
  page.wait_until do
     not page.facility.nil? and page.facility.eql? 'Select a facility...'
  end
  @browser.save_screenshot 'screenshots/Loginpage.png'
  page.facility = facility
  expect(page.facility).to eql facility

  page.wait_until do
    not page.access_code.nil? 
  end
  page.access_code = user
  expect(page.access_code).to eql user

  page.wait_until do
    not page.verify_code.nil?
  end
  page.verify_code = pwd
  expect(page.verify_code).to eql pwd

  page.wait_until do
    true
    # find a better way to validate this expectation 
  end
  expect(page.login).to be_truthy
end

Then(/^I can see the landing page$/) do
  page = PatientSearchPage.new @browser
  field = false
  # page.wait_until do
  #  page.set_page_url.eql? page.current_url
  #  #true
  #  #this is currently always passing true even if login fails
  # end
  #puts
  page.wait_until do 
  @browser.save_screenshot 'screenshots/Landingpage.png'
  page.patient_search_input_element.visible?
  end
  field = page.patient_search_input_element
  expect(field).to be_truthy
end
