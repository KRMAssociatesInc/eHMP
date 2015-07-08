path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'singleton'
require 'AccessBrowserV2.rb'
require 'HTMLVerification.rb'

# @description: All the HTML Elements the tests need to access in order to login to the site
class LoginHTMLElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("AccessCode"), SendKeysAction.new, AccessHtmlElement.new(:id, "accessCode"))
    add_action(CucumberLabel.new("VerifyCode"),  SendKeysAction.new, AccessHtmlElement.new(:id, "verifyCode"))
    add_action(CucumberLabel.new("Facility"), ComboSelectAction.new, AccessHtmlElement.new(:id, "facility"))
    add_action(CucumberLabel.new("SignIn"), ClickAction.new, AccessHtmlElement.new(:id, "login"))
    add_action(CucumberLabel.new("Signout"), ClickAction.new, AccessHtmlElement.new(:id, "logoutButton"))
    add_verify(CucumberLabel.new("Login Error Message"), VerifyText.new, AccessHtmlElement.new(:id, "errorMessage"))
  end
end

# All the HTML Elements the tests need to access patient details
class PatientDetailsHTMLElements < AccessBrowserV2
  include Singleton
  def initializeper
    su
    add_action(CucumberLabel.new("Postings"), ClickAction.new, AccessHtmlElement.new(:xpath, "//a/descendant::span[contains(@class, 'label-danger')]"))
    add_action(CucumberLabel.new("Close Button"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[@id='cwadf-detail']/parent::div/parent::div/descendant::span[contains(string(), 'Close')]"))
    add_action(CucumberLabel.new("Meds Review Tab"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[contains(@id, 'charttabbar')]/a/descendant::span[contains(string(), 'Meds Review')]"))
    add_action(CucumberLabel.new("Search Tab"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[contains(@id, 'charttabbar')]/a/descendant::span[contains(string(), 'Search')]"))

    add_action(CucumberLabel.new("Tasks Tab"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[contains(@id, 'charttabbar')]/a/descendant::span[contains(string(), 'Tasks')]"))
    add_action(CucumberLabel.new("Recent Meds"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[contains(@id, 'segmentedbutton')]/a/descendant::span[contains(string(), 'Recent Meds')]"))
    add_action(CucumberLabel.new("All Meds"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[contains(@id, 'segmentedbutton')]/a/descendant::span[contains(string(), 'All Meds')]"))

    add_action(CucumberLabel.new("Date Range 2y"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '2y')]/ancestor::a"))
    add_action(CucumberLabel.new("Date Range 1y"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '1y')]/ancestor::a"))
    add_action(CucumberLabel.new("Date Range 3mo"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '3mo')]/ancestor::a"))
    add_action(CucumberLabel.new("Date Range 1mo"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '1mo')]/ancestor::a"))
    add_action(CucumberLabel.new("Date Range 7d"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '7d')]/ancestor::a"))
    add_action(CucumberLabel.new("Date Range 72h"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '72h')]/ancestor::a"))
    add_action(CucumberLabel.new("Date Range 24h"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), '24h')]/ancestor::a"))
    add_action(CucumberLabel.new("Date Range All"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Date Range')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'All')]/ancestor::a"))

    add_action(CucumberLabel.new("Filter All"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'All')]/ancestor::a"))
    add_action(CucumberLabel.new("Filter Meds"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'Meds')]/ancestor::a"))
    add_action(CucumberLabel.new("Filter Labs"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'Labs')]/ancestor::a"))
    add_action(CucumberLabel.new("Filter Orders"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'Orders')]/ancestor::a"))
    add_action(CucumberLabel.new("Filter Vitals"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'Vitals')]/ancestor::a"))
    add_action(CucumberLabel.new("Filter Documents"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'Documents')]/ancestor::a"))
    add_action(CucumberLabel.new("Filter Observations"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'Observations')]/ancestor::a"))
    add_action(CucumberLabel.new("Filter Other"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Filter')]/parent::div/following-sibling::div[contains(@id, 'segmentedbutton')]/descendant::span[contains(string(), 'Other')]/ancestor::a"))

    add_verify(CucumberLabel.new("Allergiesposting"), VerifyText.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Allergies')]"))
    add_action(CucumberLabel.new("Signout"), ClickAction.new, AccessHtmlElement.new(:xpath, "//button[contains(@id, 'logoutButton')]"))
  end # initialize
end # PatientDetailsHTMLElements
