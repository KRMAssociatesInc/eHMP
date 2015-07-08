
When(/^the user accesses the base url$/) do
  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url)
end

Then(/^the login screen is displayed$/) do
  login_screen_elements = LoginHTMLElements.instance
  expect(login_screen_elements.wait_until_element_present("SignIn")).to be_true, "Timed out waiting for Sign in button"
  expect(login_screen_elements.wait_until_element_present("Facility")).to be_true, "Timed out waiting for Facility element"
  expect(login_screen_elements.wait_until_element_present("AccessCode")).to be_true, "Timed out waiting for Access Code element"
  expect(login_screen_elements.wait_until_element_present("VerifyCode")).to be_true, "Timed out waiting for Verify Code element"
end
