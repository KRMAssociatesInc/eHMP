require 'HtmlGenerator.rb'

class LoginHMPAttributeParameters
  def login_page
    # HtmlGenerator.add_action_and_verify("AccessCode", "id", "textfield-1103-inputEl", "sendKeys", "test")
    # HtmlGenerator.add_action_and_verify("VerifyCode", "id", "textfield-1104-inputEl", "sendKeys")
    # HtmlGenerator.add_action_and_verify("Facility", "id", "ext-gen1246", "comboSelect")
    # HtmlGenerator.add_action_and_verify("SignIn", "id", "button-1109", "click")

    HtmlGenerator.add_action_and_verify("AccessCode", "xpath", "//td[contains(string(), 'Access Code')]/following-sibling::td/input", "sendKeys")
    HtmlGenerator.add_action_and_verify("VerifyCode", "xpath", "//td[contains(string(), 'Verify Code')]/following-sibling::td/input", "sendKeys")
    HtmlGenerator.add_action_and_verify("Facility", "xpath", "//td[contains(string(), 'Facility')]/following-sibling::td/descendant::input", "comboSelect")

    HtmlGenerator.add_action_and_verify("SignIn", "xpath", "//span/span[contains(string(), 'Sign In')]/span", "click")

    HtmlGenerator.add_verify("loginErrorMessage", "xpath", "//div[contains(string(), 'Not a valid ACCESS CODE/VERIFY CODE pair')]", "waitUntilElementPresent")

    HtmlGenerator.add_action_and_verify("VerifyCodelabel", "xpath", "//td[contains(string(), 'Verify Code')]/following-sibling::td/label", "waitUntilElementPresent")
  end
end
