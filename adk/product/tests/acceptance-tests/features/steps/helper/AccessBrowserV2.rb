path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require "TestSupport.rb"
require "WebDriverFactory.rb"

# Version 2 of AccessBrowser class, but can't update the code base yet because I wouldn't be able to verify, the test site is down
class AccessBrowserV2
  def initialize
    @action_map = {}
    @verify_map = {}
    @error_message = []
  end

  def add_action(cucumber_label, html_action, access_html_element)
    @action_map[cucumber_label.label] = { function: html_action, searchOn: access_html_element.how, value: access_html_element.locator }
  end

  def add_verify(cucumber_label, html_verification, access_html_element)
    @verify_map[cucumber_label.label] = { verifyOn: html_verification, searchOn: access_html_element.how, locator: access_html_element.locator }
  end

  def wait_until_xpath_count(cucumber_label, num_expected_results, num_seconds = 30)
    seconds_to_wait = num_seconds.to_i
    i = 0
    verification_passed = false
    while i < seconds_to_wait
      begin
        verification_passed = perform_verification(cucumber_label, num_expected_results)
      rescue Exception => e
        #p "wait_until_xpath_count::error #{e}"
        verification_passed = false
      end
      if verification_passed
        i = seconds_to_wait
      else
        sleep 1
        # p "wait_until_xpath_count::xpath count hasn't updated, wait 1 second"
      end
      i = i + 1
    end
    return verification_passed
  end

  def wait_until_element_present(map_key, seconds_to_wait)
    driver = TestSupport.driver
    what = get_what(map_key)
    wait = Selenium::WebDriver::Wait.new(:timeout => seconds_to_wait) # seconds # wait until list opens
    wait.until { driver.find_element(get_how(map_key) => what) } # wait until specific list element is shown
  end

  def wait_until_action_element_visible(map_key, seconds_to_wait)
    driver = TestSupport.driver
    what = get_what(map_key)
    wait = Selenium::WebDriver::Wait.new(:timeout => seconds_to_wait) # seconds # wait until list opens
    wait.until { driver.find_element(get_how(map_key) => what).displayed? } # wait until specific list element is shown
  end

  def perform_action(field_to_manipulate, value = nil)
    completed_successfully = false
    begin
      element = @action_map[field_to_manipulate]
      html_element = find_dom_element(element[:searchOn], element[:value])
      element_function = element[:function]
      element_function.perform_action(html_element, value)
      completed_successfully = true
    rescue Exception => e
      p "Error attempting to perform_action with field #{field_to_manipulate} and value #{value}"
      p "Exception #{e}"
    end
    return completed_successfully
  end

  def static_dom_element_exists?(map_key)
    how = get_how(map_key)
    what = get_what(map_key)
    begin
      html_element = find_dom_element(how, what)
    rescue
      html_element = nil
    end
    return !html_element.nil?
  end

  def dynamic_dom_element_exists?(search_on, value)
    how = search_on
    what = value
    begin
      html_element = find_dom_element(how, what)
    rescue
      html_element = nil
    end
    return !html_element.nil?
  end

  def find_dom_element(search_on, value)
    driver = TestSupport.driver
    return driver.find_element(search_on, value)
  end

  def perform_verification(field, value, check_error_message_generator = 0)
    html_element = @verify_map[field]
    element = find_dom_element(html_element[:searchOn], html_element[:locator])
    verify_on = html_element[:verifyOn]
    return verify_on.verify(element, value)
  end

  def error_messages
    return error_message_generator(@error_message)
  end

  private

  def error_message_generator(error_messages)
    text_error_message = "\n"+'    | Field Name         | Expected Value          | Runtime Value         |' + "\n"
    (0..error_messages.size-1).each do | i |
      text_error_message = text_error_message + (i+1).to_s + " - "+ error_messages[i]+"\n\n"
    end
    return text_error_message
  end

  def get_how(map_key)
    how = "error"
    if @action_map.key? map_key
      how = @action_map[map_key][:searchOn]
    elsif @verify_map.key? map_key
      how = @verify_map[map_key][:searchOn]
    else
      fail "key #{map_key} is not a saved action nor verification"
    end
    return how
  end

  def get_what(map_key)
    what = nil
    if @action_map.key? map_key
      what = @action_map[map_key][:value]
    elsif @verify_map.key? map_key
      what = @verify_map[map_key][:locator]
    else
      fail "key #{map_key} is not a saved action nor verification"
    end
    return what
  end
end
