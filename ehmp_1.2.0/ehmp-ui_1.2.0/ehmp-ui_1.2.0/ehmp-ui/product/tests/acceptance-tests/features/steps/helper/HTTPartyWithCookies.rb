require "httparty"

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "DefaultLogin.rb"
require "TestSupport.rb"
require "DomAccess.rb"
#require "PatientPickerDomElements.rb"

#
class HTTPartyWithCookies
  include HTTParty
  # format  :xml
  def self.post_with_cookies(path)
    cookie_string = return_cookies_from_browser
    default_cookies.add_cookies(cookie_string)
#    p "AFTER ADDITION: #{self.default_cookies}"
#    p "PATH: #{path}"
    directory = post(path, { :verify => false })
    return directory
  end

  def self.get_with_cookies(path)
    cookie_string = return_cookies_from_browser
    default_cookies.add_cookies(cookie_string)
#    p "AFTER ADDITION: #{self.default_cookies}"
#    p "PATH: #{path}"
    directory = get(path, { :verify => false })
    return directory
  end

  def self.return_cookies_from_browser
    my_test_driver = TestSupport.driver
    cookies = my_test_driver.manage.all_cookies
    cookie_string = build_cookie_string(cookies)
    return cookie_string
  end

  def self.build_cookie_string(cookie_array)
    mycookies = ""
    cookie_array.each do | single |
      new_string = ""
      new_string << single[:name] << "=" << single[:value]
      mycookies << new_string << ";"

    end
    return mycookies
  end
end

if __FILE__ == $PROGRAM_NAME
  p '-------- WAS HERE -----------'
  unless TestSupport.successfully_loggedin?
    TestSupport.navigate_to_url(DefaultLogin.hmp_url)
    TestSupport.driver.manage.window.maximize
    login_dom_objects= LoginHTMLElements.instance
    login_dom_objects.wait_until_element_present("AccessCode", 15)

    login_dom_objects.perform_action("Facility", DefaultLogin.facility)
    login_dom_objects.perform_action("AccessCode", DefaultLogin.access_code)
    login_dom_objects.perform_action("VerifyCode", DefaultLogin.verify_code)
    login_dom_objects.perform_action("SignIn")

    PatientPickerElements.instance.wait_until_element_present("CPRS Default", 30)
    TestSupport.successfully_loggedin=true
  end
  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/loadOperationalData?domain=Allergy"

  p "Posting-------------------"
  p HTTPartyWithCookies.post_with_cookies(path)

  p "Getting-------------------"
  path = "#{base_url}/sync/operationalSyncStatus"
  p HTTPartyWithCookies.get_with_cookies(path)
  TestSupport.close_browser
end
