require 'HtmlGenerator.rb'

class MainPageSystemAdminAttribute
  def main_system_admin_page
    # HtmlGenerator.add_action_and_verify("CPRS Default", "xpath", "//span[contains(string(), 'CPRS Default')]", 'Click', "attribute")
  end

  def main_system_admin_page_locator_with_arg(locator_arg1, _locator_arg2)
    HtmlGenerator.add_action_and_verify("Task option left drop list", 'xpath', "//span[contains(string(), '#{locator_arg1}')]", 'click', 'findelements')
    HtmlGenerator.add_action_and_verify("Browse Patients Table Results", 'xpath', "//span[contains(string(), 'PID')]/ancestor::div/div/following-sibling::div/div/table/tbody/tr", 'click', 'findelements')
  end
end
