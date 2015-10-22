path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class ActiveMedications < AccessBrowserV2
  include Singleton
  def initialize
    super
    
    add_action(CucumberLabel.new("Amoxapine Tablet Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[data-appletid=activeMeds]/descendant::a[@id='info-button-sidekick-detailView']"))
    
  end
end

When(/^the user clicks the row that contains "(.*?)" in the Active Medications Applet$/) do |arg1|
  # //table[@id='data-grid-activeMeds']/descendant::td[contains(string(), "${bob}")]/parent::tr
  path = "//table[@id='data-grid-activeMeds']/descendant::td[contains(string(), '#{arg1}')]/parent::tr"
  active_medications = ActiveMedications.instance
  active_medications.add_action(CucumberLabel.new("Row to click"), ClickAction.new, AccessHtmlElement.new(:xpath, path))

  expect(active_medications.perform_action("Row to click")).to be_true
end

Then(/^user selects the "(.*?)" detail icon in Active Medications Applet$/) do |arg1|
  label = "#{arg1} Detail View Icon"
  active_medications = ActiveMedications.instance
  expect(active_medications.perform_action(label)).to be_true
end

Then(/^the Active Medications Applet table contains rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  con = VerifyTableValue.new 
  driver = TestSupport.driver
  wait.until {  
    browser_elements_list = driver.find_elements(:css, "#data-grid-activeMeds tbody tr")  
    con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-activeMeds']", table)
  }
end


