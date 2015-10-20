Given(/^user is logged into eHMP\-UI$/) do
  # p "running test #{TestSupport.test_counter} #{TestSupport.test_counter % 10}"
  # if ENV.keys.include?('LOCAL') || TestSupport.test_counter % 10 == 0
  #   p 'refresh the app'
  #   TestSupport.navigate_to_url(DefaultLogin.ehmpui_url)
  # else
  #   TestSupport.navigate_to_url(DefaultLogin.ehmpui_url + "/#patient-search-screen")
  # end
  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url)
  begin
    # TestSupport.driver.manage.window.maximize
    # target_size = Selenium::WebDriver::Dimension.new(1280, 800)
    # TestSupport.driver.manage.window.size = target_size
    TestSupport.driver.manage.window.resize_to(1280, 800)
    p "Browser window size: #{TestSupport.driver.manage.window.size}"
  rescue Exception => e 
    p "Exception #{e}"
    p "Unable to maximize window - continuing anyway"
  end

  wait_until_dom_has_signin_or_signout

  login_elements = LoginHTMLElements.instance
  if login_elements.static_dom_element_exists?("Signout")
    perform_signout_steps login_elements
  end
  
  expect(select_default_facility).to be_true

  expect(login_elements.perform_action("AccessCode", DefaultLogin.accesscode)).to be_true
  expect(login_elements.perform_action("VerifyCode", DefaultLogin.verifycode)).to be_true

  expect(login_elements.perform_action("SignIn", "")).to be_true
  login_elements.wait_until_element_present('Signout')
  TestSupport.driver.execute_script("$.fx.off = true;")
end
