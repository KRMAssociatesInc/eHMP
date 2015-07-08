class Login < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("AccessCode"), SendKeysAction.new, AccessHtmlElement.new(:id, "accessCode"))
    add_action(CucumberLabel.new("VerifyCode"), SendKeysAction.new, AccessHtmlElement.new(:id, "verifyCode"))

    add_action(CucumberLabel.new("Sign in"), ClickAction.new, AccessHtmlElement.new(:id, "login"))
    add_action(CucumberLabel.new("Signout"), ClickAction.new, AccessHtmlElement.new(:id, "logoutButton"))

    add_action(CucumberLabel.new("Control - MySite Tab"), ClickAction.new, AccessHtmlElement.new(:id, "mySite"))
    add_action(CucumberLabel.new("Control - All"), ClickAction.new, AccessHtmlElement.new(:css, "#all > a"))
    add_action(CucumberLabel.new("Control - Patient Search Input"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "patientSearchInput"))
    add_action(CucumberLabel.new("Control - First Patient Result"), ClickAction.new, AccessHtmlElement.new(:css, "#patient-search-results .list-group a"))
    add_action(CucumberLabel.new("Control - Second Patient Result"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@class='list-group']/descendant::a[2]"))
    add_action(CucumberLabel.new("Control - Confirm"), ClickAction.new, AccessHtmlElement.new(:id, "confirmationButton"))

    add_verify(CucumberLabel.new("Coversheet"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".cover-sheet"))
  end
end

Given(/^user is logged into ADK$/) do
  p "attempt to login to #{DefaultLogin.adk_url}"
  unless TestSupport.successfully_loggedin?
    TestSupport.navigate_to_url(DefaultLogin.adk_url)
    TestSupport.driver.manage.window.maximize
    login_screen = Login.instance
    expect(login_screen.static_dom_element_exists? "AccessCode").to be_true
    DRIVER = TestSupport.driver

    option = Selenium::WebDriver::Support::Select.new(DRIVER.find_element(:id, "facility"))
    option.select_by(:index, DefaultLogin.default_facility)

    login_screen.perform_action("AccessCode", DefaultLogin.accesscode)
    login_screen.perform_action("VerifyCode", DefaultLogin.verifycode)
    login_screen.perform_action("Sign in", "")
    TestSupport.successfully_loggedin=true
  end # unless

end

# logs into eHMP-UI and goes to the cover sheet for a particular patient
Given(/^user is logged in and viewing patient "(.*?)"$/) do |patient_name|
  p "!! Warning - This step has been deprecated. !!"
  step "user is logged into eHMP-UI"
  step "user searches for and selects \"#{patient_name}\""
  step "Cover Sheet is active"
  p "!! Warning - This step has been deprecated. !!"
end

Given(/^user is logged into eHMP\-UI in the browser$/) do
  p "attempt to login to #{DefaultLogin.ehmpui_url}"
  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url)
  unless TestSupport.successfully_loggedin?
    TestSupport.driver.manage.window.maximize
    login_screen = Login.instance
    expect(login_screen.static_dom_element_exists? "AccessCode").to be_true
    DRIVER = TestSupport.driver

    option = Selenium::WebDriver::Support::Select.new(DRIVER.find_element(:id, "facility"))
    option.select_by(:index, DefaultLogin.default_facility)

    login_screen.perform_action("AccessCode", DefaultLogin.accesscode)
    login_screen.perform_action("VerifyCode", DefaultLogin.verifycode)
    login_screen.perform_action("Sign in", "")
    TestSupport.successfully_loggedin=true
  end # unless
end

Given(/^user is logged in and viewing second patient "(.*?)"$/) do |patient_name|
  log_con = Login.instance
  driver = TestSupport.driver

  p "attempt to login to #{DefaultLogin.ehmpui_url}"
  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url)
  unless TestSupport.successfully_loggedin?
    driver.manage.window.maximize
    expect(log_con.static_dom_element_exists? "AccessCode").to be_true

    option = Selenium::WebDriver::Support::Select.new(driver.find_element(:id, "facility"))
    option.select_by(:index, DefaultLogin.default_facility)

    log_con.perform_action("AccessCode", DefaultLogin.accesscode)
    log_con.perform_action("VerifyCode", DefaultLogin.verifycode)
    log_con.perform_action("Sign in", "")
    TestSupport.successfully_loggedin = true
  end # unless

  wait_and_perform(log_con, "MySite Tab")
  wait_and_perform(log_con, "All")
  wait_and_perform(log_con, "Patient Search Input", patient_name)
  wait_and_perform(log_con, "Second Patient Result")
  wait_and_perform(log_con, "Confirm")

  # wait for the coversheet to fully load
  # choosing one of the applets and waiting until results are populated
  # first syncing of a patient can take quite some time
  wait = Selenium::WebDriver::Wait.new(:timeout => 300)
  wait.until { driver.find_element(:css, "[data-appletid=lab_results_grid] tr") }
end
