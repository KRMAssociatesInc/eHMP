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
    @last_error_message
  end

  def add_action(cucumber_label, html_action, access_html_element)
    @action_map[cucumber_label.label] = { function: html_action, searchOn: access_html_element.how, value: access_html_element.locator }
  end

  def add_verify(cucumber_label, html_verification, access_html_element)
    @verify_map[cucumber_label.label] = { verifyOn: html_verification, searchOn: access_html_element.how, locator: access_html_element.locator }
  end

  def wait_until_xpath_count_greater_than(cucumber_label, results_limit = 0, num_seconds = DefaultLogin.wait_time)
    seconds_to_wait = num_seconds.to_i
    i = 0
    verification_passed = false
    current_xpath_count = -1
    while i < seconds_to_wait
      begin
        html_element = @verify_map[cucumber_label]
        element = find_dom_element(html_element[:searchOn], html_element[:locator])
        verify_on = html_element[:verifyOn]
        current_xpath_count = verify_on.pull_value(element, results_limit)
        #p "current: #{current_xpath_count}"
        verification_passed = (current_xpath_count.to_i > results_limit.to_i)
        #return verify_on.verify(element, value)

        #verification_passed = perform_verification(cucumber_label, num_expected_results)
      rescue Exception => e
        #p "wait_until_xpath_count::error #{e}"
        verification_passed = false
      end
      if verification_passed
        i = seconds_to_wait
      else
        sleep 1
        #p "wait_until_xpath_count greater then #{results_limit} (#{current_xpath_count})::xpath count hasn't updated, wait 1 second"
      end
      i = i + 1
    end
    return verification_passed
  end

  def wait_until_xpath_count(cucumber_label, num_expected_results, num_seconds = DefaultLogin.wait_time)
    verification_passed = perform_verification(cucumber_label, num_expected_results, num_seconds)
    return verification_passed
  end

  def wait_until_element_present(map_key, seconds_to_wait = DefaultLogin.wait_time)
    driver = TestSupport.driver
    begin
      what = get_what(map_key)
      wait = Selenium::WebDriver::Wait.new(:timeout => seconds_to_wait) # seconds # wait until list opens
      wait.until { driver.find_element(get_how(map_key) => what) } # wait until specific list element is shown
      return true
    rescue Exception => e
      p "Exception while waiting for #{map_key}: #{e}"
      return false
    end
  end

  def am_i_visible?(map_key)
    driver = TestSupport.driver
    what = get_what(map_key)
    element_string = "element (#{get_how(map_key)}, #{what})"
    element = driver.find_element(get_how(map_key) => what)
    element.location_once_scrolled_into_view
    @last_error_message = "was element #{element_string} enabled (#{element.enabled?}) and displayed (#{element.displayed?})"
    return false unless element.displayed?
    return false unless element.enabled?
    return true
  rescue Exception => e 
    @last_error_message = "function am_i_visible ( #{element_string} ) exception thrown #{e}"
    return false
  end

  def wait_until_action_element_visible(map_key, seconds_to_wait = DefaultLogin.wait_time)
    @last_error_message = ''
    wait = Selenium::WebDriver::Wait.new(:timeout => seconds_to_wait) # seconds # wait until list opens
    wait.until { am_i_visible? map_key }
  rescue Exception => e
    p @last_error_message
    p "wait_until_action_element_visible exception: #{e}"
    raise e
  end

  def wait_until_action_element_invisible(map_key, seconds_to_wait = DefaultLogin.wait_time)
    driver = TestSupport.driver
    what = get_what(map_key)
    wait = Selenium::WebDriver::Wait.new(:timeout => seconds_to_wait) # seconds # wait until list opens
    element = driver.find_elements(get_how(map_key) => what)

    unless element.empty?
      wait.until { !(driver.find_element(get_how(map_key) => what).displayed?) } # wait until specific list element is shown
    end
  rescue Exception => e
    return
  end

  def can_i_perform_action?(access_html_element, value)
    driver = TestSupport.driver
    element_string = "element (#{access_html_element[:searchOn]}, #{access_html_element[:value]})"
    html_element = driver.find_element(access_html_element[:searchOn], access_html_element[:value])
    html_element.location_once_scrolled_into_view
    @last_error_message = "was element #{element_string} enabled (#{html_element.enabled?}) and displayed (#{html_element.displayed?})"
    return false unless html_element.displayed?
    return false unless html_element.enabled?
    element_function = access_html_element[:function]
    element_function.perform_action(html_element, value)
    return true 
  rescue Exception => e 
    #p "background: Exception #{e}"
    @last_error_message = "function can_i_perform_action ( #{element_string} ) exception thrown #{e}"
    return false
  end #method

  def can_i_perform_verification?(access_html_element, value)
    driver = TestSupport.driver
    element_string = "element (#{access_html_element[:searchOn]}, #{access_html_element[:locator]})"
    html_element = driver.find_element(access_html_element[:searchOn], access_html_element[:locator])
    html_element.location_once_scrolled_into_view
    @last_error_message = "was element #{element_string} enabled (#{html_element.enabled?}) and displayed (#{html_element.displayed?})"
    return false unless html_element.displayed?
    return false unless html_element.enabled?
    verify_on = access_html_element[:verifyOn]
    was_verified = verify_on.verify(html_element, value)
    @last_error_message = "#{element_string} error #{verify_on.error_message}" unless was_verified
    return was_verified
  rescue Exception => e 
    #p "background: Exception #{e}"
    @last_error_message = "function can_i_perform_verification ( #{element_string} ) on value #{value} exception thrown #{e}"
    return false
  end #method

  def verify_element_hidden?(map_key, value)
    driver = TestSupport.driver
    driver = TestSupport.driver
    what = get_what(map_key)

    if driver.find_element(get_how(map_key) => what).displayed?
      return false
    else
      return true
    end
  end

  def perform_verification(field, value, timeout = DefaultLogin.wait_time)
    @last_error_message = 'no error found'
    access_html_element = @verify_map[field]
    wait = Selenium::WebDriver::Wait.new(:timeout => timeout)
    wait.until { 
      can_i_perform_verification?(access_html_element, value)
    }
    return true
  rescue Exception => e
    p "Exception #{e}"
    p @last_error_message
    return false
  end

  def perform_action(field_to_manipulate, value = nil)
    @last_error_message = 'no error found'
    access_html_element = @action_map[field_to_manipulate]
    wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
    wait.until { 
      can_i_perform_action?(access_html_element, value)
    }
    return true
  rescue Exception => e 
    p "Exception #{e}"
    p @last_error_message
    return false
  end

  def perform_action_old(field_to_manipulate, value = nil)
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

  def perform_action_rethrow(field_to_manipulate, value = nil)
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
      raise e
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

  def get_element(map_key)
    if static_dom_element_exists?(map_key)
      how = get_how(map_key)
      what = get_what(map_key)
      return find_dom_element(how, what)
    else
      return get_elements(map_key)[0]
    end
  end

  def get_elements(map_key)
    how = get_how(map_key)
    what = get_what(map_key)
    driver = TestSupport.driver
    return driver.find_elements(how, what)
  end

  def find_dom_element(search_on, value)
    driver = TestSupport.driver
    return driver.find_element(search_on, value)
  end
=begin
  def perform_verification(field, value, check_error_message_generator = 0)
    html_element = @verify_map[field]
    element = find_dom_element(html_element[:searchOn], html_element[:locator])
    verify_on = html_element[:verifyOn]
    return verify_on.verify(element, value)
  end
=end
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
      p "action: #{@action_map.keys}"
      p "verify: #{@verify_map.keys}"
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
      p @action_map.keys
      p @verify_map.keys
      fail "key #{map_key} is not a saved action nor verification"
    end
    return what
  end
end
