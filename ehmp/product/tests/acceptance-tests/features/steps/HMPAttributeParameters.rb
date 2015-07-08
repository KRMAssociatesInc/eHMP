path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'HtmlGenerator.rb'
require 'Login_HMPAttributeParameters.rb'
require 'MainPage_HMPAttributeParameters.rb'
require 'MainPage_SystemAdmin_HMPAttributeParas.rb'

class HMPAttributeParameters
  def all_page_html_attribute
    attribute_login = LoginHMPAttributeParameters.new
    attribute_main = MainPageHMPAttributeParameters.new
    attribute_main_admin = MainPageSystemAdminAttribute.new
    attribute_main.main_page
    attribute_login.login_page
    # attribute_main_admin.main_system_admin_page
  end
end
