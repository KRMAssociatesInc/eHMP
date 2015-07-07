

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require "selenium-webdriver"
require "WebDriverFactory.rb"
require "SeleniumCommand.rb"
require "DefaultLogin.rb"

# class to force each test to use the same selenium webdriver
class TestSupport
  @@selenium_webdriver = nil
  @@successfully_loggedin = false

  def self.wait_for_page_loaded
    SeleniumCommand.wait_until_page_loaded(DefaultLogin.wait_time)
  end

  def self.successfully_loggedin?
    return @@successfully_loggedin
  end

  def self.successfully_loggedin=(result)
    @@successfully_loggedin = result
  end

  def self.successful_logout?
    return @@successful_logout
  end

  def self.successful_logout=(result)
    @@successful_logout = result
  end

  def self.driver
    @@selenium_webdriver = open_browser if @@selenium_webdriver.nil?
    return @@selenium_webdriver
  end

  def self.nondefault_driver(browser_type)
    @@selenium_webdriver = open_browser(browser_type) if @@selenium_webdriver.nil?
    return @@selenium_webdriver
  end

  def self.navigate_to_url(url)
    SeleniumCommand.navigate_to_url(url)
  end

  def self.close_browser
    begin
      @@selenium_webdriver.quit unless @@selenium_webdriver.nil?
    rescue Exception => e
      p "Exception while closing browser: #{e}"
    end
    @@selenium_webdriver = nil
    @@successfully_loggedin = false
  end

  def self.error_message_generator(error_message)
    text_error_message = "\n"+'    | Field Name         | Expected Value          | Runtime Value         |' + "\n"
    error_message.each do | single_message |
      text_error_message = textErrorMessage + (i+1).to_s + " - "+ single_message+"\n\n"
    end

    fail ArgumentError, text_error_message
  end

  private

  def self.open_browser(browser_type = "firefox")
    driver = SeleniumCommand.driver
    return driver
  end
end

if __FILE__ == $PROGRAM_NAME
  puts "---------------------TestSupport Unit Tests  Start----------------"
  temp_driver = TestSupport.nondefault_driver("phantomjs")
  fail "driver is unexpectedly nil" if temp_driver.nil?
  fail "Should not report logged in" if TestSupport.successfully_loggedin?
  TestSupport.successfully_loggedin=(true)
  fail "Should report logged in" unless TestSupport.successfully_loggedin?
  TestSupport.close_browser
  fail "Should not report logged in" if TestSupport.successfully_loggedin?
  puts "---------------------TestSupport Unit Tests  Complete----------------"
end
