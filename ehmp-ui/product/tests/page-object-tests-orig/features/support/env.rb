require 'selenium-webdriver'

login_is_done ||= false

if ENV['BTYPE'].nil?
  @btype = 'phantomjs'
else
  @btype = ENV['BTYPE']
end

case @btype.downcase
when 'firefox'
  browser = Selenium::WebDriver.for :firefox
when 'ie'
  browser = Selenium::WebDriver.for :ie
when 'chrome'
  browser = Selenium::WebDriver.for :chrome
else
  #@driver = Selenium::WebDriver.for :phantomjs
  browser = Selenium::WebDriver.for :phantomjs, desired_capabilities: \
    { 'phantomjs.cli.args' => ['--ignore-ssl-errors=yes'] }
end

Before do
  @browser=browser
  unless login_is_done
    page = LoginPage.new @browser, true
    puts "I AM LOGGING IN!"
    page.wait_until do
      not page.facility.nil? and page.facility.eql? 'Select a facility...'
    end

    page.facility = 'PANORAMA'
    expect(page.facility).to eql 'PANORAMA'

    page.wait_until do
      not page.access_code.nil?
    end
    page.access_code = 'pu1234'
    expect(page.access_code).to eql 'pu1234'

    page.wait_until do
      not page.verify_code.nil?
    end
    page.verify_code = 'pu1234!!'
    expect(page.verify_code).to eql 'pu1234!!'

    page.login

    page = PatientSearchPage.new @browser
    field = false
    page.wait_until do
      page.patient_search_input_element.visible?
    end
    field = page.patient_search_input_element
    expect(field).to be_truthy
    login_is_done = true
  end
end

at_exit do
  if ENV['KEEP_OPEN'] != 'false' || ENV['KEEP_OPEN'] != 'no'
    browser.close
  end
end
